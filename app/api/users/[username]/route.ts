import { NextRequest, NextResponse } from "next/server";
import User, { IUser } from "@/lib/models/user.model";
import { connectToDatabase } from "@/lib/mongodb";
import axios from "axios";

export async function GET(
  req: NextRequest,
  { params }: { params: { username: string } }
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

    const userId = String(user._id);

    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/ranks/${userId}`,
      {
        validateStatus: (status) => status < 500,
      }
    );

    if (res.status === 404) {
      return NextResponse.json(
        { error: "Rank data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: user,
      rank: res.data.rank,
    });
  } catch (error: any) {
    console.error("Error fetching user data:", error.message || error);
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
}
