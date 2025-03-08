"use client";

import { clsx } from "clsx";
import Image from "next/image";

export function BentoCard({
  dark = false,
  className = "",
  eyebrow,
  title,
  description,
  imgUrl,
  fade = [],
}: {
  dark?: boolean;
  className?: string;
  eyebrow: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  imgUrl: string;
  fade?: ("top" | "bottom")[];
}) {
  return (
    <div
      className={clsx(
        className,
        "group relative flex flex-col overflow-hidden rounded-lg",
        "bg-white ring-1 shadow-md ring-black/5",
        "data-dark:bg-gray-800 data-dark:ring-white/15"
      )}
    >
      <div className="relative h-80 shrink-0">
        <Image
          width={300}
          height={100}
          src={imgUrl}
          alt="bento"
          className="w-full h-full"
        />
        {fade.includes("top") && (
          <div className="absolute inset-0 bg-linear-to-b from-white to-50% group-data-dark:from-gray-800 group-data-dark:from-[-25%]" />
        )}
        {fade.includes("bottom") && (
          <div className="absolute inset-0 bg-linear-to-t from-white to-50% group-data-dark:from-gray-800 group-data-dark:from-[-25%]" />
        )}
      </div>
      <div className="relative p-10">
        <h3 className="font-mono text-xs/5 font-semibold tracking-widest text-gray-500 uppercase data-dark:text-gray-400">
          {eyebrow}
        </h3>

        <p className="mt-1 text-2xl/8 font-medium tracking-tight text-primary group-data-dark:text-white">
          {title}
        </p>

        {description}
      </div>
    </div>
  );
}
