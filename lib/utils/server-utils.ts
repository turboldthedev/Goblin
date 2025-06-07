import User from "@/lib/models/user.model";
import { connectToDatabase } from "@/lib/config/mongodb";

export async function getUserByUsername(xUsername: string) {
  await connectToDatabase();
  return await User.findOne({ xUsername }).lean();
}

export async function getAllUsers() {
  await connectToDatabase();
  return await User.find().sort({ goblinPoints: -1 }).lean();
}
