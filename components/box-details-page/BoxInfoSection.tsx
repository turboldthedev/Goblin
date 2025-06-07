"use client";

import { Users, Gift, Coins, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BOX_STATIC_INFO } from "@/lib/constant";

export function BoxInfoSection() {
  return (
    <Card className="bg-black/40 border border-lime-500/20 backdrop-blur-md">
      <CardContent className="p-6 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-lime-300 mb-3 flex items-center gap-2">
            <Users className="h-5 w-5" />
            WHAT IS GOBLIN BOX?
          </h3>
          <p className="text-lime-100/80 leading-relaxed">
            {BOX_STATIC_INFO.description}
          </p>
        </div>

        <div>
          <h3 className="text-xl font-bold text-lime-300 mb-3 flex items-center gap-2">
            <Gift className="h-5 w-5" />
            WHAT IS PRIZE?
          </h3>
          <p className="text-lime-100/80 leading-relaxed mb-3">
            Each box contains a random combination of:
          </p>
          <div className="flex flex-wrap gap-2">
            {BOX_STATIC_INFO.prizes.map((prize, idx) => (
              <Badge
                key={idx}
                variant="outline"
                className="border-lime-500/30 bg-lime-500/10 text-lime-300"
              >
                {prize}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-lime-300 mb-3 flex items-center gap-2">
            <Coins className="h-5 w-5" />
            IS THERE A COST TO PARTICIPATE?
          </h3>
          <p className="text-lime-100/80 leading-relaxed">
            {BOX_STATIC_INFO.cost}
          </p>
        </div>

        <div>
          <h3 className="text-xl font-bold text-lime-300 mb-3 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            HOW LONG WILL IT LAST?
          </h3>
          <p className="text-lime-100/80 leading-relaxed">
            {BOX_STATIC_INFO.duration}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
