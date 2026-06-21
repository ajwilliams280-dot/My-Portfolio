"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UploadCloud, Star, CheckCircle } from "lucide-react";
import { ExperienceReaction } from "@/types";

const AVAILABLE_REACTIONS: ExperienceReaction[] = [
  "Memorable",
  "Exceptional",
  "Outstanding",
  "Cinematic",
  "Amazing",
  "Beautifully Captured",
];

interface ShareStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export default function ShareStoryModal({ isOpen, onClose, onSubmit }: ShareStoryModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    clientName: "",
    serviceType: "Photography",
    projectName: "",
    story: "",
    rating: 5,
    reactions: [] as ExperienceReaction[],
    clientImage: undefined as string | undefined,
    mediaUrl: undefined as string | undefined,
    isVideo: false,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleReactionToggle = (reaction: ExperienceReaction) => {
    setFormData((prev) => ({
      ...prev,
      reactions: prev.reactions.includes(reaction)
        ? prev.reactions.filter((r) => r !== reaction)
        : [...prev.reactions, reaction],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate network delay
    await new Promise((res) => setTimeout(res, 1500));
    setIsSubmitting(false);
    setSubmitted(true);
    onSubmit(formData);
    setTimeout(() => {
      setSubmitted(false);
      setStep(1);
      setFormData({
        clientName: "",
        serviceType: "Photography",
        projectName: "",
        story: "",
        rating: 5,
        reactions: [],
        clientImage: undefined,
        mediaUrl: undefined,
        isVideo: false,
      });
      onClose();
    }, 3000);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 p-4 md:p-6 overflow-y-auto"
      >
        <div className="absolute inset-0" onClick={onClose} />
        
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-2xl bg-card border border-border rounded-[24px] shadow-2xl flex flex-col my-auto z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-2xl font-bold tracking-widest uppercase">
              Share Your <span className="text-accent">Story</span>
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-foreground/50 hover:text-accent transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 md:p-8">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center py-12"
              >
                <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-10 h-10 text-accent" />
                </div>
                <h3 className="text-3xl font-bold mb-4">Thank You!</h3>
                <p className="text-foreground/70 max-w-md">
                  Your story has been submitted and will be reviewed before appearing on the wall. Your voice makes AltonsWorld special.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold tracking-widest uppercase text-foreground/80">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.clientName}
                      onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all"
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold tracking-widest uppercase text-foreground/80">
                      Service Used
                    </label>
                    <select
                      value={formData.serviceType}
                      onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all appearance-none"
                    >
                      <option value="Photography">Photography</option>
                      <option value="Videography">Videography</option>
                      <option value="Music Production">Music Production</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold tracking-widest uppercase text-foreground/80">
                    Project Name <span className="text-foreground/40 text-xs normal-case">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.projectName}
                    onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all"
                    placeholder="e.g. Summer Lookbook 2026"
                  />
                </div>

                {/* Rating & Reactions */}
                <div className="space-y-4 pt-4 border-t border-border">
                  <label className="text-sm font-semibold tracking-widest uppercase text-foreground/80">
                    Your Experience
                  </label>
                  
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormData({ ...formData, rating: star })}
                        className="p-1 focus:outline-none"
                      >
                        <Star
                          className={`w-8 h-8 transition-colors ${
                            star <= formData.rating ? "text-accent fill-accent" : "text-border"
                          }`}
                        />
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-3 pt-2">
                    {AVAILABLE_REACTIONS.map((reaction) => (
                      <button
                        key={reaction}
                        type="button"
                        onClick={() => handleReactionToggle(reaction)}
                        className={`px-4 py-2 rounded-full border text-sm transition-all duration-300 ${
                          formData.reactions.includes(reaction)
                            ? "bg-accent/20 border-accent text-foreground shadow-[0_0_15px_rgba(229,9,20,0.2)]"
                            : "bg-background border-border text-foreground/60 hover:border-accent/50 hover:text-foreground"
                        }`}
                      >
                        {reaction}
                      </button>
                    ))}
                  </div>
                </div>

                {/* The Story */}
                <div className="space-y-2 pt-4 border-t border-border">
                  <label className="text-sm font-semibold tracking-widest uppercase text-foreground/80">
                    Your Story
                  </label>
                  <textarea
                    required
                    value={formData.story}
                    onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all min-h-[120px] resize-y"
                    placeholder="Tell us about the impact of the project, the creative process, and how you felt..."
                  />
                </div>

                {/* Media Uploads */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold tracking-widest uppercase text-foreground/80">
                      Profile Picture <span className="text-foreground/40 text-xs normal-case">(Optional)</span>
                    </label>
                    <label className="border-2 border-dashed border-border rounded-xl p-4 flex flex-col items-center justify-center text-center hover:border-accent/50 hover:bg-background/50 transition-colors cursor-pointer group">
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFormData(prev => ({...prev, clientImage: URL.createObjectURL(file)}));
                        }
                      }} />
                      <UploadCloud className="w-8 h-8 text-foreground/40 group-hover:text-accent mb-2 transition-colors" />
                      <span className="text-sm text-foreground/60">{formData.clientImage ? 'Image Selected' : 'Upload Image'}</span>
                    </label>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold tracking-widest uppercase text-foreground/80">
                      Video Testimonial <span className="text-foreground/40 text-xs normal-case">(Optional)</span>
                    </label>
                    <label className="border-2 border-dashed border-border rounded-xl p-4 flex flex-col items-center justify-center text-center hover:border-accent/50 hover:bg-background/50 transition-colors cursor-pointer group">
                      <input type="file" className="hidden" accept="video/mp4,video/x-m4v,video/*" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFormData(prev => ({...prev, mediaUrl: URL.createObjectURL(file), isVideo: true}));
                        }
                      }} />
                      <UploadCloud className="w-8 h-8 text-foreground/40 group-hover:text-accent mb-2 transition-colors" />
                      <span className="text-sm text-foreground/60">{formData.mediaUrl ? 'Video Selected' : 'Upload MP4'}</span>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.clientName || !formData.story}
                    className="w-full py-4 bg-foreground text-background rounded-full font-bold tracking-widest uppercase hover:bg-accent hover:text-foreground hover:shadow-[0_0_30px_rgba(229,9,20,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                  >
                    {isSubmitting ? (
                      <div className="w-6 h-6 border-2 border-background border-t-transparent rounded-full animate-spin" />
                    ) : (
                      "Submit Story"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
