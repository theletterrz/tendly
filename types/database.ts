export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          display_name: string
          avatar_url: string
          level: number
          compost: number
          total_tasks: number
          focus_hours: number
          current_streak: number
          longest_streak: number
          plants_grown: number
          rare_seeds: number
          mood: 'sunny' | 'cloudy' | 'rainy'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          display_name?: string
          avatar_url?: string
          level?: number
          compost?: number
          total_tasks?: number
          focus_hours?: number
          current_streak?: number
          longest_streak?: number
          plants_grown?: number
          rare_seeds?: number
          mood?: 'sunny' | 'cloudy' | 'rainy'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          display_name?: string
          avatar_url?: string
          level?: number
          compost?: number
          total_tasks?: number
          focus_hours?: number
          current_streak?: number
          longest_streak?: number
          plants_grown?: number
          rare_seeds?: number
          mood?: 'sunny' | 'cloudy' | 'rainy'
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          priority: 'low' | 'medium' | 'high'
          category: 'work' | 'personal' | 'health' | 'learning'
          completed: boolean
          plant_type: 'sprout' | 'flower' | 'tree'
          compost_reward: number
          due_date: string | null
          completed_at: string | null
          blockchain_hash: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string
          priority?: 'low' | 'medium' | 'high'
          category?: 'work' | 'personal' | 'health' | 'learning'
          completed?: boolean
          plant_type?: 'sprout' | 'flower' | 'tree'
          compost_reward?: number
          due_date?: string | null
          completed_at?: string | null
          blockchain_hash?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string
          priority?: 'low' | 'medium' | 'high'
          category?: 'work' | 'personal' | 'health' | 'learning'
          completed?: boolean
          plant_type?: 'sprout' | 'flower' | 'tree'
          compost_reward?: number
          due_date?: string | null
          completed_at?: string | null
          blockchain_hash?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      plants: {
        Row: {
          id: string
          user_id: string
          task_id: string | null
          type: 'sprout' | 'sapling' | 'flower' | 'tree'
          growth: number
          position_x: number
          position_y: number
          planted_at: string
          last_watered: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          task_id?: string | null
          type?: 'sprout' | 'sapling' | 'flower' | 'tree'
          growth?: number
          position_x?: number
          position_y?: number
          planted_at?: string
          last_watered?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          task_id?: string | null
          type?: 'sprout' | 'sapling' | 'flower' | 'tree'
          growth?: number
          position_x?: number
          position_y?: number
          planted_at?: string
          last_watered?: string | null
          created_at?: string
        }
      }
      focus_sessions: {
        Row: {
          id: string
          user_id: string
          duration_minutes: number
          completed: boolean
          distractions_count: number
          session_type: 'focus' | 'break'
          compost_earned: number
          plant_growth_bonus: number
          blockchain_hash: string | null
          zktls_proof: string | null
          started_at: string
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          duration_minutes?: number
          completed?: boolean
          distractions_count?: number
          session_type?: 'focus' | 'break'
          compost_earned?: number
          plant_growth_bonus?: number
          blockchain_hash?: string | null
          zktls_proof?: string | null
          started_at?: string
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          duration_minutes?: number
          completed?: boolean
          distractions_count?: number
          session_type?: 'focus' | 'break'
          compost_earned?: number
          plant_growth_bonus?: number
          blockchain_hash?: string | null
          zktls_proof?: string | null
          started_at?: string
          completed_at?: string | null
          created_at?: string
        }
      }
      achievements: {
        Row: {
          id: string
          name: string
          description: string
          icon: string
          category: 'tasks' | 'focus' | 'social' | 'streak' | 'garden' | 'general'
          requirements: Json
          reward_type: 'compost' | 'rare_seed' | 'badge'
          reward_amount: number
          is_rare: boolean
          created_at: string
        }
        Insert: {
          id: string
          name: string
          description: string
          icon?: string
          category?: 'tasks' | 'focus' | 'social' | 'streak' | 'garden' | 'general'
          requirements?: Json
          reward_type?: 'compost' | 'rare_seed' | 'badge'
          reward_amount?: number
          is_rare?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          icon?: string
          category?: 'tasks' | 'focus' | 'social' | 'streak' | 'garden' | 'general'
          requirements?: Json
          reward_type?: 'compost' | 'rare_seed' | 'badge'
          reward_amount?: number
          is_rare?: boolean
          created_at?: string
        }
      }
      user_achievements: {
        Row: {
          id: string
          user_id: string
          achievement_id: string
          unlocked_at: string
          blockchain_hash: string | null
          zktls_proof: string | null
        }
        Insert: {
          id?: string
          user_id: string
          achievement_id: string
          unlocked_at?: string
          blockchain_hash?: string | null
          zktls_proof?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          achievement_id?: string
          unlocked_at?: string
          blockchain_hash?: string | null
          zktls_proof?: string | null
        }
      }
      garden_posts: {
        Row: {
          id: string
          user_id: string
          achievement_text: string
          garden_image_url: string | null
          likes_count: number
          comments_count: number
          is_featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          achievement_text: string
          garden_image_url?: string | null
          likes_count?: number
          comments_count?: number
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          achievement_text?: string
          garden_image_url?: string | null
          likes_count?: number
          comments_count?: number
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      post_likes: {
        Row: {
          id: string
          user_id: string
          post_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          post_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          post_id?: string
          created_at?: string
        }
      }
      post_comments: {
        Row: {
          id: string
          user_id: string
          post_id: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          post_id: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          post_id?: string
          content?: string
          created_at?: string
          updated_at?: string
        }
      }
      weekly_challenges: {
        Row: {
          id: string
          title: string
          description: string
          target_value: number
          challenge_type: 'focus_sessions' | 'tasks_completed' | 'streak_days'
          reward_compost: number
          reward_rare_seed: boolean
          start_date: string
          end_date: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          target_value: number
          challenge_type: 'focus_sessions' | 'tasks_completed' | 'streak_days'
          reward_compost?: number
          reward_rare_seed?: boolean
          start_date: string
          end_date: string
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          target_value?: number
          challenge_type?: 'focus_sessions' | 'tasks_completed' | 'streak_days'
          reward_compost?: number
          reward_rare_seed?: boolean
          start_date?: string
          end_date?: string
          is_active?: boolean
          created_at?: string
        }
      }
      user_challenge_progress: {
        Row: {
          id: string
          user_id: string
          challenge_id: string
          current_progress: number
          completed: boolean
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          challenge_id: string
          current_progress?: number
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          challenge_id?: string
          current_progress?: number
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}