import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/lib/models/user.model";

interface UserUpdatePayload {
  _id: string;
  goblinPoints: number;
}

export async function POST(req: NextRequest) {
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
