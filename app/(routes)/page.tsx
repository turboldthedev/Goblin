import { getServerSession } from "next-auth";
import axios from "axios";
import GoblinCharacter from "@/components/GoblinCharacter";
import UserDetails from "@/components/UserDetails";
import Leaderboard from "@/components/Leaderboard";
import { authOptions } from "@/lib/authConfig";

export default async function Home() {
  const session = await getServerSession(authOptions);

  let userRankData;
  if (session) {
    const userRes = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/${session?.user.xUsername}`
    );
    userRankData = userRes.data;
  }

  const usersRes = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users`
  );
  const usersRankData = usersRes.data;

  return (
    <div className="min-h-screen  text-white overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-900/20 via-black to-black"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-lime-500 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-lime-500 to-transparent"></div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8 md:py-16">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
          {/* Left Column - Goblin Character */}
          <GoblinCharacter userRankData={userRankData} />
          {/* Right Column - User Info */}
          <UserDetails userRank={userRankData} />
        </div>

        {/* Leaderboard Section */}
        <Leaderboard usersRankData={usersRankData} />
      </main>
    </div>
  );
}
