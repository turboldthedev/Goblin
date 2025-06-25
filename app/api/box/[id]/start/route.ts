import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { connectToDatabase } from "@/lib/config/mongodb";
import { UserBox } from "@/lib/models/user-box.model";
import { BoxTemplate, IBoxTemplate } from "@/lib/models/box.model";
import { requireAuth } from "./utils";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // 1) Auth check
  const { id } = await params;

  const user = await requireAuth();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();

  // 2) Check if user already has an active (not opened) box
  const existing = await UserBox.findOne({
    userId: new Types.ObjectId(user.id as string),
    opened: false,
  });
  if (existing) {
    return NextResponse.json(
      { error: "You already have an active box mining." },
      { status: 400 }
    );
  }

  // 3) Find the active BoxTemplate
  const template: IBoxTemplate | null = await BoxTemplate.findOne({
    _id: id,
    active: true,
  });
  if (!template) {
    return NextResponse.json({ error: "No box available." }, { status: 400 });
  }

  // 4) Determine prize type by random
  const rnd = Math.random(); // between 0 and 1
  let prizeType: "NORMAL" | "GOLDEN" = "NORMAL";
  let prizeAmount = template.normalPrize;
  if (rnd < template.goldenChance) {
    prizeType = "GOLDEN";
    prizeAmount = template.goldenPrize;
  }

  const now = new Date();
  const readyAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  // const readyAt = new Date(now.getTime() + 1000);

  // 6) Create a UserBox entry
  const userBox = new UserBox({
    userId: new Types.ObjectId(user.id as string),
    templateId: template._id,
    startTime: now,
    readyAt,
    prizeType,
    prizeAmount,
    missionCompleted: false,
    opened: false,
  });
  await userBox.save();

  return NextResponse.json(
    {
      message: "Box mining started",
      box: {
        id: userBox._id,
        startTime: userBox.startTime,
        readyAt: userBox.readyAt,
        prizeType: userBox.prizeType,
        prizeAmount: userBox.prizeAmount,
      },
    },
    { status: 200 }
  );
}
