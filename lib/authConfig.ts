import { NextAuthOptions } from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";
import User from "@/lib/models/user.model";
import { connectToDatabase } from "./mongodb";
import { jwt } from "./jwt";

export const authOptions: NextAuthOptions = {
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      version: "2.0",
    }),
  ],
  callbacks: {
    jwt,
    async session({ session, token }) {
      if (!session.user) {
        session.user = { isAdmin: false };
      }

      session.accessToken = token.accessToken as string;
      session.user.followersCount = token.followersCount as number;
      session.user.xUsername = token.xUsername as string;
      session.user.profileImage = token.profileImage as string;
      session.user.isAdmin = token.isAdmin as boolean;

      await connectToDatabase();
      try {
        const normalizedUsername =
          session.user.xUsername?.replace(/\s/g, "") || "";
        const existingUser = await User.findOne({
          xUsername: normalizedUsername,
        });

        if (!existingUser) {
          session.user.followersCount = 102;
          const goblinPoints = generateGoblinCoins(session.user.followersCount);

          await User.create({
            xUsername: normalizedUsername,
            followersCount: session.user.followersCount || 0,
            goblinPoints,
            profileImage: session.user.profileImage,
            lastUpdated: new Date(),
          });
          console.log(`Created new user: ${normalizedUsername}`);
        } else {
          await User.updateOne(
            { xUsername: normalizedUsername },
            {
              $set: {
                followersCount: session.user.followersCount || 0,
                profileImage: session.user.profileImage,
              },
            }
          );
        }
      } catch (error) {
        console.error("Error handling user in session callback:", error);
      }

      return session;
    },
  },
};

const generateGoblinCoins = (followersCount: number): number => {
  if (followersCount >= 100 && followersCount < 1000) {
    return Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000;
  } else if (followersCount >= 1000 && followersCount < 10000) {
    return Math.floor(Math.random() * (100000 - 10000 + 1)) + 10000;
  } else if (followersCount >= 10000) {
    return Math.floor(Math.random() * (1000000 - 100000 + 1)) + 100000;
  }
  return 0; // Default case for users with < 100 followers
};

export default authOptions;
