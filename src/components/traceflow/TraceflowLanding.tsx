import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Activity,
  Play,
  ArrowRight,
  Check,
  Zap,
  Brain,
  GitBranch,
  Shield,
  Globe,
  Mic,
  Eye,
  Code,
  TrendingUp,
  Users,
  ChevronDown,
  Star,
  Crown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Eye,
    title: "Session Replay",
    description: "Pixel-perfect session recordings with DOM mutations, network calls, and console logs.",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Brain,
    title: "AI Cortex",
    description: "Automatic root-cause analysis with code-level context and fix suggestions.",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: Activity,
    title: "UX Intelligence",
    description: "Heatmaps, rage click detection, and journey causality analysis.",
    color: "from-emerald-500 to-teal-500"
  },
  {
    icon: Code,
    title: "Experience-to-Code",
    description: "Link user frustration directly to suspected code files and git commits.",
    color: "from-amber-500 to-orange-500"
  },
  {
    icon: Mic,
    title: "Voice Fusion",
    description: "Align audio/video feedback with session replays for complete context.",
    color: "from-rose-500 to-red-500"
  },
  {
    icon: GitBranch,
    title: "Auto-Ticketing",
    description: "Create Jira/GitHub issues with reproduction steps and test skeletons.",
    color: "from-indigo-500 to-violet-500"
  }
];

const differentiators = [
  {
    title: "AI Cortex Engine",
    description: "Beyond simple replay — our LLM-powered engine correlates signals across sessions, traces, and logs to surface what matters.",
    visual: "ai"
  },
  {
    title: "Voice + Session Fusion",
    description: "First platform to align audio feedback with session replays, giving you the 'why' behind user frustration.",
    visual: "voice"
  },
  {
    title: "Experience → Code Correlation",
    description: "No more guessing. We show you exactly which component and line of code is likely causing the issue.",
    visual: "code"
  }
];

const pricingTeaser = {
  starter: { price: "₹9,900", priceUSD: "$99", seats: 5, events: "50K", description: "For growing teams" },
  growth: { price: "₹49,000", priceUSD: "$499", seats: 25, events: "500K", description: "For scaling products" },
  business: { price: "Custom", seats: 100, events: "3M+", description: "For enterprise" }
};

