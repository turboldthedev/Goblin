"use client";

import { FC } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderSectionProps {
  isAdmin: boolean;
  onUploadClick: () => void;
}

const HeaderSection: FC<HeaderSectionProps> = ({ isAdmin, onUploadClick }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-lime-300 to-lime-500 text-transparent bg-clip-text">
          Gallery
        </h1>
        <p className="text-lime-300/70 mt-2">
          Explore and contribute to the Goblin gallery
        </p>
      </div>

      {isAdmin && (
        <Button
          className="bg-lime-500 hover:bg-lime-600 text-black"
          onClick={onUploadClick}
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload Image
        </Button>
      )}
    </div>
  );
};

export default HeaderSection;
