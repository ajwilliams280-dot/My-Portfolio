"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface PortalTransitionProps {
  onComplete: () => void;
  targetUrl?: string;
}

export default function PortalTransition({ onComplete, targetUrl = "/work" }: PortalTransitionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();
  
  const [phase, setPhase] = useState<"activation" | "portal" | "journey" | "reveal" | "arrival">("activation");
  const [showText, setShowText] = useState(false);
  const [isShortVersion, setIsShortVersion] = useState(false);

  useEffect(() => {
    // Check session storage
    const hasVisited = sessionStorage.getItem("altonsworld_visited");
    let shortVersion = false;
    if (hasVisited) {
      shortVersion = true;
      setIsShortVersion(true);
    } else {
      sessionStorage.setItem("altonsworld_visited", "true");
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    window.addEventListener('resize', () => {
      width = window.innerWidth;
      height = window.innerHeight;
      if (canvas) {
        canvas.width = width;
        canvas.height = height;
      }
    });

    const numStars = 800;
    const stars: { x: number, y: number, z: number, px: number, py: number }[] = [];
    
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: (Math.random() - 0.5) * 2000,
        y: (Math.random() - 0.5) * 2000,
        z: Math.random() * 2000,
        px: 0,
        py: 0
      });
    }

    let speed = 0;
    let animationFrameId: number;
    let startTime = performance.now();

    // Timings - made slower and more cinematic
    const tActivation = shortVersion ? 200 : 1500;
    const tPortal = shortVersion ? 400 : 3000;
    const tJourney = shortVersion ? 600 : 5500;
    const tReveal = shortVersion ? 800 : 7000;
    const tArrival = shortVersion ? 1000 : 8500;

    // Audio Context setup for ethereal ascending chant
    let audioCtx: AudioContext | null = null;
    const activeOscillators: OscillatorNode[] = [];

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioCtx = new AudioContextClass();
      
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const masterGain = audioCtx.createGain();
      masterGain.connect(audioCtx.destination);
      
      const journeyDuration = tArrival / 1000;

      // Master volume envelope: start immediately, swell, then fade
      masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.3); // Quick fade in
      masterGain.gain.linearRampToValueAtTime(0.8, audioCtx.currentTime + journeyDuration * 0.7); // Swell
      masterGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + journeyDuration); // Fade out

      // Filter for the "opening universe" effect
      const filter = audioCtx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(300, audioCtx.currentTime); // Start muffled
      // Filter opens up to bright frequencies over time
      filter.frequency.exponentialRampToValueAtTime(4000, audioCtx.currentTime + journeyDuration * 0.8);
      filter.connect(masterGain);

      // Create an angelic chord
      // Base frequency (e.g., 220Hz - A3)
      const baseFreq = 220; 
      const frequencies = [
        baseFreq,         // Root
        baseFreq * 1.5,   // Perfect 5th
        baseFreq * 2,     // Octave
        baseFreq * 2.5,   // Major 3rd (octave up)
        baseFreq * 3      // Perfect 5th (octave up)
      ];

      frequencies.forEach((freq, i) => {
        // Create 2 oscillators per note for chorusing/detune effect
        for (let j = 0; j < 2; j++) {
          const osc = audioCtx!.createOscillator();
          const oscGain = audioCtx!.createGain();
          
          osc.type = "triangle"; // Softer, more vocal-like than sine
          
          // Slight detune
          const detune = (j === 0 ? 1 : -1) * (Math.random() * 4 + 2);
          osc.frequency.setValueAtTime(freq + detune, audioCtx!.currentTime);
          
          // Ascend pitch slightly over the journey to feel like ascending/opening
          osc.frequency.exponentialRampToValueAtTime((freq + detune) * 1.25, audioCtx!.currentTime + journeyDuration);

          // Balance volumes (higher notes are quieter)
          oscGain.gain.value = (1 / (frequencies.length * 2)) * (1 - (i * 0.15));

          osc.connect(oscGain);
          oscGain.connect(filter);
          
          osc.start();
          osc.stop(audioCtx!.currentTime + journeyDuration);
          activeOscillators.push(osc);
        }
      });
    } catch (e) {
      console.warn("Audio context not supported or failed", e);
    }

    const render = (time: number) => {
      const elapsed = time - startTime;

      // Phase Management
      if (elapsed < tActivation) {
        if (phase !== "activation") setPhase("activation");
        speed = 2;
      } else if (elapsed < tPortal) {
        if (phase !== "portal") setPhase("portal");
        // Accelerate more slowly
        speed += (25 - speed) * 0.02;
      } else if (elapsed < tJourney) {
        if (phase !== "journey") setPhase("journey");
        speed = 25; // Slower warp speed (was 50)
      } else if (elapsed < tReveal) {
        if (phase !== "reveal") {
          setPhase("reveal");
          setShowText(true);
        }
        // Decelerate
        speed += (2 - speed) * 0.05;
      } else if (elapsed < tArrival) {
        if (phase !== "arrival") setPhase("arrival");
      } else {
        // Complete
        cancelAnimationFrame(animationFrameId);
        window.location.href = targetUrl;
        setTimeout(() => {
          onComplete();
        }, 500); // Give router time to mount new page
        return;
      }

      // Draw
      ctx.fillStyle = `rgba(0, 0, 0, ${speed > 20 ? 0.2 : 0.8})`; // Trails effect
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      for (let i = 0; i < numStars; i++) {
        let star = stars[i];
        
        star.z -= speed;

        if (star.z <= 0) {
          star.x = (Math.random() - 0.5) * 2000;
          star.y = (Math.random() - 0.5) * 2000;
          star.z = 2000;
          star.px = cx + (star.x / star.z) * 100;
          star.py = cy + (star.y / star.z) * 100;
        }

        const x = cx + (star.x / star.z) * 500;
        const y = cy + (star.y / star.z) * 500;

        const pz = star.z + speed;
        const px = cx + (star.x / pz) * 500;
        const py = cy + (star.y / pz) * 500;

        // Draw star
        const size = Math.max(0.1, (1 - star.z / 2000) * 3);
        const intensity = 1 - star.z / 2000;
        
        ctx.beginPath();
        if (speed > 10) {
          // Lines for warp
          ctx.moveTo(px, py);
          ctx.lineTo(x, y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${intensity})`;
          ctx.lineWidth = size;
          ctx.stroke();
        } else {
          // Dots
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${intensity})`;
          ctx.fill();
        }

        star.px = x;
        star.py = y;
      }

      // Draw central glow/singularity in early phases
      if (elapsed > 0 && elapsed < tPortal) {
        const progress = elapsed / tPortal;
        const radius = Math.max(0.1, progress * 50);
        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius * 3);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${1 - progress})`);
        gradient.addColorStop(0.2, `rgba(100, 200, 255, ${0.8 * (1 - progress)})`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      activeOscillators.forEach(osc => {
        try {
          osc.stop();
          osc.disconnect();
        } catch (e) {}
      });
      if (audioCtx && audioCtx.state !== 'closed') {
        try { audioCtx.close(); } catch (e) {}
      }
    };
  }, [router, targetUrl, onComplete, isShortVersion]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] bg-black text-white overflow-hidden flex items-center justify-center pointer-events-auto"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      
      {/* Reveal Text */}
      <AnimatePresence>
        {showText && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative z-10 flex flex-col items-center justify-center text-center px-4"
          >
            <h1 className="text-5xl md:text-8xl font-bold tracking-[0.2em] uppercase text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.8)]">
              AltonsWorld
            </h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="mt-6 text-xl md:text-2xl tracking-widest uppercase text-white/80 font-light drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
            >
              Where Creativity Becomes Reality
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skip Button */}
      <button 
        onClick={() => {
          window.location.href = targetUrl;
          onComplete();
        }}
        className="absolute bottom-8 right-8 z-20 px-6 py-2 border border-white/20 rounded-full text-xs tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300"
      >
        Skip Intro
      </button>

      {/* Arrival Flash */}
      <AnimatePresence>
        {phase === "arrival" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-30 bg-white"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
