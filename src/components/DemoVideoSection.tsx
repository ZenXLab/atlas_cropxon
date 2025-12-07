import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Play, Pause, Volume2, VolumeX, Maximize2 } from "lucide-react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";

export const DemoVideoSection = () => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const handlePlayClick = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <section 
      ref={ref as React.RefObject<HTMLElement>}
      className="py-20 lg:py-28 relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Header */}
        <div className={`text-center max-w-3xl mx-auto mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-accent text-xs font-semibold tracking-wide uppercase mb-6">
            <Play className="w-4 h-4" />
            See ATLAS in Action
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight mb-6">
            Experience the <span className="text-gradient">Future of Work</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Watch how ATLAS transforms enterprise operations with unified HR, Payroll, Compliance, and AI-powered automation.
          </p>
        </div>

        {/* Video Container */}
        <div className={`max-w-5xl mx-auto transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="relative rounded-2xl overflow-hidden bg-card border border-border/60 shadow-2xl shadow-primary/10">
            {/* Video Placeholder with Gradient Overlay */}
            <div className="aspect-video bg-gradient-to-br from-primary/20 via-accent/10 to-primary/5 relative">
              {/* Animated Grid Pattern */}
              <div className="absolute inset-0 opacity-20">
                <div 
                  className="absolute inset-0" 
                  style={{
                    backgroundImage: `linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                  }}
                />
              </div>

              {/* Center Play Button */}
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={handlePlayClick}
                    className="group relative w-24 h-24 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-primary shadow-lg shadow-primary/30"
                  >
                    <Play className="w-10 h-10 text-primary-foreground ml-1" fill="currentColor" />
                    {/* Pulse rings */}
                    <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
                    <span className="absolute -inset-4 rounded-full border-2 border-primary/20 animate-pulse" />
                  </button>
                </div>
              )}

              {/* Video Content Mockup */}
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="grid grid-cols-3 gap-4 w-full max-w-4xl opacity-60">
                  {/* Dashboard Preview Cards */}
                  {[
                    { title: "Workforce Dashboard", color: "from-blue-500/20 to-cyan-500/20" },
                    { title: "Payroll Engine", color: "from-amber-500/20 to-orange-500/20" },
                    { title: "AI Insights", color: "from-violet-500/20 to-purple-500/20" },
                  ].map((item, index) => (
                    <div 
                      key={index}
                      className={`bg-gradient-to-br ${item.color} backdrop-blur-sm rounded-xl p-4 border border-white/10`}
                    >
                      <div className="h-3 w-20 bg-white/30 rounded mb-3" />
                      <div className="space-y-2">
                        <div className="h-2 w-full bg-white/20 rounded" />
                        <div className="h-2 w-3/4 bg-white/20 rounded" />
                        <div className="h-2 w-1/2 bg-white/20 rounded" />
                      </div>
                      <div className="mt-4 h-16 bg-white/10 rounded-lg" />
                    </div>
                  ))}
                </div>
              </div>

              {/* ATLAS Logo Watermark */}
              <div className="absolute top-6 left-6 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/80 flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">A</span>
                </div>
                <span className="text-foreground/80 font-heading font-bold">ATLAS Demo</span>
              </div>

              {/* Duration Badge */}
              <div className="absolute top-6 right-6 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                3:45
              </div>
            </div>

            {/* Video Controls Bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="flex items-center gap-4">
                {/* Play/Pause */}
                <button 
                  onClick={handlePlayClick}
                  className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 text-white" />
                  ) : (
                    <Play className="w-5 h-5 text-white ml-0.5" />
                  )}
                </button>

                {/* Progress Bar */}
                <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full w-0 bg-primary rounded-full transition-all duration-300" />
                </div>

                {/* Time */}
                <span className="text-white/80 text-sm font-medium">0:00 / 3:45</span>

                {/* Volume */}
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5 text-white" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-white" />
                  )}
                </button>

                {/* Fullscreen */}
                <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
                  <Maximize2 className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {[
            { label: "Quick Setup", value: "< 5 mins" },
            { label: "No Credit Card", value: "Free Trial" },
            { label: "Data Import", value: "1-Click" },
            { label: "Full Access", value: "14 Days" },
          ].map((item, index) => (
            <div key={index} className="text-center p-4 bg-card/50 border border-border/40 rounded-xl">
              <div className="text-2xl font-heading font-bold text-primary mb-1">{item.value}</div>
              <div className="text-sm text-muted-foreground">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
