"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { AlertCircle, ArrowLeft, CheckCircle, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedBackground } from "./AnimatedBackground";
import { BoxImageAction } from "./BoxImageAction";
import { BoxInfoSection } from "./BoxInfoSection";
import { RewardModal } from "./RewardModal";
import { PartialBoxDetails } from "@/types";
import { toast } from "@/hooks/use-toast";
import { BOX_STATIC_INFO } from "@/lib/constant";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";

export default function BoxDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [boxDetails, setBoxDetails] = useState<PartialBoxDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const [promoStatus, setPromoStatus] = useState<
    "idle" | "valid" | "invalid" | "checking"
  >("idle");
  const [promoMessage, setPromoMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState<string>("");
  const { data: session } = useSession();
  // --- RewardModal state ---
  const [rewardModalOpen, setRewardModalOpen] = useState(false);
  const [rewardData, setRewardData] = useState<{
    amount: number;
    type: string;
    isGolden?: boolean;
  }>({
    amount: 0,
    type: "Goblin Points",
    isGolden: false,
  });

  // Format milliseconds → HH:MM:SS
  const formatTime = (ms: number) => {
    if (ms <= 0) return "00:00:00";
    const totalSeconds = Math.floor(ms / 1000);
    const hrs = Math.floor(totalSeconds / 3600)
      .toString()
      .padStart(2, "0");
    const mins = Math.floor((totalSeconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const secs = Math.floor(totalSeconds % 60)
      .toString()
      .padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  // --- Fetch box data on mount / when params.id changes ---
  useEffect(() => {
    async function fetchBox() {
      setIsLoading(true);
      setError(null);
      try {
        const { data } = await axios.get<PartialBoxDetails>(
          `/api/box/${params.id}`
        );
        setBoxDetails(data);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setError("Box not found");
        } else {
          setError("Failed to load box details");
        }
      } finally {
        setIsLoading(false);
      }
    }
    if (params.id) fetchBox();
  }, [params.id]);

  // --- Countdown effect for mining ---
  useEffect(() => {
    if (!boxDetails?.hasBox || boxDetails.isReady || !boxDetails.readyAt) {
      setTimeLeft("");
      return;
    }
    const updateTimer = () => {
      const now = Date.now();
      const readyTime = new Date(boxDetails.readyAt!).getTime();
      const diff = readyTime - now;
      setTimeLeft(formatTime(diff));
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [boxDetails]);

  // --- Start mining handler ---
  const handleStartMining = async () => {
    if (!session?.user?.xUsername) {
      toast({
        variant: "destructive",
        title: "Please login to start mining",
        description: "You need to login to start mining",
      });
      return;
    }
    setIsLoading(true);
    try {
      await axios.post(`/api/box/${params.id}/start`);
      const { data } = await axios.get<PartialBoxDetails>(
        `/api/box/${params.id}`
      );
      setBoxDetails(data);
    } catch {
      setError("Could not start mining");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Complete mission & open URL ---
  const handleMissionClick = async () => {
    if (!boxDetails) return;

    try {
      await axios.post(`/api/box/${params.id}/mission`);
      setBoxDetails((prev) =>
        prev ? { ...prev, missionCompleted: true } : prev
      );
      window.open(boxDetails.missionUrl, "_blank");
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        const serverError = (err.response.data as { error?: string }).error;
        toast({
          variant: "destructive",
          title: "Mission Error",
          description: serverError ?? "Could not complete mission.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Network error",
          description: "Please check your connection and try again.",
        });
      }
    }
  };

  // --- Open box handler → show RewardModal ---
  const handleOpenBox = async () => {
    if (!boxDetails) return;
    setIsLoading(true);

    try {
      const response = await axios.post<{
        message: string;
        prizeAmount: number;
        newBalance: number;
      }>(`/api/box/${params.id}/claim`);

      const { prizeAmount, newBalance } = response.data;

      const isGolden = prizeAmount > boxDetails.normalPrize;

      setRewardData({
        amount: prizeAmount,
        type: "Goblin Points",
        isGolden,
      });
      setRewardModalOpen(true);

      const { data } = await axios.get<PartialBoxDetails>(
        `/api/box/${params.id}`
      );
      setBoxDetails(data);
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        const serverError = (err.response.data as { error?: string }).error;
        toast({
          variant: "destructive",
          title: "Could not open box",
          description: serverError ?? "Something went wrong. Please try again.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Network error",
          description: "Please check your connection and try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  async function handlePromoCodeSubmit() {
    if (!promoCode.trim()) {
      setPromoStatus("invalid");
      setPromoMessage("Please enter a promo code");
      return;
    }

    setPromoStatus("checking");
    try {
      await axios.post(`/api/box/${params.id}/promo`, { code: promoCode });
      // If successful:
      setPromoStatus("valid");
      setPromoMessage("Promo code applied!");

      setBoxDetails((prev) => (prev ? { ...prev, promoValid: true } : prev));
    } catch (err: any) {
      setPromoStatus("invalid");
      setPromoMessage(
        axios.isAxiosError(err) && err.response?.data?.error
          ? err.response.data.error
          : "Invalid promo code"
      );
    }
  }

  const { name = "" } = boxDetails ?? {};

  // --- Loading / error fallback rendering ---
  if (isLoading && !boxDetails) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-lime-300">Loading box details…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated background */}
      <AnimatedBackground />

      <main className="relative z-10 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Back link + centered title */}
          <div className="mb-6">
            <Link
              href="/box"
              className="inline-flex items-center text-lime-300 hover:text-lime-500"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Boxes
            </Link>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-lime-300 to-lime-500 text-transparent bg-clip-text mb-4">
              {name}
            </h1>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Left: Box image + all actions */}
            <div>
              <BoxImageAction
                details={boxDetails!}
                isLoading={isLoading}
                timeLeft={timeLeft}
                onStartMining={handleStartMining}
                onMissionClick={handleMissionClick}
                onOpenBox={handleOpenBox}
              />

              {/* Promo Code Section */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-6"
              >
                <Card className="bg-black/40 border border-lime-500/20 backdrop-blur-md overflow-hidden">
                  <CardContent className="p-5">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Ticket className="h-5 w-5 text-lime-400" />
                        <h3 className="text-lg font-medium text-lime-300">
                          Promo Code
                        </h3>
                      </div>

                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Enter promo code"
                            value={promoCode}
                            onChange={(e) => {
                              setPromoCode(e.target.value);
                              if (promoStatus !== "idle") {
                                setPromoStatus("idle");
                                setPromoMessage("");
                              }
                            }}
                            className="bg-black/60 border-lime-500/20 focus:border-lime-500/50 text-lime-100"
                          />
                          <Button
                            onClick={handlePromoCodeSubmit}
                            disabled={
                              promoStatus === "checking" ||
                              promoStatus === "valid"
                            }
                            className="bg-lime-500 hover:bg-lime-600 text-black font-medium"
                          >
                            Apply
                          </Button>
                        </div>

                        {promoStatus !== "idle" && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            transition={{ duration: 0.3 }}
                            className="flex items-center gap-2"
                          >
                            {promoStatus === "checking" && (
                              <div className="w-4 h-4 border-2 border-lime-500 border-t-transparent rounded-full animate-spin"></div>
                            )}
                            {promoStatus === "valid" && (
                              <CheckCircle className="h-4 w-4 text-lime-500" />
                            )}
                            {promoStatus === "invalid" && (
                              <AlertCircle className="h-4 w-4 text-red-500" />
                            )}
                            <p
                              className={`text-sm ${
                                promoStatus === "valid"
                                  ? "text-lime-400"
                                  : promoStatus === "invalid"
                                    ? "text-red-400"
                                    : "text-lime-300/70"
                              }`}
                            >
                              {promoMessage}
                            </p>
                          </motion.div>
                        )}
                      </div>

                      <div className="text-xs text-lime-300/60">
                        Enter a valid promo code to receive bonus rewards when
                        opening your box
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Right: Static info section */}
            <div className="h-[500px] overflow-y-auto">
              <BoxInfoSection />
            </div>
          </div>
        </motion.div>
      </main>

      {/* RewardModal */}
      <RewardModal
        isOpen={rewardModalOpen}
        onClose={() => setRewardModalOpen(false)}
        reward={rewardData}
      />
    </div>
  );
}
