"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { Clock, CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PartialBoxDetails } from "@/types";

interface BoxImageActionProps {
  details: PartialBoxDetails;
  isLoading: boolean;
  timeLeft: string;
  onStartMining: () => Promise<void>;
  onMissionClick: () => Promise<void>;
  onOpenBox: () => Promise<void>;
}

export function BoxImageAction({
  details,
  isLoading,
  timeLeft,
  onStartMining,
  onMissionClick,
  onOpenBox,
}: BoxImageActionProps) {
  const {
    name = "",
    imageUrl = "",
    hasBox = false,
    isReady = false,
    opened = false,
    missionDesc = "",
    missionUrl = "",
    missionCompleted = false,
  } = details ?? {};

  return (
    <Card className="bg-black/40 border border-lime-500/20 backdrop-blur-md overflow-hidden">
      <CardContent className="p-6">
        <div className="relative mb-6">
          <div className="absolute -inset-4 bg-lime-500/20 blur-xl rounded-full" />
          <motion.div
            animate={{ y: [0, -10, 0], rotateY: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="relative z-10"
          >
            <Image
              src={imageUrl ?? "/placeholder.svg?height=400&width=400"}
              alt={name}
              width={400}
              height={400}
              className="w-full h-auto drop-shadow-[0_0_30px_rgba(132,204,22,0.3)] rounded-lg"
            />
          </motion.div>
        </div>

        <div className="text-center space-y-4">
          <h3 className="text-2xl font-bold text-lime-300">{name}</h3>

          {!hasBox ? (
            <Button
              onClick={onStartMining}
              disabled={isLoading}
              className="w-full bg-lime-500 hover:bg-lime-600 text-black font-bold py-4 text-lg"
            >
              {isLoading ? "Starting…" : "START MINING"}
            </Button>
          ) : !isReady ? (
            <div className="space-y-2">
              <p className="text-lime-300">Mining in progress…</p>
              <p className="text-3xl font-mono text-lime-400">{timeLeft}</p>
            </div>
          ) : !opened ? (
            <div className="space-y-4">
              {/* Mission Card */}
              <div className="bg-black/60 border border-lime-500/30 rounded-lg p-4 space-y-3">
                <h4 className="text-lime-300 font-semibold">
                  Mission Required
                </h4>
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
                        <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
                      </svg>
                    </div>
                    <span className="text-lime-300 text-sm font-medium">
                      {missionDesc}
                    </span>
                  </div>
                  <div className="w-6 h-6 border-2 border-lime-500/50 rounded-full flex items-center justify-center">
                    {missionCompleted ? (
                      <CheckIcon className="text-lime-400" />
                    ) : (
                      <div className="w-2 h-2 bg-lime-500 rounded-full opacity-0 animate-pulse" />
                    )}
                  </div>
                </div>
              </div>

              {/* Mission Action Button */}
              {missionUrl && (
                <Button
                  onClick={onMissionClick}
                  disabled={isLoading || missionCompleted}
                  variant="outline"
                  className="w-full border-lime-500/50 text-lime-400 hover:bg-lime-500/10 hover:text-lime-300 py-3"
                >
                  {missionCompleted ? (
                    <>
                      <CheckIcon className="h-4 w-4 mr-2 text-lime-400" />
                      Mission Done
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2"
                      >
                        <path d="M15 3h6v6"></path>
                        <path d="M10 14 21 3"></path>
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      </svg>
                      Go to Mission
                    </>
                  )}
                </Button>
              )}

              {/* Open Box Button */}
              <Button
                onClick={onOpenBox}
                disabled={isLoading || !missionCompleted}
                className={`w-full font-bold py-4 text-lg ${
                  isLoading || !missionCompleted
                    ? "bg-lime-400/60 cursor-not-allowed text-lime-100"
                    : "bg-lime-500 hover:bg-lime-600 text-black"
                }`}
              >
                {isLoading ? "Opening…" : "OPEN BOX"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-800/60 border border-gray-600/30 rounded-lg p-4 text-center">
                <div className="w-12 h-12 bg-gray-600/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-400"
                  >
                    <path d="M20 7h-9"></path>
                    <path d="M14 17H5"></path>
                    <circle cx="17" cy="17" r="3"></circle>
                    <circle cx="7" cy="7" r="3"></circle>
                  </svg>
                </div>
                <p className="text-gray-400 font-medium">Box Already Opened</p>
              </div>
              <Button
                disabled
                className="w-full bg-gray-700 text-gray-400 font-bold py-4 text-lg cursor-not-allowed"
              >
                BOX OPENED
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
