// types.ts

export interface User {
  userId: string;
  username: string;
  email: string;
  metaAccountId?: string; // XION Meta Account
  profileImage?: string;
  bio?: string;
  settings: {
    notificationsEnabled: boolean;
    theme: 'light' | 'dark';
  };
  createdAt: string; // ISO timestamp
  updatedAt: string;
}

export interface Plant {
  plantId: string;
  type: 'rare_seed' | 'common';
  growthStage: number; // 0 = seed, max = 5
  linkedTaskId?: string;
}

export interface Garden {
  gardenId: string;
  userId: string;
  plants: Plant[];
  compostBalance: number;
  lastUpdated: string;
}

export interface Task {
  taskId: string;
  userId: string;
  title: string;
  description?: string;
  status: 'pending' | 'completed' | 'archived';
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  linkedPlantId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FocusSession {
  sessionId: string;
  userId: string;
  duration: number; // in minutes
  startedAt: string;
  endedAt: string;
  verifiedProof?: string; // zkTLS proof if added
}

export interface Mood {
  moodId: string;
  userId: string;
  mood: 'happy' | 'stressed' | 'tired' | 'neutral';
  weather: 'sunny' | 'rainy' | 'cloudy' | 'snowy' | 'windy';
  loggedAt: string;
}

export interface Achievement {
  achievementId: string;
  userId: string;
  title: string;
  description: string;
  points: number;
  earnedAt: string;
}

export interface Comment {
  commentId: string;
  userId: string;
  text: string;
  createdAt: string;
}

export interface Post {
  postId: string;
  userId: string;
  content: string;
  attachedGardenId?: string;
  likes: string[]; // array of userIds
  comments: Comment[];
  createdAt: string;
}

export interface BlockchainAnchor {
  recordId: string;
  userId: string;
  entityType: 'task' | 'garden' | 'achievement';
  entityId: string;
  txHash: string;
  recordedAt: string;
}
