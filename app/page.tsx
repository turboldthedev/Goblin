import NavBar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Leaderboard from "@/components/Leaderboard";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/authConfig";
import axios from "axios";

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
  console.log(usersRankData);
  return (
    <div className="min-h-screen bg-[#1C1C1C] text-white">
      {/* Navigation */}
      <NavBar />

      {/* Hero Section */}
      <Hero userRankData={userRankData} />
      {/* Leaderboard */}
      <Leaderboard usersRankData={usersRankData} />
    </div>
  );
}
