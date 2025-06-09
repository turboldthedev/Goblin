// lib/models/user-box.model.ts
import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IUserBox extends Document {
  userId: Types.ObjectId;
  templateId: Types.ObjectId;
  opened: boolean;
  missionCompleted: boolean;
  readyAt: Date;
  openedAt?: Date;
  prizeAmount: number;
  startTime: Date;
  prizeType: "NORMAL" | "GOLDEN";
  promoValid: boolean;
  promoCodeUsed?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserBoxSchema: Schema<IUserBox> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    templateId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Box",
    },
    opened: { type: Boolean, required: true, default: false },
    missionCompleted: { type: Boolean, required: true, default: false },
    startTime: { type: Date, required: true },
    readyAt: { type: Date, required: true },
    prizeType: { type: String, enum: ["NORMAL", "GOLDEN"], required: true },
    openedAt: { type: Date },
    prizeAmount: { type: Number, required: true, default: 0 },

    promoValid: { type: Boolean, required: true, default: false },
    promoCodeUsed: { type: String },
  },
  { timestamps: true }
);

export const UserBox: Model<IUserBox> =
  mongoose.models.UserBox || mongoose.model<IUserBox>("UserBox", UserBoxSchema);
