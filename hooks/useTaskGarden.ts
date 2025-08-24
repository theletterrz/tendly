import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { smartContractService } from '@/services/smartContractService';
import {
  Task,
  Plant,
  CreateTaskForm,
  UpdateTaskForm,
  UseTasksOptions,
  UseTasksReturn,
  FocusSession,
  CompostTransaction,
  UserAchievement,
} from '@/types/xion';

const STORAGE_KEYS = {
  TASKS: 'tendly_tasks',
  PLANTS: 'tendly_plants',
  COMPOST: 'tendly_compost',
  LEVEL: 'tendly_level',
  FOCUS_SESSIONS: 'tendly_focus_sessions',
  ACHIEVEMENTS: 'tendly_achievements',
};

export function useTaskGarden(options: UseTasksOptions = {}): UseTasksReturn {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [compost, setCompost] = useState(0);
  const [level, setLevel] = useState(1);
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>([]);
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize garden state
  useEffect(() => {
    initializeGarden();
  }, []);

  // Filter tasks based on options
  const filteredTasks = tasks
    .filter((task) => {
      if (options.status && task.status !== options.status) return false;
      if (options.category && task.category !== options.category) return false;
      if (options.priority && task.priority !== options.priority) return false;
      return true;
    })
    .sort((a, b) => {
      const sortBy = options.sortBy || 'createdAt';
      const order = options.sortOrder || 'desc';

      let aValue = a[sortBy as keyof Task];
      let bValue = b[sortBy as keyof Task];

      if (aValue instanceof Date) aValue = aValue.getTime();
      if (bValue instanceof Date) bValue = bValue.getTime();

      if (order === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    })
    .slice(0, options.limit);

  const initializeGarden = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load data from AsyncStorage
      await Promise.all([
        loadTasks(),
        loadPlants(),
        loadCompost(),
        loadLevel(),
        loadFocusSessions(),
        loadAchievements(),
      ]);

      // Initialize smart contract connection
      try {
        await smartContractService.initialize();
        // Sync with blockchain if connected
        await syncWithBlockchain();
      } catch (blockchainError) {
        console.warn(
          'Blockchain sync failed, continuing with local data:',
          blockchainError
        );
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to initialize garden'
      );
      console.error('Failed to initialize garden:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadTasks = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.TASKS);
      if (stored) {
        const parsedTasks = JSON.parse(stored).map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
          completedAt: task.completedAt
            ? new Date(task.completedAt)
            : undefined,
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        }));
        setTasks(parsedTasks);
      } else {
        // Load sample data for first time users
        await loadSampleData();
      }
    } catch (err) {
      console.error('Failed to load tasks:', err);
    }
  };

  const loadPlants = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.PLANTS);
      if (stored) {
        const parsedPlants = JSON.parse(stored).map((plant: any) => ({
          ...plant,
          plantedAt: new Date(plant.plantedAt),
          lastWatered: plant.lastWatered
            ? new Date(plant.lastWatered)
            : undefined,
          lastFertilized: plant.lastFertilized
            ? new Date(plant.lastFertilized)
            : undefined,
        }));
        setPlants(parsedPlants);
      }
    } catch (err) {
      console.error('Failed to load plants:', err);
    }
  };

  const loadCompost = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.COMPOST);
      if (stored) {
        setCompost(parseInt(stored, 10));
      } else {
        setCompost(128); // Default starting compost
      }
    } catch (err) {
      console.error('Failed to load compost:', err);
    }
  };

  const loadLevel = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.LEVEL);
      if (stored) {
        setLevel(parseInt(stored, 10));
      } else {
        setLevel(8); // Default starting level
      }
    } catch (err) {
      console.error('Failed to load level:', err);
    }
  };

  const loadFocusSessions = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.FOCUS_SESSIONS);
      if (stored) {
        const parsedSessions = JSON.parse(stored).map((session: any) => ({
          ...session,
          startTime: new Date(session.startTime),
          endTime: new Date(session.endTime),
        }));
        setFocusSessions(parsedSessions);
      }
    } catch (err) {
      console.error('Failed to load focus sessions:', err);
    }
  };

  const loadAchievements = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      if (stored) {
        const parsedAchievements = JSON.parse(stored).map(
          (achievement: any) => ({
            ...achievement,
            unlockedAt: new Date(achievement.unlockedAt),
          })
        );
        setAchievements(parsedAchievements);
      }
    } catch (err) {
      console.error('Failed to load achievements:', err);
    }
  };

  const loadSampleData = async () => {
    const sampleTasks: Task[] = [
      {
        id: '1',
        userId: 'user1',
        title: 'Morning workout',
        description: 'Complete 30-minute cardio session',
        priority: 'high',
        category: 'health',
        status: 'pending',
        plantType: 'tree',
        compostReward: 15,
        estimatedFocusTime: 30,
        createdAt: new Date(),
        updatedAt: new Date(),
        dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
        tags: ['fitness', 'morning'],
      },
      {
        id: '2',
        userId: 'user1',
        title: 'Review project proposal',
        description: 'Read through and provide feedback',
        priority: 'medium',
        category: 'work',
        status: 'completed',
        plantType: 'flower',
        compostReward: 10,
        estimatedFocusTime: 45,
        actualFocusTime: 50,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        tags: ['work', 'review'],
      },
      {
        id: '3',
        userId: 'user1',
        title: 'Call mom',
        description: 'Weekly check-in call',
        priority: 'low',
        category: 'personal',
        status: 'pending',
        plantType: 'sprout',
        compostReward: 5,
        estimatedFocusTime: 15,
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: ['family', 'personal'],
      },
    ];

    const samplePlants: Plant[] = [
      {
        id: '1',
        userId: 'user1',
        taskId: '2',
        type: 'flower',
        species: {
          id: 'rose',
          name: 'Garden Rose',
          emoji: '🌹',
          rarity: 'common',
          growthRate: 1.0,
          compostRequirement: 10,
          description: 'A beautiful garden rose that blooms with dedication',
          unlockConditions: ['Complete first work task'],
        },
        growth: 90,
        health: 95,
        position: { x: 200, y: 300 },
        plantedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isRare: false,
        specialTraits: [],
      },
    ];

    setTasks(sampleTasks);
    setPlants(samplePlants);

    // Save to storage
    await saveTasks(sampleTasks);
    await savePlants(samplePlants);
  };

  const syncWithBlockchain = async () => {
    try {
      const gardenState = await smartContractService.getGardenState();
      // Update local state with blockchain data if available
      if (gardenState.compost > compost) {
        setCompost(gardenState.compost);
        await AsyncStorage.setItem(
          STORAGE_KEYS.COMPOST,
          gardenState.compost.toString()
        );
      }
      if (gardenState.level > level) {
        setLevel(gardenState.level);
        await AsyncStorage.setItem(
          STORAGE_KEYS.LEVEL,
          gardenState.level.toString()
        );
      }
    } catch (err) {
      console.warn('Blockchain sync failed:', err);
    }
  };

  const saveTasks = async (tasksToSave: Task[]) => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.TASKS,
        JSON.stringify(tasksToSave)
      );
    } catch (err) {
      console.error('Failed to save tasks:', err);
    }
  };

  const savePlants = async (plantsToSave: Plant[]) => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.PLANTS,
        JSON.stringify(plantsToSave)
      );
    } catch (err) {
      console.error('Failed to save plants:', err);
    }
  };

  const saveCompost = async (compostAmount: number) => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.COMPOST,
        compostAmount.toString()
      );
    } catch (err) {
      console.error('Failed to save compost:', err);
    }
  };

  const createTask = useCallback(
    async (taskData: CreateTaskForm): Promise<Task> => {
      try {
        const newTask: Task = {
          id: Date.now().toString(),
          userId: 'user1', // In a real app, get from auth context
          title: taskData.title,
          description: taskData.description,
          priority: taskData.priority,
          category: taskData.category,
          status: 'pending',
          plantType:
            taskData.priority === 'high'
              ? 'tree'
              : taskData.priority === 'medium'
              ? 'flower'
              : 'sprout',
          compostReward:
            taskData.priority === 'high'
              ? 15
              : taskData.priority === 'medium'
              ? 10
              : 5,
          estimatedFocusTime: taskData.estimatedFocusTime,
          createdAt: new Date(),
          updatedAt: new Date(),
          dueDate: taskData.dueDate,
          tags: taskData.tags || [],
        };

        const updatedTasks = [newTask, ...tasks];
        setTasks(updatedTasks);
        await saveTasks(updatedTasks);

        return newTask;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to create task';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [tasks]
  );

  const updateTask = useCallback(
    async (id: string, updates: UpdateTaskForm): Promise<Task> => {
      try {
        const updatedTasks = tasks.map((task) =>
          task.id === id
            ? {
                ...task,
                ...updates,
                updatedAt: new Date(),
                // Recalculate plant type and reward if priority changed
                ...(updates.priority && {
                  plantType:
                    updates.priority === 'high'
                      ? 'tree'
                      : updates.priority === 'medium'
                      ? 'flower'
                      : 'sprout',
                  compostReward:
                    updates.priority === 'high'
                      ? 15
                      : updates.priority === 'medium'
                      ? 10
                      : 5,
                }),
              }
            : task
        );

        const updatedTask = updatedTasks.find((task) => task.id === id);
        if (!updatedTask) {
          throw new Error('Task not found');
        }

        setTasks(updatedTasks);
        await saveTasks(updatedTasks);

        return updatedTask;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to update task';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [tasks]
  );

  const deleteTask = useCallback(
    async (id: string): Promise<void> => {
      try {
        const updatedTasks = tasks.filter((task) => task.id !== id);
        setTasks(updatedTasks);
        await saveTasks(updatedTasks);

        // Also remove associated plant if exists
        const associatedPlant = plants.find((plant) => plant.taskId === id);
        if (associatedPlant) {
          const updatedPlants = plants.filter((plant) => plant.taskId !== id);
          setPlants(updatedPlants);
          await savePlants(updatedPlants);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to delete task';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [tasks, plants]
  );

  const completeTask = useCallback(
    async (id: string): Promise<void> => {
      try {
        const task = tasks.find((t) => t.id === id);
        if (!task) {
          throw new Error('Task not found');
        }

        // Update task status
        const updatedTasks = tasks.map((t) =>
          t.id === id
            ? {
                ...t,
                status: 'completed' as const,
                completedAt: new Date(),
                updatedAt: new Date(),
              }
            : t
        );

        setTasks(updatedTasks);
        await saveTasks(updatedTasks);

        // Award compost
        const newCompostAmount = compost + task.compostReward;
        setCompost(newCompostAmount);
        await saveCompost(newCompostAmount);

        // Create a plant in the garden
        const newPlant: Plant = {
          id: Date.now().toString(),
          userId: 'user1',
          taskId: task.id,
          type: task.plantType,
          species: {
            id: 'basic',
            name: `Basic ${task.plantType}`,
            emoji:
              task.plantType === 'tree'
                ? '🌳'
                : task.plantType === 'flower'
                ? '🌸'
                : '🌱',
            rarity: 'common',
            growthRate: 1.0,
            compostRequirement: task.compostReward,
            description: `A ${task.plantType} grown from completing "${task.title}"`,
            unlockConditions: [],
          },
          growth: 25,
          health: 100,
          position: {
            x: Math.random() * 200 + 50,
            y: Math.random() * 200 + 150,
          },
          plantedAt: new Date(),
          isRare: false,
          specialTraits: [],
        };

        const updatedPlants = [...plants, newPlant];
        setPlants(updatedPlants);
        await savePlants(updatedPlants);

        // Try to submit to blockchain
        try {
          const result = await smartContractService.completeTaskOnChain({
            taskId: task.id,
            category: task.category,
            priority: task.priority,
          });

          if (result.success) {
            // Update task with blockchain hash
            const tasksWithHash = updatedTasks.map((t) =>
              t.id === id ? { ...t, blockchainHash: result.transactionHash } : t
            );
            setTasks(tasksWithHash);
            await saveTasks(tasksWithHash);
          }
        } catch (blockchainError) {
          console.warn('Blockchain submission failed:', blockchainError);
          // Continue without blockchain - task is still completed locally
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to complete task';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [tasks, plants, compost]
  );

  const archiveTask = useCallback(
    async (id: string): Promise<void> => {
      try {
        const updatedTasks = tasks.map((task) =>
          task.id === id
            ? { ...task, status: 'archived' as const, updatedAt: new Date() }
            : task
        );

        setTasks(updatedTasks);
        await saveTasks(updatedTasks);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to archive task';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [tasks]
  );

  const refresh = useCallback(async (): Promise<void> => {
    await initializeGarden();
  }, []);

  const recordFocusSession = async (sessionData: {
    duration: number;
    distractionsCount: number;
    taskId?: string;
    mood?: FocusSession['mood'];
    notes?: string;
  }) => {
    try {
      const session: FocusSession = {
        id: Date.now().toString(),
        userId: 'user1',
        taskId: sessionData.taskId,
        duration: sessionData.duration,
        plannedDuration: sessionData.duration, // Assume planned = actual for now
        startTime: new Date(Date.now() - sessionData.duration * 1000),
        endTime: new Date(),
        distractionsCount: sessionData.distractionsCount,
        focusScore: Math.max(0, 100 - sessionData.distractionsCount * 10),
        compostEarned: Math.floor(sessionData.duration / 60) * 2, // 2 compost per minute
        plantGrowthContributed: 10,
        sessionType: 'pomodoro',
        mood: sessionData.mood || 'focused',
        notes: sessionData.notes,
      };

      const updatedSessions = [...focusSessions, session];
      setFocusSessions(updatedSessions);
      await AsyncStorage.setItem(
        STORAGE_KEYS.FOCUS_SESSIONS,
        JSON.stringify(updatedSessions)
      );

      // Award compost
      const newCompostAmount = compost + session.compostEarned;
      setCompost(newCompostAmount);
      await saveCompost(newCompostAmount);

      // Grow existing plants
      const updatedPlants = plants.map((plant) => ({
        ...plant,
        growth: Math.min(100, plant.growth + session.plantGrowthContributed),
        health: Math.min(100, plant.health + 2),
      }));
      setPlants(updatedPlants);
      await savePlants(updatedPlants);

      // Try to submit to blockchain
      try {
        const result = await smartContractService.recordFocusSession({
          duration: session.duration,
          startTime: session.startTime,
          endTime: session.endTime,
          distractionsCount: session.distractionsCount,
        });

        if (result.success) {
          session.blockchainHash = result.transactionHash;
          const sessionsWithHash = updatedSessions.map((s) =>
            s.id === session.id ? session : s
          );
          setFocusSessions(sessionsWithHash);
          await AsyncStorage.setItem(
            STORAGE_KEYS.FOCUS_SESSIONS,
            JSON.stringify(sessionsWithHash)
          );
        }
      } catch (blockchainError) {
        console.warn('Blockchain submission failed:', blockchainError);
      }

      return session;
    } catch (error) {
      console.error('Failed to record focus session:', error);
      throw error;
    }
  };

  return {
    tasks: filteredTasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    completeTask,
    archiveTask,
    refresh,
    // Additional garden-specific data and methods
    plants,
    compost,
    level,
    focusSessions,
    achievements,
    recordFocusSession,
  };
}

// Additional hooks for specific use cases
export function useTasks(options?: UseTasksOptions) {
  return useTaskGarden(options);
}

export function useGardenStats() {
  const { tasks, plants, compost, level, focusSessions } = useTaskGarden();

  const stats = {
    totalTasks: tasks.length,
    completedTasks: tasks.filter((t) => t.status === 'completed').length,
    pendingTasks: tasks.filter((t) => t.status === 'pending').length,
    totalPlants: plants.length,
    healthyPlants: plants.filter((p) => p.health > 80).length,
    totalCompost: compost,
    currentLevel: level,
    totalFocusHours: Math.floor(
      focusSessions.reduce((acc, s) => acc + s.duration, 0) / 3600
    ),
    averageFocusScore:
      focusSessions.length > 0
        ? Math.round(
            focusSessions.reduce((acc, s) => acc + s.focusScore, 0) /
              focusSessions.length
          )
        : 0,
    currentStreak: 7, // TODO: Calculate actual streak
  };

  return stats;
}
