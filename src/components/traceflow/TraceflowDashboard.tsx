import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { 
  LayoutDashboard, 
  Video, 
  Activity, 
  Zap, 
  GitBranch, 
  Cpu, 
  Bot, 
  Plug2, 
  Settings,
  Search,
  Bell,
  Plus,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Play,
  Clock,
  Users,
  DollarSign,
  Eye,
  MousePointer,
  Sparkles,
  ArrowRight,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";

// TRACEFLOW Brand Colors
const tfColors = {
  primary: "#0B3D91", // Deep Azure
  accent1: "#00C2D8", // Aqua
  accent2: "#FF8A00", // Sun/CTA
  neutral: "#0C1624", // Near-Black
  light: "#F6F8FA", // Off-White
};

interface AIInsightCard {
  id: string;
  type: "urgent" | "revenue" | "churn" | "conversion" | "error";
  title: string;
  description: string;
  impact: string;
  confidence: number;
  sessionId?: string;
  timestamp: string;
}

const mockInsights: AIInsightCard[] = [
  {
    id: "1",
    type: "urgent",
    title: "Critical: Checkout OTP Flow Broken",
    description: "12% of users experiencing OTP input failure on mobile Safari. Root cause: ComponentX at /src/components/Checkout/OTPInput.tsx::line53",
    impact: "₹2.1M potential revenue at risk",
    confidence: 94,
    sessionId: "sess_abc123",
    timestamp: "2 min ago"
  },
  {
    id: "2",
    type: "revenue",
    title: "Revenue Leak Detected",
    description: "Payment gateway timeout causing 8% drop-off at final step. API latency spike from payment provider.",
    impact: "₹890K/week estimated loss",
    confidence: 89,
    sessionId: "sess_def456",
    timestamp: "15 min ago"
  },
  {
    id: "3",
    type: "churn",
    title: "High Churn Cohort Identified",
    description: "Users from organic search showing 3x higher rage-click rate on pricing page. UI overlay causing confusion.",
    impact: "~2,400 users at risk",
    confidence: 87,
    sessionId: "sess_ghi789",
    timestamp: "1 hour ago"
  },
  {
    id: "4",
    type: "conversion",
    title: "Funnel Optimization Opportunity",
    description: "A/B test suggests removing email verification step could increase signups by 23%.",
    impact: "+₹1.2M/month projected",
    confidence: 82,
    timestamp: "3 hours ago"
  },
  {
    id: "5",
    type: "error",
    title: "API Error Spike Detected",
    description: "GraphQL endpoint /api/products returning 500 errors for 5% of requests. Linked to recent deployment.",
    impact: "78 affected sessions",
    confidence: 96,
    sessionId: "sess_jkl012",
    timestamp: "5 min ago"
  }
];

const recentSessions = [
  { id: "sess_001", user: "Anonymous", device: "Mobile iOS", page: "/checkout", duration: "4:32", hasError: true },
  { id: "sess_002", user: "user@example.com", device: "Desktop Chrome", page: "/dashboard", duration: "12:45", hasError: false },
  { id: "sess_003", user: "Anonymous", device: "Mobile Android", page: "/pricing", duration: "1:23", hasError: false },
  { id: "sess_004", user: "pro@company.com", device: "Desktop Firefox", page: "/settings", duration: "8:12", hasError: true },
];

const quickFilters = [
  { label: "Last 24h", active: true },
  { label: "Last 7d", active: false },
  { label: "Last 30d", active: false },
  { label: "Custom", active: false },
];

const savedQueries = [
  "Rage clicks on checkout",
  "Mobile iOS errors",
  "High-value user sessions",
  "Payment failures",
];

export const TraceflowDashboard = () => {
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("Last 24h");

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "urgent": return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "revenue": return <DollarSign className="h-4 w-4 text-amber-500" />;
      case "churn": return <Users className="h-4 w-4 text-purple-500" />;
      case "conversion": return <TrendingUp className="h-4 w-4 text-emerald-500" />;
      case "error": return <Zap className="h-4 w-4 text-red-500" />;
      default: return <Sparkles className="h-4 w-4 text-blue-500" />;
    }
  };

  const getInsightBadge = (type: string) => {
    switch (type) {
      case "urgent": return <Badge variant="destructive" className="text-[10px]">Urgent</Badge>;
      case "revenue": return <Badge className="bg-amber-500/10 text-amber-600 text-[10px]">Revenue</Badge>;
      case "churn": return <Badge className="bg-purple-500/10 text-purple-600 text-[10px]">Churn Risk</Badge>;
      case "conversion": return <Badge className="bg-emerald-500/10 text-emerald-600 text-[10px]">Opportunity</Badge>;
      case "error": return <Badge variant="destructive" className="text-[10px]">Error</Badge>;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Top Bar */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0B3D91] to-[#00C2D8] flex items-center justify-center">
                <Activity className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-lg tracking-tight">TRACEFLOW</span>
              <Badge variant="secondary" className="text-[10px] bg-gradient-to-r from-[#0B3D91]/10 to-[#00C2D8]/10 text-[#0B3D91]">
                DXI Engine
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search sessions, traces, errors..." 
                className="pl-9 w-80 bg-muted/30 border-0 focus:ring-2 focus:ring-[#00C2D8]/30"
              />
            </div>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF8A00] rounded-full text-[10px] text-white flex items-center justify-center">3</span>
            </Button>
            <Button className="bg-gradient-to-r from-[#0B3D91] to-[#00C2D8] text-white hover:opacity-90">
              <Plus className="h-4 w-4 mr-1" />
              Quick Create
            </Button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Left Sidebar - Quick Filters */}
        <aside className="w-64 border-r bg-white/50 min-h-[calc(100vh-57px)] p-4 space-y-6">
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Time Range</h3>
            <div className="space-y-1">
              {quickFilters.map((filter) => (
                <button
                  key={filter.label}
                  onClick={() => setActiveFilter(filter.label)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg text-sm transition-all",
                    activeFilter === filter.label
                      ? "bg-gradient-to-r from-[#0B3D91]/10 to-[#00C2D8]/10 text-[#0B3D91] font-medium"
                      : "text-muted-foreground hover:bg-muted/50"
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Environment</h3>
            <div className="flex gap-2">
              <Badge variant="outline" className="cursor-pointer hover:bg-muted">Production</Badge>
              <Badge variant="secondary" className="cursor-pointer">Staging</Badge>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Saved Queries</h3>
            <div className="space-y-1">
              {savedQueries.map((query) => (
                <button
                  key={query}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all truncate"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Watchlists</h3>
            <Button variant="outline" size="sm" className="w-full text-muted-foreground">
              <Plus className="h-3 w-3 mr-1" />
              Create Watchlist
            </Button>
          </div>
        </aside>

        {/* Main Content - AI Insights Stream */}
        <main className="flex-1 p-6">
          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label: "Active Sessions", value: "1,247", change: "+12%", icon: Eye, trend: "up" },
              { label: "Events/sec", value: "4.2K", change: "+8%", icon: Activity, trend: "up" },
              { label: "Error Rate", value: "0.34%", change: "-15%", icon: AlertTriangle, trend: "down" },
              { label: "Avg. Session", value: "4:32", change: "+3%", icon: Clock, trend: "up" },
            ].map((stat) => (
              <Card key={stat.label} className="bg-white/70 backdrop-blur border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold mt-1">{stat.value}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {stat.trend === "up" ? (
                          <TrendingUp className="h-3 w-3 text-emerald-500" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-red-500" />
                        )}
                        <span className={cn(
                          "text-xs font-medium",
                          stat.trend === "up" ? "text-emerald-600" : "text-red-600"
                        )}>{stat.change}</span>
                      </div>
                    </div>
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#0B3D91]/10 to-[#00C2D8]/10 flex items-center justify-center">
                      <stat.icon className="h-5 w-5 text-[#0B3D91]" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* AI Insights Stream */}
          <Card className="bg-white/70 backdrop-blur border-0 shadow-sm mb-6">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#0B3D91] to-[#00C2D8] flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-base">AI Analyst Insights</CardTitle>
                    <CardDescription className="text-xs">Real-time intelligence from TRACEFLOW Cortex</CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-3">
                  {mockInsights.map((insight, index) => (
                    <div
                      key={insight.id}
                      onClick={() => setSelectedInsight(insight.id)}
                      className={cn(
                        "p-4 rounded-xl border bg-white/80 cursor-pointer transition-all duration-300 hover:shadow-md animate-fade-in",
                        selectedInsight === insight.id && "ring-2 ring-[#00C2D8]/50 shadow-lg",
                        insight.type === "urgent" && "border-l-4 border-l-red-500"
                      )}
                      style={{ animationDelay: `${index * 80}ms` }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5">{getInsightIcon(insight.type)}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {getInsightBadge(insight.type)}
                              <span className="text-xs text-muted-foreground">{insight.timestamp}</span>
                            </div>
                            <h4 className="font-medium text-sm mb-1">{insight.title}</h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">{insight.description}</p>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-xs font-medium text-[#FF8A00]">{insight.impact}</span>
                              <span className="text-xs text-muted-foreground">
                                Confidence: <span className="font-medium">{insight.confidence}%</span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          {insight.sessionId && (
                            <Button size="sm" variant="ghost" className="h-7 text-xs">
                              <Play className="h-3 w-3 mr-1" />
                              Replay
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" className="h-7 text-xs text-[#0B3D91]">
                            Create Ticket
                            <ArrowRight className="h-3 w-3 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </main>

        {/* Right Sidebar - Live Activity */}
        <aside className="w-72 border-l bg-white/50 min-h-[calc(100vh-57px)] p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Live Sessions</h3>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-emerald-600 font-medium">Live</span>
            </div>
          </div>

          <div className="space-y-2">
            {recentSessions.map((session) => (
              <div
                key={session.id}
                className="p-3 rounded-lg bg-white/80 border hover:shadow-sm transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium truncate max-w-[120px]">{session.user}</span>
                  {session.hasError && (
                    <Badge variant="destructive" className="text-[9px] h-4">Error</Badge>
                  )}
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{session.device}</span>
                  <span>{session.duration}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1 truncate">{session.page}</div>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="w-full mt-2 h-7 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Watch Live
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Quick Charts</h3>
            <Card className="bg-white/80 border-0">
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium">Error Rate Trend</span>
                  <TrendingDown className="h-3 w-3 text-emerald-500" />
                </div>
                {/* Placeholder chart */}
                <div className="h-16 bg-gradient-to-r from-[#0B3D91]/5 to-[#00C2D8]/10 rounded-lg flex items-end justify-around p-1">
                  {[40, 65, 45, 80, 55, 35, 25].map((h, i) => (
                    <div
                      key={i}
                      className="w-3 bg-gradient-to-t from-[#0B3D91] to-[#00C2D8] rounded-t"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default TraceflowDashboard;
