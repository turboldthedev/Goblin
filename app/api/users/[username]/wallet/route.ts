import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/config/mongodb";
import User from "@/lib/models/user.model";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  await connectToDatabase();

  try {
    const { walletAddress } = await req.json();
    const { username } = await params;
    if (!username || !walletAddress) {
      return NextResponse.json(
        { error: "Missing xUsername or walletAddress" },
        { status: 400 }
      );
    }

    const result = await User.updateOne(
      { xUsername: username },
      { $set: { metamaskWalletAddress: walletAddress } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Wallet saved successfully" });
  } catch (error) {
    console.error("Error saving wallet:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
