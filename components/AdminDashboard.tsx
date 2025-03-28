"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

import { Award, Save, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import UserTable from "./UserTable";
import { User } from "@/types";

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`/api/users`);
        setUsers(res.data.rankedUsers);
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };

    fetchUsers();
  }, []);

  const handlePointChange = (_id: string, newPoints: number) => {
    setUsers((prev) =>
      prev.map((user) =>
        user._id === _id ? { ...user, goblinPoints: newPoints } : user
      )
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await axios.post("/api/update-points", {
        users: users.map(({ _id, goblinPoints }) => ({ _id, goblinPoints })),
      });
      alert("Successfully updated goblin points!");
    } catch (error) {
      console.error("Failed to update users", error);
      alert("Something went wrong while saving.");
    }
    setIsSaving(false);
  };

  const filteredUsers = users.filter((user) =>
    user.xUsername.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="relative z-10 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">
              <span className="bg-gradient-to-r from-lime-300 to-lime-500 text-transparent bg-clip-text">
                Admin Dashboard
              </span>
            </h1>
            <Badge
              variant="outline"
              className="border-lime-500/50 bg-lime-500/10 text-lime-300 px-3 py-1"
            >
              <Award className="h-4 w-4 mr-2" />
              Weekly Goblin Points
            </Badge>
          </div>

          <div className="mb-4 relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lime-400 w-4 h-4" />
            <Input
              className="pl-10 bg-black/50 border-lime-500/20 text-lime-100"
              placeholder="Search by username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <UserTable users={filteredUsers} onPointChange={handlePointChange} />

          <div className="flex justify-end mt-6">
            <Button
              className={`bg-lime-600 hover:bg-lime-700 text-white ${isSaving ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={handleSave}
              disabled={isSaving}
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save All Changes"}
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
