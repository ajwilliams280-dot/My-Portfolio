"use client";

import { Mail, Globe, MapPin, Send, CheckCircle, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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
          email: form.email,
          message: form.message,
          subject: `New message from ${form.name} — Altonsworld Portfolio`,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
      } else {
        throw new Error(data.message || "Submission failed");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 min-h-[80vh]">
      <div className="grid md:grid-cols-2 gap-16 items-start">
        {/* Contact Info */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-widest uppercase mb-6">
            Get In <span className="text-accent">Touch</span>
          </h1>
          <p className="text-foreground/60 text-lg tracking-wide mb-12">
            Ready to start a project or collaborate? Drop a message and let&apos;s create something extraordinary together.
          </p>

          <div className="space-y-6">
            <div className="flex items-center gap-4 text-foreground/80">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                <Mail className="text-accent" />
              </div>
              <div>
                <p className="text-sm text-foreground/50 uppercase tracking-widest">Email</p>
                <p className="text-lg">williamsalton15@gmail.com</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-foreground/80">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                <Globe className="text-accent" />
              </div>
              <div>
                <p className="text-sm text-foreground/50 uppercase tracking-widest">Social</p>
                <p className="text-lg">@altonsworld</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-foreground/80">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                <MapPin className="text-accent" />
              </div>
              <div>
                <p className="text-sm text-foreground/50 uppercase tracking-widest">Location</p>
                <p className="text-lg">Freetown (Goderich, Emergency)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="p-8 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-6"
        >
          {status === "success" ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
              <CheckCircle className="text-green-400 w-16 h-16" />
              <h2 className="text-2xl font-bold">Message Sent!</h2>
              <p className="text-foreground/60">Thanks for reaching out. I&apos;ll get back to you soon.</p>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="mt-4 px-6 py-2 rounded-full border border-white/20 text-sm hover:border-accent transition-colors"
              >
                Send Another
              </button>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm uppercase tracking-widest text-foreground/70 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-4 focus:outline-none focus:border-accent text-white transition-colors"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label className="block text-sm uppercase tracking-widest text-foreground/70 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-4 focus:outline-none focus:border-accent text-white transition-colors"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm uppercase tracking-widest text-foreground/70 mb-2">Message</label>
                <textarea
                  name="message"
                  rows={5}
                  required
                  value={form.message}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-4 focus:outline-none focus:border-accent text-white transition-colors resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>

              {status === "error" && (
                <div className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  Something went wrong. Please try again or email me directly.
                </div>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent/80 disabled:opacity-60 text-white font-bold uppercase tracking-widest py-4 rounded-lg transition-colors"
              >
                {status === "sending" ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
