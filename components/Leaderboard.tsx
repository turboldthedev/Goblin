import React, { FC } from "react";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
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
  return (
    <section className="py-8 max-w-6xl mx-auto">
      <div className="bg-opacity-50 rounded-lg overflow-hidden">
        {/* Search Bar */}
        <div className="p-4 flex items-center gap-4 bg-[#5B8B5B]">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Search..."
              className="w-full bg-black bg-opacity-50 border-none text-white placeholder:text-gray-400"
            />
            <Search
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>
        </div>

        {/* Header */}
        <div className="grid grid-cols-12 px-4 py-3 bg-[#5B8B5B] text-sm font-medium">
          <div className="col-span-1">Rank</div>
          <div className="col-span-8">User</div>
          <div className="col-span-3 text-right">Paw Points</div>
        </div>

        {/* Leaderboard Entries */}
        <div className="divide-y divide-gray-700">
          {usersRankData?.rankedUsers.map((user) => (
            <div
              key={user._id}
              className="grid grid-cols-12 px-4 py-4 items-center hover:bg-white/5"
            >
              <div className="col-span-1 text-gray-400 text-xs">
                #{user.rank}
              </div>
              <div className="col-span-8 flex items-center gap-3">
                <Image
                  src={user.profileImage || "/img/goblin-contact2.webp"}
                  width={40}
                  height={40}
                  quality={90}
                  layout="intrinsic" // Maintain the aspect ratio and quality
                  alt={user.xUsername}
                  className="rounded-full"
                />
                <div>
                  <div className="font-medium text-xs">{user.xUsername}</div>
                  <div className="text-xs text-gray-400">
                    @{user.xUsername.toLowerCase()}
                  </div>
                </div>
              </div>
              <div className="col-span-3 text-right flex items-center justify-end gap-2 text-xs">
                {user.goblinPoints.toLocaleString()}{" "}
                <span className="text-yellow-500">🐾</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Leaderboard;
