"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Copy, Download, Loader2, ArrowLeft, Info, Music, Shield, FileAudio, LayoutList, Phone } from "lucide-react";

interface OrangeMoneyCheckoutProps {
  post: any;
  onClose: () => void;
  merchantNumber?: string;
}

const LICENSES = [
  { 
    id: "mp3", 
    name: "Basic MP3 Lease", 
    format: "MP3", 
    price: "600 SLE", 
    icon: Music,
    features: ["Untagged MP3", "Up to 100,000 streams", "Must credit producer"] 
  },
  { 
    id: "wav", 
    name: "WAV Lease", 
    format: "WAV", 
    price: "1,500 SLE", 
    icon: FileAudio,
    features: ["Untagged WAV + MP3", "Up to 500,000 streams", "Must credit producer"] 
  },
  { 
    id: "stems", 
    name: "Premium (Trackouts)", 
    format: "Stems", 
    price: "3,000 SLE", 
    icon: LayoutList,
    features: ["WAV + MP3 + Trackouts", "Unlimited streams", "Must credit producer"] 
  },
  { 
    id: "exclusive", 
    name: "Exclusive Rights", 
    format: "Ownership", 
    price: "10,000 SLE", 
    icon: Shield,
    features: ["Full Ownership", "Unlimited everything", "Beat removed from store"] 
  },
];