export const TraceflowLanding = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0B3D91] to-[#00C2D8] flex items-center justify-center">
                <Activity className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-lg">ATLAS</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-1 cursor-pointer group">
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">Products</span>
                <ChevronDown className="h-3 w-3 text-muted-foreground" />
              </div>
              <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Solutions</span>
              <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Resources</span>
              <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Pricing</span>
              <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Contact</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm">Sign In</Button>
            <Button className="bg-[#FF8A00] hover:bg-[#FF8A00]/90 text-white" size="sm">
              Start 14-Day Trial — No Card
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-20 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B3D91]/5 via-white to-[#00C2D8]/5" />
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-[#0B3D91]/5 to-[#00C2D8]/10 blur-3xl animate-pulse"
              style={{
                left: `${20 + i * 20}%`,
                top: `${10 + i * 15}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${4 + i}s`
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-2">
                <Badge className="bg-gradient-to-r from-[#0B3D91] to-[#00C2D8] text-white border-0">
                  <Crown className="h-3 w-3 mr-1" />
                  Flagship Product
                </Badge>
                <Badge variant="outline" className="text-[#0B3D91]">AI-Native DXI</Badge>
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-[#0B3D91] to-[#00C2D8] bg-clip-text text-transparent">TRACEFLOW</span>
                <br />
                <span className="text-slate-900">Every Signal. One Intelligence.</span>
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                Unify clickstream, observability, and multimodal feedback — auto-diagnose, auto-suggest, auto-fix. The world's first AI-native Digital Experience Intelligence platform.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button size="lg" className="bg-[#FF8A00] hover:bg-[#FF8A00]/90 text-white shadow-lg shadow-[#FF8A00]/25 px-8">
                  Start 14-Day Trial — No Card
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="border-[#0B3D91] text-[#0B3D91] hover:bg-[#0B3D91]/5">
                  <Play className="mr-2 h-4 w-4" />
                  Request Demo
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-6 pt-6 border-t">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-emerald-600" />
                  <span className="text-sm text-muted-foreground">SOC2 Ready</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-emerald-600" />
                  <span className="text-sm text-muted-foreground">PCI Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-600" />
                  <span className="text-sm text-muted-foreground">GDPR Ready</span>
                </div>
              </div>
            </div>

            {/* Right Column - Hero Visual */}
            <div className="relative animate-fade-in" style={{ animationDelay: "200ms" }}>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-[#0B3D91]/20 border border-slate-200/50">
                {/* Video/Demo placeholder */}
                <div className="aspect-video bg-gradient-to-br from-slate-900 via-slate-800 to-[#0B3D91] p-6 relative">
                  {/* Floating UI elements */}
                  <div className="absolute top-4 left-4 bg-white/10 backdrop-blur rounded-lg p-3 border border-white/20 animate-fade-in" style={{ animationDelay: "400ms" }}>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-white text-xs">Session Recording</span>
                    </div>
                  </div>
                  
                  <div className="absolute top-4 right-4 bg-white rounded-lg p-3 shadow-lg animate-fade-in" style={{ animationDelay: "600ms" }}>
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4 text-[#0B3D91]" />
                      <span className="text-xs font-medium">AI Analysis Complete</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">Root cause: API timeout</p>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg p-3 shadow-lg animate-fade-in" style={{ animationDelay: "800ms" }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GitBranch className="h-4 w-4 text-[#0B3D91]" />
                        <span className="text-xs font-medium">Jira Ticket Created</span>
                      </div>
                      <Badge className="bg-emerald-100 text-emerald-700 text-[10px]">Auto-generated</Badge>
                    </div>
                  </div>

                  {/* Play button overlay */}
                  <button 
                    className="absolute inset-0 flex items-center justify-center group"
                    onClick={() => setIsVideoPlaying(true)}
                  >
                    <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="h-8 w-8 text-white ml-1" />
                    </div>
                  </button>
                </div>
              </div>

              {/* Floating elements around hero */}
              <div className="absolute -left-6 top-1/4 bg-white rounded-xl p-3 shadow-xl border animate-fade-in" style={{ animationDelay: "1000ms" }}>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-500" />
                  <span className="text-xs font-medium">Rage Click Detected</span>
                </div>
              </div>

              <div className="absolute -right-6 bottom-1/4 bg-white rounded-xl p-3 shadow-xl border animate-fade-in" style={{ animationDelay: "1200ms" }}>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                  <span className="text-xs font-medium">+23% Conversion</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem / Value Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Teams Choose TRACEFLOW</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Stop losing revenue to invisible UX issues. TRACEFLOW automatically finds, explains, and helps fix problems before they impact your bottom line.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: TrendingUp, title: "Reduce Triage Time by 70%", description: "AI automatically links user frustration to code-level root causes." },
              { icon: Users, title: "Prevent Revenue Leakage", description: "Surface checkout issues and conversion blockers in real-time." },
              { icon: Activity, title: "Unified Signal Intelligence", description: "One platform for sessions, traces, logs, and user feedback." }
            ].map((item, i) => (
              <Card key={i} className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0B3D91] to-[#00C2D8] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Everything You Need in One Platform</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From session replay to AI-powered insights — TRACEFLOW is the complete DXI solution.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <Card 
                key={i} 
                className="bg-white border hover:border-[#00C2D8]/50 transition-all hover:shadow-lg group cursor-pointer"
              >
                <CardContent className="p-6">
                  <div className={cn(
                    "w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center mb-4 group-hover:scale-110 transition-transform",
                    feature.color
                  )}>
                    <feature.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#0B3D91] to-[#00C2D8]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Digital Experience?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of teams using TRACEFLOW to understand users, fix issues faster, and drive conversions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-[#FF8A00] hover:bg-[#FF8A00]/90 text-white shadow-lg px-8">
              Start 14-Day Trial — No Card
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
              Talk to Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0B3D91] to-[#00C2D8] flex items-center justify-center">
                <Activity className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold">TRACEFLOW</span>
              <span className="text-slate-400 text-sm">by CropXon Innovations</span>
            </div>
            <div className="text-sm text-slate-400">
              © 2025 CropXon Innovations. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TraceflowLanding;
