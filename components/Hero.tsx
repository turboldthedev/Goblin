"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import { signIn, useSession } from "next-auth/react";
import { PiXLogoLight } from "react-icons/pi";
import { FC, useEffect, useState } from "react";
import LoginArea from "./LoginArea";
import { UserResponse } from "@/types";

interface SessionUser {
  image: string;
  name: string;
}

interface HeroProps {
  userRankData: UserResponse;
}
const Hero: FC<HeroProps> = ({ userRankData }) => {
  return (
    <section className="relative mx-auto max-w-6xl">
      <div className="container grid lg:grid-cols-2 gap-8 py-12">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Image
              src="/img/G3.png"
              width={200}
              height={200}
              alt="BOI Character"
              className="rounded-lg"
            />
          </div>
          <div className="space-y-4">
            <h1 className="text-xl font-bold flex items-center gap-2">
              Welcome to Goblin
            </h1>
            <p className="text-gray-400 max-w-md text-sm">
              To qualify for a spot, engage with our posts and share about BOI
              on X, tagging @boithebear.
            </p>
            <p className="text-gray-400 max-w-md text-sm">
              Higher rankings increase your chances but don't guarantee a spot.
              All applications are manually reviewed, and attempts to game the
              system will result in removal. Stay active and be authentic!
            </p>
          </div>
        </div>

        <LoginArea userRank={userRankData} />
      </div>
    </section>
  );
};

export default Hero;
