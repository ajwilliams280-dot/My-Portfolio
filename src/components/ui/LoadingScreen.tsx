"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time (e.g. waiting for fonts/media)
    const timeout = setTimeout(() => {
      setLoading(false);
      setTimeout(onComplete, 800); // Wait for exit animation
    }, 2500);

    return () => clearTimeout(timeout);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: loading ? 1 : 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background pointer-events-none"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <h1 className="text-4xl md:text-6xl font-bold tracking-[0.2em] text-foreground uppercase">
          Altonsworld
        </h1>
        <motion.div
          className="mt-6 h-[2px] bg-accent"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, ease: "easeInOut" }}
          style={{ maxWidth: "200px" }}
        />
      </motion.div>
    </motion.div>
  );
}
