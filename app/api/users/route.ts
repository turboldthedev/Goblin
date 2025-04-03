import { NextRequest, NextResponse } from "next/server";
import User from "@/lib/models/user.model";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const users = await User.find().sort({ goblinPoints: -1 }).lean();

    if (!users || users.length === 0) {
      return NextResponse.json({ error: "No users found" }, { status: 404 });
    }

    const rankedUsers = users.map((user, index) => ({
      ...user,
      rank: index + 1,
    }));

    return NextResponse.json({ rankedUsers }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching users:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
}
