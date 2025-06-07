// components/admin/boxes/FilterBar.tsx
"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  filterActive: boolean | null;
  onFilterActiveChange: (value: boolean | null) => void;
}

export function FilterBar({
  searchTerm,
  onSearchChange,
  filterActive,
  onFilterActiveChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div className="flex flex-wrap gap-2">
        <Badge
          variant={filterActive === null ? "default" : "outline"}
          className={
            filterActive === null
              ? "bg-lime-500 hover:bg-lime-600 text-black cursor-pointer"
              : "border-lime-500/30 text-lime-300 hover:bg-lime-500/10 cursor-pointer"
          }
          onClick={() => onFilterActiveChange(null)}
        >
          All Boxes
        </Badge>
        <Badge
          variant={filterActive === true ? "default" : "outline"}
          className={
            filterActive === true
              ? "bg-lime-500 hover:bg-lime-600 text-black cursor-pointer"
              : "border-lime-500/30 text-lime-300 hover:bg-lime-500/10 cursor-pointer"
          }
          onClick={() => onFilterActiveChange(true)}
        >
          Active Only
        </Badge>
        <Badge
          variant={filterActive === false ? "default" : "outline"}
          className={
            filterActive === false
              ? "bg-lime-500 hover:bg-lime-600 text-black cursor-pointer"
              : "border-lime-500/30 text-lime-300 hover:bg-lime-500/10 cursor-pointer"
          }
          onClick={() => onFilterActiveChange(false)}
        >
          Inactive Only
        </Badge>
      </div>

      <div className="relative w-full md:w-64">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-lime-500/50" />
        <Input
          placeholder="Search boxes..."
          className="pl-10 bg-black/40 border-lime-500/20 focus:border-lime-500/50 text-lime-100 w-full"
          value={searchTerm}
          onChange={onSearchChange}
        />
      </div>
    </div>
  );
}
