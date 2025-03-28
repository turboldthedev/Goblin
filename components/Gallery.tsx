// Updated and Optimized Gallery Page
"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { motion } from "framer-motion";

import UploadDialog from "./UploadDialog";
import HeaderSection from "./HeaderSection";
import SearchAndViewToggle from "./SearchAndViewToggle";
import GalleryGrid from "./GalleryGrid";

export interface GalleryItem {
  _id: string;
  title: string;
  imageUrl: string;
  createdBy: string;
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState<"grid" | "masonry">("grid");
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const { data: session } = useSession();

  const isAdmin = session?.user?.isAdmin as boolean;

  useEffect(() => {
    const fetchGallery = async () => {
      const res = await axios.get("/api/gallery");
      setItems(res.data);
    };
    fetchGallery();
  }, []);

  const refreshGalleryItems = async () => {
    const res = await axios.get("/api/gallery");
    setItems(res.data);
  };

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="relative z-10 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <HeaderSection
            isAdmin={isAdmin}
            onUploadClick={() => setIsDialogOpen(true)}
          />

          {isAdmin && (
            <UploadDialog
              isDialogOpen={isDialogOpen}
              setIsDialogOpen={setIsDialogOpen}
              onUploadSuccess={refreshGalleryItems}
            />
          )}

          <SearchAndViewToggle
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            view={view}
            setView={setView}
          />

          <GalleryGrid items={filteredItems} view={view} />
        </motion.div>
      </main>
    </div>
  );
}
