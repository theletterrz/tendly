import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';

type Tables = Database['public']['Tables'];
type Profile = Tables['profiles']['Row'];
type Task = Tables['tasks']['Row'];
type Plant = Tables['plants']['Row'];
type FocusSession = Tables['focus_sessions']['Row'];
type Achievement = Tables['achievements']['Row'];
type UserAchievement = Tables['user_achievements']['Row'];
type GardenPost = Tables['garden_posts']['Row'];
type WeeklyChallenge = Tables['weekly_challenges']['Row'];

export class SupabaseService {
  // Profile Management
  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return data;
  }

  async createProfile(userId: string, profileData: Partial<Profile>) {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        ...profileData,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating profile:', error);
      throw error;
    }

    return data;
  }

  async updateProfile(userId: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }

    return data;
  }

  // Task Management
  async getTasks(userId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }

    return data || [];
  }

  async createTask(userId: string, taskData: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        user_id: userId,
        ...taskData,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating task:', error);
      throw error;
    }

    return data;
  }

  async completeTask(taskId: string, blockchainHash?: string) {
    const { data, error } = await supabase
      .from('tasks')
      .update({
        completed: true,
        completed_at: new Date().toISOString(),
        blockchain_hash: blockchainHash,
      })
      .eq('id', taskId)
      .select()
      .single();

    if (error) {
      console.error('Error completing task:', error);
      throw error;
    }

    return data;
  }

  // Plant Management
  async getPlants(userId: string): Promise<Plant[]> {
    const { data, error } = await supabase
      .from('plants')
      .select('*')
      .eq('user_id', userId)
      .order('planted_at', { ascending: false });

    if (error) {
      console.error('Error fetching plants:', error);
      return [];
    }

    return data || [];
  }

  async plantSeed(userId: string, plantData: Omit<Plant, 'id' | 'user_id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('plants')
      .insert({
        user_id: userId,
        ...plantData,
      })
      .select()
      .single();

    if (error) {
      console.error('Error planting seed:', error);
      throw error;
    }

    return data;
  }

  async updatePlantGrowth(plantId: string, growth: number) {
    const { data, error } = await supabase
      .from('plants')
      .update({ growth })
      .eq('id', plantId)
      .select()
      .single();

    if (error) {
      console.error('Error updating plant growth:', error);
      throw error;
    }

    return data;
  }

  // Focus Sessions
  async createFocusSession(userId: string, sessionData: Omit<FocusSession, 'id' | 'user_id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('focus_sessions')
      .insert({
        user_id: userId,
        ...sessionData,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating focus session:', error);
      throw error;
    }

    return data;
  }

  async getFocusStats(userId: string) {
    const { data, error } = await supabase
      .from('focus_sessions')
      .select('duration_minutes, completed, created_at')
      .eq('user_id', userId)
      .eq('completed', true);

    if (error) {
      console.error('Error fetching focus stats:', error);
      return { totalSessions: 0, totalMinutes: 0 };
    }

    const totalSessions = data?.length || 0;
    const totalMinutes = data?.reduce((sum, session) => sum + session.duration_minutes, 0) || 0;

    return { totalSessions, totalMinutes };
  }

  // Achievements
  async getAchievements(): Promise<Achievement[]> {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .order('category', { ascending: true });

    if (error) {
      console.error('Error fetching achievements:', error);
      return [];
    }

    return data || [];
  }

  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    const { data, error } = await supabase
      .from('user_achievements')
      .select(`
        *,
        achievements (*)
      `)
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching user achievements:', error);
      return [];
    }

    return data || [];
  }

  async unlockAchievement(userId: string, achievementId: string, blockchainHash?: string, zkTLSProof?: string) {
    const { data, error } = await supabase
      .from('user_achievements')
      .insert({
        user_id: userId,
        achievement_id: achievementId,
        blockchain_hash: blockchainHash,
        zktls_proof: zkTLSProof,
      })
      .select()
      .single();

    if (error) {
      console.error('Error unlocking achievement:', error);
      throw error;
    }

    return data;
  }

  // Social Features
  async getGardenPosts(limit: number = 20): Promise<(GardenPost & { profiles: Profile })[]> {
    const { data, error } = await supabase
      .from('garden_posts')
      .select(`
        *,
        profiles (*)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching garden posts:', error);
      return [];
    }

    return data || [];
  }

  async createGardenPost(userId: string, postData: Omit<GardenPost, 'id' | 'user_id' | 'likes_count' | 'comments_count' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('garden_posts')
      .insert({
        user_id: userId,
        ...postData,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating garden post:', error);
      throw error;
    }

    return data;
  }

  async togglePostLike(userId: string, postId: string) {
    // Check if already liked
    const { data: existingLike } = await supabase
      .from('post_likes')
      .select('id')
      .eq('user_id', userId)
      .eq('post_id', postId)
      .single();

    if (existingLike) {
      // Unlike
      const { error: deleteError } = await supabase
        .from('post_likes')
        .delete()
        .eq('user_id', userId)
        .eq('post_id', postId);

      if (deleteError) throw deleteError;

      // Decrement likes count
      const { error: updateError } = await supabase
        .from('garden_posts')
        .update({ likes_count: supabase.sql`likes_count - 1` })
        .eq('id', postId);

      if (updateError) throw updateError;

      return { liked: false };
    } else {
      // Like
      const { error: insertError } = await supabase
        .from('post_likes')
        .insert({
          user_id: userId,
          post_id: postId,
        });

      if (insertError) throw insertError;

      // Increment likes count
      const { error: updateError } = await supabase
        .from('garden_posts')
        .update({ likes_count: supabase.sql`likes_count + 1` })
        .eq('id', postId);

      if (updateError) throw updateError;

      return { liked: true };
    }
  }

  // Weekly Challenges
  async getActiveWeeklyChallenges(): Promise<WeeklyChallenge[]> {
    const { data, error } = await supabase
      .from('weekly_challenges')
      .select('*')
      .eq('is_active', true)
      .gte('end_date', new Date().toISOString().split('T')[0]);

    if (error) {
      console.error('Error fetching weekly challenges:', error);
      return [];
    }

    return data || [];
  }

  async getUserChallengeProgress(userId: string, challengeId: string) {
    const { data, error } = await supabase
      .from('user_challenge_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('challenge_id', challengeId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching challenge progress:', error);
      return null;
    }

    return data;
  }

  async updateChallengeProgress(userId: string, challengeId: string, progress: number) {
    const { data, error } = await supabase
      .from('user_challenge_progress')
      .upsert({
        user_id: userId,
        challenge_id: challengeId,
        current_progress: progress,
        completed: false,
      })
      .select()
      .single();

    if (error) {
      console.error('Error updating challenge progress:', error);
      throw error;
    }

    return data;
  }

  // Leaderboard
  async getWeeklyLeaderboard(limit: number = 10) {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from('focus_sessions')
      .select(`
        user_id,
        profiles!inner (display_name, level, avatar_url),
        count(*) as session_count
      `)
      .eq('completed', true)
      .gte('completed_at', startOfWeek.toISOString())
      .group('user_id, profiles.display_name, profiles.level, profiles.avatar_url')
      .order('session_count', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching leaderboard:', error);
      return [];
    }

    return data || [];
  }

  // Authentication helpers
  async signUp(email: string, password: string, displayName: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      // Create profile
      await this.createProfile(data.user.id, {
        display_name: displayName,
        username: email.split('@')[0],
      });
    }

    return data;
  }

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }
}

export const supabaseService = new SupabaseService();