import type { Metadata } from "next";
import "./globals.css";
import CustomWagmiProvider from "@/provider/WagmiProvider";
import SessionProvider from "../provider/AuthProvider";
import { getServerSession } from "next-auth";
import { connectToDatabase } from "@/lib/mongodb";
import authOptions from "@/lib/authConfig";

import { Toaster } from "@/components/ui/toaster";
import { ThemeClientProvider } from "@/components/ui/theme-provider";

export const metadata: Metadata = {
  title: "Goblin",
  description: "Generated by Turbold",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <CustomWagmiProvider>
          <SessionProvider session={session}>
            <ThemeClientProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster />
            </ThemeClientProvider>
          </SessionProvider>
        </CustomWagmiProvider>
      </body>
    </html>
  );
}
