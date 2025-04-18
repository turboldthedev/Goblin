import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IUser extends Document {
  xUsername: string;
  followersCount: number;
  goblinPoints: number;
  profileImage?: string;
  referralCode?: string; // New field for referral code
  referralPoints?: number;
}

const UserSchema = new Schema<IUser>({
  xUsername: { type: String, required: true, unique: true },
  followersCount: { type: Number, default: 0 },
  goblinPoints: { type: Number, default: 0 },
  profileImage: { type: String },
  referralCode: { type: String, unique: true, sparse: true },
  referralPoints: { type: Number, default: 0 },
});

export default models.User || model<IUser>("User", UserSchema);
