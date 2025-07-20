import { AlertCircle, CheckCircle, Ticket } from "lucide-react";
import { motion } from "framer-motion";
import React from "react";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface PromoCodeBoxProps {
  promoCode: string;
  setPromoCode: (code: string) => void;
  handlePromoCodeSubmit: () => void;
  promoStatus: "idle" | "valid" | "invalid" | "checking";
  promoMessage: string;
  setPromoStatus: (status: "idle" | "valid" | "invalid" | "checking") => void;
  setPromoMessage: (message: string) => void;
}

const PromoCodeBox = ({
  promoCode,
  setPromoCode,
  handlePromoCodeSubmit,
  promoStatus,
  setPromoStatus,
  setPromoMessage,
  promoMessage,
}: PromoCodeBoxProps) => {
  return (
    <Card className="bg-black/40 border border-lime-500/20 backdrop-blur-md overflow-hidden">
      <CardContent className="p-5">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Ticket className="h-5 w-5 text-lime-400" />
            <h3 className="text-lg font-medium text-lime-300">Promo Code</h3>
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
                disabled={promoStatus === "checking" || promoStatus === "valid"}
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
            Enter a valid promo code to receive bonus rewards when opening your
            box
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PromoCodeBox;
