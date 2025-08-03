import { useState, useEffect } from 'react';
import { smartContractService } from '@/services/smartContractService';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  category: 'work' | 'personal' | 'health' | 'learning';
  completed: boolean;
  plantType: 'sprout' | 'flower' | 'tree';
  compostReward: number;
  createdAt: Date;
  completedAt?: Date;
  blockchainHash?: string;
}

export interface Plant {
  id: string;
  taskId: string;
  type: 'sprout' | 'sapling' | 'flower' | 'tree';
  growth: number;
  position: { x: number; y: number };
  plantedAt: Date;
  lastWatered?: Date;
}

export function useTaskGarden() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [compost, setCompost] = useState(0);
  const [level, setLevel] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize garden state from blockchain
  useEffect(() => {
    initializeGarden();
  }, []);

  const initializeGarden = async () => {
    try {
      setIsLoading(true);
      
      // Initialize smart contract connection
      await smartContractService.initialize();
      
      // Load user's garden state from blockchain
      const gardenState = await smartContractService.getGardenState();
      
      setCompost(gardenState.compost);
      setLevel(gardenState.level);
      
      // Load tasks and plants (in a real app, this would come from storage + blockchain)
      loadInitialData();
      
    } catch (error) {
      console.error('Failed to initialize garden:', error);
      // Fall back to local state
      loadInitialData();
    } finally {
      setIsLoading(false);
    }
  };

  const loadInitialData = () => {
    // Load some sample data
    setTasks([
      {
        id: '1',
        title: 'Morning workout',
        description: 'Complete 30-minute cardio session',
        priority: 'high',
        category: 'health',
        completed: false,
        plantType: 'tree',
        compostReward: 15,
        createdAt: new Date(),
      },
      {
        id: '2',
        title: 'Review project proposal',
        description: 'Read through and provide feedback',
        priority: 'medium',
        category: 'work',
        completed: true,
        plantType: 'flower',
        compostReward: 10,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
    ]);

    setPlants([
      {
        id: '1',
        taskId: '2',
        type: 'flower',
        growth: 90,
        position: { x: 200, y: 300 },
        plantedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
    ]);

    setCompost(128);
    setLevel(8);
  };

  const completeTask = async (taskId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      // Update local state immediately for UX
      setTasks(tasks.map(t => 
        t.id === taskId 
          ? { ...t, completed: true, completedAt: new Date() }
          : t
      ));

      // Submit to blockchain
      const result = await smartContractService.completeTaskOnChain({
        taskId: task.id,
        category: task.category,
        priority: task.priority,
      });

      if (result.success) {
        // Update compost count
        setCompost(prev => prev + result.compostEarned);
        
        // Plant a new plant in the garden
        const newPlant: Plant = {
          id: Date.now().toString(),
          taskId: task.id,
          type: task.plantType,
          growth: 0,
          position: { 
            x: Math.random() * 200 + 50, 
            y: Math.random() * 200 + 150 
          },
          plantedAt: new Date(),
        };
        
        setPlants(prev => [...prev, newPlant]);
        
        // Update task with blockchain hash
        setTasks(tasks.map(t => 
          t.id === taskId 
            ? { ...t, blockchainHash: result.transactionHash }
            : t
        ));
      }
    } catch (error) {
      console.error('Failed to complete task:', error);
      // Revert local state if blockchain submission fails
      setTasks(tasks.map(t => 
        t.id === taskId 
          ? { ...t, completed: false, completedAt: undefined }
          : t
      ));
    }
  };

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'completed' | 'plantType' | 'compostReward'>) => {
    const task: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date(),
      completed: false,
      plantType: taskData.priority === 'high' ? 'tree' : 
                 taskData.priority === 'medium' ? 'flower' : 'sprout',
      compostReward: taskData.priority === 'high' ? 15 : 
                     taskData.priority === 'medium' ? 10 : 5,
    };

    setTasks(prev => [task, ...prev]);
    return task;
  };

  const recordFocusSession = async (sessionData: {
    duration: number;
    distractionsCount: number;
  }) => {
    try {
      const result = await smartContractService.recordFocusSession({
        duration: sessionData.duration,
        startTime: new Date(Date.now() - sessionData.duration * 1000),
        endTime: new Date(),
        distractionsCount: sessionData.distractionsCount,
      });

      if (result.success) {
        setCompost(prev => prev + result.compostEarned);
        
        // Grow existing plants
        setPlants(prev => prev.map(plant => ({
          ...plant,
          growth: Math.min(100, plant.growth + result.plantGrowth),
        })));
      }

      return result;
    } catch (error) {
      console.error('Failed to record focus session:', error);
      throw error;
    }
  };

  return {
    tasks,
    plants,
    compost,
    level,
    isLoading,
    completeTask,
    addTask,
    recordFocusSession,
  };
}