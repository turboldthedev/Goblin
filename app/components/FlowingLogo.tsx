"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import AnimatedTitle from "./AnimatedTitle";

const logos = [
  "https://media.licdn.com/dms/image/v2/D4D12AQHwi4jdRd3fQQ/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1685279753620?e=2147483647&v=beta&t=YW7XR2IH5YitaLgvCDlC6rEOqSRzpVzgZ4BWONafvuU",
  "https://www.cdnlogo.com/logos/t/34/tailwind-css.svg",
  "https://media.licdn.com/dms/image/v2/D4D12AQHwi4jdRd3fQQ/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1685279753620?e=2147483647&v=beta&t=YW7XR2IH5YitaLgvCDlC6rEOqSRzpVzgZ4BWONafvuU",
  "https://media.licdn.com/dms/image/v2/D4D12AQHwi4jdRd3fQQ/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1685279753620?e=2147483647&v=beta&t=YW7XR2IH5YitaLgvCDlC6rEOqSRzpVzgZ4BWONafvuU",
  "https://media.licdn.com/dms/image/v2/D4D12AQHwi4jdRd3fQQ/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1685279753620?e=2147483647&v=beta&t=YW7XR2IH5YitaLgvCDlC6rEOqSRzpVzgZ4BWONafvuU",
];

const FlowingLogoSection = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [duplicatedLogos, setDuplicatedLogos] = useState([...logos, ...logos]);

  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const logoWidth = 64; // Adjust based on your logo's width (e.g., h-16 = 64px)
      const totalLogos = logos.length;
      const totalWidth = totalLogos * logoWidth;

      const duplicatesNeeded = Math.ceil(containerWidth / totalWidth) + 1;

      const newDuplicatedLogos = Array.from(
        { length: duplicatesNeeded },
        () => logos
      ).flat();
      setDuplicatedLogos(newDuplicatedLogos);
    }
  }, []);

  return (
    <div className="py-24">
      <AnimatedTitle
        title="Our Sponsors"
        className="mt-5 !text-primary text-4xl"
      />
      <div className="overflow-hidden relative mt-20" ref={containerRef}>
        <motion.div
          className="flex items-center space-x-12"
          animate={{
            x: ["0%", "-100%"],
          }}
          transition={{
            ease: "linear",
            duration: 20,
            repeat: Infinity,
          }}
        >
          {duplicatedLogos.map((logo, index) => (
            <motion.img
              key={index}
              src={logo}
              alt={`logo-${index}`}
              className="h-16 opacity-80 hover:opacity-100 transition-opacity duration-300"
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default FlowingLogoSection;
