"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { AnimatedBackground } from "./AnimatedBackground";
import { BoxImageAction } from "./BoxImageAction";
import { BoxInfoSection } from "./BoxInfoSection";
import { RewardModal } from "./RewardModal";
import { PartialBoxDetails } from "@/types";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import PromoCodeBox from "./PromoCodeBox";
import { LoadingScreen } from "../Loading";

export default function BoxDetailsPage() {
  const params = useParams();

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
  const [visitedUrls, setVisitedUrls] = useState<string[]>([]);
  const missionUrls = boxDetails?.missionUrl
    ? boxDetails.missionUrl
        .split(",")
        .map((u) => u.trim())
        .filter(Boolean)
    : [];

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

      if (diff <= 0) {
        // Box is ready - update box details
        fetchBoxDetails();
        setTimeLeft("");
        return;
      }

      setTimeLeft(formatTime(diff));
    };

    const fetchBoxDetails = async () => {
      try {
        const { data } = await axios.get<PartialBoxDetails>(
          `/api/box/${params.id}`
        );
        setBoxDetails(data);
      } catch (err) {
        console.error("Failed to refresh box details:", err);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [boxDetails, params.id]);

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
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const serverError = (err.response.data as { error?: string }).error;
        toast({
          variant: "destructive",
          title: "Mining Error",
          description: serverError ?? "Could not start mining",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Network error",
          description: "Please check your connection and try again.",
        });
      }
      setError("Could not start mining");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Complete mission & open URL ---
  // replace your old handleMissionClick with:
  const handleMissionClick = async (url: string) => {
    try {
      await axios.post(`/api/box/${params.id}/mission`, { url });
      setVisitedUrls((v) => {
        const next = v.includes(url) ? v : [...v, url];
        // once all have been clicked, mark missionCompleted locally
        if (next.length === missionUrls.length && boxDetails) {
          setBoxDetails({ ...boxDetails, missionCompleted: true });
        }
        return next;
      });
      window.open(url, "_blank");
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Mission Error",
        description: err.response?.data?.error || "Could not complete mission",
      });
    }
  };

  const handleOpenBox = async () => {
    if (!boxDetails) return;
    setIsLoading(true);

    try {
      const response = await axios.post<{
        message: string;
        prizeAmount: number;
        newBalance: number;
        prizeType: string;
      }>(`/api/box/${params.id}/claim`);

      const { prizeAmount, prizeType } = response.data;

      const isGolden = prizeType === "GOLDEN";

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
    return <LoadingScreen name="Box" />;
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
                visitedUrls={visitedUrls} // ← new
                onStartMining={handleStartMining}
                onMissionClick={handleMissionClick} // now takes the URL
                onOpenBox={handleOpenBox}
              />
              {/* Promo Code Section */}
              {/* <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-6"
              >
                {boxDetails?.boxType === "partner" && (
                  <PromoCodeBox
                    promoCode={promoCode}
                    setPromoCode={setPromoCode}
                    handlePromoCodeSubmit={handlePromoCodeSubmit}
                    promoStatus={promoStatus}
                    setPromoStatus={setPromoStatus}
                    setPromoMessage={setPromoMessage}
                    promoMessage={promoMessage}
                  />
                )}
              </motion.div> */}
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
