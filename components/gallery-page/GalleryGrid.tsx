"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

interface GalleryItem {
  _id: string;
  title: string;
  imageUrl: string;
  createdBy: string;
}

interface GalleryGridProps {
  items: GalleryItem[];
  view: "grid" | "masonry";
}

const GalleryGrid: React.FC<GalleryGridProps> = ({ items, view }) => {
  const containerClass =
    view === "grid"
      ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      : "columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6";

  return (
    <div className={containerClass}>
      {items.map((item) => (
        <motion.div
          key={item._id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          whileHover={{ y: -5 }}
          className={view === "masonry" ? "break-inside-avoid" : ""}
        >
          <div className="bg-black/40 border border-lime-500/20 rounded-lg overflow-hidden backdrop-blur-sm">
            <Link href={item.imageUrl} target="_blank">
              <div className="relative aspect-[4/3] w-full min-h-80 overflow-hidden rounded hover:opacity-90 transition">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover object-center"
                />
              </div>
            </Link>

            <div className="p-4">
              <h3 className="font-medium text-lime-300 truncate">
                {item.title}
              </h3>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default GalleryGrid;
