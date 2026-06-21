"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function DynamicBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 transition-colors duration-700">
      {/* Liquid blob 1 */}
      <motion.div
        animate={{
          x: [0, 100, -100, 0],
          y: [0, 150, -50, 0],
          scale: [1, 1.1, 0.9, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full mix-blend-normal filter blur-[100px] md:blur-[150px] opacity-70 dark:opacity-20 bg-accent/40 dark:bg-accent/20"
      />

      {/* Liquid blob 2 */}
      <motion.div
        animate={{
          x: [0, -120, 80, 0],
          y: [0, -100, 100, 0],
          scale: [1, 0.9, 1.2, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full mix-blend-normal filter blur-[100px] md:blur-[150px] opacity-70 dark:opacity-20 bg-blue-500/30 dark:bg-blue-600/20"
      />

      {/* Liquid blob 3 (Center subtle) */}
      <motion.div
        animate={{
          x: [0, 50, -50, 0],
          y: [0, 50, -50, 0],
          scale: [1, 1.2, 0.8, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5,
        }}
        className="absolute top-[30%] left-[30%] w-[40vw] h-[40vw] rounded-full mix-blend-normal filter blur-[120px] md:blur-[200px] opacity-60 dark:opacity-10 bg-purple-500/30 dark:bg-purple-600/20"
      />
      
      {/* Overlaid grain texture to give a premium matte finish to the background */}
      <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.02]" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}></div>
    </div>
  );
}
