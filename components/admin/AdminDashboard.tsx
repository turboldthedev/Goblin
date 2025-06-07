// components/AdminDashboard.tsx
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Award, Save, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import UserTable from "./UserTable";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/types";
import { LoadingScreen } from "../Loading";

const PAGE_SIZE = 20;

interface PaginatedUsers {
  rankedUsers: User[];
  page: number;
  total: number;
  totalPages: number;
}

export default function AdminDashboard() {
  const [data, setData] = useState<PaginatedUsers>({
    rankedUsers: [],
    page: 1,
    total: 0,
    totalPages: 1,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingSearch, setPendingSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  // fetch with pagination + searchTerm
  const fetchPage = async (page: number, search = "") => {
    setIsLoading(true);
    try {
      const res = await axios.get<PaginatedUsers>(
        `/api/users?page=${page}&limit=${PAGE_SIZE}&search=${encodeURIComponent(
          search
        )}`
      );
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
      toast({ title: "Error", description: "Could not load users." });
    } finally {
      setIsLoading(false);
    }
  };

  // whenever page or committed searchTerm changes, re-fetch
  useEffect(() => {
    fetchPage(data.page, searchTerm);
  }, [data.page, searchTerm]);

  // when user presses Enter, commit the search
  const onSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setSearchTerm(pendingSearch);
      setData((d) => ({ ...d, page: 1 }));
    }
  };

  // per-row point edits
  const handlePointChange = (_id: string, newPoints: number) => {
    setData((d) => ({
      ...d,
      rankedUsers: d.rankedUsers.map((u) =>
        u._id === _id ? { ...u, goblinPoints: newPoints } : u
      ),
    }));
  };

  // save all changes
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await axios.post("/api/update-points", {
        users: data.rankedUsers.map(({ _id, goblinPoints }) => ({
          _id,
          goblinPoints,
        })),
      });
      toast({ title: "Saved!", description: "Points updated." });
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Save failed." });
    } finally {
      setIsSaving(false);
    }
  };

  // summary indexes
  const startIndex = data.total === 0 ? 0 : (data.page - 1) * PAGE_SIZE + 1;
  const endIndex =
    data.total === 0
      ? 0
      : Math.min(startIndex + data.rankedUsers.length - 1, data.total);

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-lime-300 to-lime-500 text-transparent bg-clip-text">
              User points
            </h1>
            <Badge
              variant="outline"
              className="border-lime-500/50 bg-lime-500/10 text-lime-300 px-3 py-1"
            >
              <Award className="h-4 w-4 mr-2" />
              Weekly Goblin Points
            </Badge>
          </div>

          {/* Search (Enter to trigger) */}
          <div className="mb-4 relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-lime-400 w-4 h-4" />
            <Input
              className="pl-10 bg-black/50 border-lime-500/20 text-lime-100"
              placeholder="Type and press Enter to search..."
              value={pendingSearch}
              onChange={(e) => setPendingSearch(e.target.value)}
              onKeyDown={onSearchKeyDown}
            />
          </div>

          {/* Loader / Empty / Table + Pagination + Save */}
          {isLoading ? (
            <LoadingScreen name="User points" />
          ) : data.total === 0 ? (
            <div className="py-16 text-center text-lime-300">
              <p className="text-xl font-semibold">No users found.</p>
              <p className="mt-2">Try a different search term or add users.</p>
            </div>
          ) : (
            <>
              <UserTable
                users={data.rankedUsers}
                onPointChange={handlePointChange}
              />

              {/* Pagination */}
              <div className="flex justify-between items-center mt-4 text-lime-300 text-sm">
                <div>
                  {startIndex} — {endIndex} of {data.total} results
                </div>
                <div className="flex items-center space-x-4">
                  <div>
                    {data.page} of {data.totalPages} pages
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={data.page <= 1 || isLoading}
                    onClick={() => setData((d) => ({ ...d, page: d.page - 1 }))}
                    className="disabled:opacity-50"
                  >
                    Prev
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={data.page >= data.totalPages || isLoading}
                    onClick={() => setData((d) => ({ ...d, page: d.page + 1 }))}
                    className="disabled:opacity-50"
                  >
                    Next
                  </Button>
                </div>
              </div>

              {/* Save */}
              <div className="flex justify-end mt-6">
                <Button
                  className={`bg-lime-600 hover:bg-lime-700 text-white ${
                    isSaving ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "Saving..." : "Save All Changes"}
                </Button>
              </div>
            </>
          )}
        </motion.div>
      </main>
    </div>
  );
}
