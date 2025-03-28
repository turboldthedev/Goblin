// app/loading.tsx
"use client";

import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <Loader2 className="h-10 w-10 animate-spin text-lime-400" />
      <span className="ml-4 text-lime-300 text-lg">Loading Goblin...</span>
    </div>
  );
}
