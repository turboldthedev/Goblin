// components/admin/boxes/BoxCard.tsx
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditBoxDrawer } from "./EditBoxDrawer";
import Image from "next/image";

export type BoxTemplate = {
  _id: string;
  name: string;
  imageUrl?: string;
  // (the other fields no longer appear here because they live in the drawer)
  normalPrize: number;
  goldenPrize: number;
  goldenChance: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

interface BoxCardProps {
  template: BoxTemplate;
  onUpdated: () => void; // Called after a successful edit so parent can re‐fetch/mutate
}

export function BoxCard({ template, onUpdated }: BoxCardProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <motion.div
        key={template._id}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
      >
        <Card className="bg-black/40 border border-lime-500/20 backdrop-blur-sm hover:border-lime-500/50 transition-colors">
          <CardContent className="p-0">
            {/* Image area (if provided) */}
            {template.imageUrl ? (
              <div className="w-full h-96 overflow-hidden rounded-t-lg ">
                <Image
                  src={template.imageUrl}
                  alt={template.name}
                  className="object-cover w-full h-full"
                  width={400}
                  height={300}
                />
              </div>
            ) : (
              <div className="w-full h-40 bg-gray-800 flex items-center justify-center rounded-t-lg">
                <p className="text-sm text-gray-400">No Image</p>
              </div>
            )}

            {/* Name + Edit Button */}
            <div className="flex items-center justify-between p-4">
              <h3 className="font-medium text-lime-300 truncate">
                {template.name}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDrawerOpen(true)}
                className="text-lime-300 hover:bg-lime-500/10"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Edit Drawer */}
      <EditBoxDrawer
        isOpen={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        template={template}
        onUpdated={onUpdated}
      />
    </>
  );
}
