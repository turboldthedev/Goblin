"use client";

import React, { FC, useState } from "react";
import { Input } from "./ui/input";
import { Search } from "lucide-react";

import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Card } from "./ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import Image from "next/image";

interface UserRank {
  rankedUsers: {
    rank: number;
    xUsername: string;
    goblinPoints: number;
    followersCount: number;
    profileImage: string;
    _id: string;
  }[];
}

interface LeaderboardProps {
  usersRankData: UserRank;
}

const Leaderboard: FC<LeaderboardProps> = ({ usersRankData }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = usersRankData.rankedUsers.filter((user) =>
    user.xUsername.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="mt-16"
    >
      <Tabs defaultValue="leaderboard" className="w-full">
        <div className="flex justify-between items-center mb-6">
          <TabsList className="bg-black/60 border border-lime-500/20">
            <TabsTrigger
              value="leaderboard"
              className="data-[state=active]:bg-lime-500/20 data-[state=active]:text-lime-300"
            >
              Leaderboard
            </TabsTrigger>
            {/* <TabsTrigger
              value="activity"
              className="data-[state=active]:bg-lime-500/20 data-[state=active]:text-lime-300"
            >
              Activity
            </TabsTrigger>
            <TabsTrigger
              value="rewards"
              className="data-[state=active]:bg-lime-500/20 data-[state=active]:text-lime-300"
            >
              Rewards
            </TabsTrigger> */}
          </TabsList>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-lime-500/50" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-black/40 border-lime-500/20 focus:border-lime-500/50 text-lime-100 w-[250px]"
            />
          </div>
        </div>

        <TabsContent value="leaderboard" className="mt-0">
          <Card className="bg-black/40 border border-lime-500/20 backdrop-blur-md overflow-hidden">
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-lime-500/20 text-lime-300 font-medium">
              <div className="col-span-1">Rank</div>
              <div className="col-span-7">User</div>
              <div className="col-span-4 text-right">Paw Points</div>
            </div>

            <div className="divide-y divide-lime-500/10">
              {filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-lime-500/5 transition"
                >
                  <div className="col-span-1 font-bold">#{user.rank}</div>
                  <div className="col-span-7 flex items-center gap-3">
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
                  </div>
                  <div className="col-span-4 text-right font-bold flex items-center justify-end gap-2">
                    {user.goblinPoints.toLocaleString()}
                    <Image
                      width={35}
                      height={30}
                      src="/img/coin-left.png"
                      alt="coin"
                    />
                    {/* <span className="inline-block w-4 h-4">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-lime-400"
                      >
                        <path
                          d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                          fill="currentColor"
                        />
                      </svg>
                    </span> */}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card className="bg-black/40 border border-lime-500/20 backdrop-blur-md p-6">
            <p className="text-center text-lime-300">
              Activity feed coming soon!
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="rewards">
          <Card className="bg-black/40 border border-lime-500/20 backdrop-blur-md p-6">
            <p className="text-center text-lime-300">
              Rewards system coming soon!
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default Leaderboard;
