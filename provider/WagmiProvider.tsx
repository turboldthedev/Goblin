// wagmi.config.ts (or @/wagmi.config.ts)
"use client";

import { createConfig, WagmiProvider } from "wagmi";
import { mainnet } from "wagmi/chains";
import { injected } from "@wagmi/connectors";
import { http } from "viem";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const config = createConfig({
  chains: [mainnet],
  connectors: [injected()],
  transports: {
    [mainnet.id]: http(),
  },
});

// Create a single QueryClient instance
const queryClient = new QueryClient();
export default function CustomWagmiProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>{children}</WagmiProvider>
    </QueryClientProvider>
  );
}
