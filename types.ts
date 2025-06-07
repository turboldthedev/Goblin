export interface User {
  _id: string;
  xUsername: string;
  profileImage: string;
  followersCount: number;
  goblinPoints: number;
  lastUpdated: string;
  metamaskWalletAddress: string;
  referralPoints?: number; // ← Add this line
  referralCode?: string; // ← Add this line

  // __v: number;
}

export interface UserResponse {
  user: User;
  rank: number;
}

export interface PartialBoxDetails {
  _id: string;
  name: string;
  imageUrl: string | null;
  normalPrize: number;
  hasBox: boolean;
  isReady: boolean;
  opened: boolean;
  startTime: string;
  readyAt: string;
  missionUrl: string;
  missionDesc: string;
  missionCompleted: boolean;
}
