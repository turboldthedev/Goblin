// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import User from "@/lib/models/user.model";
import { connectToDatabase } from "@/lib/config/mongodb";

export async function GET(req: NextRequest) {
  await connectToDatabase();

  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const limit = parseInt(url.searchParams.get("limit") || "20", 10);
  const search = url.searchParams.get("search")?.trim() || "";

  // build a filter: if there’s a search term, do a case-insensitive regex match:
  const filter = search ? { xUsername: { $regex: search, $options: "i" } } : {};

  // count total matching docs
  const total = await User.countDocuments(filter);

  // fetch one page
  const users = await User.find(filter)
    .sort({ goblinPoints: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  // assign ranks relative to the *filtered* & sorted* set:
  const rankedUsers = users.map((u, i) => ({
    ...u,
    rank: (page - 1) * limit + i + 1,
  }));

  const totalPages = Math.ceil(total / limit) || 1;

  return NextResponse.json({ rankedUsers, page, total, totalPages });
}
