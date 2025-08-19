/*
  # Tendly App Database Schema

  1. New Tables
    - `profiles` - User profile information and stats
    - `tasks` - User tasks with priority and category
    - `plants` - Garden plants linked to completed tasks
    - `focus_sessions` - Focus timer session records
    - `achievements` - Available achievements in the system
    - `user_achievements` - User's unlocked achievements
    - `garden_posts` - Social posts from users
    - `post_likes` - Likes on garden posts
    - `post_comments` - Comments on garden posts
    - `weekly_challenges` - Weekly challenge definitions
    - `user_challenge_progress` - User progress on challenges

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for public read access where appropriate (social features)

  3. Features
    - Automatic timestamps for created/updated records
    - Proper foreign key relationships
    - Indexes for performance
    - Default values for better data consistency
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE,
  display_name text DEFAULT '',
  avatar_url text DEFAULT '',
  level integer DEFAULT 1,
  compost integer DEFAULT 0,
  total_tasks integer DEFAULT 0,
  focus_hours integer DEFAULT 0,
  current_streak integer DEFAULT 0,
  longest_streak integer DEFAULT 0,
  plants_grown integer DEFAULT 0,
  rare_seeds integer DEFAULT 0,
  mood text DEFAULT 'sunny' CHECK (mood IN ('sunny', 'cloudy', 'rainy')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  category text DEFAULT 'personal' CHECK (category IN ('work', 'personal', 'health', 'learning')),
  completed boolean DEFAULT false,
  plant_type text DEFAULT 'sprout' CHECK (plant_type IN ('sprout', 'flower', 'tree')),
  compost_reward integer DEFAULT 5,
  due_date timestamptz,
  completed_at timestamptz,
  blockchain_hash text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Plants table
CREATE TABLE IF NOT EXISTS plants (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  task_id uuid REFERENCES tasks(id) ON DELETE CASCADE,
  type text DEFAULT 'sprout' CHECK (type IN ('sprout', 'sapling', 'flower', 'tree')),
  growth integer DEFAULT 0 CHECK (growth >= 0 AND growth <= 100),
  position_x integer DEFAULT 0,
  position_y integer DEFAULT 0,
  planted_at timestamptz DEFAULT now(),
  last_watered timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Focus sessions table
CREATE TABLE IF NOT EXISTS focus_sessions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  duration_minutes integer NOT NULL DEFAULT 25,
  completed boolean DEFAULT false,
  distractions_count integer DEFAULT 0,
  session_type text DEFAULT 'focus' CHECK (session_type IN ('focus', 'break')),
  compost_earned integer DEFAULT 0,
  plant_growth_bonus integer DEFAULT 0,
  blockchain_hash text,
  zktls_proof text,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Achievements table (system-wide achievements)
CREATE TABLE IF NOT EXISTS achievements (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  icon text DEFAULT '🏆',
  category text DEFAULT 'general' CHECK (category IN ('tasks', 'focus', 'social', 'streak', 'garden', 'general')),
  requirements jsonb NOT NULL DEFAULT '{}',
  reward_type text DEFAULT 'compost' CHECK (reward_type IN ('compost', 'rare_seed', 'badge')),
  reward_amount integer DEFAULT 0,
  is_rare boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- User achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  achievement_id text REFERENCES achievements(id) ON DELETE CASCADE NOT NULL,
  unlocked_at timestamptz DEFAULT now(),
  blockchain_hash text,
  zktls_proof text,
  UNIQUE(user_id, achievement_id)
);

-- Garden posts table (social features)
CREATE TABLE IF NOT EXISTS garden_posts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  achievement_text text NOT NULL,
  garden_image_url text,
  likes_count integer DEFAULT 0,
  comments_count integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Post likes table
CREATE TABLE IF NOT EXISTS post_likes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  post_id uuid REFERENCES garden_posts(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, post_id)
);

-- Post comments table
CREATE TABLE IF NOT EXISTS post_comments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  post_id uuid REFERENCES garden_posts(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Weekly challenges table
CREATE TABLE IF NOT EXISTS weekly_challenges (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text NOT NULL,
  target_value integer NOT NULL,
  challenge_type text NOT NULL CHECK (challenge_type IN ('focus_sessions', 'tasks_completed', 'streak_days')),
  reward_compost integer DEFAULT 50,
  reward_rare_seed boolean DEFAULT false,
  start_date date NOT NULL,
  end_date date NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- User challenge progress table
CREATE TABLE IF NOT EXISTS user_challenge_progress (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  challenge_id uuid REFERENCES weekly_challenges(id) ON DELETE CASCADE NOT NULL,
  current_progress integer DEFAULT 0,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, challenge_id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE plants ENABLE ROW LEVEL SECURITY;
ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE garden_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_challenge_progress ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Tasks policies
CREATE POLICY "Users can manage own tasks"
  ON tasks FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Plants policies
CREATE POLICY "Users can manage own plants"
  ON plants FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Focus sessions policies
CREATE POLICY "Users can manage own focus sessions"
  ON focus_sessions FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Achievements policies (public read, no write)
CREATE POLICY "Anyone can view achievements"
  ON achievements FOR SELECT
  TO authenticated
  USING (true);

-- User achievements policies
CREATE POLICY "Users can view own achievements"
  ON user_achievements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
  ON user_achievements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Garden posts policies (public read for social features)
CREATE POLICY "Anyone can view garden posts"
  ON garden_posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage own posts"
  ON garden_posts FOR INSERT, UPDATE, DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Post likes policies
CREATE POLICY "Users can view all likes"
  ON post_likes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage own likes"
  ON post_likes FOR INSERT, DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Post comments policies
CREATE POLICY "Users can view all comments"
  ON post_comments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage own comments"
  ON post_comments FOR INSERT, UPDATE, DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Weekly challenges policies
CREATE POLICY "Anyone can view active challenges"
  ON weekly_challenges FOR SELECT
  TO authenticated
  USING (is_active = true);

-- User challenge progress policies
CREATE POLICY "Users can view own challenge progress"
  ON user_challenge_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own challenge progress"
  ON user_challenge_progress FOR INSERT, UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_plants_user_id ON plants(user_id);
CREATE INDEX IF NOT EXISTS idx_focus_sessions_user_id ON focus_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_focus_sessions_completed ON focus_sessions(completed);
CREATE INDEX IF NOT EXISTS idx_garden_posts_created_at ON garden_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_garden_posts_updated_at
  BEFORE UPDATE ON garden_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_post_comments_updated_at
  BEFORE UPDATE ON post_comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_challenge_progress_updated_at
  BEFORE UPDATE ON user_challenge_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();