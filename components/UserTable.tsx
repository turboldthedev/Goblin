"use client";

import { FC } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/types";

interface UserTableProps {
  users: User[];
  onPointChange: (_id: string, newPoints: number) => void;
}

const UserTable: FC<UserTableProps> = ({ users, onPointChange }) => {
  return (
    <Card className="bg-black/40 border border-lime-500/20 backdrop-blur-md overflow-hidden">
      <CardHeader className="border-b border-lime-500/20 bg-black/60 py-4">
        <div className="grid grid-cols-12 gap-4 text-lime-300 font-medium">
          <div className="col-span-1">No.</div>
          <div className="col-span-3">Username</div>
          <div className="col-span-2 text-center">Followers</div>
          <div className="col-span-3 text-center">Goblin Points</div>
          <div className="col-span-3 text-center">Wallet Address</div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-lime-500/10">
          {users.map((user, index) => (
            <div
              key={user._id}
              className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-lime-500/5 transition"
            >
              <div className="col-span-1 font-bold">#{index + 1}</div>
              <div className="col-span-3 flex items-center gap-3">
                <Avatar className="border-2 border-lime-500/30">
                  <AvatarImage
                    src={user.profileImage || "/placeholder.svg"}
                    alt={user.xUsername}
                  />
                  <AvatarFallback className="bg-lime-500/20 text-lime-300">
                    {user.xUsername.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user.xUsername}</p>
                  <p className="text-xs text-lime-400/70">
                    @{user.xUsername.toLowerCase()}
                  </p>
                </div>
              </div>
              <div className="col-span-2 text-center">
                {user.followersCount.toLocaleString()}
              </div>
              <div className="col-span-3 text-center">
                <Input
                  type="number"
                  value={user.goblinPoints}
                  onChange={(e) =>
                    onPointChange(user._id, parseInt(e.target.value, 10))
                  }
                  className="bg-black/60 border-lime-500/20 focus:border-lime-500/50 text-lime-100 text-center"
                />
              </div>
              <div className="col-span-3 text-center text-sm text-lime-300 break-all">
                {user.metamaskWalletAddress || "—"}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserTable;
