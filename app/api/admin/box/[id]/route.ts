import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { connectToDatabase } from "@/lib/config/mongodb";
import { BoxTemplate } from "@/lib/models/box.model";
import { requireAuth } from "../../../box/[id]/start/utils";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAuth();
  if (!user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();

  const { id } = await params;
  if (!id) {
    return NextResponse.json(
      { error: "Template ID required." },
      { status: 400 }
    );
  }

  try {
    const update = await req.json();
    const updated = await BoxTemplate.findByIdAndUpdate(
      new Types.ObjectId(id),
      update,
      { new: true }
    );
    if (!updated) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
    return NextResponse.json({ template: updated }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || "Error updating." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAuth();
  if (!user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();

  const { id } = await params;
  if (!id) {
    return NextResponse.json(
      { error: "Template ID required." },
      { status: 400 }
    );
  }

  try {
    const deleted = await BoxTemplate.findByIdAndDelete(new Types.ObjectId(id));
    if (!deleted) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
    return NextResponse.json({ message: "Deleted." }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || "Error deleting." },
      { status: 500 }
    );
  }
}
