import { NextRequest, NextResponse } from "next/server";
import User from "@/lib/models/user.model";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose from "mongoose";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectToDatabase();

  const { id } = await params;

  if (!id) {
    return NextResponse.json({ message: "ID is required" }, { status: 400 });
  }

  try {
    const users = await User.find().sort({ goblinPoints: -1 }).lean().exec();

    const userIndex = users.findIndex((u) => String(u._id) === id);
    if (userIndex === -1) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const user = users[userIndex];

    return NextResponse.json(
      { rank: userIndex + 1, goblinPoints: user.goblinPoints },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching user rank", error },
      { status: 500 }
    );
  }
}
