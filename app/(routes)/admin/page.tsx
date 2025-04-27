import AdminDashboard from "@/components/AdminDashboard";
import { authOptions } from "@/lib/authConfig";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session?.user || !session.user.isAdmin) {
    return redirect("/forbidden");
  }

  return <AdminDashboard />;
}
