import NextAuth, { DefaultSession, DefaultUser, DefaultJWT } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: DefaultSession["user"] & {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      followersCount?: number;
      xUsername?: string;
      profileImage?: string;
      referralCode: string;
      goblinPoints?: number;
      referralPoints: number;
      isAdmin: boolean;
    };
  }

  interface User extends DefaultUser {
    accessToken?: string;
    xUsername: string;
    followersCount: number;
    profileImage: string;
    isAdmin: boolean;
    referralCode: string;
    goblinPoints?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    accessToken?: string;
    followersCount?: number;
    xUsername?: string;
    profileImage?: string;
    goblinPoints?: number;
    referralCode: string;
    referralPoints: number;
    isAdmin: boolean;
  }
}
