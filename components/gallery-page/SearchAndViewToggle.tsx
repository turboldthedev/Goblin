"use client";

import { FC } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Grid3X3, LayoutGrid } from "lucide-react";

interface Props {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  view: "grid" | "masonry";
  setView: (value: "grid" | "masonry") => void;
}

const SearchAndViewToggle: FC<Props> = ({
  searchTerm,
  setSearchTerm,
  view,
  setView,
}) => {
  return (
    <div className="mb-6 flex items-center gap-3">
      <div className="relative flex-1 md:w-64">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-lime-500/50" />
        <Input
          placeholder="Search images..."
          className="pl-10 bg-black/40 border-lime-500/20 focus:border-lime-500/50 text-lime-100"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex border border-lime-500/30 rounded-md overflow-hidden">
        <Button
          variant="ghost"
          size="icon"
          className={`rounded-none ${
            view === "grid"
              ? "bg-lime-500/20 text-lime-300"
              : "text-lime-400 hover:bg-lime-500/10"
          }`}
          onClick={() => setView("grid")}
        >
          <Grid3X3 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={`rounded-none ${
            view === "masonry"
              ? "bg-lime-500/20 text-lime-300"
              : "text-lime-400 hover:bg-lime-500/10"
          }`}
          onClick={() => setView("masonry")}
        >
          <LayoutGrid className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default SearchAndViewToggle;
