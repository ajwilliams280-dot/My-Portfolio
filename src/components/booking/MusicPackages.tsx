"use client";

import { useState } from "react";
import { Music, Mic, Headphones, Activity } from "lucide-react";
import { motion } from "framer-motion";
import BookingModal from "./BookingModal";

export default function MusicPackages() {
  const [selectedPackage, setSelectedPackage] = useState<{ name: string; basePrice: number } | null>(null);

  const packages = [
    {
      id: "beat",
      name: "Beat Making Session",
      icon: <Activity size={24} />,
      price: "Le 500 – Le 2,000",
      features: [
        "Custom beat (any genre)",
        "MP3 delivery",
        "Basic mixing",
        "Beat preview before final delivery"
      ],
      buttonText: "Book Beat Session",
      popular: false,
      basePrice: 500,
    },
    {
      id: "recording",
      name: "Recording Session",
      icon: <Mic size={24} />,
      price: "Le 1,500 – Le 3,500",
      features: [
        "Studio recording time",
        "Vocal recording assistance",
        "Basic mixing",
        "Vocal cleanup"
      ],
      buttonText: "Book Recording",
      popular: false,
      basePrice: 1500,
    },
    {
      id: "full",
      name: "Full Song Production",
      icon: <Headphones size={24} />,
      price: "Le 5,000 – Le 15,000+",
      features: [
        "Custom beat production",
        "Recording session",
        "Mixing & mastering",
        "High-quality WAV + MP3 export",
        "Full track completion"
      ],
      buttonText: "Book Full Production",
      popular: true,
      basePrice: 5000,
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-widest uppercase mb-4"
          >
            Music Production <span className="text-purple-500">Packages</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-foreground/60 text-lg tracking-wide"
          >
            Turn your ideas into professional sound.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-stretch justify-center">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedPackage({ name: pkg.name, basePrice: pkg.basePrice })}
              className={`relative group cursor-pointer rounded-[24px] p-8 bg-card border transition-all duration-500 hover:-translate-y-2 flex flex-col ${
                pkg.popular 
                  ? "border-accent shadow-[0_8px_32px_rgba(229,9,20,0.2)] hover:shadow-[0_16px_48px_rgba(229,9,20,0.4)]" 
                  : "border-border hover:border-accent/50 hover:shadow-[0_16px_48px_rgba(0,0,0,0.2)]"
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-xs font-bold uppercase tracking-widest py-1 px-4 rounded-full z-10 shadow-lg">
                  Premium
                </div>
              )}

              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-colors ${
                pkg.popular ? "bg-purple-500/20 text-purple-500" : "bg-foreground/5 text-foreground/80 group-hover:text-purple-500 group-hover:bg-purple-500/10"
              }`}>
                {pkg.icon}
              </div>

              <h3 className="text-xl font-bold uppercase tracking-wider mb-2">{pkg.name}</h3>
              <div className="text-2xl font-semibold text-purple-500 mb-6">{pkg.price}</div>

              <ul className="space-y-4 mb-8 flex-grow">
                {pkg.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-foreground/70">
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-purple-500/50 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button 
                className={`w-full py-4 rounded-lg font-bold uppercase tracking-widest text-sm transition-all duration-300 mt-auto ${
                  pkg.popular 
                    ? "bg-purple-500 text-white hover:bg-purple-400" 
                    : "bg-foreground/5 text-foreground hover:bg-purple-500 hover:text-white"
                }`}
              >
                {pkg.buttonText}
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      <BookingModal 
        isOpen={!!selectedPackage} 
        onClose={() => setSelectedPackage(null)} 
        selectedPackage={selectedPackage}
        serviceType="music"
      />
    </section>
  );
}
