"use client";

import { XCircle, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function PaymentCancelledPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center pt-32 pb-24 px-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-card border border-border rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-2 bg-red-500"></div>
        
        <div className="flex flex-col items-center py-8">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
            <XCircle size={40} className="text-red-500" />
          </div>
          <h2 className="text-3xl font-black mb-2 uppercase tracking-tight">Payment Cancelled</h2>
          <p className="text-foreground/70 mb-8">
            Your payment process was cancelled or didn't complete successfully. No charges were made.
          </p>
          
          <Link href="/work" className="w-full bg-foreground text-background font-bold py-4 rounded-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
            <ArrowLeft size={20} /> Back to Music
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
