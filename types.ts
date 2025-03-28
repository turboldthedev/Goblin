export interface User {
  _id: string;
  xUsername: string;
  followersCount: number;
  goblinPoints: number;
  lastUpdated: string;
  __v: number;
}

export interface UserResponse {
  user: User;
  rank: number;
}
