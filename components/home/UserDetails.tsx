"use client";

import React, { FC } from "react";
import { useSession, signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Award } from "lucide-react";
import { PiXLogoLight } from "react-icons/pi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import WalletConnect from "../WalletConnect";
import { UserResponse } from "@/types";

interface LoginAreaProps {
  userRank: UserResponse;
}

const UserDetails: FC<LoginAreaProps> = ({ userRank }) => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p className="text-center text-lime-300">Loading...</p>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-6"
    >
      {status === "authenticated" ? (
        <>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              Welcome back,{" "}
              <span className="bg-gradient-to-r from-lime-300 to-lime-500 text-transparent bg-clip-text">
                {session?.user?.name || session?.user?.xUsername}!
              </span>
            </h1>
            <div className="flex items-center gap-2 text-lime-400">
              <Award className="h-5 w-5" />
              <span>
                Your current rank:{" "}
                <span className="font-bold">#{userRank?.rank || "-"}</span>
              </span>

              <div className="flex items-center gap-2">
                <span>Your referral link:</span>
                <div className="relative group">
                  <div
                    className="flex items-center gap-1 cursor-pointer bg-lime-500/10 px-2 py-0.5 rounded border border-lime-500/30 hover:bg-lime-500/20 transition-colors"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${process.env.NEXT_PUBLIC_API_URL}?referral_code=${userRank.user.referralCode}`
                      );
                      const tooltip = document.getElementById("copy-tooltip");
                      if (tooltip) {
                        tooltip.innerText = "Copied!";
                        setTimeout(() => {
                          tooltip.innerText = "Copy code";
                        }, 2000);
                      }
                    }}
                  >
                    <span className="font-bold text-lime-300">
                      {userRank.user.referralCode}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-lime-400"
                    >
                      <rect
                        x="9"
                        y="9"
                        width="13"
                        height="13"
                        rx="2"
                        ry="2"
                      ></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    <span
                      id="copy-tooltip"
                      className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/90 text-lime-300 text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap"
                    >
                      Copy code
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-x-4">
              <div className="flex items-center gap-2 mt-1 text-lime-400">
                <Badge
                  variant="outline"
                  className="border-lime-500/50 bg-lime-500/10 text-lime-300"
                >
                  {userRank?.user?.goblinPoints || 0} Total Goblin Points
                </Badge>
              </div>
              <div className="flex items-center gap-2 mt-1 text-lime-400">
                <Badge
                  variant="outline"
                  className="border-lime-500/50 bg-lime-500/10 text-lime-300"
                >
                  {userRank?.user?.referralPoints || 0} Referral Points
                </Badge>
              </div>
            </div>
          </div>

          <WalletConnect />
          {/* <div className="bg-lime-500/10 border border-lime-500/20 rounded-lg p-4 flex items-center gap-4">
            <Twitter className="h-6 w-6 text-lime-400" />
            <p className="text-sm">
              Keep tweeting with{" "}
              <span className="font-bold text-lime-300">#goblin</span> to climb
              the leaderboard!
            </p>
          </div> */}
        </>
      ) : (
        <div className="text-center space-y-6">
          <h2 className="text-2xl font-bold">Curious about your rank?</h2>
          <p className="text-lg">
            Join the <span className="font-bold">hundreds</span> of people
            already connected
          </p>
          <Button
            className="bg-lime-600 hover:bg-lime-400 px-6 py-3 rounded-md flex items-center mx-auto"
            onClick={() => signIn("twitter", { prompt: "login" })}
          >
            Connect your <PiXLogoLight className="ml-2" /> account
          </Button>
          <p className="text-gray-400">Don't be late, join Goblin!</p>
        </div>
      )}
    </motion.div>
  );
};

export default UserDetails;
