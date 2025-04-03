import { NextRequest, NextResponse } from "next/server";
import User, { IUser } from "@/lib/models/user.model";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    await connectToDatabase();

    const { username } = await params;

    if (!username) {
      return NextResponse.json(
        { message: "Username is required" },
        { status: 400 }
      );
    }

    const user = (await User.findOne({ xUsername: username })
      .lean()
      .exec()) as IUser | null;

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const users = await User.find().sort({ goblinPoints: -1 }).lean().exec();
    const userIndex = users.findIndex(
      (u) => String(u._id) === String(user._id)
    );

    if (userIndex === -1) {
      return NextResponse.json(
        { error: "User found but not ranked" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user,
      rank: userIndex + 1,
      goblinPoints: user.goblinPoints,
    });
  } catch (error: any) {
    console.error("Error fetching user rank data:", error.message || error);
    return NextResponse.json(
      { error: "Failed to fetch user rank data" },
      { status: 500 }
    );
  }
}
