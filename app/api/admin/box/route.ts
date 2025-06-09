import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/config/mongodb";
import { BoxTemplate } from "@/lib/models/box.model";
import { requireAuth } from "../../box/[id]/start/utils";

export async function GET(req: NextRequest) {
  const user = await requireAuth();
  if (!user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();

  const templates = await BoxTemplate.find().lean();
  return NextResponse.json({ templates }, { status: 200 });
}

export async function POST(req: NextRequest) {
  const user = await requireAuth();
  if (!user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    name,
    normalPrize,
    goldenPrize,
    goldenChance,
    active,
    imageUrl,
    missionUrl,
    missionDesc,
    boxType,
    promoCode,
  } = body;

  await connectToDatabase();

  try {
    const newBox = await BoxTemplate.create({
      name,
      normalPrize,
      goldenPrize,
      goldenChance,
      active,
      imageUrl,
      missionUrl,
      missionDesc,
      boxType,
      ...(boxType === "partner" ? { promoCode } : {}),
    });
    return NextResponse.json({ template: newBox });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
