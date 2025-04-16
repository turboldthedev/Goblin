import type { JWT } from "next-auth/jwt";
import type { Account, Profile, User } from "next-auth";
import axios from "axios";
import { connectToDatabase } from "@/lib/mongodb";
import UserModel from "@/lib/models/user.model";
import { cookies } from "next/headers";
import { generateGoblinPoints } from "./utils";

const ADMIN_USERNAMES = ["TurboldDev", "hiisverHQ"];

export const jwt = async ({
  token,
  account,
}: {
  token: JWT;
  user?: User;
  account?: Account | null;
  profile?: Profile;
  isNewUser?: boolean;
}): Promise<JWT> => {
  if (account?.access_token) {
    token.accessToken = account.access_token;

    try {
      // Fetch Twitter user data.
      const response = await axios.get("https://api.twitter.com/2/users/me", {
        headers: {
          Authorization: `Bearer ${account.access_token}`,
        },
        params: {
          "user.fields": "public_metrics,profile_image_url",
        },
      });

      const userData = response.data?.data;
      token.followersCount = userData?.public_metrics?.followers_count || 0;
      token.xUsername = userData?.username || "";
      token.profileImage = userData?.profile_image_url || "";
      token.isAdmin = ADMIN_USERNAMES.includes(userData?.username);

      const normalizedUsername = (userData?.username || "").replace(/\s/g, "");
      await connectToDatabase();
      const existingUser = await UserModel.findOne({
        xUsername: normalizedUsername,
      }).lean();

      if (!existingUser) {
        const cookieStore = await cookies();
        const referralCode = cookieStore.get("referral")?.value;
        if (referralCode) {
          token.followersCount = 120;
          const newUserGoblinPoints = generateGoblinPoints(
            token.followersCount as number
          );
          const bonusPoints = Math.floor(newUserGoblinPoints * 0.05);
          token.goblinPoints = newUserGoblinPoints;
          const referringUser = await UserModel.findOne({ referralCode });
          if (referringUser) {
            referringUser.goblinPoints += bonusPoints;
            referringUser.referralPoints += bonusPoints;
            await referringUser.save();
            console.log(
              `Awarded ${bonusPoints} bonus points to referring user (${referralCode})`
            );
          }
        }
      }
    } catch (error) {
      console.error("Error fetching Twitter user data:", error);
    }
  }
  return token;
};

export default jwt;
