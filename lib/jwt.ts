import type { JWT } from "next-auth/jwt";
import type { Account, Profile } from "next-auth";
import axios from "axios";
import { connectToDatabase } from "./mongodb";
import { cookies } from "next/headers";
import { generateGoblinPoints, generateReferralCode } from "./utils";
import User from "@/lib/models/user.model";

const BONUS_PERCENT = 0.05;

export async function jwt({
  token,
  account,
}: {
  token: JWT;
  account?: Account | null;
  profile?: Profile;
}): Promise<JWT> {
  // on initial sign in
  if (account?.access_token) {
    const { data } = await axios.get("https://api.twitter.com/2/users/me", {
      headers: { Authorization: `Bearer ${account.access_token}` },
      params: { "user.fields": "public_metrics,profile_image_url" },
    });
    const u = data.data;
    const username = u.username.replace(/\s+/g, "");
    const followers = u.public_metrics.followers_count;

    token.xUsername = username;
    token.profileImage = u.profile_image_url;
    token.followersCount = followers;
    token.isAdmin = [
      "TurboldDev",
      "hiisverHQ",
      "LavaMAYC",
      "bananatheart",
    ].includes(u.username);

    // 3) upsert your own user record
    await connectToDatabase();
    let dbUser = await User.findOne({ xUsername: username });

    if (!dbUser) {
      // brand new user!

      const startingPoints = generateGoblinPoints(followers);
      const referralCode = generateReferralCode();
      token.goblinPoints = startingPoints;
      token.referralCode = referralCode;
      token.referralPoints = 0;

      dbUser = await User.create({
        xUsername: username,
        followersCount: followers,
        goblinPoints: startingPoints,
        referralCode,
        referralPoints: 0,
        profileImage: u.profile_image_url,
        lastUpdated: new Date(),
      });

      const cookieStore = await cookies();
      const ref = cookieStore.get("referral")?.value;
      if (ref) {
        const bonus = Math.floor(startingPoints * BONUS_PERCENT);
        await User.updateOne(
          { referralCode: ref },
          { $inc: { goblinPoints: bonus, referralPoints: bonus } }
        );
      }
    } else {
      token.goblinPoints = dbUser.goblinPoints;
      token.referralCode = dbUser.referralCode;
      token.referralPoints = dbUser.referralPoints;
    }
  }

  return token;
}
