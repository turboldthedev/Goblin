import { motion, useAnimation } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";
import AnimatedTitle from "./AnimatedTitle";

const stats = [
  { label: "Locked Mining", value: 30 },
  { label: "Locked Burn", value: 30 },
  { label: "Reserve", value: 10 },
  { label: "Liquidity Pool", value: 7 },
  { label: "Community Activate", value: 7 },
  { label: "Airdrop", value: 10 },
  { label: "Team", value: 6 },
];

const totalSupply = 1_000_000_000_000; // Total supply: one trillion

const AnimatedStats = () => {
  const [animatedValues, setAnimatedValues] = useState(stats.map(() => 0));
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true }); // Runs animation only once when in view

  useEffect(() => {
    if (isInView) {
      const interval = setInterval(() => {
        setAnimatedValues((prevValues) =>
          prevValues.map((val, index) =>
            val < stats[index].value ? val + 1 : stats[index].value
          )
        );
      }, 50);

      return () => clearInterval(interval);
    }
  }, [isInView]);

  return (
    <div ref={ref} className="py-24">
      <AnimatedTitle
        title="Goblinomics"
        className="mt-5 !text-primary text-2xl"
      />
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold text-white mt-4">
          Total Supply: {totalSupply.toLocaleString()} (1 Trillion)
        </h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 p-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="p-4 text-white rounded-xl shadow-lg text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: index * 0.2, duration: 0.5 }}
          >
            <h3 className="text-lg font-bold">{stat.label}</h3>
            <motion.p className="text-3xl font-extrabold text-primary">
              {animatedValues[index]}%
            </motion.p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AnimatedStats;
