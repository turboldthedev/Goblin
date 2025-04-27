import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/lib/models/user.model";
import { authOptions } from "@/lib/authConfig";
import { getServerSession } from "next-auth";

interface UserUpdatePayload {
  _id: string;
  goblinPoints: number;
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  await connectToDatabase();

  try {
    const body = await req.json();
    const updates: UserUpdatePayload[] = body.users;

    const bulkOps = updates.map((user) => ({
      updateOne: {
        filter: { _id: user._id },
        update: { $set: { goblinPoints: user.goblinPoints } },
      },
    }));

    await User.bulkWrite(bulkOps);

    return NextResponse.json({ message: "Goblin points updated successfully" });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update users", error },
      { status: 500 }
    );
  }
}
