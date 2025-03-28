export interface User {
  _id: string;
  xUsername: string;
  profileImage: string;
  followersCount: number;
  goblinPoints: number;
  lastUpdated: string;
  metamaskWalletAddress: string;

  // __v: number;
}

export interface UserResponse {
  user: User;
  rank: number;
}
