"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Image as ImageIcon, Music, ZoomIn, ZoomOut, RotateCcw, ShoppingCart } from "lucide-react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import Image from "next/image";
import MonimeCheckout from "./MonimeCheckout";

type MediaType = "video" | "photo" | "music";

interface MediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaUrl: string;
  type: MediaType;
  title: string;
  description?: string;
  date?: any;
  thumbnailUrl?: string;
}

import { useState, useRef, useEffect } from "react";

function MusicNotes({ isPlaying }: { isPlaying: boolean }) {
  const [notes, setNotes] = useState<{ id: number; left: number }[]>([]);

  useEffect(() => {
    if (!isPlaying) {
      setNotes([]);
      return;
    }
    const interval = setInterval(() => {
      setNotes((prev) => [
        ...prev.slice(-15),
        { id: Date.now(), left: 15 + Math.random() * 70 }
      ]);
    }, 400);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden rounded-[24px]">
      <AnimatePresence>
        {notes.map((note) => (
          <motion.div
            key={note.id}
            initial={{ opacity: 0, y: 0, x: `calc(${note.left}% - 12px)`, scale: 0.5, rotate: Math.random() * -45 }}
            animate={{ 
              opacity: [0, 1, 0], 
              y: '-40vh', 
              x: `calc(${note.left + (Math.random() > 0.5 ? 20 : -20)}% - 12px)`, 
              scale: [0.5, 1.5, 1],
              rotate: Math.random() * 45
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 4, ease: "easeOut" }}
            className="absolute top-1/2 left-0 text-accent filter drop-shadow-[0_0_8px_rgba(229,9,20,0.8)]"
          >
            <Music size={28} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default function MediaModal({
  isOpen,
  onClose,
  mediaUrl,
  type,
  title,
  description,
  date,
  thumbnailUrl,
}: MediaModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  const handleClose = () => {
    if (window.history.state && window.history.state.modal) {
      window.history.back();
    } else {
      onClose();
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      if (isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (!window.history.state || !window.history.state.modal) {
        window.history.pushState({ modal: true }, '');
      }
      window.addEventListener('popstate', handlePopState);
    } else {
      document.body.style.overflow = "unset";
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
    
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isOpen, onClose]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(audioRef.current.duration, audioRef.current.currentTime + 10);
    }
  };

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 p-4 md:p-8"
        onClick={handleClose}
      >
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 text-foreground/70 hover:text-accent transition-colors z-50"
        >
          <X size={32} />
        </button>

        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className={`relative w-full max-w-5xl flex flex-col rounded-[24px] ${
            type === "photo"
              ? "h-[90vh] overflow-hidden"
              : type === "video"
              ? "aspect-video bg-card border border-border shadow-2xl overflow-hidden"
              : "min-h-[500px] h-auto max-h-[90vh] overflow-y-auto overflow-x-hidden bg-card border border-border shadow-2xl"
          }`}
          onClick={(e) => e.stopPropagation()}
        >

          {type === "video" && (
            <div className="w-full h-full flex flex-col bg-transparent">
              {mediaUrl.includes("youtube.com") || mediaUrl.includes("youtu.be") || mediaUrl.includes("vimeo.com") ? (
                <iframe
                  src={mediaUrl}
                  title={title}
                  className="w-full flex-1 object-cover"
                  allowFullScreen
                />
              ) : (
                <video
                  src={mediaUrl}
                  controls
                  className="w-full flex-1 object-contain bg-black"
                />
              )}
              {description && (
                <div className="p-4 bg-background border-t border-border text-foreground/70 tracking-wide text-sm">
                  {description}
                </div>
              )}
            </div>
          )}

          {type === "photo" && (
            <div className="relative w-full h-full flex flex-col items-center justify-center bg-transparent">
              {mediaUrl ? (
                <TransformWrapper
                  initialScale={1}
                  minScale={1}
                  maxScale={4}
                  centerZoomedOut={true}
                  centerOnInit={true}
                  wheel={{ step: 0.1 }}
                  pinch={{ step: 5 }}
                  doubleClick={{ step: 1, mode: "zoomIn" }}
                >
                  {({ zoomIn, zoomOut, resetTransform }) => (
                    <>
                      <div className="absolute top-0 right-0 z-50 flex gap-2 p-4">
                        <button onClick={() => zoomIn()} className="w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center border border-white/10 hover:bg-black/80 transition-colors">
                          <ZoomIn size={18} />
                        </button>
                        <button onClick={() => zoomOut()} className="w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center border border-white/10 hover:bg-black/80 transition-colors">
                          <ZoomOut size={18} />
                        </button>
                        <button onClick={() => resetTransform()} className="w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center border border-white/10 hover:bg-black/80 transition-colors">
                          <RotateCcw size={18} />
                        </button>
                      </div>
                      <TransformComponent wrapperClass="!w-full !h-full" contentClass="!w-full !h-full flex items-center justify-center">
                        <img
                          src={mediaUrl}
                          alt={title}
                          className="max-w-full max-h-[90vh] object-contain cursor-grab active:cursor-grabbing select-none"
                          draggable={false}
                        />
                      </TransformComponent>
                    </>
                  )}
                </TransformWrapper>
              ) : (
                <span className="text-white/30 uppercase tracking-widest text-xs">No Image</span>
              )}
            </div>
          )}

          {type === "music" && (
            <div className="flex flex-col items-center justify-center h-full gap-8 text-foreground bg-black/40 backdrop-blur-sm relative w-full p-8">
              <MusicNotes isPlaying={isPlaying} />
              
              {/* Spinning Vinyl Record (Picture Disc Style) */}
              <div 
                className="relative flex-shrink-0 flex items-center justify-center w-64 md:w-80 aspect-square rounded-full border-[4px] border-accent/40 shadow-[0_0_60px_rgba(229,9,20,0.25)] overflow-hidden animate-spin z-10"
                style={{ animationDuration: '4s', animationTimingFunction: 'linear', animationPlayState: isPlaying ? 'running' : 'paused' }}
              >
                {/* Full Disc Cover Art */}
                {thumbnailUrl ? (
                  <img src={thumbnailUrl} alt={title} className="absolute inset-0 w-full h-full object-cover z-10" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-black via-[#111] to-[#200000] flex items-center justify-center z-10">
                    <Music size={64} className="text-white/20" />
                  </div>
                )}

                {/* Vinyl Grooves - overlaid on top */}
                <div className="absolute inset-0 rounded-full border border-black/30 m-2 z-20 pointer-events-none"></div>
                <div className="absolute inset-0 rounded-full border border-white/5 m-6 z-20 pointer-events-none mix-blend-overlay"></div>
                <div className="absolute inset-0 rounded-full border border-black/30 m-12 z-20 pointer-events-none"></div>
                <div className="absolute inset-0 rounded-full border border-white/5 m-16 z-20 pointer-events-none mix-blend-overlay"></div>
                <div className="absolute inset-0 rounded-full border border-black/30 m-20 z-20 pointer-events-none"></div>
                <div className="absolute inset-0 rounded-full border border-white/5 m-24 z-20 pointer-events-none mix-blend-overlay"></div>
                <div className="absolute inset-0 rounded-full border border-black/30 m-28 z-20 pointer-events-none"></div>
                
                {/* Vinyl Reflection / Glare */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-white/10 to-black/20 z-30 pointer-events-none"></div>

                {/* Center Hole */}
                <div className="absolute m-auto w-4 h-4 bg-background rounded-full z-40 border border-black/80 shadow-[inset_0_0_4px_rgba(0,0,0,0.8)]"></div>
              </div>

              <div className="flex flex-col items-center mt-2 w-full max-w-lg z-10">
                <h3 className="text-2xl md:text-3xl font-bold tracking-widest text-center text-white mb-2">{title}</h3>
                {description && (
                  <p className="text-center text-foreground/70 text-sm tracking-widest mb-6">
                    {description}
                  </p>
                )}
                
                {/* Hidden Audio Element */}
                <audio 
                  ref={audioRef}
                  className="hidden" 
                  src={mediaUrl} 
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                />

                {/* Custom Audio Player Controls */}
                <div className="w-full bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl mt-4">
                  {/* Progress Bar */}
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-xs font-mono text-white/50 w-10 text-right">{formatTime(currentTime)}</span>
                    <div className="relative flex-1 h-2 group cursor-pointer flex items-center">
                      <input 
                        type="range" 
                        min={0} 
                        max={duration || 100} 
                        value={currentTime} 
                        onChange={handleSeek}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                      />
                      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden z-0">
                        <div 
                          className="h-full bg-accent relative"
                          style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                        ></div>
                      </div>
                      {/* Custom Thumb */}
                      <div 
                        className="absolute top-1/2 h-3 w-3 bg-white rounded-full shadow-[0_0_10px_rgba(var(--accent),0.8)] z-10 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-transform group-hover:scale-125"
                        style={{ left: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-mono text-white/50 w-10">{formatTime(duration)}</span>
                  </div>

                  {/* Controls Row */}
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0 mt-4 md:mt-0">
                    {/* Volume Control */}
                    <div className="flex items-center justify-center md:justify-start gap-2 group w-full md:w-24 order-2 md:order-1">
                      <button onClick={() => setIsMuted(!isMuted)} className="text-white/50 hover:text-accent transition-colors shrink-0">
                        {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                      </button>
                      <input 
                        type="range" 
                        min={0} 
                        max={1} 
                        step={0.01}
                        value={isMuted ? 0 : volume}
                        onChange={(e) => setVolume(Number(e.target.value))}
                        className="w-24 md:w-0 opacity-100 md:opacity-0 md:group-hover:w-full md:group-hover:opacity-100 transition-all duration-300 h-1 bg-white/20 rounded-full appearance-none cursor-pointer accent-accent"
                      />
                    </div>

                    {/* Playback Buttons */}
                    <div className="flex items-center gap-6 order-1 md:order-2">
                      <button onClick={skipBackward} className="text-white/50 hover:text-white transition-colors active:scale-90">
                        <SkipBack size={24} />
                      </button>
                      <button 
                        onClick={togglePlay} 
                        className="w-16 h-16 flex items-center justify-center rounded-full bg-accent text-background hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                      >
                        {isPlaying ? <Pause size={28} className="fill-current" /> : <Play size={28} className="fill-current ml-1" />}
                      </button>
                      <button onClick={skipForward} className="text-white/50 hover:text-white transition-colors active:scale-90">
                        <SkipForward size={24} />
                      </button>
                    </div>

                    {/* Buy Beat Button Wrapper (keeps playback controls centered) */}
                    <div className="flex justify-center md:justify-end w-full md:w-24 order-3">
                      {!mediaUrl.includes('/audio-projects/') && (
                        <button 
                          onClick={() => setIsCheckoutOpen(true)}
                          className="w-full md:w-auto bg-[#ff6600] text-white px-6 md:px-4 py-3 md:py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#e65c00] transition-colors shadow-[0_0_15px_rgba(255,102,0,0.4)] hover:scale-105 active:scale-95"
                        >
                          <ShoppingCart size={16} /> Buy
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Monime Checkout Overlay */}
          {isCheckoutOpen && (
            <MonimeCheckout 
              post={{ title, thumbnailUrl, mediaUrl }} 
              onClose={() => setIsCheckoutOpen(false)} 
            />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
