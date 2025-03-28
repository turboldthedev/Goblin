import { NextRequest, NextResponse } from "next/server";

import User from "@/lib/models/user.model";
import { connectToDatabase } from "@/lib/mongodb";
import axios from "axios";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const users = await User.find();
    if (!users) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/ranks`,
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
    const rankedUsers = res.data.rankedUsers;

    return NextResponse.json({
      rankedUsers,
    });
  } catch (error: any) {
    console.error("Error fetching user data:", error.message || error);
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
}
