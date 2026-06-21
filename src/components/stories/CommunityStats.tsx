"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Camera, Video, Music, Users, Star, Award } from "lucide-react";

interface CounterProps {
  end: number;
  label: string;
  icon: React.ReactNode;
  suffix?: string;
}

function Counter({ end, label, icon, suffix = "" }: CounterProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [count, setCount] = useState<number | string>(0);

  useEffect(() => {
    if (isInView) {
      if (end === 0) {
        setCount(0);
        return;
      }
      
      let start = 0;
      const duration = 2000;
      const increment = end / (duration / 16);
      const isFloat = end % 1 !== 0;
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(isFloat ? end.toFixed(1) : end);
          clearInterval(timer);
        } else {
          setCount(isFloat ? start.toFixed(1) : Math.ceil(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [isInView, end]);

  return (
    <div ref={ref} className="flex flex-col items-center text-center p-6 bg-card border border-border rounded-2xl">
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-accent/10 text-accent mb-4">
        {icon}
      </div>
      <h4 className="text-4xl font-bold tracking-tighter text-foreground mb-2">
        {count}
        {suffix}
      </h4>
      <p className="text-sm tracking-widest uppercase text-foreground/50">
        {label}
      </p>
    </div>
  );
}

export default function CommunityStats() {
  const stats = [
    { label: "Happy Clients", end: 150, icon: <Users size={24} />, suffix: "+" },
    { label: "Photos Delivered", end: 5000, icon: <Camera size={24} />, suffix: "+" },
    { label: "Videos Produced", end: 85, icon: <Video size={24} />, suffix: "" },
    { label: "Music Projects", end: 1, icon: <Music size={24} />, suffix: "" },
    { label: "Average Rating", end: 4.8, icon: <Star size={24} />, suffix: "" },
    { label: "Awards Won", end: 0, icon: <Award size={24} />, suffix: "" },
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Counter
                end={stat.end}
                label={stat.label}
                icon={stat.icon}
                suffix={stat.suffix}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
