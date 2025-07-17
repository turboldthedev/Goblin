import { getServerSession } from "next-auth";

import { connectToDatabase } from "@/lib/config/mongodb";
import User from "@/lib/models/user.model";
import { authOptions } from "@/lib/config/authConfig";

export async function requireAuth() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.xUsername) {
    return null;
  }
  await connectToDatabase();
  const user = await User.findOne({ xUsername: session.user.xUsername });
  if (!user) {
    return null;
  }

  return { ...session.user, id: user._id };
}
