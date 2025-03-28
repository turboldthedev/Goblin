import { NextRequest, NextResponse } from "next/server";
import User from "@/lib/models/user.model";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const users = await User.find().sort({ goblinPoints: -1 }).lean().exec();

    if (!users || users.length === 0) {
      return NextResponse.json({ error: "No users found" }, { status: 404 });
    }

    // Assign rank based on position in sorted list
    const rankedUsers = users.map((user, index) => ({
      ...user,
      rank: index + 1,
    }));

    return NextResponse.json({ rankedUsers });
  } catch (error: any) {
    console.error("Error fetching ranked users:", error.message || error);
    return NextResponse.json(
      { error: "Failed to fetch ranked users" },
      { status: 500 }
    );
  }
}
