import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateGoblinPoints = (followersCount: number): number => {
  if (followersCount >= 100 && followersCount < 1000) {
    return Math.floor(Math.random() * (1000 - 100 + 1)) + 100; // 100 to 1000 points
  } else if (followersCount >= 1000 && followersCount < 10000) {
    return Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000; // 1000 to 10000 points
  } else if (followersCount >= 10000) {
    return Math.floor(Math.random() * (1000000 - 100000 + 1)) + 100000; // 100000 to 1000000 points
  }
  return 0; // Default to 0 if the count doesn't match any range
};

export const generateReferralCode = (): string => {
  const length = 6;
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};
