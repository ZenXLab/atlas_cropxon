import { useEffect, useState, useRef } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { 
  Layers, 
  ShieldCheck, 
  Clock, 
  Users, 
  Building2, 
  Globe, 
  Zap,
  Award
} from "lucide-react";

interface StatItem {
  icon: React.ElementType;
  value: number;
  suffix: string;
  label: string;
  description: string;
}

const stats: StatItem[] = [
  {
    icon: Layers,
    value: 15,
    suffix: "+",
    label: "Unified Modules",
    description: "Complete workforce coverage"
  },
  {
    icon: ShieldCheck,
    value: 100,
    suffix: "%",
    label: "Compliance Ready",
    description: "PF, ESI, PT, TDS automated"
  },
  {
    icon: Clock,
    value: 24,
    suffix: "/7",
    label: "Support",
    description: "Enterprise-grade assistance"
  },
  {
    icon: Users,
    value: 50,
    suffix: "K+",
    label: "Employees Managed",
    description: "Across organizations"
  },
  {
    icon: Building2,
    value: 200,
    suffix: "+",
    label: "Enterprises Trust Us",
    description: "From startups to MNCs"
  },
  {
    icon: Globe,
    value: 15,
    suffix: "+",
    label: "Countries Supported",
    description: "India-first, global-ready"
  },
  {
    icon: Zap,
    value: 95,
    suffix: "%",
    label: "Automation Rate",
    description: "Manual work eliminated"
  },
  {
    icon: Award,
    value: 99.9,
    suffix: "%",
    label: "Uptime SLA",
    description: "Enterprise reliability"
  }
];

const AnimatedCounter = ({ 
  value, 
  suffix, 
  isVisible 
}: { 
  value: number; 
  suffix: string; 
  isVisible: boolean;
}) => {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (isVisible && !hasAnimated.current) {
      hasAnimated.current = true;
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current * 10) / 10);
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isVisible, value]);

  const displayValue = Number.isInteger(value) ? Math.floor(count) : count.toFixed(1);

  return (
    <span className="tabular-nums">
      {displayValue}{suffix}
    </span>
  );
};

export const StatsSection = () => {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });

  return (
    <section 
      ref={ref as React.RefObject<HTMLElement>}
      className="relative py-20 lg:py-28 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-accent/5 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Header */}
        <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-accent text-xs font-semibold tracking-wide uppercase mb-6">
            <Zap className="w-4 h-4" />
            By The Numbers
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight mb-6">
            Built for Trust. <span className="text-gradient">Designed for Scale.</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Powering India's most ambitious enterprises with unified workforce intelligence.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`group relative bg-card/50 backdrop-blur-sm border border-border/60 rounded-2xl p-6 text-center transition-all duration-500 hover:bg-card hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Icon */}
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
                </div>

                {/* Value */}
                <div className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-foreground mb-2">
                  <AnimatedCounter 
                    value={stat.value} 
                    suffix={stat.suffix} 
                    isVisible={isVisible} 
                  />
                </div>

                {/* Label */}
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  {stat.label}
                </h3>

                {/* Description */}
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>

                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/0 via-primary/5 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
