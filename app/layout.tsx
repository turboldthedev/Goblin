import type { Metadata } from "next";

import "./globals.css";
import CustomWagmiProvider from "@/provider/WagmiProvider";

export const metadata: Metadata = {
  title: "Goblin",
  description: "Generated by Turbold",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <CustomWagmiProvider>
        <body className={` antialiased`}>{children}</body>
      </CustomWagmiProvider>
    </html>
  );
}
