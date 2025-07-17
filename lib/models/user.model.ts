import mongoose, { Schema, Document, model, models, Model } from "mongoose";

export interface IUser extends Document {
  xUsername: string;
  followersCount: number;
  goblinPoints: number;
  profileImage?: string;
  referralCode?: string;
  referralPoints?: number;
}

const UserSchema = new Schema<IUser>({
  xUsername: { type: String, required: true, unique: true, sparse: true },
  followersCount: { type: Number, default: 0 },
  goblinPoints: { type: Number, default: 0 },
  profileImage: { type: String },
  referralCode: { type: String, unique: true, sparse: true },
  referralPoints: { type: Number, default: 0 },
});

UserSchema.index({ goblinPoints: -1 });
UserSchema.index({ xUsername: "text" });

const User: Model<IUser> =
  (mongoose.models && mongoose.models.User) || model<IUser>("User", UserSchema);

export default User;
