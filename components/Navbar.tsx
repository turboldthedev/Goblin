"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

const NavBar = () => {
  const { data: session, status } = useSession();
  const isAdmin = session?.user.isAdmin;
  return (
    <nav className="px-8 py-5">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src="/img/logo.png"
            width={50}
            height={50}
            alt="$Goblin"
            className="rounded-full"
          />
          <h1 className="text-xl font-bold">Goblin</h1>
        </div>

        <div className="flex gap-6 text-gray-300 text-xs">
          {isAdmin && (
            <Link href="/admin" className="hover:text-white">
              Admin
            </Link>
          )}
          <Link href="#" className="hover:text-white">
            Grindboard
          </Link>
          <Link href="#" className="hover:text-white">
            Boi Club
          </Link>
          <Link href="#" className="hover:text-white">
            Gallery
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
