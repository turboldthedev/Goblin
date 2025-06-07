import { connectToDatabase } from "@/lib/config/mongodb";
import { requireAuth } from "../start/utils";
import { UserBox } from "@/lib/models/user-box.model";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await requireAuth();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();

  // Find the user's active box
  const userBox = await UserBox.findOne({
    userId: new Types.ObjectId(user.id as string),
    templateId: id,
    opened: false,
  });
  if (!userBox) {
    return NextResponse.json(
      { error: "No active box to complete mission for." },
      { status: 400 }
    );
  }

  const now = new Date();
  // Only allow mission completion if the box is ready (24h passed)
  if (now < userBox.readyAt) {
    return NextResponse.json(
      { error: "Box is not ready yet." },
      { status: 400 }
    );
  }

  // Mark missionCompleted = true
  userBox.missionCompleted = true;
  await userBox.save();

  return NextResponse.json(
    { message: "Mission marked as completed." },
    { status: 200 }
  );
}
