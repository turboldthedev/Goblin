import { NextAuthOptions } from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";
import User from "@/lib/models/user.model";
import { connectToDatabase } from "./mongodb";
import { jwt } from "./jwt";
import { generateReferralCode } from "./utils";

export const authOptions: NextAuthOptions = {
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      version: "2.0",
      authorization: {
        url: "https://twitter.com/i/oauth2/authorize",
        params: {
          prompt: "login",
        },
      },
    }),
  ],
  callbacks: {
    jwt,
    async session({ session, token }) {
      // Initialize session.user with default values
      if (!session.user) {
        session.user = { isAdmin: false, referralCode: "" };
      }

      session.accessToken = token.accessToken as string;
      session.user.followersCount = token.followersCount as number;
      session.user.xUsername = token.xUsername as string;
      session.user.profileImage = token.profileImage as string;
      session.user.isAdmin = token.isAdmin as boolean;
      session.user.goblinPoints = token.goblinPoints as number;
      await connectToDatabase();
      try {
        const normalizedUsername =
          session.user.xUsername?.replace(/\s/g, "") || "";
        const existingUser = await User.findOne({
          xUsername: normalizedUsername,
        });

        if (!existingUser) {
          session.user.followersCount = 120;

          const referralCode = generateReferralCode();
          session.user.referralCode = referralCode;

          await User.create({
            xUsername: normalizedUsername,
            followersCount: session.user.followersCount || 0,
            goblinPoints: session.user.goblinPoints,
            referralCode,
            profileImage: session.user.profileImage,
            lastUpdated: new Date(),
          });

          console.log(`Created new user: ${normalizedUsername}`);
        } else {
          session.user.referralCode = existingUser.referralCode || "";

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

export default authOptions;
