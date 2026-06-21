import { FaTiktok, FaInstagram, FaYoutube } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="w-full py-8 border-t border-border bg-background mt-auto relative z-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm tracking-widest uppercase text-foreground/50">
          © {new Date().getFullYear()} Altonsworld. All rights reserved.
        </p>
        
        <div className="flex items-center gap-6">
          <a 
            href="https://www.tiktok.com/@altons_tech_tips?_r=1&_t=ZS-961gVV6iaqD" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-foreground/50 hover:text-white transition-colors flex items-center justify-center hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
            aria-label="TikTok"
          >
            <FaTiktok size={24} />
          </a>
          <a 
            href="https://www.instagram.com/altons_world?igsh=MTFmeG8zZDl5ZndvcQ==" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-foreground/50 hover:text-[#E1306C] transition-colors flex items-center justify-center hover:drop-shadow-[0_0_8px_rgba(225,48,108,0.8)]"
            aria-label="Instagram"
          >
            <FaInstagram size={24} />
          </a>
          <a 
            href="https://youtube.com/@altonsworld20?si=YNIUIG6OfC6aSCXn" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-foreground/50 hover:text-[#FF0000] transition-colors flex items-center justify-center hover:drop-shadow-[0_0_8px_rgba(255,0,0,0.8)]"
            aria-label="YouTube"
          >
            <FaYoutube size={28} />
          </a>
        </div>
      </div>
    </footer>
  );
}
