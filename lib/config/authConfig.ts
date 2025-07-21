// lib/authConfig.ts
import type { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import TwitterProvider from "next-auth/providers/twitter";
import { SignJWT, jwtVerify } from "jose";
import { jwt as upsertJwtToken } from "../utils/jwt";
import { loadSecrets } from "../load-secrets";

const ALGORITHM = "HS256";

const secrets = await loadSecrets();
console.log("=== SECRETS ===");
console.log(secrets);

export const authOptions: NextAuthOptions = {
  secret: secrets.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    async encode({ token, secret, maxAge }): Promise<string> {
      const now = Math.floor(Date.now() / 1000);
      const claims = {
        iat: now,
        exp: now + (maxAge as number),
        ...token,
      };
      return new SignJWT(claims)
        .setProtectedHeader({ alg: ALGORITHM })
        .sign(new TextEncoder().encode(secret as string));
    },
    async decode({ token, secret }): Promise<JWT | null> {
      try {
        const { payload } = await jwtVerify(
          token!,
          new TextEncoder().encode(secret as string),
          { algorithms: [ALGORITHM] }
        );
        return payload as JWT;
      } catch {
        return null;
      }
    },
  },

  providers: [
    TwitterProvider({
      clientId: secrets.TWITTER_CLIENT_ID!,
      clientSecret: secrets.TWITTER_CLIENT_SECRET!,
      version: "2.0",
      authorization: { params: { prompt: "login" } },
    }),
  ],

  callbacks: {
    // runs on every JWT create/update
    async jwt({ token, account, profile }) {
      // -- your existing upsert / profile logic --
      token = await upsertJwtToken({ token, account, profile });

      // carry forward the OAuth access_token
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }

      return token;
    },

    // make token data available in `session`
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
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: false,
        sameSite: "lax",
        path: "/",
        domain:
          secrets.NODE_ENV === "production" ? ".goblinbox.com" : "localhost",
      },
    },
  },
};
