import { NextRequest, NextResponse } from "next/server";
import User, { IUser } from "@/lib/models/user.model";
import { connectToDatabase } from "@/lib/config/mongodb";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    // 1) Connect once
    await connectToDatabase();

    // 2) Extract & validate
    const { username } = await params;
    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    // 3) Fetch only that user
    const user = (await User.findOne({ xUsername: username })
      .select("xUsername goblinPoints profileImage referralCode") // only pull what you need
      .lean()
      .exec()) as Pick<
      IUser,
      "xUsername" | "goblinPoints" | "profileImage" | "referralCode"
    > | null;

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 4) Count how many have strictly more points
    const higherCount = await User.countDocuments({
      goblinPoints: { $gt: user.goblinPoints },
    });

    // 5) Respond with rank + minimal user info
    return NextResponse.json({
      user: {
        xUsername: user.xUsername,
        goblinPoints: user.goblinPoints,
        profileImage: user.profileImage,
        referralCode: user.referralCode,
      },
      rank: higherCount + 1,
    });
  } catch (err: any) {
    console.error("Error fetching user rank data:", err);
    return NextResponse.json(
      { error: "Failed to fetch user rank data" },
      { status: 500 }
    );
  }
}
