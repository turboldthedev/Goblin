"use client";

import clsx from "clsx";
import gsap from "gsap";
import { useWindowScroll } from "react-use";
import { useEffect, useRef, useState } from "react";
import { BrowserProvider, formatEther, formatUnits, Contract } from "ethers";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  ChevronDown,
  Copy,
  ExternalLink,
  LogOut,
  Wallet,
  Wallet2Icon,
} from "lucide-react";
import { Button } from "./ui/button";

const navItems = ["Buy", "About", "Contact"];

const NavBar = () => {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // Refs for audio and navigation container (Typed)
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const navContainerRef = useRef<HTMLDivElement | null>(null);

  const { y: currentScrollY } = useWindowScroll();
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [address, setAddress] = useState("");
  const [ethBalance, setEthBalance] = useState("0");
  const [tokenBalance, setTokenBalance] = useState("0");

  // Sample ERC-20 contract address (USDT on Ethereum mainnet)
  const tokenContractAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
  // Minimal ABI required to get balanceOf and decimals
  const erc20ABI = [
    "function balanceOf(address account) view returns (uint256)",
    "function decimals() view returns (uint8)",
  ];

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // Prompt user to connect their wallet
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const newProvider = new BrowserProvider(window.ethereum);
        setProvider(newProvider);
      } catch (err) {
        console.error("User rejected request:", err);
      }
    } else {
      alert(
        "No Web3 provider found. Please install MetaMask or another wallet."
      );
    }
  };

  // Once a provider is set, fetch balances
  useEffect(() => {
    if (!provider) return;

    const loadBalances = async () => {
      try {
        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();
        setAddress(userAddress);

        // Get ETH balance
        const balanceBN = await provider.getBalance(userAddress);
        const balanceInEth = formatEther(balanceBN);
        setEthBalance(balanceInEth);

        // Get ERC-20 token balance
        const tokenContract = new Contract(
          tokenContractAddress,
          erc20ABI,
          provider
        );
        const rawTokenBalance = await tokenContract.balanceOf(userAddress);
        const decimals = await tokenContract.decimals();
        const tokenBalanceReadable = formatUnits(rawTokenBalance, decimals);
        setTokenBalance(tokenBalanceReadable);
      } catch (err) {
        console.error("Error loading balances:", err);
      }
    };

    loadBalances();
  }, [provider]);

  // Toggle audio and visual indicator

  // Manage audio playback
  useEffect(() => {
    if (audioElementRef.current) {
      if (isAudioPlaying) {
        audioElementRef.current.play();
      } else {
        audioElementRef.current.pause();
      }
    }
  }, [isAudioPlaying]);

  useEffect(() => {
    if (!navContainerRef.current) return; // Ensure ref exists

    if (currentScrollY === 0) {
      setIsNavVisible(true);
      navContainerRef.current.classList.remove("floating-nav");
    } else if (currentScrollY > lastScrollY) {
      setIsNavVisible(false);
      navContainerRef.current.classList.add("floating-nav");
    } else if (currentScrollY < lastScrollY) {
      setIsNavVisible(true);
      navContainerRef.current.classList.add("floating-nav");
    }

    setLastScrollY(currentScrollY);
  }, [currentScrollY, lastScrollY]);

  useEffect(() => {
    if (navContainerRef.current) {
      gsap.to(navContainerRef.current, {
        y: isNavVisible ? 0 : -100,
        opacity: isNavVisible ? 1 : 0,
        duration: 0.2,
      });
    }
  }, [isNavVisible]);

  return (
    <div
      ref={navContainerRef}
      className="fixed inset-x-0 top-4 z-50 h-16 border-none transition-all duration-700 sm:inset-x-6"
    >
      <header className="absolute top-1/2 w-full -translate-y-1/2">
        <nav className="flex size-full items-center justify-between p-4">
          {/* Logo and Product button */}
          <div className="flex items-center gap-7">
            <img src="/img/logo.png" alt="logo" className="w-48 h-22 " />
          </div>

          <div className="flex h-full items-center">
            <div className="hidden md:flex items-center ">
              {!address ? (
                <button
                  onClick={connectWallet}
                  className={clsx(
                    "group relative z-10 w-fit cursor-pointer overflow-hidden rounded-full bg-primary px-7 py-3 text-black"
                  )}
                >
                  <span className="relative inline-flex overflow-hidden font-general text-xs uppercase">
                    <div className="translate-y-0 skew-y-0 transition duration-500 group-hover:translate-y-[-160%] group-hover:skew-y-12">
                      Connect Wallet
                    </div>
                    <div className="absolute translate-y-[164%] skew-y-12 transition duration-500 group-hover:translate-y-0 group-hover:skew-y-0">
                      Connect Wallet
                    </div>
                  </span>
                </button>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button
                      variant="secondary"
                      className="bg-[#F0B90B] hover:bg-[#F0B90B]/90 text-black"
                    >
                      <Wallet className="mr-2 h-4 w-4" />
                      Wallet
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-auto">
                    <DropdownMenuLabel>Wallet Details</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Address:
                      </span>
                      <span className="font-mono">{address}</span>
                      <Copy className="ml-2 h-4 w-4" />
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        ETH Balance:
                      </span>
                      <span className="font-mono">{ethBalance}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Token Balance (USDT):
                      </span>
                      <span className="font-mono">{tokenBalance}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-500">
                      <LogOut className="mr-2 h-4 w-4" />
                      Disconnect
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <a href="mining" className="nav-hover-btn">
                Mining
              </a>
              {navItems.map((item, index) => (
                <a
                  key={index}
                  href={`#${item.toLowerCase()}`}
                  className="nav-hover-btn"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default NavBar;