export default function OrangeMoneyCheckout({
  post,
  onClose,
  merchantNumber = "+232 76 980 072",
}: OrangeMoneyCheckoutProps) {
  const [step, setStep] = useState<"licenses" | "form" | "dialer" | "success">("licenses");
  const [selectedLicense, setSelectedLicense] = useState<typeof LICENSES[0] | null>(null);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [legalName, setLegalName] = useState("");
  const [stageName, setStageName] = useState("");
  const [orderCode, setOrderCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

  const [isGenerating, setIsGenerating] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === "dialer" && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  const generateAndSendPDF = async () => {
    setIsGenerating(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();
      
      doc.setFontSize(22);
      doc.text("BEAT LICENSE AGREEMENT", 105, 20, { align: "center" });
      
      doc.setFontSize(12);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 40);
      doc.text(`Order Code: ${orderCode}`, 20, 50);
      
      doc.setFontSize(14);
      doc.text("1. PARTIES", 20, 70);
      doc.setFontSize(12);
      doc.text(`Producer (Licensor): Alton James Williams (Stage Name: Spice)`, 20, 80);
      doc.text(`Location: Sierra Leone`, 20, 90);
      doc.text(`Artist (Licensee): ${legalName} (Stage Name: ${stageName})`, 20, 100);
      
      doc.setFontSize(14);
      doc.text("2. BEAT DETAILS", 20, 120);
      doc.setFontSize(12);
      doc.text(`Beat Title: ${post.title}`, 20, 130);
      doc.text(`License Type: ${selectedLicense?.name} (${selectedLicense?.format})`, 20, 140);
      doc.text(`Price: ${selectedLicense?.price}`, 20, 150);
      
      doc.setFontSize(14);
      doc.text("3. TERMS & CONDITIONS", 20, 170);
      doc.setFontSize(12);
      let y = 180;
      selectedLicense?.features.forEach(feature => {
        doc.text(`- ${feature}`, 20, y);
        y += 10;
      });
      
      const pdfBase64 = doc.output('datauristring');
      
      const res = await fetch('/api/send-license', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          buyerName: stageName || legalName,
          beatTitle: post.title,
          pdfBase64,
        })
      });
      
      if (!res.ok) {
        console.error("Failed to send email API");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
      setStep("success");
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim() || !email.trim() || !legalName.trim() || !stageName.trim() || !selectedLicense) return;

    setIsProcessingPayment(true);
    setPaymentError("");

    try {
      const res = await fetch('/api/checkout/monime', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          email,
          name: legalName,
          stageName,
          amount: selectedLicense.price,
          description: `Beat License: ${post.title} (${selectedLicense.format})`
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to process payment");
      }

      setPaymentDetails(data.payment);
      
      // If the API returns a hosted checkout URL, redirect the user immediately
      const checkoutUrl = data.payment?.checkout_url || data.payment?.checkoutUrl || data.payment?.url || data.payment?.link;
      if (checkoutUrl) {
        // Save order details for fulfillment on success page
        localStorage.setItem("pendingBeatOrder", JSON.stringify({
          email,
          legalName,
          stageName,
          title: post.title,
          licenseName: selectedLicense.name,
          licenseFormat: selectedLicense.format,
          features: selectedLicense.features,
          price: selectedLicense.price,
          orderCode: data.payment?.code || data.payment?.id || Math.floor(100000 + Math.random() * 900000).toString(),
        }));

        window.location.href = checkoutUrl;
        return;
      }

      // Fallback order code if no code returned and no redirect
      const code = data.payment?.code || data.payment?.id || Math.floor(100000 + Math.random() * 900000).toString();
      setOrderCode(code);
      
      setTimeLeft(600); // 10 mins
      setStep("dialer");
    } catch (err: any) {
      setPaymentError(err.message || "An error occurred during checkout");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(orderCode);
  };

  const handleBack = () => {
    if (step === "form") setStep("licenses");
    else if (step === "dialer") setStep("form");
    else onClose();
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="absolute inset-0 z-50 flex items-center justify-center p-4 md:p-8"
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl rounded-[24px]" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-[#f9f9f9] rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(255,102,0,0.3)] border-2 border-[#ff6600] flex flex-col max-h-full">
        
        {/* Header */}
        <div className="bg-[#ff6600] p-6 text-white text-center relative shrink-0">
          <button onClick={handleBack} className="absolute left-4 top-1/2 -translate-y-1/2 hover:scale-110 transition-transform">
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-2xl font-bold tracking-wider">MoniMe Secure Checkout</h2>
          <p className="text-white/80 text-sm mt-1">
            {step === "licenses" ? "Select a License" : 
             step === "form" ? "Enter Details" : 
             step === "dialer" ? "Make Payment" : "Order Status"}
          </p>
        </div>

        <div className="p-6 md:p-8 text-black overflow-y-auto">
          
          {step !== "success" && (
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200 shrink-0">
              <img src={post.thumbnailUrl || "/images/default_audio_cover.jpg"} alt={post.title} className="w-16 h-16 rounded-lg object-cover shadow-md" />
              <div>
                <h3 className="font-bold text-lg">{post.title}</h3>
                <p className="text-gray-500 text-sm">
                  {selectedLicense ? `${selectedLicense.name} (${selectedLicense.format})` : "High Quality Audio"}
                </p>
              </div>
              {selectedLicense && (
                <div className="ml-auto text-right">
                  <span className="block font-bold text-[#ff6600] text-xl">{selectedLicense.price}</span>
                </div>
              )}
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === "licenses" && (
              <motion.div
                key="licenses"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {LICENSES.map((license) => {
                  const isSelected = selectedLicense?.id === license.id;
                  const Icon = license.icon;
                  return (
                    <div 
                      key={license.id}
                      onClick={() => setSelectedLicense(license)}
                      className={`cursor-pointer rounded-2xl p-5 border-2 transition-all ${
                        isSelected 
                          ? "border-[#ff6600] bg-orange-50 shadow-md transform scale-[1.02]" 
                          : "border-gray-200 bg-white hover:border-orange-300 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Icon size={20} className={isSelected ? "text-[#ff6600]" : "text-gray-400"} />
                          <h4 className="font-bold text-lg">{license.name}</h4>
                        </div>
                        <span className="font-bold text-[#ff6600]">{license.price}</span>
                      </div>
                      <div className="inline-block px-2 py-1 bg-gray-100 text-xs font-bold text-gray-600 rounded mb-4 tracking-wider">
                        {license.format}
                      </div>
                      <ul className="space-y-2 text-sm text-gray-600">
                        {license.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
                
                <div className="md:col-span-2 mt-4">
                  <button 
                    disabled={!selectedLicense}
                    onClick={() => setStep("form")}
                    className="w-full bg-[#000] text-white font-bold py-4 rounded-xl hover:bg-gray-900 transition-colors shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            )}

            {step === "form" && selectedLicense && (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 flex gap-3">
                  <Info className="text-[#ff6600] shrink-0 mt-0.5" size={20} />
                  <p className="text-sm text-gray-700">
                    Please enter your details. We will send the beat files and license to this email address after payment.
                  </p>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Your Email Address</label>
                    <input 
                      type="email" 
                      required
                      placeholder="e.g. artist@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#ff6600] focus:ring-2 focus:ring-[#ff6600]/20 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Your Legal Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. John Doe"
                      value={legalName}
                      onChange={(e) => setLegalName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#ff6600] focus:ring-2 focus:ring-[#ff6600]/20 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Your Stage Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Lil Artist"
                      value={stageName}
                      onChange={(e) => setStageName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#ff6600] focus:ring-2 focus:ring-[#ff6600]/20 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Your Orange Money Phone Number</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. 76 000 00 00"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#ff6600] focus:ring-2 focus:ring-[#ff6600]/20 outline-none transition-all"
                    />
                  </div>
                  {paymentError && (
                    <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm mb-4 border border-red-200">
                      {paymentError}
                    </div>
                  )}
                  <button 
                    type="submit"
                    disabled={isProcessingPayment}
                    className="w-full bg-[#000] text-white font-bold py-4 rounded-xl mt-4 hover:bg-gray-900 transition-colors shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isProcessingPayment ? <><Loader2 className="animate-spin" size={20} /> Processing...</> : "Pay with MoniMe"}
                  </button>
                </form>
              </motion.div>
            )}

            {step === "dialer" && selectedLicense && (
              <motion.div
                key="dialer"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center text-center"
              >
                <div className="bg-white border-2 border-[#ff6600] rounded-2xl p-6 w-full shadow-lg mb-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-[#ff6600]"></div>
                  <p className="text-gray-500 uppercase tracking-widest text-xs font-bold mb-2">Your Order Code</p>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-4xl font-black tracking-widest text-black">{orderCode}</span>
                    <button onClick={copyCode} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-600">
                      <Copy size={20} />
                    </button>
                  </div>
                  <p className="text-[#ff6600] font-semibold text-sm mt-3 flex items-center justify-center gap-2">
                    <Loader2 size={16} className="animate-spin" /> Expires in {formatTime(timeLeft)}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-5 w-full mb-6 text-left border border-gray-200">
                  <p className="text-sm text-gray-700 mb-4">
                    1. A MoniMe payment request has been initiated for <strong>{selectedLicense.price}</strong>.<br/><br/>
                    2. Check your phone (<strong>{phone}</strong>) for a push prompt to enter your PIN.<br/><br/>
                    3. If you didn't get a prompt, follow your mobile money provider's instructions to authorize a pending payment using code <strong>{orderCode}</strong>.
                  </p>
                </div>

                <button 
                  onClick={generateAndSendPDF}
                  disabled={isGenerating}
                  className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-900 transition-colors shadow-lg active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isGenerating ? <><Loader2 size={20} className="animate-spin" /> Generating License...</> : "I have completed the payment"}
                </button>
              </motion.div>
            )}

            {step === "success" && selectedLicense && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-8 text-center"
              >
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 size={48} className="text-green-500" />
                </div>
                <h3 className="text-3xl font-black mb-2 uppercase tracking-tight">Order Received</h3>
                <p className="text-gray-500 mb-6 text-lg">
                  Order Code: <strong>{orderCode}</strong>
                </p>
                
                <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 text-left max-w-sm mb-8">
                  <p className="text-gray-700 text-center leading-relaxed">
                    We are currently verifying your MoniMe payment of <strong className="text-black">{selectedLicense.price}</strong>.<br/><br/>
                    Once confirmed, your high-quality <strong>{selectedLicense.format}</strong> files and license will be delivered to:<br/>
                    <strong className="text-[#ff6600] block mt-2 text-lg">{email}</strong>
                  </p>
                </div>
                
                <button 
                  onClick={onClose}
                  className="w-full max-w-sm bg-[#000] text-white font-bold py-4 rounded-xl hover:bg-gray-900 transition-colors shadow-lg active:scale-[0.98]"
                >
                  Return to Portfolio
                </button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </motion.div>
  );
}
