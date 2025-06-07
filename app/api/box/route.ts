import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/config/mongodb";
import { requireAuth } from "./[id]/start/utils";
import { BoxTemplate } from "@/lib/models/box.model";

export async function GET(req: NextRequest) {
  // const user = await requireAuth();

  // if (!user) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }

  await connectToDatabase();

  const boxes = await BoxTemplate.find({
    active: true,
  }).lean();

  if (!boxes) {
    return NextResponse.json({ hasBox: false }, { status: 200 });
  }

  return NextResponse.json(
    {
      boxes,
    },
    { status: 200 }
  );
}
