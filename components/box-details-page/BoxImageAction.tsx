"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PartialBoxDetails } from "@/types";

interface BoxImageActionProps {
  details: PartialBoxDetails;
  isLoading: boolean;
  timeLeft: string;
  visitedUrls: string[];
  onStartMining: () => Promise<void>;
  onMissionClick: (url: string) => Promise<void>;
  onOpenBox: () => Promise<void>;
}

export function BoxImageAction({
  details,
  isLoading,
  timeLeft,
  visitedUrls,
  onStartMining,
  onMissionClick,
  onOpenBox,
}: BoxImageActionProps) {
  const {
    name,
    imageUrl,
    hasBox,
    isReady,
    opened,
    missionDesc,
    missionUrl,
    missionCompleted,
  } = details;

  // build array of URLs
  const missionUrls = missionUrl
    ? missionUrl
        .split(",")
        .map((u) => u.trim())
        .filter(Boolean)
    : [];

  // have all been visited or is mission already completed?
  const allVisited =
    missionCompleted ||
    (missionUrls.length > 0 &&
      missionUrls.every((u) => visitedUrls.includes(u)));

  return (
    <Card className="bg-black/40 border border-lime-500/20 backdrop-blur-md overflow-hidden">
      <CardContent className="p-6">
        {/* image + title */}
        <div className="relative mb-6">
          <div className="absolute -inset-4 bg-lime-500/20 blur-xl rounded-full" />
          <motion.div
            animate={{ y: [0, -10, 0], rotateY: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="relative z-10"
          >
            <Image
              src={imageUrl!}
              alt={name}
              width={400}
              height={400}
              className="w-full h-auto drop-shadow-[0_0_30px_rgba(132,204,22,0.3)] rounded-lg"
            />
          </motion.div>
        </div>

        <h3 className="text-center text-2xl font-bold text-lime-300 mb-4">
          {name}
        </h3>

        {/* START / COUNTDOWN */}
        {!hasBox ? (
          <Button
            onClick={onStartMining}
            disabled={isLoading}
            className="w-full bg-lime-500 hover:bg-lime-600 text-black py-4 font-bold text-lg"
          >
            {isLoading ? "Starting…" : "START MINING"}
          </Button>
        ) : !isReady ? (
          <div className="space-y-2 text-center">
            <p className="text-lime-300">Mining in progress…</p>
            <p className="text-3xl font-mono text-lime-400">{timeLeft}</p>
          </div>
        ) : !opened ? (
          <>
            {/* Mission UI */}
            {missionCompleted ? (
              <div className="bg-black/60 border border-lime-500/30 rounded-lg p-4 space-y-3 mb-4">
                <div className="flex items-center gap-3 p-3 bg-lime-500/10 border border-lime-500/20 rounded-lg">
                  <div className="flex items-center gap-2 flex-1">
                    <div className="w-6 h-6 bg-lime-500/20 rounded-full flex items-center justify-center">
                      <CheckIcon className="h-4 w-4 text-lime-400" />
                    </div>
                    <span className="text-lime-300 text-sm font-medium">
                      Mission Completed!
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="bg-black/60 border border-lime-500/30 rounded-lg p-4 space-y-3 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-lime-300 font-semibold">
                      Mission Required
                    </h4>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-lime-500/10 border border-lime-500/20 rounded-lg">
                    <div className="flex items-center gap-2 flex-1">
                      <div className="w-6 h-6 bg-lime-500/20 rounded-full flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-lime-400"
                        >
                          <path d="M7 10v12"></path>
                          <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"></path>
                        </svg>
                      </div>
                      <span className="text-lime-300 text-sm font-medium">
                        {missionDesc}
                      </span>
                    </div>
                    <div className="w-6 h-6 border-2 border-lime-500/50 rounded-full flex items-center justify-center">
                      {allVisited ? (
                        <CheckIcon className="text-lime-400" />
                      ) : (
                        <div className="w-2 h-2 bg-lime-500 rounded-full opacity-0 animate-pulse"></div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Mission Action Buttons */}
                <div className="space-y-2 mb-4">
                  {missionUrls.map((url, idx) => {
                    const visited = visitedUrls.includes(url);
                    return (
                      <Button
                        key={idx}
                        onClick={() => onMissionClick(url)}
                        disabled={isLoading || visited}
                        variant="outline"
                        className={`w-full text-lg ${
                          visited
                            ? "border-lime-500/50 text-lime-400 bg-lime-500/10"
                            : "border-lime-500/30 text-lime-300 hover:bg-lime-500/10"
                        }`}
                      >
                        {visited && (
                          <CheckIcon className="h-4 w-4 mr-2 text-lime-400" />
                        )}
                        {visited
                          ? `Mission ${idx + 1} Done`
                          : `Go to Mission ${idx + 1}`}
                      </Button>
                    );
                  })}
                </div>
              </>
            )}

            {/* Open Box Button */}
            <Button
              onClick={onOpenBox}
              disabled={isLoading || (!missionCompleted && !allVisited)}
              className={`w-full py-4 font-bold text-lg ${
                isLoading || (!missionCompleted && !allVisited)
                  ? "bg-lime-400/60 text-lime-100 cursor-not-allowed"
                  : "bg-lime-500 hover:bg-lime-600 text-black"
              }`}
            >
              {isLoading ? "Opening…" : "OPEN BOX"}
            </Button>
          </>
        ) : (
          <div className="text-center space-y-3">
            <p className="text-gray-400 font-medium">Box Already Opened</p>
            <Button disabled className="w-full bg-gray-700 text-gray-400 py-4">
              BOX OPENED
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
