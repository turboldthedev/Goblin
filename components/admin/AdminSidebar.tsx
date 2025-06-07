"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  SettingsIcon,
  UsersIcon,
  BoxIcon,
  ChevronLeftIcon,
} from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { useRouter } from "next/navigation";

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const items: SidebarItem[] = [
    { label: "Dashboard", href: "/admin", icon: <HomeIcon size={18} /> },
    { label: "Box", href: "/admin/box", icon: <BoxIcon size={18} /> },
  ];

  return (
    <aside className="w-64 border-r z-10">
      <div className="p-4 border-b">
        <button
          onClick={() => router.push("/")}
          className="flex items-center text-sm font-medium bg-gradient-to-r from-lime-300 to-lime-500 text-transparent bg-clip-text hover:text-white group"
        >
          <ChevronLeftIcon
            size={20}
            className="mr-2 text-lime-400 group-hover:text-white"
          />
          Back
        </button>
      </div>
      <ScrollArea className="h-full">
        <nav className="p-4 space-y-1">
          {items.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  group flex items-center px-3 py-2 text-sm font-medium rounded-md 
                  transition-colors 
                  ${isActive ? "bg-primary text-black" : "bg-gradient-to-r from-lime-300 to-lime-500 text-transparent bg-clip-text hover:bg-primary hover:text-white"}
                `}
              >
                <span
                  className={`mr-3 ${isActive ? "text-gray-900" : "text-lime-400"}`}
                >
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
    </aside>
  );
}
