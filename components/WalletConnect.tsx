"use client";

import React, { FC } from "react";
import { Award, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface LoginAreaProps {}

const WalletConnect: FC<LoginAreaProps> = () => {
  return (
    <Card className="bg-black/40 border border-lime-500/20 backdrop-blur-md overflow-hidden">
      <CardContent className="p-6">
        {/* Campaign banner */}
        <div className="mb-4 rounded-lg bg-lime-500/20 p-3 text-center text-sm font-semibold text-lime-100">
          The campaign has started
        </div>

        {/* Header + subheader */}
        <div className="space-y-4">
          <div className="text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-lime-500/30 bg-lime-500/10 mb-2">
              <Award className="h-6 w-6 text-lime-400" />
            </div>
            <h3 className="text-lg font-medium text-lime-300">
              How to earn points
            </h3>
          </div>

          {/* Steps */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-lime-500/20 text-lime-400">
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
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <p className="text-sm text-lime-300/80">
                  Follow the GoblinBNB account
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-lime-500/20 text-lime-400">
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
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <p className="text-sm text-lime-300/80">
                  Mine boxes to earn epic rewards
                </p>
              </div>
            </div>

            <Button
              className="w-full bg-lime-500 hover:bg-lime-600 text-black font-medium"
              onClick={() =>
                window.open("https://x.com/GoblinMemeBNB", "_blank")
              }
            >
              <Twitter className="h-4 w-4 mr-2" />
              Visit GoblinBNB on X
            </Button>
          </div>

          {/* Goblin motto footer */}
          <p className="mt-6 text-center text-xs italic text-lime-300/70">
            Be greedy, be like a goblin.
          </p>
          <p className="mt-6 text-center text-xs italic text-lime-300/70">
            Point = Airdrop
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletConnect;
