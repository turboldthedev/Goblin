"use client";

import React, { FC, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Award, LogOut, Twitter, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BrowserProvider, Contract, formatEther, formatUnits } from "ethers";

const tokenContractAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
const erc20ABI = [
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)",
];

interface LoginAreaProps {}

const WalletConnect: FC<LoginAreaProps> = () => {
  const { data: session, status } = useSession();

  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [ethBalance, setEthBalance] = useState("0");
  const [tokenBalance, setTokenBalance] = useState("0");
  const [walletConnected, setWalletConnected] = useState(false);

  const handleConnectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const newProvider = new BrowserProvider(window.ethereum);
        setProvider(newProvider);
        setWalletConnected(true);
        localStorage.setItem("walletConnected", "true");
      } catch (err) {
        console.error("User rejected connection:", err);
      }
    } else {
      alert("MetaMask not found. Please install it.");
    }
  };

  const handleDisconnectWallet = () => {
    localStorage.removeItem("walletConnected");
    setProvider(null);
    setWalletAddress("");
    setEthBalance("0");
    setTokenBalance("0");
    setWalletConnected(false);
  };

  useEffect(() => {
    const previouslyConnected = localStorage.getItem("walletConnected");
    if (previouslyConnected === "true") {
      handleConnectWallet();
    }
  }, []);

  useEffect(() => {
    if (!provider) return;

    const loadBalances = async () => {
      try {
        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();
        setWalletAddress(userAddress);

        const eth = await provider.getBalance(userAddress);
        setEthBalance(formatEther(eth));

        const token = new Contract(tokenContractAddress, erc20ABI, provider);
        const rawTokenBalance = await token.balanceOf(userAddress);
        const decimals = await token.decimals();
        setTokenBalance(formatUnits(rawTokenBalance, decimals));

        if (session?.user?.xUsername) {
          await fetch(`/api/users/${session.user.xUsername}/wallet`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ walletAddress: userAddress }),
          });
        }
      } catch (error) {
        console.error("Failed to load balances or save wallet:", error);
      }
    };

    loadBalances();
  }, [provider]);

  if (status === "loading") {
    return <p className="text-center text-lime-300">Loading...</p>;
  }

  return (
    <Card className="bg-black/40 border border-lime-500/20 backdrop-blur-md overflow-hidden">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            {/* <h3 className="text-xl font-semibold text-lime-300">Wallet</h3> */}
            {walletConnected && (
              <Button
                variant="ghost"
                size="sm"
                className="text-lime-400 hover:text-lime-300 hover:bg-lime-500/10"
                onClick={handleDisconnectWallet}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Disconnect
              </Button>
            )}
          </div>

          {walletConnected ? (
            <>
              <div className="p-3 bg-black/60 rounded-lg border border-lime-500/20">
                <p className="text-xs text-lime-300/70 font-mono break-all">
                  {walletAddress || "Not connected"}
                </p>
              </div>
            </>
          ) : (
            // <div className="space-y-6">
            //   <div className="text-center space-y-2">
            //     <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-lime-500/30 bg-lime-500/10 mb-2">
            //       <Wallet className="h-6 w-6 text-lime-400" />
            //     </div>
            //     <h3 className="text-lg font-medium text-lime-300">
            //       Connect Your Wallet
            //     </h3>
            //     <p className="text-sm text-lime-300/70">
            //       Connect your wallet to access exclusive NFT features and track
            //       your assets
            //     </p>
            //   </div>

            //   <div className="space-y-4">
            //     <div className="grid grid-cols-1 gap-3">
            //       {[
            //         "View your NFT collection",
            //         "Trade and mint new Goblin NFTs",
            //         "Earn rewards and climb the leaderboard",
            //       ].map((text, i) => (
            //         <div key={i} className="flex items-start gap-3">
            //           <div className="flex h-6 w-6 items-center justify-center rounded-full bg-lime-500/20 text-lime-400">
            //             <svg
            //               xmlns="http://www.w3.org/2000/svg"
            //               width="14"
            //               height="14"
            //               viewBox="0 0 24 24"
            //               fill="none"
            //               stroke="currentColor"
            //               strokeWidth="2"
            //               strokeLinecap="round"
            //               strokeLinejoin="round"
            //             >
            //               <polyline points="20 6 9 17 4 12"></polyline>
            //             </svg>
            //           </div>
            //           <p className="text-sm text-lime-300/80">{text}</p>
            //         </div>
            //       ))}
            //     </div>

            //     <Button
            //       className="w-full bg-lime-500 hover:bg-lime-600 text-black font-medium"
            //       onClick={handleConnectWallet}
            //     >
            //       <Wallet className="h-4 w-4 mr-2" />
            //       Connect Wallet
            //     </Button>
            //   </div>
            // </div>
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-lime-500/30 bg-lime-500/10 mb-2">
                  <Award className="h-6 w-6 text-lime-400" />
                </div>
                <h3 className="text-lg font-medium text-lime-300">
                  How to earn points
                </h3>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-lime-500/20 text-lime-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <p className="text-sm text-lime-300/80">
                      Follow the GoblinBNB account
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-lime-500/20 text-lime-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <p className="text-sm text-lime-300/80">
                      Make a post and mention GoblinBNB
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-lime-500/20 text-lime-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <p className="text-sm text-lime-300/80">
                      Comment, reply, or retweet GoblinBNB's posts
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-black/60 rounded-lg border border-lime-500/20 text-center">
                  <p className="text-sm text-lime-300/80 italic">
                    Points will be updated every 24 hours
                  </p>
                </div>

                <Button
                  className="w-full bg-lime-500 hover:bg-lime-600 text-black font-medium"
                  onClick={() =>
                    window.open("https://twitter.com/GoblinBNB", "_blank")
                  }
                >
                  <Twitter className="h-4 w-4 mr-2" />
                  Visit GoblinBNB on Twitter
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletConnect;
