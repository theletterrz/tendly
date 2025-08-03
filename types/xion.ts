// XION Mobile Development Kit Types
export interface XIONWallet {
  address: string;
  isConnected: boolean;
  network: 'testnet' | 'mainnet';
}

export interface XIONTransaction {
  hash: string;
  type: 'task_completion' | 'achievement_unlock' | 'compost_transfer';
  data: any;
  timestamp: Date;
  verified: boolean;
}

export interface zkTLSProof {
  proof: string;
  publicSignals: string[];
  verificationKey: string;
  timestamp: Date;
}

export interface SmartContractState {
  userLevel: number;
  totalCompost: number;
  plantsGrown: number;
  achievements: string[];
  lastUpdate: Date;
}

// Smart contract interaction types
export interface TaskCompletionData {
  taskId: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  completedAt: Date;
  focusTime?: number;
}

export interface PlantGrowthData {
  plantId: string;
  growthStage: number;
  plantType: string;
  compostEarned: number;
}
