import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Gallery from "@/lib/models/gallery.model";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/authConfig";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();

  const { title, imageUrl } = await req.json();
  if (!title || !imageUrl) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const newEntry = await Gallery.create({
    title,
    imageUrl,
  });

  return NextResponse.json(newEntry, { status: 201 });
}

export async function GET() {
  await connectToDatabase();

  const gallery = await Gallery.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(gallery);
}
