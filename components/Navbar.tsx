"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "./ui/button";
import { LogOut, Wallet, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

export const Navbar = () => {
  const { data: session, status } = useSession();
  const isAdmin = session?.user.isAdmin;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

  const navLinks = [
    ...(isAdmin ? [{ href: "/admin", label: "Admin" }] : []),

    { href: "/gallery", label: "Gallery" },
  ];

  return (
    <header className="relative z-10 border-b border-lime-500/20 backdrop-blur-sm top-0">
      <div className="container mx-auto px-8 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/img/logo.png"
            alt="Goblin Logo"
            width={40}
            height={40}
            className="w-10 h-10 object-contain filter brightness-125"
          />
          <span className="text-2xl font-bold bg-gradient-to-r from-lime-300 to-lime-500 text-transparent bg-clip-text">
            Goblin
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-lime-300 hover:text-lime-400 transition"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {status == "authenticated" && (
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="border-lime-500/50 text-lime-400 hover:bg-lime-500/10 hidden md:flex"
              onClick={() => signOut()}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          </div>
        )}

        <Button
          variant="outline"
          size="icon"
          className="border-lime-500/50 text-lime-400 hover:bg-lime-500/10 md:hidden"
          onClick={toggleMobileMenu}
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          )}
          <span className="sr-only">Toggle menu</span>
        </Button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden px-4 py-3 bg-black border-t border-lime-500/10 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-lime-300 hover:text-lime-400"
            >
              {link.label}
            </Link>
          ))}
          <Button
            variant="outline"
            className="w-full border-lime-500/50 text-lime-400 hover:bg-lime-500/10"
            onClick={() => signOut()}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign out
          </Button>
        </div>
      )}
    </header>
  );
};
