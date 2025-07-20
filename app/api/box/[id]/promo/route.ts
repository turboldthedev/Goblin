import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { connectToDatabase } from "@/lib/config/mongodb";
import { BoxTemplate } from "@/lib/models/box.model";
import { UserBox } from "@/lib/models/user-box.model";
import { requireAuth } from "../start/utils";

interface PromoRequestBody {
  code: string;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // 1) Authenticate
  const user = await requireAuth();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2) Parse request
  const { id } = await params; // this is the BoxTemplate ID
  const { code }: PromoRequestBody = await req.json();
  if (!code || code.trim().length === 0) {
    return NextResponse.json(
      { error: "Promo code is required" },
      { status: 400 }
    );
  }

  // 3) Connect to MongoDB
  await connectToDatabase();

  // 4) Fetch the BoxTemplate to see if it has a promoCode
  const template = await BoxTemplate.findById(id).lean();
  if (!template) {
    return NextResponse.json(
      { error: "Box template not found" },
      { status: 404 }
    );
  }

  if (!template.promoCode) {
    return NextResponse.json(
      { error: "This box does not accept promo codes." },
      { status: 400 }
    );
  }

  // 5) Fetch the UserBox record for this user AND this template, unopened
  const userBox = await UserBox.findOne({
    userId: new Types.ObjectId(user.id as string),
    templateId: new Types.ObjectId(id),
    opened: false,
  });

  if (!userBox) {
    return NextResponse.json(
      { error: "No active box to apply promo for." },
      { status: 400 }
    );
  }

  // 6) Check that the box is ready (24h have passed)
  const now = new Date();
  if (now < userBox.readyAt) {
    return NextResponse.json(
      { error: "Box is not ready yet." },
      { status: 400 }
    );
  }

  // 7) Validate the provided code
  if (code.toUpperCase() !== template.promoCode.toUpperCase()) {
    return NextResponse.json({ error: "Invalid promo code." }, { status: 400 });
  }

  // 8) Mark promoValid = true on the UserBox
  userBox.promoValid = true;
  userBox.promoCodeUsed = template.promoCode.toUpperCase();
  await userBox.save();

  return NextResponse.json(
    { message: "Promo code applied successfully!" },
    { status: 200 }
  );
}
