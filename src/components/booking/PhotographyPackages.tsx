"use client";

import { useState } from "react";
import { Camera, Image as ImageIcon, Sparkles, PartyPopper, Star } from "lucide-react";
import { motion } from "framer-motion";
import BookingModal from "./BookingModal";

export default function PhotographyPackages() {
  const [selectedPackage, setSelectedPackage] = useState<{ name: string; basePrice: number } | null>(null);

  const packages = [
    {
      id: "starter",
      name: "Starter Portrait Session",
      icon: <Camera size={24} />,
      price: "Le 500 – Le 800",
      features: [
        "1 hour shoot",
        "1 location",
        "1 outfit",
        "5 edited photos",
        "Basic retouching"
      ],
      buttonText: "Book Starter",
      popular: false,
      basePrice: 500,
    },
    {
      id: "standard",
      name: "Standard Portrait Session",
      icon: <ImageIcon size={24} />,
      price: "Le 1,000 – Le 1,800",
      features: [
        "1–2 hour shoot",
        "2 outfit changes",
        "15 edited photos",
        "Color grading + retouching"
      ],
      buttonText: "Book Standard",
      popular: true,
      basePrice: 1000,
    },
    {
      id: "premium",
      name: "Premium Portrait Session",
      icon: <Sparkles size={24} />,
      price: "Le 2,500 – Le 4,000",
      features: [
        "2–3 hour shoot",
        "Multiple poses & setups",
        "3 outfit changes",
        "30 edited photos",
        "Advanced cinematic editing"
      ],
      buttonText: "Book Premium",
      popular: false,
      basePrice: 2500,
    },
    {
      id: "event",
      name: "Event Photography Package",
      icon: <PartyPopper size={24} />,
      price: "Le 2,000 – Le 5,000",
      features: [
        "2–5 hours coverage",
        "Full event storytelling",
        "25 edited photos"
      ],
      buttonText: "Book Event",
      popular: false,
      basePrice: 2000,
    },
    {
      id: "event-premium",
      name: "Full Event Premium Package",
      icon: <Star size={24} />,
      price: "Le 5,000 – Le 8,000+",
      features: [
        "4–8 hours coverage",
        "Priority shooting",
        "50 edited photos",
        "Highlight selection editing"
      ],
      buttonText: "Book Premium Event",
      popular: false,
      basePrice: 5000,
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-widest uppercase mb-4"
          >
            Photography <span className="text-accent">Packages</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-foreground/60 text-lg tracking-wide"
          >
            Choose a package based on the number of edited photos you want.
          </motion.p>
        </div>

        {/* 
          Using grid for the cards. 
          It will be 1 column on mobile, 2 columns on tablet, and 3 columns on large screens. 
          To make 5 items look good in a 3-column grid, we can let them wrap normally.
        */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch justify-center">
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
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-white text-xs font-bold uppercase tracking-widest py-1 px-4 rounded-full z-10 shadow-lg">
                  Most Popular
                </div>
              )}

              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-colors ${
                pkg.popular ? "bg-accent/20 text-accent" : "bg-foreground/5 text-foreground/80 group-hover:text-accent group-hover:bg-accent/10"
              }`}>
                {pkg.icon}
              </div>

              <h3 className="text-xl font-bold uppercase tracking-wider mb-2">{pkg.name}</h3>
              <div className="text-2xl font-semibold text-accent mb-6">{pkg.price}</div>

              <ul className="space-y-4 mb-8 flex-grow">
                {pkg.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-foreground/70">
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-accent/50 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button 
                className={`w-full py-4 rounded-lg font-bold uppercase tracking-widest text-sm transition-all duration-300 mt-auto ${
                  pkg.popular 
                    ? "bg-accent text-white hover:bg-accent/80" 
                    : "bg-foreground/5 text-foreground hover:bg-accent hover:text-white"
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
        serviceType="photography"
      />
    </section>
  );
}
