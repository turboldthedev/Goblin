import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { connectToDatabase } from "@/lib/config/mongodb";
import { UserBox } from "@/lib/models/user-box.model";
import { requireAuth } from "../[id]/start/utils";

export async function GET(req: NextRequest) {
  const user = await requireAuth();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();

  const userBox = await UserBox.findOne({
    userId: new Types.ObjectId(user.id as string),
    opened: false,
  }).lean();

  if (!userBox) {
    return NextResponse.json({ hasBox: false }, { status: 200 });
  }

  // Determine if ready (server time vs readyAt)
  const now = new Date();
  const isReady = now >= userBox.readyAt;

  return NextResponse.json(
    {
      hasBox: true,
      box: {
        id: userBox._id,
        startTime: userBox.startTime,
        readyAt: userBox.readyAt,
        prizeType: userBox.prizeType,
        prizeAmount: userBox.prizeAmount,
        missionCompleted: userBox.missionCompleted,
        isReady,
        opened: userBox.opened,
      },
    },
    { status: 200 }
  );
}
