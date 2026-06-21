"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion } from "framer-motion";
import ToolsAndSoftware from "@/components/about/ToolsAndSoftware";

export default function AboutPage() {
  const [profileData, setProfileData] = useState({
    profileImageUrl: "/images/about_profile.jpg",
    name: "Alton James Williams",
    identity: "Cinematographer · Photographer · Music Producer"
  });

  useEffect(() => {
    if (!db) return;
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, "settings", "profile");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfileData({
            profileImageUrl: data.profileImageUrl || "/images/about_profile.jpg",
            name: data.name || "Alton James Williams",
            identity: data.identity || "Cinematographer · Photographer · Music Producer"
          });
        }
      } catch (err) {
        console.error("Error fetching profile", err);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 min-h-[80vh]">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        
        {/* Dynamic Image Side */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden border border-foreground/10 group shadow-[0_0_40px_rgba(229,9,20,0.1)]"
        >
          <Image
            src={profileData.profileImageUrl}
            alt={profileData.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            unoptimized
          />
          <div className="absolute inset-0 bg-accent/20 mix-blend-overlay pointer-events-none group-hover:opacity-0 transition-opacity duration-700" />
        </motion.div>
        
        {/* Text Details Side */}
        <motion.div
           initial={{ opacity: 0, x: 50 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.4em] text-accent mb-4 font-medium">
              Welcome to My Universe
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-widest uppercase mb-2">
              <span className="text-accent">{profileData.name}</span>
            </h1>
            <h2 className="text-xl md:text-2xl text-foreground/50 tracking-widest uppercase font-light">
              {profileData.identity}
            </h2>
          </div>

          <div className="space-y-6 text-foreground/70 tracking-wide text-lg font-light leading-relaxed">
            <p>
              Creativity has always been a big part of who I am. Whether I&apos;m behind a camera, creating music, or working on a new project, I&apos;m driven by the passion to tell stories, capture moments, and create experiences that people can connect with.
            </p>
            <p>
              My journey is a blend of art and technology, where cinematic visuals, photography, music, and innovation come together. Every project is an opportunity to learn, grow, and share a piece of my perspective with the world.
            </p>
            <p>
              This is my universe — a space built on creativity, curiosity, and the belief that every story deserves to be told.
            </p>
            <p className="text-foreground/90 font-medium">
              Welcome to my world.
            </p>

            {/* Signature styling for name */}
            <div className="mt-8 pt-8">
              <p className="text-3xl font-serif italic text-foreground/40 mb-10 tracking-widest">
                - {profileData.name}
              </p>
            </div>

            <div className="pt-6 border-t border-foreground/10">
              <h3 className="text-xl font-bold tracking-widest uppercase text-foreground mb-4">Core Competencies</h3>
              <ul className="grid grid-cols-2 gap-4 text-sm md:text-base">
                {["Cinematography", "Color Grading", "Film Photography", "Digital Imaging", "Beat Production", "Sound Design"].map((skill) => (
                  <li key={skill} className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Tools & Software Section */}
      <ToolsAndSoftware />
    </div>
  );
}
