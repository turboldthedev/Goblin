"use client";
import { useEffect } from "react";

export default function ReferralHandler() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("referral_code");
    if (ref) {
      // Store in cookie (valid for 30 days)
      document.cookie = `referral=${ref}; path=/; max-age=2592000`;
    }
  }, []);

  return null;
}
