"use client";

import { motion } from "framer-motion";

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 z-0">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-900/20 via-black to-black" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-lime-500 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-lime-500 to-transparent" />

      {/* Floating element 1 */}
      <motion.div
        animate={{ y: [0, -20, 0], x: [0, 10, 0], rotate: [0, 5, 0] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        className="absolute top-20 left-10 opacity-20"
      >
        <div className="w-32 h-32 bg-lime-500/10 rounded-lg backdrop-blur-sm border border-lime-500/20" />
      </motion.div>

      {/* Floating element 2 */}
      <motion.div
        animate={{ y: [0, 15, 0], x: [0, -15, 0], rotate: [0, -3, 0] }}
        transition={{
          repeat: Infinity,
          duration: 10,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute top-40 right-20 opacity-20"
      >
        <div className="w-24 h-24 bg-lime-500/10 rounded-lg backdrop-blur-sm border border-lime-500/20" />
      </motion.div>
    </div>
  );
}
