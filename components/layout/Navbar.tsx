"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";
import { LogOut, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

export const Navbar = () => {
  const { data: session, status } = useSession();
  const isAdmin = session?.user.isAdmin;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

  const navLinks = [
    ...(isAdmin ? [{ href: "/admin", label: "Admin" }] : []),
    { href: "/gallery", label: "Gallery" },
    { href: "/box", label: "Box" },
  ];

  // Framer Motion Variants
  const headerVariants = {
    hidden: { y: -50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 110, damping: 20 },
    },
  };

  const logoVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { delay: 0.2, duration: 0.4 } },
  };

  const signOutVariants = {
    hidden: { opacity: 0, x: 10 },
    visible: { opacity: 1, x: 0, transition: { delay: 0.3, duration: 0.4 } },
  };

  const mobileMenuVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: {
      height: "auto",
      opacity: 1,
      transition: { duration: 0.25, ease: "easeOut" },
    },
    exit: {
      height: 0,
      opacity: 0,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  return (
    <motion.header
      className="absolute inset-x-0 top-0 z-50 bg-black/90 backdrop-blur-sm border-b "
      initial="hidden"
      animate="visible"
      variants={headerVariants}
    >
      {/* ──────────── Increased py Here ──────────── */}
      <div className="flex items-center py-4 px-6 justify-between ">
        {/* ─── LEFT: Logo ───────────────────────────────────────── */}
        <motion.div
          className="flex items-center"
          variants={logoVariants}
          initial="hidden"
          animate="visible"
        >
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/img/logo.png"
              alt="Goblin Logo"
              width={32}
              height={32}
              className="h-8 w-8 object-contain filter brightness-125"
            />
            <span className="text-xl font-bold bg-gradient-to-r from-lime-300 to-lime-500 text-transparent bg-clip-text">
              Goblin
            </span>
          </Link>
        </motion.div>

        {/* ─── CENTER: Navigation Links ──────────────────────────── */}

        <ul className="hidden space-x-8 md:flex md:mr-10">
          {navLinks.map((link) => (
            <motion.li
              key={link.href}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.4 + 0.05 * navLinks.indexOf(link),
                duration: 0.3,
              }}
            >
              <Link
                href={link.href}
                className="text-lime-300 hover:text-lime-400 transition-colors"
              >
                {link.label}
              </Link>
            </motion.li>
          ))}
        </ul>
        {status === "authenticated" && (
          <motion.div
            variants={signOutVariants}
            initial="hidden"
            animate="visible"
          >
            <Button
              variant="outline"
              className="hidden md:flex border-lime-500/50 text-lime-300 hover:bg-lime-500/10 hover:text-lime-200 items-center"
              onClick={() => signOut()}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          </motion.div>
        )}

        {/* ─── RIGHT: Sign Out / Mobile Toggle ──────────────────── */}
        <div className="flex items-center space-x-4 md:hidden">
          <motion.div
            variants={signOutVariants}
            initial="hidden"
            animate="visible"
          >
            <Button
              variant="outline"
              size="icon"
              className="border-lime-500/50 text-lime-300 hover:bg-lime-500/10 md:hidden"
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
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="18" x2="20" y2="18" />
                </svg>
              )}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* ─── Mobile Drawer (Animated) ────────────────────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden bg-black border-t border-lime-500/10 px-6 overflow-hidden"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={mobileMenuVariants}
          >
            <div className="py-4 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-lime-300 hover:text-lime-400 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              {status === "authenticated" && (
                <Button
                  variant="outline"
                  className="w-full border-lime-500/50 text-lime-300 hover:bg-lime-500/10 flex items-center justify-center"
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Bottom Neon Glow Line ─────────────────────────────────── */}
    </motion.header>
  );
};
