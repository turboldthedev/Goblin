import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/config/authConfig";
import { BoxTemplate } from "@/lib/models/box.model";
import { UserBox } from "@/lib/models/user-box.model";
import { connectToDatabase } from "@/lib/config/mongodb";
import User from "@/lib/models/user.model";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // 1) Connect to MongoDB
  await connectToDatabase();

  // 2) Find the BoxTemplate by ID
  const box = await BoxTemplate.findById(id).lean();
  if (!box) {
    return NextResponse.json(
      { error: "Box template not found" },
      { status: 404 }
    );
  }

  // 3) Attempt to get the logged-in user (if any)
  const session = await getServerSession(authOptions);
  let hasBox = false;
  let isReady = false;
  let opened = false;
  let missionCompleted = false;
  let startTime: string | null = null;
  let readyAt: string | null = null;

  if (session?.user?.xUsername) {
    // Get user by xUsername
    const user = (await User.findOne({
      xUsername: session.user.xUsername,
    }).lean()) as { _id: string };

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // See if this user already has a UserBox record for this template
    const userBox = await UserBox.findOne({
      userId: user._id,
      templateId: box._id,
      opened: false,
    }).lean();

    if (userBox) {
      hasBox = true;
      startTime = userBox.startTime.toISOString();
      readyAt = userBox.readyAt.toISOString();
      const now = new Date();
      isReady = now >= userBox.readyAt;
      opened = userBox.opened;
      missionCompleted = userBox.missionCompleted;
    }
  }

  // 4) Build the response, including hasBox + timestamps when applicable
  const boxDetails = {
    _id: box._id.toString(),
    name: box.name,
    imageUrl: box.imageUrl,
    normalPrize: box.normalPrize,
    missionUrl: box.missionUrl,
    missionDesc: box.missionDesc,
    missionCompleted,
    hasBox, // <— true if user has already started mining this box
    isReady, // <— only valid if hasBox === true
    opened, // <— only valid if hasBox is false
    startTime, // <— ISO string, or null if hasBox is false
    readyAt, // <— ISO string, or null if hasBox is false
  };

  return NextResponse.json(boxDetails, { status: 200 });
}
