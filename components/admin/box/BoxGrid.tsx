// components/admin/boxes/BoxGrid.tsx
"use client";

import React from "react";
import { BoxCard, BoxTemplate } from "./BoxCard";

interface BoxGridProps {
  templates: BoxTemplate[];
  /**
   * Called by any BoxCard after it successfully updates its data.
   * Typically, you’d pass in something like `() => mutate()`.
   */
  onUpdated: () => void;
}

export function BoxGrid({ templates, onUpdated }: BoxGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template) => (
        <BoxCard key={template._id} template={template} onUpdated={onUpdated} />
      ))}
    </div>
  );
}
