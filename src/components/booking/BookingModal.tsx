"use client";

import { useState, useEffect, useMemo } from "react";
import { X, Send, CheckCircle, AlertCircle, Plus, Minus, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage: { name: string; basePrice: number } | null;
  serviceType: "photography" | "videography" | "music";
}

const ADDONS = {
  photography: {
    quantities: [
      { id: "extraPhotos", label: "Extra Edited Photos", price: 75, max: 50 },
      { id: "extraLocations", label: "Additional Locations", price: 500, max: 10 },
      { id: "extraOutfits", label: "Additional Outfit Changes", price: 150, max: 10 },
    ],
    selects: [
      {
        id: "transportation", label: "Transportation Fee",
        options: [
          { label: "Within Town", price: 0 },
          { label: "Nearby Area", price: 200 },
          { label: "Outside Town", price: 500 },
          { label: "Long Distance", price: 1000 },
        ]
      },
      {
        id: "delivery", label: "Express Delivery",
        options: [
          { label: "Standard Delivery (3-7 Days)", price: 0 },
          { label: "72 Hours", price: 250 },
          { label: "48 Hours", price: 500 },
          { label: "24 Hours", price: 1000 },
          { label: "Same Day Delivery", price: 1500 },
        ]
      },
      {
        id: "extraTime", label: "Additional Shooting Time",
        options: [
          { label: "None", price: 0 },
          { label: "+30 Minutes", price: 250 },
          { label: "+1 Hour", price: 500 },
          { label: "+2 Hours", price: 1000 },
          { label: "+3 Hours", price: 1500 },
        ]
      }
    ],
    booleans: [
      { id: "skinRetouching", label: "Skin Retouching", price: 300 },
      { id: "objectRemoval", label: "Object Removal", price: 200 },
      { id: "bgCleanup", label: "Background Cleanup", price: 200 },
      { id: "colorGrading", label: "High-End Color Grading", price: 300 },
      { id: "magazineStyle", label: "Magazine Style Editing", price: 500 },
    ]
  },
  videography: {
    quantities: [
      { id: "extraShootingTime", label: "Extra Shooting Time (Hours)", price: 500, max: 10 },
      { id: "extraCameraOp", label: "Additional Camera Operator", price: 1000, max: 5 },
    ],
    selects: [
      {
        id: "drone", label: "Drone Coverage",
        options: [
          { label: "None", price: 0 },
          { label: "15 Minutes", price: 500 },
          { label: "30 Minutes", price: 1000 },
          { label: "1 Hour", price: 2000 },
        ]
      },
    ],
    booleans: [
      { id: "tiktok", label: "TikTok Version", price: 200 },
      { id: "igReel", label: "Instagram Reel Version", price: 200 },
      { id: "ytShorts", label: "YouTube Shorts Version", price: 200 },
    ]
  },
  music: {
    quantities: [
      { id: "extraRecording", label: "Extra Recording Time (Hours)", price: 500, max: 10 },
      { id: "extraRevisions", label: "Extra Revisions", price: 100, max: 50 },
    ],
    selects: [
      {
        id: "coverArt", label: "Cover Art Design",
        options: [
          { label: "None", price: 0 },
          { label: "Basic", price: 300 },
          { label: "Premium", price: 500 },
          { label: "Professional", price: 1000 },
        ]
      },
      {
        id: "lyricVideo", label: "Lyric Video",
        options: [
          { label: "None", price: 0 },
          { label: "Basic", price: 1000 },
          { label: "Premium", price: 2000 },
        ]
      },
      {
        id: "visualizer", label: "Music Visualizer",
        options: [
          { label: "None", price: 0 },
          { label: "Standard", price: 1000 },
          { label: "Advanced", price: 2000 },
        ]
      }
    ],
    booleans: []
  }
};

