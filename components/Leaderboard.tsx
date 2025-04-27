// components/Leaderboard.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "./ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import Image from "next/image";

interface UserEntry {
  _id: string;
  xUsername: string;
  goblinPoints: number;
  profileImage?: string;
  rank: number;
}

interface PaginatedResponse {
  rankedUsers: UserEntry[];
  page: number;
  total: number;
  totalPages: number;
}

const PAGE_SIZE = 20;

const Leaderboard: React.FC = () => {
  const [pendingSearch, setPendingSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<PaginatedResponse>({
    rankedUsers: [],
    page: 1,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(false);

  // Fetch one page + optional search
  const fetchPage = async (p: number, q: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/users?page=${p}&limit=${PAGE_SIZE}&search=${encodeURIComponent(
          q
        )}`
      );
      const json = (await res.json()) as PaginatedResponse;
      setData(json);
    } catch (err) {
      console.error("Failed to load page", err);
    } finally {
      setLoading(false);
    }
  };

  // whenever page or committed searchTerm changes, re-fetch
  useEffect(() => {
    fetchPage(page, searchTerm);
  }, [page, searchTerm]);

  // only commit the search when user presses Enter
  const onSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setSearchTerm(pendingSearch.trim());
      setPage(1);
    }
  };

  // client‐side filter as a fallback
  const filtered = data.rankedUsers.filter((u) =>
    u.xUsername.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // summary indexes
  const startIndex = data.total === 0 ? 0 : (data.page - 1) * PAGE_SIZE + 1;
  const endIndex =
    data.total === 0
      ? 0
      : Math.min(startIndex + data.rankedUsers.length - 1, data.total);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="mt-16"
    >
      {/* Search bar */}
      <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-lime-400 w-4 h-4" />
          <Input
            className="pl-10 bg-black/50 border-lime-500/20 text-lime-100"
            placeholder="Type and press Enter to search…"
            value={pendingSearch}
            onChange={(e) => setPendingSearch(e.target.value)}
            onKeyDown={onSearchKeyDown}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Card className="bg-black/40 border border-lime-500/20 backdrop-blur-md overflow-hidden min-w-[600px]">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-lime-500/20 text-lime-300 font-medium">
            <div className="col-span-1">Rank</div>
            <div className="col-span-7">User</div>
            <div className="col-span-4 text-right">Points</div>
          </div>

          {loading ? (
            <div className="p-4 text-center text-lime-300">Loading…</div>
          ) : filtered.length === 0 ? (
            <div className="p-4 text-center text-lime-300">No users found</div>
          ) : (
            <div className="divide-y divide-lime-500/10">
              {filtered.map((user) => (
                <div
                  key={user._id}
                  className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-lime-500/5 transition"
                >
                  <div className="col-span-1 font-bold">#{user.rank}</div>
                  <a
                    className="col-span-7 flex items-center gap-3"
                    href={`https://x.com/${user.xUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Avatar className="border-2 border-lime-500/30">
                      <AvatarImage
                        src={user.profileImage || "/img/goblin-contact2.webp"}
                        alt={`@${user.xUsername}`}
                      />
                      <AvatarFallback className="bg-lime-500/20 text-lime-300">
                        {user.xUsername[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.xUsername}</p>
                      <p className="text-xs text-lime-400/70">
                        @{user.xUsername.toLowerCase()}
                      </p>
                    </div>
                  </a>
                  <div className="col-span-4 text-right font-bold flex items-center justify-end gap-2">
                    {user.goblinPoints.toLocaleString()}
                    <Image
                      width={35}
                      height={30}
                      src="/img/coin-left.png"
                      alt="coin"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 px-2 text-lime-300 text-sm">
        <div>
          {startIndex} — {endIndex} of {data.total} results
        </div>
        <div className="flex items-center space-x-4">
          <div>
            {data.page} of {data.totalPages} pages
          </div>
          <button
            disabled={data.page <= 1 || loading}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className="px-3 py-1 bg-black/50 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <button
            disabled={data.page >= data.totalPages || loading}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 bg-black/50 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Leaderboard;
