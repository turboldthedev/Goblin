import mongoose, { Schema, model, models } from "mongoose";

export interface IGallery {
  _id?: string;
  title: string;
  imageUrl: string;
  createdBy: string; // Could be user id or username
  createdAt?: Date;
}

const GallerySchema = new Schema<IGallery>(
  {
    title: { type: String, required: true },
    imageUrl: { type: String, required: true },
  },
  { timestamps: true }
);

const Gallery = models.Gallery || model<IGallery>("Gallery", GallerySchema);
export default Gallery;
