/*
  # Seed Initial Data for Tendly

  1. Achievements
    - Create all available achievements with proper categories and requirements
    
  2. Weekly Challenges
    - Create sample weekly challenges
    
  3. Sample Data
    - No user-specific data (will be created when users sign up)
*/

-- Insert system achievements
INSERT INTO achievements (id, name, description, icon, category, requirements, reward_type, reward_amount, is_rare) VALUES
  ('first-sprout', 'First Sprout', 'Complete your first task', '🌱', 'tasks', '{"tasks_completed": 1}', 'compost', 10, false),
  ('focus-master', 'Focus Master', 'Complete 50 focus sessions', '🧘‍♀️', 'focus', '{"focus_sessions": 50}', 'rare_seed', 1, true),
  ('green-thumb', 'Green Thumb', 'Grow 25 plants', '👍', 'garden', '{"plants_grown": 25}', 'compost', 50, false),
  ('streak-warrior', 'Streak Warrior', 'Maintain a 30-day streak', '🔥', 'streak', '{"streak_days": 30}', 'rare_seed', 1, true),
  ('garden-guardian', 'Garden Guardian', 'Complete 500 tasks', '🛡️', 'tasks', '{"tasks_completed": 500}', 'rare_seed', 2, true),
  ('zen-master', 'Zen Master', 'Complete 200 focus sessions', '☯️', 'focus', '{"focus_sessions": 200}', 'rare_seed', 3, true),
  ('social-butterfly', 'Social Butterfly', 'Get 100 likes on posts', '🦋', 'social', '{"post_likes": 100}', 'compost', 25, false),
  ('early-bird', 'Early Bird', 'Complete 10 morning tasks', '🐦', 'tasks', '{"morning_tasks": 10}', 'compost', 20, false),
  ('night-owl', 'Night Owl', 'Complete 10 evening focus sessions', '🦉', 'focus', '{"evening_sessions": 10}', 'compost', 20, false),
  ('perfectionist', 'Perfectionist', 'Complete 20 tasks without distractions', '💎', 'focus', '{"perfect_sessions": 20}', 'rare_seed', 1, true)
ON CONFLICT (id) DO NOTHING;

-- Insert sample weekly challenges
INSERT INTO weekly_challenges (title, description, target_value, challenge_type, reward_compost, reward_rare_seed, start_date, end_date, is_active) VALUES
  ('Focus Champion', 'Complete 20 focus sessions this week', 20, 'focus_sessions', 100, true, CURRENT_DATE - INTERVAL '3 days', CURRENT_DATE + INTERVAL '4 days', true),
  ('Task Master', 'Complete 30 tasks this week', 30, 'tasks_completed', 75, false, CURRENT_DATE - INTERVAL '3 days', CURRENT_DATE + INTERVAL '4 days', true),
  ('Consistency King', 'Maintain your streak for 7 days', 7, 'streak_days', 50, false, CURRENT_DATE - INTERVAL '3 days', CURRENT_DATE + INTERVAL '4 days', true)
ON CONFLICT DO NOTHING;