"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedTitle from "./AnimatedTitle";
import AnimatedStats from "./AnimatedStats";

gsap.registerPlugin(ScrollTrigger);

const Text = () => {
  const imgRef = useRef(null);

  useEffect(() => {
    if (!imgRef.current) return;

    gsap.fromTo(
      imgRef.current,
      { opacity: 0, y: 100, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 3,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: imgRef.current,
          start: "top 70%",
          end: "top 50%",
          scrub: true,
        },
      }
    );
  }, []);

  return (
    <section className="bg-black">
      <div className="container mx-auto px-3 md:px-10">
        <div className="px-5 py-32">
          <AnimatedTitle
            title="Mining = Burning"
            className="mt-5 !text-primary text-2xl"
          />
          <p className="font-circular-web text-lg text-blue-50 opacity-50 mt-10">
            A total of 60% of the supply will be locked. Users from the top
            1,000 NFT projects across the top 10 chains can mine 30% of the
            total supply over five years. The remaining 30% will be burned. The
            burning process will match the amount of mined coins. For example,
            in the first year, if 6% of the supply is mined, then 6% from the
            burn pool will also be burned and removed from the total supply.
          </p>

          <div className="rounded-[calc(var(--radius)+var(--padding))] ring-1 shadow-xs ring-black/5 pt-10">
            <img
              ref={imgRef}
              alt="Goblin Coin"
              src="/img/contact-2.webp"
              className="h-full rounded-md ring-1 shadow-2xl ring-black/10"
            />
          </div>
        </div>
      </div>
      <AnimatedStats />
    </section>
  );
};

export default Text;
