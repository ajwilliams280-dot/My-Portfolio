"use client";

import { motion } from "framer-motion";

const tools = [
  { name: "Premiere Pro", img: "https://api.iconify.design/logos:adobe-premiere.svg", color: "9999FF" },
  { name: "CapCut", img: "https://www.google.com/s2/favicons?domain=capcut.com&sz=128", color: "FFFFFF" },
  { name: "Photoshop", img: "https://api.iconify.design/logos:adobe-photoshop.svg", color: "31A8FF" },
  { name: "DaVinci Resolve", img: "https://api.iconify.design/simple-icons:davinciresolve.svg?color=%23E81224", color: "E81224" },
  { name: "Lightroom", img: "https://api.iconify.design/logos:adobe-lightroom.svg", color: "31A8FF" },
  { name: "FL Studio", img: "https://www.google.com/s2/favicons?domain=image-line.com&sz=128", color: "F28500" },
  { name: "VS Code", img: "https://api.iconify.design/vscode-icons:file-type-vscode.svg", color: "007ACC" },
  { name: "IntelliJ IDEA", img: "https://api.iconify.design/logos:intellij-idea.svg", color: "FF318C" },
];

export default function ToolsAndSoftware() {
  return (
    <div className="pt-16 mt-16 border-t border-foreground/10">
      <h3 className="text-xl md:text-2xl font-bold tracking-widest uppercase text-foreground mb-10 text-center">
        Tools & Software
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-10 perspective-1000">
        {tools.map((tool, index) => (
          <motion.div
            key={tool.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ 
              scale: 1.05, 
              rotateX: 10, 
              rotateY: -10,
              boxShadow: `0px 20px 40px -10px #${tool.color}40`
            }}
            style={{ transformStyle: 'preserve-3d' }}
            className="group flex flex-col items-center justify-center p-8 bg-foreground/5 border border-foreground/10 rounded-2xl cursor-pointer transition-colors duration-300 hover:bg-foreground/10"
          >
            <motion.div
              className="relative w-20 h-20 mb-4 flex items-center justify-center rounded-2xl shadow-inner border border-foreground/5 backdrop-blur-md bg-background"
              style={{ translateZ: 30 }}
              whileHover={{ translateZ: 50 }}
            >
              <img 
                src={tool.img} 
                alt={`${tool.name} logo`}
                width={44}
                height={44}
                className="drop-shadow-lg transition-all duration-300 group-hover:scale-110"
                style={{ filter: `drop-shadow(0px 0px 10px #${tool.color}80)` }}
              />
            </motion.div>
            <motion.span 
              className="text-sm font-semibold tracking-wider text-foreground/70 group-hover:text-foreground transition-colors text-center"
              style={{ translateZ: 20 }}
            >
              {tool.name}
            </motion.span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
