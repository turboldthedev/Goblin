"use client";

import { useState, useRef, ReactNode, MouseEvent } from "react";
import { TiLocationArrow } from "react-icons/ti";
import { BentoCard } from "./BentoCard";

// BentoTilt Props Type
type BentoTiltProps = {
  children: ReactNode;
  className?: string;
};

export const BentoTilt: React.FC<BentoTiltProps> = ({
  children,
  className = "",
}) => {
  const [transformStyle, setTransformStyle] = useState<string>("");
  const itemRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!itemRef.current) return;

    const { left, top, width, height } =
      itemRef.current.getBoundingClientRect();
    const relativeX = (event.clientX - left) / width;
    const relativeY = (event.clientY - top) / height;

    const tiltX = (relativeY - 0.5) * 5;
    const tiltY = (relativeX - 0.5) * -5;

    const newTransform = `perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(.95, .95, .95)`;
    setTransformStyle(newTransform);
  };

  const handleMouseLeave = () => {
    setTransformStyle("");
  };

  return (
    <div
      ref={itemRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: transformStyle }}
    >
      {children}
    </div>
  );
};

const Features: React.FC = () => (
  <section className=" pb-52 ">
    <div className="container mx-auto px-3 md:px-10">
      <div className="px-5 py-32">
        <p className="font-circular-web text-lg text-primary">
          Into the Metagame Layer
        </p>
        <p className="max-w-md font-circular-web text-lg  opacity-50">
          Immerse yourself in a rich and ever-expanding universe where a vibrant
          array of products converge into an interconnected overlay experience
          on your world.
        </p>
      </div>

      <div className=" grid grid-cols-1 gap-4  lg:grid-cols-6 lg:grid-rows-2">
        <BentoTilt className="max-lg:rounded-t-4xl lg:col-span-3 lg:rounded-tl-4xl">
          <BentoCard
            eyebrow="Insight"
            title="40% community-owned, 30% burned"
            imgUrl="/img/contact-1.webp"
            fade={["bottom"]}
            className="max-lg:rounded-t-4xl lg:col-span-3 lg:rounded-tl-4xl"
          />
        </BentoTilt>
        <BentoTilt className="lg:col-span-3 lg:rounded-tr-4xl">
          <BentoCard
            eyebrow="Analysis"
            title=" A community-driven meme coin"
            imgUrl="/img/contact-1.webp"
            fade={["bottom"]}
          />
        </BentoTilt>
        <BentoTilt className="lg:col-span-2 lg:rounded-bl-4xl">
          <BentoCard
            eyebrow="Speed"
            title="Supporting the NFT industry.
            Ways to make coin using NFTs:"
            description={
              <ul className="list-disc pl-5 mt-2 max-w-[600px] text-sm/6 text-gray-600 group-data-dark:text-gray-400">
                <li>Cross-chain opportunities</li>
                <li>The next generation of MEME coins.</li>
              </ul>
            }
            imgUrl="/img/contact-1.webp"
          />
        </BentoTilt>
        <BentoTilt className="lg:col-span-2">
          <BentoCard
            eyebrow="Source"
            title="Get the furthest reach"
            imgUrl="/img/contact-1.webp"
          />
        </BentoTilt>
        <BentoTilt className="max-lg:rounded-b-4xl lg:col-span-2 lg:rounded-br-4xl">
          <BentoCard
            eyebrow="Limitless"
            title="Sell globally"
            imgUrl="/img/contact-1.webp"
          />
        </BentoTilt>
      </div>
    </div>
  </section>
);

export default Features;
