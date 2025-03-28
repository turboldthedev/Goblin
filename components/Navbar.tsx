"use client";

import Image from "next/image";

const NavBar = () => {
  return (
    <nav className=" px-8 py-5">
      <div className="container flex items-center justify-between ">
        <div className="flex items-center gap-2">
          <Image
            src="/img/logo.png"
            width={50}
            height={50}
            alt="$Goblin"
            className="rounded-full"
          />
          <h1 className="text-xl font-bold">Goblin</h1>
        </div>
        <div className="flex gap-6 text-gray-300 text-xs">
          <a href="#" className="hover:text-white">
            Grindboard
          </a>
          <a href="#" className="hover:text-white">
            Boi Club
          </a>
          <a href="#" className="hover:text-white">
            Gallery
          </a>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
