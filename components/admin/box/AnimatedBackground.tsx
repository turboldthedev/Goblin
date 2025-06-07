// components/admin/boxes/AnimatedBackground.tsx
import React from "react";

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 z-0">
      {/* radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-900/20 via-black to-black"></div>
      {/* top and bottom gradient lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-lime-500 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-lime-500 to-transparent"></div>
    </div>
  );
}
