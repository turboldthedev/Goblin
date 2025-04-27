// lib/authConfig.ts
import { NextAuthOptions } from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";
import { jwt } from "./jwt";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      version: "2.0",
      authorization: { params: { prompt: "login" } },
    }),
  ],
  callbacks: {
    jwt,
    async session({ session, token }) {
      session.user = session.user || {};
      session.accessToken = token.accessToken as string;
      session.user.xUsername = token.xUsername as string;
      session.user.profileImage = token.profileImage as string;
      session.user.followersCount = token.followersCount as number;
      session.user.isAdmin = token.isAdmin as boolean;
      session.user.goblinPoints = token.goblinPoints as number;
      session.user.referralCode = token.referralCode as string;
      session.user.referralPoints = token.referralPoints as number;
      return session;
    },
  },

  // no adapter here
};
