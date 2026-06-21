"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const packages = [
  {
    name: "Basic Portfolio / Landing Page",
    price: "Le 5,000+",
    description: "Perfect for personal brands and small businesses needing an online presence.",
    features: [
      "Responsive Modern Design",
      "Up to 3 Pages",
      "Contact Form Integration",
      "Basic SEO Optimization",
      "Mobile Friendly",
      "1 Month Free Support"
    ],
    highlighted: false,
  },
  {
    name: "Business / E-commerce",
    price: "Le 10,000+",
    description: "Ideal for growing businesses and stores needing to sell products online.",
    features: [
      "Custom E-commerce Store",
      "Product Catalog & Cart",
      "Payment Gateway Integration",
      "Admin Dashboard",
      "Advanced SEO",
      "3 Months Free Support"
    ],
    highlighted: true,
  },
  {
    name: "Custom Web / Mobile App",
    price: "Le 20,000+",
    description: "For unique ideas requiring complex features and full-stack architecture.",
    features: [
      "Full-Stack Web or Mobile App",
      "User Authentication",
      "Database Architecture",
      "Custom APIs",
      "High Performance",
      "6 Months Free Support"
    ],
    highlighted: false,
  }
];

export default function PricingTable() {
  return (
    <div className="py-12 mt-12 border-t border-border/50">
      <div className="text-center mb-16">
        <h3 className="text-3xl font-bold tracking-widest uppercase mb-4">
          Software Development Packages
        </h3>
        <p className="text-foreground/60 max-w-2xl mx-auto">
          Choose a package that fits your needs. Prices are estimated starting points in Leones.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {packages.map((pkg, index) => (
          <motion.div
            key={pkg.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className={`relative rounded-3xl p-8 flex flex-col h-full transition-transform duration-300 hover:-translate-y-2 ${
              pkg.highlighted 
                ? "bg-gradient-to-br from-accent/20 to-background border-2 border-accent shadow-[0_0_30px_rgba(var(--accent),0.2)]" 
                : "bg-card border border-border"
            }`}
          >
            {pkg.highlighted && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent text-accent-foreground px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase">
                Most Popular
              </div>
            )}
            
            <div className="mb-8">
              <h4 className="text-xl font-bold mb-2">{pkg.name}</h4>
              <p className="text-sm text-foreground/60 h-10">{pkg.description}</p>
            </div>
            
            <div className="mb-8">
              <span className="text-4xl font-black tracking-tight">{pkg.price}</span>
            </div>
            
            <div className="flex-grow space-y-4 mb-8">
              {pkg.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground/80">{feature}</span>
                </div>
              ))}
            </div>
            
            <button 
              className={`w-full py-4 rounded-xl font-bold tracking-widest uppercase text-sm transition-all duration-300 ${
                pkg.highlighted
                  ? "bg-accent text-accent-foreground hover:bg-accent/90"
                  : "bg-foreground/10 hover:bg-foreground/20 text-foreground"
              }`}
              onClick={() => window.location.href = "mailto:altonsworld20@gmail.com"}
            >
              Contact to Start
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
