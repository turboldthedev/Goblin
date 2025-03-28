import AdminTable from "@/components/AdminTable";
import authOptions from "@/lib/authConfig";
import { getServerSession } from "next-auth";

import { redirect } from "next/navigation";
import React from "react";

export default async function Page() {
  const session = await getServerSession(authOptions);

  // If user is not logged in or not an admin, redirect
  if (!session?.user || !session.user.isAdmin) {
    return redirect("/unauthorized"); // Or any page you want
  }

  return <AdminTable />;
}
