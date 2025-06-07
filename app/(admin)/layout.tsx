// app/admin/layout.tsx
import React from "react";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/config/authConfig";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

// This file acts as the “wrapper” for all /admin/* routes
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // --- (1) AUTH GUARD ---
  // You can either check admin access here, or continue to check it on each subpage.
  // If you want every nested admin route to auto-redirect if not an admin, do it here:
  const session = await getServerSession(authOptions);
  if (!session?.user || !session.user.isAdmin) {
    return redirect("/forbidden");
  }

  return (
    <div className="flex h-screen overflow-hidden ">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
