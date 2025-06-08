import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBoxTemplate extends Document {
  name: string;
  normalPrize: number;
  goldenPrize: number;
  goldenChance: number;
  active: boolean;
  imageUrl?: string;
  missionUrl: string;
  missionDesc: string;
  boxType: "normal" | "partner";
  promoCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BoxTemplateSchema: Schema<IBoxTemplate> = new Schema(
  {
    name: { type: String, required: true },
    normalPrize: { type: Number, required: true, default: 0 },
    goldenPrize: { type: Number, required: true, default: 0 },
    goldenChance: { type: Number, required: true, default: 0.01 },
    active: { type: Boolean, required: true, default: true },
    imageUrl: { type: String, required: true },
    missionUrl: { type: String, required: true },
    missionDesc: { type: String, required: true },
    boxType: {
      type: String,
      enum: ["normal", "partner"],
      required: true,
      default: "normal",
    },

    promoCode: { type: String },
  },
  { timestamps: true }
);

export const BoxTemplate: Model<IBoxTemplate> =
  mongoose.models.Box || // ✅ guard against existing "Box"
  mongoose.model<IBoxTemplate>("Box", BoxTemplateSchema);
