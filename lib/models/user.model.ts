import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  xUsername: string;
  followersCount: number;
  goblinPoints: number;
  lastUpdated: Date;
}

const UserSchema: Schema = new Schema({
  xUsername: { type: String, required: true, unique: true },
  followersCount: { type: Number, required: true, default: 0 },
  goblinPoints: { type: Number, required: true, default: 0 },
  profileImage: { type: String, default: null },
  metamaskWalletAddress: { type: String, default: null },
  lastUpdated: { type: Date, default: Date.now },
});

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
