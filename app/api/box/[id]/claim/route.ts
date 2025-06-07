// app/api/box/[id]/claim/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { connectToDatabase } from "@/lib/config/mongodb";
import { requireAuth } from "../start/utils";
import { UserBox } from "@/lib/models/user-box.model";
import User from "@/lib/models/user.model";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1) Authenticate
    const user = await requireAuth();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2) Get template ID
    const { id } = await params;

    // 3) Connect to DB
    await connectToDatabase();

    // 4) Fetch active UserBox for this user/template
    const userBox = await UserBox.findOne({
      userId: new Types.ObjectId(user.id as string),
      templateId: new Types.ObjectId(id),
      opened: false,
    });
    if (!userBox) {
      return NextResponse.json(
        { error: "No active box to open." },
        { status: 400 }
      );
    }

    // 5) Check readyAt (24h passed)
    const now = new Date();
    if (now < userBox.readyAt) {
      return NextResponse.json(
        { error: "Box is not ready yet." },
        { status: 400 }
      );
    }

    // 6) Check mission completed
    if (!userBox.missionCompleted) {
      return NextResponse.json(
        { error: "Mission not completed yet." },
        { status: 400 }
      );
    }

    userBox.opened = true;
    userBox.openedAt = now;

    let basePrize = userBox.prizeAmount;
    let finalPrize = basePrize;

    if (userBox.promoValid) {
      const bonus = Math.floor(basePrize * 2);
      finalPrize = basePrize + bonus;
    }

    // 9) Credit the user's points
    const updatedUser = await User.findOneAndUpdate(
      { _id: new Types.ObjectId(user.id as string) },
      { $inc: { goblinPoints: finalPrize } },
      { new: true }
    );

    if (!updatedUser) {
      throw new Error("Failed to update user points");
    }

    // 10) Save the updated UserBox
    userBox.prizeAmount = finalPrize;
    await userBox.save();

    return NextResponse.json(
      {
        message: "Box opened! Prize credited.",
        prizeAmount: finalPrize,
        newBalance: updatedUser.goblinPoints,
        promoApplied: userBox.promoValid,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error claiming box:", error);
    return NextResponse.json({ error: "Failed to claim box" }, { status: 500 });
  }
}
