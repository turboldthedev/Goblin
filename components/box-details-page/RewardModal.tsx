"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { X, Gift, Award, Sparkles, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  reward: {
    amount: number;
    type: string;
    isGolden?: boolean;
  };
}

export function RewardModal({ isOpen, onClose, reward }: RewardModalProps) {
  const [showContent, setShowContent] = useState(false);
  const [showAmount, setShowAmount] = useState(false);
  const confettiRef = useRef<HTMLDivElement>(null);

  // Trigger confetti when modal opens
  useEffect(() => {
    if (isOpen && confettiRef.current) {
      const rect = confettiRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // First confetti burst
      confetti({
        particleCount: 100,
        spread: 70,
        origin: {
          x: centerX / window.innerWidth,
          y: centerY / window.innerHeight,
        },
        colors: reward.isGolden
          ? ["#FFD700", "#FFC000", "#FFDF00"]
          : ["#84cc16", "#65a30d", "#4d7c0f"],
      });

      // Second confetti burst with slight delay
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: {
            x: centerX / window.innerWidth,
            y: centerY / window.innerHeight,
          },
          colors: ["#84cc16", "#65a30d", "#4d7c0f", "#000000"],
        });
      }, 200);

      // Show content with delay
      setTimeout(() => {
        setShowContent(true);
      }, 500);

      // Show amount with delay for counting animation
      setTimeout(() => {
        setShowAmount(true);
      }, 1000);
    }

    return () => {
      setShowContent(false);
      setShowAmount(false);
    };
  }, [isOpen, reward.isGolden]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative w-full max-w-md"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 15 }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-10 rounded-full bg-black/20 p-1 text-lime-300 hover:bg-black/40 hover:text-lime-200 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal content */}
            <div
              className={`overflow-hidden rounded-xl border ${
                reward.isGolden ? "border-yellow-500/50" : "border-lime-500/50"
              } bg-black/90 shadow-xl`}
            >
              {/* Top glow */}
              <div
                className={`absolute inset-x-0 top-0 h-px ${
                  reward.isGolden
                    ? "bg-gradient-to-r from-transparent via-yellow-500 to-transparent"
                    : "bg-gradient-to-r from-transparent via-lime-500 to-transparent"
                }`}
              ></div>

              {/* Bottom glow */}
              <div
                className={`absolute inset-x-0 bottom-0 h-px ${
                  reward.isGolden
                    ? "bg-gradient-to-r from-transparent via-yellow-500 to-transparent"
                    : "bg-gradient-to-r from-transparent via-lime-500 to-transparent"
                }`}
              ></div>

              {/* Header */}
              <div
                className={`p-6 text-center ${
                  reward.isGolden ? "bg-yellow-500/10" : "bg-lime-500/10"
                } border-b ${reward.isGolden ? "border-yellow-500/20" : "border-lime-500/20"}`}
              >
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2
                    className={`text-2xl font-bold ${
                      reward.isGolden
                        ? "bg-gradient-to-r from-yellow-300 to-yellow-500 text-transparent bg-clip-text"
                        : "bg-gradient-to-r from-lime-300 to-lime-500 text-transparent bg-clip-text"
                    }`}
                  >
                    {reward.isGolden ? "GOLDEN REWARD!" : "BOX OPENED!"}
                  </h2>
                </motion.div>
              </div>

              {/* Box opening animation */}
              <div className="relative p-6" ref={confettiRef}>
                <div className="flex justify-center mb-6">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1, rotateY: [0, 360] }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="relative"
                  >
                    <div
                      className={`absolute inset-0 rounded-full ${
                        reward.isGolden ? "bg-yellow-500/30" : "bg-lime-500/30"
                      } blur-xl`}
                    ></div>
                    <div className="relative z-10">
                      {reward.isGolden ? (
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-600 flex items-center justify-center shadow-lg">
                          <Award className="h-16 w-16 text-black" />
                        </div>
                      ) : (
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-lime-300 to-lime-600 flex items-center justify-center shadow-lg">
                          <Gift className="h-16 w-16 text-black" />
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>

                {/* Reward content */}
                <AnimatePresence>
                  {showContent && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="text-center space-y-4"
                    >
                      <h3 className="text-xl text-white font-medium">
                        You received
                      </h3>

                      <div className="flex items-center justify-center gap-3">
                        <Coins
                          className={`h-6 w-6 ${reward.isGolden ? "text-yellow-400" : "text-lime-400"}`}
                        />
                        <CountUp
                          end={reward.amount}
                          isVisible={showAmount}
                          className={`text-4xl font-bold ${
                            reward.isGolden
                              ? "text-yellow-400"
                              : "text-lime-400"
                          }`}
                        />
                      </div>

                      <p className="text-lg text-white/80">{reward.type}</p>

                      {/* Floating sparkles */}
                      <motion.div
                        className="absolute top-1/4 left-1/4"
                        animate={{
                          y: [0, -15, 0],
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "loop",
                          delay: 0.2,
                        }}
                      >
                        <Sparkles
                          className={`h-4 w-4 ${reward.isGolden ? "text-yellow-400" : "text-lime-400"}`}
                        />
                      </motion.div>
                      <motion.div
                        className="absolute top-1/3 right-1/4"
                        animate={{
                          y: [0, -20, 0],
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 2.5,
                          repeat: Infinity,
                          repeatType: "loop",
                          delay: 0.7,
                        }}
                      >
                        <Sparkles
                          className={`h-5 w-5 ${reward.isGolden ? "text-yellow-400" : "text-lime-400"}`}
                        />
                      </motion.div>
                      <motion.div
                        className="absolute bottom-1/4 right-1/3"
                        animate={{
                          y: [0, -12, 0],
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 1.8,
                          repeat: Infinity,
                          repeatType: "loop",
                          delay: 1.2,
                        }}
                      >
                        <Sparkles
                          className={`h-3 w-3 ${reward.isGolden ? "text-yellow-400" : "text-lime-400"}`}
                        />
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div
                className={`p-4 border-t ${
                  reward.isGolden
                    ? "border-yellow-500/20"
                    : "border-lime-500/20"
                } text-center`}
              >
                <Button
                  onClick={onClose}
                  className={`w-full ${
                    reward.isGolden
                      ? "bg-yellow-600 hover:bg-yellow-700 text-black"
                      : "bg-lime-600 hover:bg-lime-700 text-black"
                  } font-bold`}
                >
                  AWESOME!
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Animated counter component
function CountUp({
  end,
  isVisible,
  className,
}: {
  end: number;
  isVisible: boolean;
  className?: string;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    let animationFrame: number;

    const countUp = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / 1500, 1); // 1.5 seconds duration

      // Easing function for smoother animation
      const easeOutQuart = (x: number): number => 1 - Math.pow(1 - x, 4);
      const easedProgress = easeOutQuart(progress);

      setCount(Math.floor(easedProgress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(countUp);
      }
    };

    animationFrame = requestAnimationFrame(countUp);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [end, isVisible]);

  return <span className={className}>{count.toLocaleString()}</span>;
}
