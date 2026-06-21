"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { jsPDF } from "jspdf";

export default function PaymentSuccessPage() {
  const [status, setStatus] = useState<"loading" | "generating" | "done" | "error">("loading");
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    const handleFulfillment = async () => {
      try {
        const storedOrder = localStorage.getItem("pendingBeatOrder");
        if (!storedOrder) {
          setStatus("error");
          return;
        }

        const order = JSON.parse(storedOrder);
        setOrderDetails(order);
        setStatus("generating");

        // Generate PDF
        const doc = new jsPDF();
        
        doc.setFontSize(22);
        doc.text("BEAT LICENSE AGREEMENT", 105, 20, { align: "center" });
        
        doc.setFontSize(12);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 40);
        doc.text(`Order Code: ${order.orderCode}`, 20, 50);
        
        doc.setFontSize(14);
        doc.text("1. PARTIES", 20, 70);
        doc.setFontSize(12);
        doc.text(`Producer (Licensor): Alton James Williams (Stage Name: Spice)`, 20, 80);
        doc.text(`Location: Sierra Leone`, 20, 90);
        doc.text(`Artist (Licensee): ${order.legalName} (Stage Name: ${order.stageName})`, 20, 100);
        
        doc.setFontSize(14);
        doc.text("2. BEAT DETAILS", 20, 120);
        doc.setFontSize(12);
        doc.text(`Beat Title: ${order.title}`, 20, 130);
        doc.text(`License Type: ${order.licenseName} (${order.licenseFormat})`, 20, 140);
        doc.text(`Price: ${order.price}`, 20, 150);
        
        doc.setFontSize(14);
        doc.text("3. TERMS & CONDITIONS", 20, 170);
        doc.setFontSize(12);
        let y = 180;
        order.features?.forEach((feature: string) => {
          doc.text(`- ${feature}`, 20, y);
          y += 10;
        });
        
        const pdfBase64 = doc.output('datauristring');
        
        // Send email via API
        const res = await fetch('/api/send-license', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: order.email,
            buyerName: order.stageName || order.legalName,
            beatTitle: order.title,
            pdfBase64,
          })
        });
        
        if (!res.ok) {
          console.error("Failed to send email API");
        }

        // Clear local storage so we don't send it again on refresh
        localStorage.removeItem("pendingBeatOrder");
        setStatus("done");
      } catch (err) {
        console.error("Error fulfilling order:", err);
        setStatus("error");
      }
    };

    handleFulfillment();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center pt-32 pb-24 px-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-card border border-border rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-2 bg-green-500"></div>
        
        {(status === "loading" || status === "generating") && (
          <div className="flex flex-col items-center py-12">
            <Loader2 size={64} className="text-accent animate-spin mb-6" />
            <h2 className="text-2xl font-bold mb-2">Processing Order</h2>
            <p className="text-foreground/70">
              {status === "generating" ? "Generating your beat license..." : "Verifying payment..."}
            </p>
          </div>
        )}

        {status === "done" && orderDetails && (
          <div className="flex flex-col items-center py-8">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 size={40} className="text-green-500" />
            </div>
            <h2 className="text-3xl font-black mb-2 uppercase tracking-tight">Payment Successful!</h2>
            <p className="text-foreground/70 mb-8">
              Thank you for your purchase. We have sent the high-quality <strong>{orderDetails.licenseFormat}</strong> files and your license to <strong>{orderDetails.email}</strong>.
            </p>
            
            <div className="bg-background border border-border rounded-xl p-4 w-full text-left mb-8">
              <p className="text-sm text-foreground/60 mb-1">Order Details</p>
              <p className="font-bold">{orderDetails.title} - {orderDetails.licenseName}</p>
              <p className="text-sm mt-2 font-mono text-foreground/50">Code: {orderDetails.orderCode}</p>
            </div>

            <Link href="/work" className="w-full bg-foreground text-background font-bold py-4 rounded-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
              <ArrowLeft size={20} /> Back to Work
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center py-12">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Verification Failed</h2>
            <p className="text-foreground/70 mb-8">
              We couldn't verify your pending order. If you have been charged but haven't received your beat, please contact support.
            </p>
            <Link href="/work" className="w-full bg-foreground text-background font-bold py-4 rounded-xl hover:scale-[1.02] active:scale-95 transition-all">
              Return to Work
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
