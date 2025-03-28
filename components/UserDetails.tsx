"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { PiXLogoLight } from "react-icons/pi";
import { Button } from "@/components/ui/button";
import { FC, useEffect, useState } from "react";

import { UserResponse } from "@/types";
import WalletConnect from "./WalletConnect";

interface LoginAreaProps {
  userRank: UserResponse;
}
const UserDetails: FC<LoginAreaProps> = ({ userRank }) => {
  const { data: session, status } = useSession();

  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-6 p-8">
      {status === "authenticated" ? (
        // Display this if the user is logged in
        <div className="space-y-4 flex flex-col items-center">
          <h2 className="text-2xl font-bold">
            Welcome back, {session?.user?.name}!
          </h2>
          {error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <>
              <div className="text-lg">
                Your current rank:{" "}
                <span className="font-bold">
                  #{userRank.rank || "Loading..."}
                </span>
              </div>
              <div className="text-lg">
                Your Paw Points:{" "}
                <span className="font-bold">
                  {userRank.user.goblinPoints || 0}
                </span>
              </div>
            </>
          )}
          <p className="text-gray-400">
            Keep tweeting with #boithebear to climb the leaderboard!
          </p>
         <WalletConnect/>
          <Button
            className="bg-[#5B8B5B] hover:bg-[#4A7A4A] px-6 py-3 rounded-md flex items-center"
            onClick={() => signOut()}>
            Sign out
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Curious about your rank?</h2>
            <h3 className="text-xl font-bold">Ready to connect?</h3>
          </div>
          <div className="text-lg">
            Join the <span className="font-bold">134476</span> people that have
            already connected...
          </div>
          <Button
            className="bg-[#5B8B5B] hover:bg-[#4A7A4A] px-6 py-3 rounded-md flex items-center"
            onClick={() => signIn("twitter")}>
            Connect your <PiXLogoLight className="ml-2" /> account
          </Button>
          <p className="text-gray-400">Don't be late, join Boi!</p>
        </>
      )}
    </div>
  );
};

export default UserDetails;
