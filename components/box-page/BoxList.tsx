"use client";
import useSWR from "swr";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingScreen } from "../Loading";

type BoxSummary = {
  boxes: {
    _id: string;
    name: string;
    imageUrl?: string;
    isReady: boolean;
    opened: boolean;
  }[];
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function BoxList() {
  // Fetch a list of all boxes (box summaries) from your API
  const { data, error, isLoading } = useSWR<BoxSummary>(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/boxes`,
    fetcher
  );

  if (isLoading) {
    return <LoadingScreen name="Box" />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white">
        {/* Animated background */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-900/20 via-black to-black"></div>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-lime-500 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-lime-500 to-transparent"></div>
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Package className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <p className="text-red-400">Failed to load boxes.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Animated background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-900/20 via-black to-black"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-lime-500 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-lime-500 to-transparent"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-lime-300 to-lime-500 text-transparent bg-clip-text mb-2">
              Available Boxes
            </h1>
            <p className="text-lime-300/70">
              Discover and open your mystery boxes to claim rewards
            </p>
          </div>

          {data?.boxes && data.boxes.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <Package className="h-16 w-16 text-lime-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-lime-300 mb-2">
                  No Boxes Available
                </h3>
                <p className="text-lime-300/70 max-w-md">
                  Check back later for new mystery boxes to appear in your
                  collection.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {data?.boxes?.map((box, index) => (
                <motion.div
                  key={box._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <Link href={`/box/${box._id}`} passHref>
                    <Card className="bg-black/40 border border-lime-500/20 backdrop-blur-sm hover:border-lime-500/50 transition-all duration-300 cursor-pointer group overflow-hidden">
                      {/* Image Container */}
                      <div className="relative w-full h-60 bg-black/60 overflow-hidden">
                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-b from-lime-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>

                        {box.imageUrl ? (
                          <Image
                            src={box.imageUrl || "/placeholder.svg"}
                            alt={box.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                              <Package className="h-12 w-12 text-lime-400 mx-auto mb-2" />
                              <p className="text-lime-300/60 text-sm">
                                Mystery Box
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Status Icon Overlay */}

                        {/* Glow effect for ready boxes */}
                        {box.isReady && !box.opened && (
                          <div className="absolute inset-0 bg-lime-500/5 animate-pulse"></div>
                        )}
                      </div>

                      <CardContent className="p-4">
                        <h2 className="text-lg font-medium text-lime-300 truncate mb-3 group-hover:text-lime-200 transition-colors">
                          {box.name}
                        </h2>

                        <div className="flex items-center justify-between">
                          {/* Action indicator */}
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="flex items-center text-lime-400 text-sm">
                              {box.opened ? "View Details" : "Open Box"}
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="ml-1"
                              >
                                <polyline points="9 18 15 12 9 6"></polyline>
                              </svg>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
