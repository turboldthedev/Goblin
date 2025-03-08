// app/mining/page.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import { useAccount, useBalance, useConnect, useDisconnect } from "wagmi";
import { Copy, Wallet, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Label } from "@/app/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";

export default function MiningPage() {
  const { address, isConnected: wagmiConnected } = useAccount();
  //   const { data: balance } = useBalance({ address });
  const [balance, setBalance] = useState(1000);
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const [isConnected, setIsConnected] = useState(false);
  const [ethAmount, setEthAmount] = useState("");
  const [duration, setDuration] = useState("");
  const [status, setStatus] = useState("");
  const [minedAmount, setMinedAmount] = useState<string[]>([]); // Store "mined" amounts
  const [miningSessions, setMiningSessions] = useState<number>(0); // Track active sessions

  const injectedConnector = useMemo(() => connectors[0], [connectors]);

  // Sync isConnected with Wagmi after mount to avoid hydration mismatch
  useEffect(() => {
    setIsConnected(wagmiConnected);
  }, [wagmiConnected]);

  const handleMining = async () => {
    if (!isConnected || !ethAmount || !duration) {
      setStatus("Please connect wallet and fill all fields.");
      return;
    }

    const amountToMine = Number(ethAmount);
    if (isNaN(amountToMine) || amountToMine <= 0) {
      setStatus("Please enter a valid ETH amount.");
      return;
    }

    if (amountToMine > balance) {
      setStatus("Insufficient balance for mining.");
      return;
    }

    try {
      setStatus("Processing mining request...");
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 1-second delay

      // Update state: deduct from localBalance, add to minedAmount, increment sessions
      setBalance((prev) => prev - amountToMine);
      setMinedAmount((prev) => [...prev, ethAmount]);
      setMiningSessions((prev) => prev + 1);

      setStatus("Mining simulation completed successfully!");
      setEthAmount("");
      setDuration("");
    } catch (error: any) {
      console.error(error);
      setStatus(`Error: ${error.message || "Simulation failed."}`);
    }
  };

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setStatus("Address copied to clipboard!");
    }
  };

  // Calculate total mined for stats
  const totalMined = minedAmount
    .reduce((sum, amount) => sum + Number(amount), 0)
    .toFixed(4);

  // Determine displayed balance: real balance if connected, otherwise localBalance

  const displayedBalanceUSD = (Number(balance) * 2000).toFixed(2);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Wallet Info Card */}
          <Card className="border-slate-700/50 bg-slate-900/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-white">
                <Wallet className="h-5 w-5" />
                Wallet Info
              </CardTitle>
              <CardDescription>
                View your wallet details and balance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-sm text-slate-400">Address</Label>
                <div className="flex items-center justify-between rounded-lg bg-slate-800/50 p-3">
                  <code className="text-sm text-slate-300">
                    {isConnected && address
                      ? `${address.slice(0, 6)}...${address.slice(-4)}`
                      : "Not connected"}
                  </code>
                  {isConnected && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-white"
                            onClick={handleCopyAddress}
                          >
                            <Copy className="h-4 w-4" />
                            <span className="sr-only">Copy address</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Copy wallet address</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-slate-400">Balance</Label>
                <div className="flex items-baseline justify-between rounded-lg bg-slate-800/50 p-3">
                  <div className="text-2xl font-bold text-white">
                    {balance} ETH
                  </div>
                  <div className="text-sm text-slate-400">
                    ≈ ${displayedBalanceUSD} USD
                  </div>
                </div>
              </div>

              {isConnected ? (
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => disconnect()}
                >
                  Disconnect Wallet
                </Button>
              ) : (
                <Button
                  variant="default"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => connect({ connector: injectedConnector })}
                >
                  Connect Wallet
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Mining Controls Card */}
          <Card className="border-slate-700/50 bg-slate-900/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-white">
                <Clock className="h-5 w-5" />
                Start Mining
              </CardTitle>
              <CardDescription>
                Configure your mining parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-sm text-slate-400">
                  Amount (ETH)
                </Label>
                <div className="relative">
                  <Input
                    id="amount"
                    type="number"
                    placeholder="e.g., 0.1"
                    value={ethAmount}
                    onChange={(e) => setEthAmount(e.target.value)}
                    className="bg-slate-800/50 border-slate-700 text-white"
                  />
                  <div className="absolute right-3 top-2.5 text-sm text-slate-400">
                    ETH
                  </div>
                </div>
                <p className="text-xs text-slate-400">Minimum: 0.01 ETH</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration" className="text-sm text-slate-400">
                  Duration (seconds)
                </Label>
                <div className="relative">
                  <Input
                    id="duration"
                    type="number"
                    placeholder="e.g., 3600"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="bg-slate-800/50 border-slate-700 text-white"
                  />
                  <div className="absolute right-3 top-2.5 text-sm text-slate-400">
                    sec
                  </div>
                </div>
                <p className="text-xs text-slate-400">
                  Maximum: 86400 seconds (24 hours)
                </p>
              </div>

              {status && (
                <div
                  className={`rounded-lg p-4 text-sm ${
                    status.includes("Error")
                      ? "bg-red-500/10 text-red-200"
                      : "bg-blue-500/10 text-blue-200"
                  }`}
                >
                  <div className="flex gap-2 text-white">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <p>{status}</p>
                  </div>
                </div>
              )}

              <Button
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                onClick={handleMining}
                disabled={!isConnected || !ethAmount || !duration}
              >
                Start Mining
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Mining Stats Section */}
        <Card className="border-slate-700/50 bg-slate-900/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-xl text-white">
              Mining Statistics
            </CardTitle>
            <CardDescription>
              View your mining performance and history
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg bg-slate-800/50 p-4">
                <div className="text-sm text-slate-400">Total Mined</div>
                <div className="mt-2 text-2xl font-bold text-white">
                  {totalMined} ETH
                </div>
              </div>
              <div className="rounded-lg bg-slate-800/50 p-4">
                <div className="text-sm text-slate-400">Active Sessions</div>
                <div className="mt-2 text-2xl font-bold text-white">
                  {miningSessions}
                </div>
              </div>
              <div className="rounded-lg bg-slate-800/50 p-4">
                <div className="text-sm text-slate-400">Success Rate</div>
                <div className="mt-2 text-2xl font-bold text-white">
                  {miningSessions > 0 ? "100%" : "0%"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
