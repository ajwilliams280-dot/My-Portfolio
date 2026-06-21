"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, ArrowLeft, Download } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { jsPDF } from "jspdf";

export default function PaymentSuccessPage() {
  const [status, setStatus] = useState<"loading" | "generating" | "done" | "error">("loading");
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);

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
        
        // Also generate a blob URL for immediate download
        const blob = doc.output('blob');
        const blobUrl = URL.createObjectURL(blob);
        setPdfBlobUrl(blobUrl);
        
        // Attempt to send email via API (may fail if SMTP not configured, but we still give download buttons)
        try {
          const res = await fetch('/api/send-license', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: order.email,
              buyerName: order.stageName || order.legalName,
              beatTitle: order.title,
              audioUrl: order.audioUrl,
              pdfBase64,
            })
          });
          
          if (!res.ok) {
            console.warn("Failed to send email API (SMTP likely not configured)");
          }
        } catch (emailErr) {
          console.warn("Email API unreachable", emailErr);
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
              Thank you for your purchase. You can download your high-quality files and license agreement below. We've also attempted to email them to <strong>{orderDetails.email}</strong>.
            </p>
            
            <div className="flex flex-col gap-3 w-full mb-8">
              {orderDetails.audioUrl && (
                <a 
                  href={orderDetails.audioUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  download={`${orderDetails.title.replace(/\s+/g, '_')}_Audio`}
                  className="w-full bg-[#ff6600] text-white font-bold py-4 rounded-xl hover:bg-[#e65c00] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Download size={20} /> Download Beat File
                </a>
              )}
              
              {pdfBlobUrl && (
                <a 
                  href={pdfBlobUrl}
                  download={`${orderDetails.title.replace(/\s+/g, '_')}_License.pdf`}
                  className="w-full bg-background border-2 border-foreground text-foreground font-bold py-4 rounded-xl hover:bg-foreground hover:text-background active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Download size={20} /> Download License Agreement (PDF)
                </a>
              )}
            </div>
            
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
