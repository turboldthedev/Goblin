"use client";

import { useEffect, useState } from "react";
import { BrowserProvider, Contract, formatEther, formatUnits } from "ethers";
import { Button } from "./ui/button";

const tokenContractAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
const erc20ABI = [
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)",
];

const WalletConnect = () => {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [address, setAddress] = useState("");
  const [ethBalance, setEthBalance] = useState("0");
  const [tokenBalance, setTokenBalance] = useState("0");
  const [connected, setConnected] = useState(false);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const newProvider = new BrowserProvider(window.ethereum);
        setProvider(newProvider);
        setConnected(true);
      } catch (err) {
        console.error("User rejected connection:", err);
      }
    } else {
      alert("MetaMask not found. Please install it.");
    }
  };

  useEffect(() => {
    if (!provider) return;

    const loadBalances = async () => {
      try {
        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();
        setAddress(userAddress);

        const eth = await provider.getBalance(userAddress);
        setEthBalance(formatEther(eth));

        const token = new Contract(tokenContractAddress, erc20ABI, provider);
        const rawTokenBalance = await token.balanceOf(userAddress);
        const decimals = await token.decimals();
        setTokenBalance(formatUnits(rawTokenBalance, decimals));
      } catch (error) {
        console.error("Failed to load balances:", error);
      }
    };

    loadBalances();
  }, [provider]);

  return (
    <div className="text-white p-4  rounded-lg max-w-md mx-auto mt-8 ">
      {!connected ? (
        <Button
          onClick={connectWallet}
          className="px-4 py-2 bg-primary hover:bg-green-700 rounded text-white font-bold">
          Connect Wallet
        </Button>
      ) : (
        <div>
          <p>
            <strong>Wallet:</strong> {address}
          </p>
          <p>
            <strong>ETH Balance:</strong> {parseFloat(ethBalance).toFixed(4)}{" "}
            ETH
          </p>
          <p>
            <strong>Token Balance:</strong>{" "}
            {parseFloat(tokenBalance).toFixed(2)} USDT
          </p>
        </div>
      )}
    </div>
  );
};

export default WalletConnect;
