import { Video, Camera, Music, ArrowRight, Code } from "lucide-react";
import PhotographyPackages from "@/components/booking/PhotographyPackages";
import VideographyPackages from "@/components/booking/VideographyPackages";
import MusicPackages from "@/components/booking/MusicPackages";
import PricingTable from "@/components/portfolio/PricingTable";

export default function ServicesPage() {
  const services = [
    {
      title: "Videography",
      description: "Directing, shooting, and editing cinematic visuals for music videos, commercials, and short films.",
      icon: <Video size={32} />,
      id: "videography"
    },
    {
      title: "Photography",
      description: "Capturing moody, high-contrast moments spanning across streetwear, portraits, and urban landscapes.",
      icon: <Camera size={32} />,
      id: "photography"
    },
    {
      title: "Music Production",
      description: "Crafting original beats, soundscapes, and scoring tailored to fit deep, atmospheric vibes.",
      icon: <Music size={32} />,
      id: "music"
    },
    {
      title: "Software Development",
      description: "Building modern, scalable web applications and interactive digital experiences.",
      icon: <Code size={32} />,
      id: "software"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 min-h-[80vh]">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-widest uppercase mb-4">
          Creative <span className="text-accent">Services</span>
        </h1>
        <p className="text-foreground/60 text-lg tracking-wide">
          Bringing visions to life across multiple mediums. Delivering premium cinematic quality for brands, artists, and personal projects.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service, index) => (
          <div
            key={index}
            className="group relative p-8 rounded-xl bg-white/5 border border-white/10 hover:border-accent hover:bg-accent/5 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-150 duration-500">
              {service.icon}
            </div>
            
            <div className="text-accent mb-6 bg-accent/10 w-16 h-16 flex items-center justify-center rounded-lg">
              {service.icon}
            </div>
            
            <h3 className="text-2xl font-bold tracking-widest uppercase mb-4">
              {service.title}
            </h3>
            
            <p className="text-foreground/60 leading-relaxed mb-8">
              {service.description}
            </p>
            
            <a href={`#${service.id}`} className="inline-flex items-center gap-2 text-sm uppercase tracking-widest font-semibold hover:text-accent transition-colors">
              View Packages <ArrowRight size={16} />
            </a>
          </div>
        ))}
      </div>

      <div className="mt-24 space-y-0">
        <div id="videography">
          <VideographyPackages />
        </div>
        <div id="photography">
          <PhotographyPackages />
        </div>
        <div id="music">
          <MusicPackages />
        </div>
        <div id="software" className="mt-24">
          <PricingTable />
        </div>
      </div>
    </div>
  );
}
