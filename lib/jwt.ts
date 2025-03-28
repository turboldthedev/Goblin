import type { JWT } from "next-auth/jwt";
import type { Account, Profile, User } from "next-auth";
import axios from "axios";

const ADMIN_USERNAMES = ["TurboldDev", "yourAdminXusername2"];

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

      // Optional: admin flag
      token.isAdmin = ADMIN_USERNAMES.includes(userData?.username);
    } catch (error) {
      console.error("Error fetching Twitter user data:", error);
    }
  }

  return token;
};
