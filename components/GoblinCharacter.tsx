"use client";

import React, { FC } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { UserResponse } from "@/types";
import { useSession } from "next-auth/react";

interface GoblinCharacterProps {
  userRankData: UserResponse;
}
const GoblinCharacter: FC<GoblinCharacterProps> = ({ userRankData }) => {
  const { data: session, status } = useSession();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center"
    >
      <div className="relative">
        <div className="absolute -inset-4 rounded-full bg-lime-500/20 blur-xl animate-pulse"></div>
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 4,
            ease: "easeInOut",
          }}
        >
          <Image
            src="/img/G3.png"
            alt="Goblin Character"
            width={300}
            height={400}
            className="relative z-10 drop-shadow-[0_0_15px_rgba(132,204,22,0.5)]"
          />
        </motion.div>
        <div className="absolute top-0 right-0 -mr-4 -mt-4">
          <motion.div
            animate={{
              rotate: [0, 10, 0, -10, 0],
              scale: [1, 1.1, 1, 1.1, 1],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 5,
              ease: "easeInOut",
            }}
          >
            {status == "authenticated" && (
              <div className="w-16 h-16 bg-lime-400 rounded-full flex items-center justify-center text-black font-bold text-xl shadow-[0_0_15px_rgba(132,204,22,0.7)]">
                #{userRankData?.rank}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default GoblinCharacter;
