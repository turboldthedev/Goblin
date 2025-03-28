"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShieldAlert, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-900/20 via-black to-black"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-lime-500 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-lime-500 to-transparent"></div>
      </div>

      <div className="grid min-h-screen grid-cols-1 grid-rows-[1fr_auto_1fr] lg:grid-cols-[max(50%,36rem)_1fr] relative z-10">
        <header className="mx-auto w-full max-w-7xl px-6 pt-6 sm:pt-10 lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative">
              <Image
                src="/img/logo.png"
                width={80}
                height={80}
                alt="Goblin"
                className="rounded-full relative z-10 "
              />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-lime-300 to-lime-500 text-transparent bg-clip-text mt-2">
              Goblin
            </h1>
          </Link>
        </header>

        <main className="mx-auto w-full max-w-7xl px-6 py-24 sm:py-32 lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-lg"
          >
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-6 w-6 text-lime-500" />
              <p className="text-base font-semibold text-lime-500">403</p>
            </div>

            <h1 className="mt-4 text-pretty text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Whoa there, adventurer{" "}
              <motion.span
                animate={{ rotate: [0, 10, 0, -10, 0] }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 2,
                  ease: "easeInOut",
                }}
                className="inline-block"
              >
                🧙‍♂️
              </motion.span>
            </h1>

            <p className="mt-6 text-pretty text-sm font-medium text-lime-300/70 sm:text-lg">
              You've stumbled into a secret goblin lair... but you don't have
              the magic key{" "}
              <motion.span
                animate={{
                  y: [0, -5, 0],
                  rotate: [0, 5, 0, -5, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 2,
                  ease: "easeInOut",
                }}
                className="inline-block"
              >
                🪄
              </motion.span>
              . Only admins may enter beyond this point. Nice try though{" "}
              <motion.span
                animate={{ rotate: [0, 10, 0] }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 1.5,
                  ease: "easeInOut",
                }}
                className="inline-block"
              >
                😉
              </motion.span>
            </p>

            <div className="mt-10 space-y-4">
              <Button
                asChild
                variant="outline"
                className="border-lime-500/50 text-lime-400 hover:bg-lime-500/10"
              >
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to the safety of home
                </Link>
              </Button>
            </div>
          </motion.div>
        </main>

        <div className="hidden lg:relative lg:col-start-2 lg:row-start-1 lg:row-end-4 lg:block">
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-0"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-20"></div>
            <Image
              width={1300}
              height={1200}
              alt="401 cover"
              src="/img/401-cover.png"
              className="absolute inset-0 size-full object-cover"
            />

            {/* Floating elements */}
            <motion.div
              animate={{
                y: [0, -15, 0],
                x: [0, 10, 0],
              }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 5,
                ease: "easeInOut",
              }}
              className="absolute top-1/4 left-1/4 z-30"
            >
              <div className="w-16 h-16 bg-lime-500/20 backdrop-blur-md rounded-full flex items-center justify-center">
                <Lock className="h-8 w-8 text-lime-400" />
              </div>
            </motion.div>

            <motion.div
              animate={{
                y: [0, 20, 0],
                x: [0, -15, 0],
              }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 7,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute bottom-1/3 right-1/3 z-30"
            >
              <div className="w-20 h-20 bg-lime-500/10 backdrop-blur-md rounded-full flex items-center justify-center border border-lime-500/30">
                <ShieldAlert className="h-10 w-10 text-lime-400" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
