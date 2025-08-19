import { useState, useEffect } from 'react';
import { supabaseService } from '@/services/supabaseService';
import { useAuth } from '@/hooks/useAuth';
import { Database } from '@/types/database';

type Task = Database['public']['Tables']['tasks']['Row'];
type Plant = Database['public']['Tables']['plants']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

export function useTaskGarden() {
  const { user, profile } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load garden data from Supabase
  useEffect(() => {
    if (user) {
      loadGardenData();
    }
  }, [user]);

  const loadGardenData = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Load tasks and plants from Supabase
      const [tasksData, plantsData] = await Promise.all([
        supabaseService.getTasks(user.id),
        supabaseService.getPlants(user.id),
      ]);
      
      setTasks(tasksData);
      setPlants(plantsData);
    } catch (error) {
      console.error('Failed to load garden data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const completeTask = async (taskId: string) => {
    if (!user) return;
    
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      // Complete task in Supabase
      const completedTask = await supabaseService.completeTask(taskId);
      
      // Update local state
      setTasks(tasks.map(t => 
        t.id === taskId ? completedTask : t
      ));
      
      // Plant a new plant in the garden
      const newPlant = await supabaseService.plantSeed(user.id, {
        task_id: taskId,
        type: task.plant_type as 'sprout' | 'sapling' | 'flower' | 'tree',
        growth: 0,
        position_x: Math.floor(Math.random() * 200 + 50),
        position_y: Math.floor(Math.random() * 200 + 150),
        planted_at: new Date().toISOString(),
        last_watered: null,
      });
      
      setPlants(prev => [...prev, newPlant]);
      
      // Update user's compost and stats
      if (profile) {
        await supabaseService.updateProfile(user.id, {
          compost: profile.compost + task.compost_reward,
          total_tasks: profile.total_tasks + 1,
          plants_grown: profile.plants_grown + 1,
        });
      }
      
    } catch (error) {
      console.error('Failed to complete task:', error);
      throw error;
    }
  };

  const addTask = async (taskData: {
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    category: 'work' | 'personal' | 'health' | 'learning';
    due_date?: string;
  }) => {
    if (!user) return;
    
    try {
      const plantType = taskData.priority === 'high' ? 'tree' : 
                       taskData.priority === 'medium' ? 'flower' : 'sprout';
      const compostReward = taskData.priority === 'high' ? 15 : 
                           taskData.priority === 'medium' ? 10 : 5;
      
      const task = await supabaseService.createTask(user.id, {
        ...taskData,
        plant_type: plantType,
        compost_reward: compostReward,
        completed: false,
        completed_at: null,
        blockchain_hash: null,
      });

      setTasks(prev => [task, ...prev]);
      return task;
    } catch (error) {
      console.error('Failed to add task:', error);
      throw error;
    }
  };

  const recordFocusSession = async (sessionData: {
    duration: number;
    distractionsCount: number;
  }) => {
    if (!user) return;
    
    try {
      const session = await supabaseService.createFocusSession(user.id, {
        duration_minutes: Math.floor(sessionData.duration / 60),
        completed: true,
        distractions_count: sessionData.distractionsCount,
        session_type: 'focus',
        compost_earned: Math.floor(sessionData.duration / 60) * 2,
        plant_growth_bonus: 10,
        blockchain_hash: null,
        zktls_proof: null,
        started_at: new Date(Date.now() - sessionData.duration * 1000).toISOString(),
        completed_at: new Date().toISOString(),
      });

      // Update profile stats
      if (profile) {
        await supabaseService.updateProfile(user.id, {
          compost: profile.compost + session.compost_earned,
          focus_hours: profile.focus_hours + Math.floor(sessionData.duration / 3600),
        });
      }

      // Grow existing plants
      const updatedPlants = await Promise.all(
        plants.map(async (plant) => {
          const newGrowth = Math.min(100, plant.growth + session.plant_growth_bonus);
          return await supabaseService.updatePlantGrowth(plant.id, newGrowth);
        })
      );
      
      setPlants(updatedPlants);
      
      return session;
    } catch (error) {
      console.error('Failed to record focus session:', error);
      throw error;
    }
  };

  return {
    tasks,
    plants,
    compost: profile?.compost || 0,
    level: profile?.level || 1,
    isLoading,
    completeTask,
    addTask,
    recordFocusSession,
    profile,
  };
}