export default function BookingModal({ isOpen, onClose, selectedPackage, serviceType }: BookingModalProps) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    location: "",
    genre: "",
    notes: "",
    description: "",
  });
  
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [booleans, setBooleans] = useState<Record<string, boolean>>({});

  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStatus("idle");
      setQuantities({});
      
      const initialSelections: Record<string, string> = {};
      ADDONS[serviceType].selects.forEach(sel => {
        initialSelections[sel.id] = sel.options[0].label;
      });
      setSelections(initialSelections);
      setBooleans({});
    }
  }, [isOpen, serviceType, selectedPackage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const currentAddons = ADDONS[serviceType];

  const { totalCost, lineItems } = useMemo(() => {
    if (!selectedPackage) return { totalCost: 0, lineItems: [] };
    let total = selectedPackage.basePrice;
    let items: string[] = [];

    // Quantities
    currentAddons.quantities.forEach(q => {
      const qty = quantities[q.id] || 0;
      if (qty > 0) {
        const cost = qty * q.price;
        total += cost;
        items.push(`${q.label}: ${qty} × Le ${q.price} = Le ${cost}`);
      }
    });

    // Selections
    currentAddons.selects.forEach(s => {
      const selectedLabel = selections[s.id] || s.options[0].label;
      const option = s.options.find(opt => opt.label === selectedLabel);
      if (option && option.price > 0) {
        total += option.price;
        items.push(`${s.label}: ${option.label} = Le ${option.price}`);
      }
    });

    // Booleans
    currentAddons.booleans.forEach(b => {
      if (booleans[b.id]) {
        total += b.price;
        items.push(`${b.label} = Le ${b.price}`);
      }
    });

    return { totalCost: total, lineItems: items };
  }, [selectedPackage, quantities, selections, booleans, currentAddons]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "d55180b2-76e2-4568-8801-291e1a6d52ec",
          name: form.name,
          email: form.email || "No email provided",
          subject: `New Booking Request: ${selectedPackage?.name} — Altonsworld`,
          message: `
Booking Details:
----------------
Package: ${selectedPackage?.name}
Base Price: Le ${selectedPackage?.basePrice}

Client Information:
-------------------
Name: ${form.name}
Phone/WhatsApp: ${form.phone}
Email: ${form.email || "Not provided"}
Preferred Date: ${form.date}
${serviceType === "music" ? `Genre / Style: ${form.genre || "Not provided"}` : `Location: ${form.location || "Not provided"}`}

Add-Ons Selected:
-----------------
${lineItems.length > 0 ? lineItems.join("\n") : "None"}

Estimated Total: Le ${totalCost.toLocaleString()}

Project Description/Notes:
--------------------------
${form.description || form.notes || "None"}
          `,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setForm({ name: "", phone: "", email: "", date: "", location: "", genre: "", notes: "", description: "" });
      } else {
        throw new Error(data.message || "Submission failed");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  const updateQuantity = (id: string, delta: number, max: number) => {
    setQuantities(prev => {
      const current = prev[id] || 0;
      const next = Math.max(0, Math.min(max, current + delta));
      return { ...prev, [id]: next };
    });
  };

  const setQuantityDirect = (id: string, value: string, max: number) => {
    const num = parseInt(value) || 0;
    setQuantities(prev => ({ ...prev, [id]: Math.max(0, Math.min(max, num)) }));
  };

  if (!isOpen || !selectedPackage) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-background/90 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full h-full md:h-auto max-w-6xl bg-card border border-border md:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-4 md:p-6 border-b border-border flex items-center justify-between bg-background shrink-0 z-10">
            <div>
              <h2 className="text-xl md:text-2xl font-bold tracking-widest uppercase text-foreground">
                Book <span className="text-accent">Session</span>
              </h2>
              <p className="text-sm text-foreground/60 mt-1">
                Customizing: <span className="text-foreground font-semibold">{selectedPackage.name}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-foreground/10 transition-colors text-foreground/60 hover:text-foreground"
            >
              <X size={24} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto flex flex-col lg:flex-row relative">
            {status === "success" ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                <CheckCircle className="text-green-500 w-20 h-20 mb-6" />
                <h3 className="text-3xl font-bold mb-4 text-foreground">Booking Requested!</h3>
                <p className="text-foreground/60 max-w-md text-lg mb-8">
                  Thank you! I have received your customized request for the{" "}
                  <span className="text-foreground font-medium">{selectedPackage.name}</span> and will get back to you shortly to confirm.
                </p>
                <a
                  href={`https://pay.monime.io/011477737?amount=${totalCost}&checkout=true`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 rounded-xl bg-accent hover:bg-accent/80 text-white font-bold uppercase tracking-widest shadow-lg shadow-accent/20 transition-all hover:-translate-y-1 mb-4 flex items-center justify-center gap-2"
                >
                  Pay Le {totalCost.toLocaleString()} with Monime
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-8 py-3 rounded-full text-foreground/60 hover:text-foreground hover:bg-foreground/5 font-semibold transition-colors text-sm"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <>
                {/* Configuration Area */}
                <div className="flex-1 p-4 md:p-8 overflow-y-auto custom-scrollbar">
                  <form id="bookingForm" onSubmit={handleSubmit} className="space-y-12">
                    
                    {/* Add-Ons Section */}
                    <section>
                      <div className="flex items-center gap-2 mb-6 pb-2 border-b border-foreground/10">
                        <h3 className="text-xl font-bold tracking-wider text-foreground">Customize Package</h3>
                        <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-accent/20 text-accent">Add-ons</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Quantity Add-Ons */}
                        {currentAddons.quantities.map(q => (
                          <div key={q.id} className="bg-background border border-border rounded-2xl p-4 flex flex-col justify-between hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                            <div className="mb-4">
                              <h4 className="font-semibold text-foreground">{q.label}</h4>
                              <p className="text-sm text-foreground/50">Le {q.price} / each</p>
                            </div>
                            <div className="flex items-center justify-between bg-card rounded-xl p-1 border border-border">
                              <button type="button" onClick={() => updateQuantity(q.id, -1, q.max)} className="p-2 hover:text-accent hover:bg-background rounded-md transition-colors text-foreground/60">
                                <Minus size={16} />
                              </button>
                              <input 
                                type="number" 
                                value={quantities[q.id] || ""}
                                placeholder="0"
                                onChange={(e) => setQuantityDirect(q.id, e.target.value, q.max)}
                                className="w-16 text-center bg-transparent text-foreground font-semibold focus:outline-none"
                              />
                              <button type="button" onClick={() => updateQuantity(q.id, 1, q.max)} className="p-2 hover:text-accent hover:bg-foreground/5 rounded-md transition-colors text-foreground/60">
                                <Plus size={16} />
                              </button>
                            </div>
                          </div>
                        ))}

                        {/* Select Add-Ons */}
                        {currentAddons.selects.map(s => (
                          <div key={s.id} className="bg-background border border-border rounded-2xl p-4 flex flex-col justify-between hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                            <div className="mb-4">
                              <h4 className="font-semibold text-foreground">{s.label}</h4>
                            </div>
                            <select 
                              value={selections[s.id] || s.options[0].label}
                              onChange={(e) => setSelections(prev => ({ ...prev, [s.id]: e.target.value }))}
                              className="w-full bg-card border border-border rounded-xl p-3 text-sm text-foreground focus:outline-none focus:border-accent appearance-none cursor-pointer"
                            >
                              {s.options.map(opt => (
                                <option key={opt.label} value={opt.label} className="bg-card text-foreground">
                                  {opt.label} {opt.price > 0 ? `(+Le ${opt.price})` : ""}
                                </option>
                              ))}
                            </select>
                          </div>
                        ))}

                        {/* Boolean Add-Ons */}
                        {currentAddons.booleans.length > 0 && (
                          <div className="md:col-span-2 mt-4 space-y-3">
                            <h4 className="font-semibold text-foreground mb-4">Premium Upgrades</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                              {currentAddons.booleans.map(b => (
                                <label key={b.id} className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all hover:shadow-md hover:-translate-y-1 ${booleans[b.id] ? "bg-accent/10 border-accent/50 text-foreground" : "bg-background border-border text-foreground/70 hover:border-foreground/30"}`}>
                                  <div className="flex items-center gap-3">
                                    <input 
                                      type="checkbox" 
                                      checked={booleans[b.id] || false}
                                      onChange={(e) => setBooleans(prev => ({ ...prev, [b.id]: e.target.checked }))}
                                      className="w-4 h-4 rounded border-foreground/20 text-accent focus:ring-accent/50 focus:ring-offset-0 bg-background"
                                    />
                                    <span className="text-sm font-medium">{b.label}</span>
                                  </div>
                                  <span className="text-xs text-foreground/50">+Le {b.price}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </section>

                    {/* Client Details Section */}
                    <section>
                      <div className="flex items-center gap-2 mb-6 pb-2 border-b border-foreground/10">
                        <h3 className="text-xl font-bold tracking-wider text-foreground">Your Details</h3>
                      </div>
                      
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-xs uppercase tracking-widest text-foreground/70 mb-2">Full Name *</label>
                          <input type="text" name="name" required value={form.name} onChange={handleChange} className="w-full bg-background border border-border rounded-xl p-3 text-sm focus:outline-none focus:border-accent focus:bg-card text-foreground transition-all" placeholder="John Doe" />
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-widest text-foreground/70 mb-2">Phone / WhatsApp *</label>
                          <input type="tel" name="phone" required value={form.phone} onChange={handleChange} className="w-full bg-background border border-border rounded-xl p-3 text-sm focus:outline-none focus:border-accent focus:bg-card text-foreground transition-all" placeholder="+232 XX XXX XXX" />
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-widest text-foreground/70 mb-2">Email Address</label>
                          <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full bg-background border border-border rounded-xl p-3 text-sm focus:outline-none focus:border-accent focus:bg-card text-foreground transition-all" placeholder="john@example.com" />
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-widest text-foreground/70 mb-2">Preferred Date *</label>
                          <input type="date" name="date" required value={form.date} onChange={handleChange} className="w-full bg-background border border-border rounded-xl p-3 text-sm focus:outline-none focus:border-accent focus:bg-card text-foreground transition-all [color-scheme:dark]" />
                        </div>

                        {serviceType === "music" ? (
                          <>
                            <div className="sm:col-span-2">
                              <label className="block text-xs uppercase tracking-widest text-foreground/70 mb-2">Genre / Style</label>
                              <input type="text" name="genre" value={form.genre} onChange={handleChange} className="w-full bg-background border border-border rounded-xl p-3 text-sm focus:outline-none focus:border-accent focus:bg-card text-foreground transition-all" placeholder="e.g. Afrobeats, Hip Hop, R&B" />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-xs uppercase tracking-widest text-foreground/70 mb-2">Project Description</label>
                              <textarea name="description" rows={4} value={form.description} onChange={handleChange} className="w-full bg-background border border-border rounded-xl p-3 text-sm focus:outline-none focus:border-accent focus:bg-card text-foreground transition-all resize-none" placeholder="Tell me about your song, vibes, or what you're looking to achieve..." />
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="sm:col-span-2">
                              <label className="block text-xs uppercase tracking-widest text-foreground/70 mb-2">Location</label>
                              <input type="text" name="location" value={form.location} onChange={handleChange} className="w-full bg-background border border-border rounded-xl p-3 text-sm focus:outline-none focus:border-accent focus:bg-card text-foreground transition-all" placeholder="Where will the shoot take place?" />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-xs uppercase tracking-widest text-foreground/70 mb-2">Project Details / Notes</label>
                              <textarea name="notes" rows={4} value={form.notes} onChange={handleChange} className="w-full bg-background border border-border rounded-xl p-3 text-sm focus:outline-none focus:border-accent focus:bg-card text-foreground transition-all resize-none" placeholder="Any specific ideas, themes, or requirements?" />
                            </div>
                          </>
                        )}
                      </div>
                    </section>
                  </form>
                </div>

                {/* Sticky Live Summary Pane */}
                <div className="w-full lg:w-[350px] shrink-0 bg-background lg:border-l border-t lg:border-t-0 border-border flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.2)] z-20">
                  <div className="p-6 bg-accent/5 border-b border-accent/10">
                    <h3 className="text-lg font-bold text-accent uppercase tracking-widest flex items-center gap-2">
                      Live Summary
                    </h3>
                  </div>
                  
                  <div className="flex-1 p-6 overflow-y-auto space-y-4 text-sm custom-scrollbar">
                    <div className="flex justify-between items-end pb-4 border-b border-foreground/10">
                      <div>
                        <p className="text-foreground/50 text-xs uppercase tracking-wider mb-1">Base Package</p>
                        <p className="font-semibold text-foreground">{selectedPackage.name}</p>
                      </div>
                      <span className="font-mono text-foreground/80">Le {selectedPackage.basePrice.toLocaleString()}</span>
                    </div>

                    {lineItems.length > 0 && (
                      <div className="space-y-3 pb-4 border-b border-foreground/10">
                        <p className="text-foreground/50 text-xs uppercase tracking-wider">Selected Add-Ons</p>
                        <ul className="space-y-2">
                          {lineItems.map((item, i) => {
                            const [name, price] = item.split(' = ');
                            return (
                              <li key={i} className="flex justify-between gap-4 text-foreground/80">
                                <span className="truncate" title={name}>{name}</span>
                                <span className="font-mono shrink-0">{price}</span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="p-6 bg-background border-t border-border shrink-0">
                    <div className="flex justify-between items-end mb-6">
                      <span className="text-foreground/60 uppercase tracking-widest text-sm">Estimated Total</span>
                      <span className="text-3xl font-bold text-accent">Le {totalCost.toLocaleString()}</span>
                    </div>

                    {status === "error" && (
                      <div className="flex items-center gap-2 text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm mb-4">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        Submission failed. Try again.
                      </div>
                    )}

                    <button
                      type="submit"
                      form="bookingForm"
                      disabled={status === "sending"}
                      className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent/80 disabled:opacity-60 text-white font-bold uppercase tracking-widest py-4 rounded-xl transition-all hover:scale-[1.02] shadow-lg shadow-accent/20"
                    >
                      {status === "sending" ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Confirm Request
                        </>
                      )}
                    </button>
                    <p className="text-center text-[10px] text-foreground/40 mt-3 uppercase tracking-wider">
                      No payment required yet
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
