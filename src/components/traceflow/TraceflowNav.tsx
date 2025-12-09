import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  LayoutDashboard,
  Video,
  MousePointer,
  GitBranch,
  Activity,
  Cpu,
  Mic,
  Bot,
  Plug2,
  Settings,
  ChevronLeft,
  Crown
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/traceflow", description: "Overview & AI Insights" },
  { icon: Video, label: "Sessions", href: "/admin/traceflow/sessions", description: "Session Replay", badge: "Live" },
  { icon: MousePointer, label: "UX Intelligence", href: "/admin/traceflow/ux", description: "Heatmaps & Issues" },
  { icon: GitBranch, label: "Journeys", href: "/admin/traceflow/journeys", description: "Funnels & Causality" },
  { icon: Activity, label: "Observability", href: "/admin/traceflow/observability", description: "Traces & Logs" },
  { icon: Mic, label: "Voice Fusion", href: "/admin/traceflow/voice", description: "Audio Feedback", badge: "New" },
  { icon: Bot, label: "AI Ops", href: "/admin/traceflow/ai-ops", description: "Auto-Ticketing" },
  { icon: Plug2, label: "Integrations", href: "/admin/traceflow/integrations", description: "Jira, GitHub, Slack" },
  { icon: Settings, label: "Admin", href: "/admin/traceflow/admin", description: "Billing & Settings" },
];

interface TraceflowNavProps {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

export const TraceflowNav = ({ collapsed = false, onCollapse }: TraceflowNavProps) => {
  const location = useLocation();

  const isActive = (href: string) => {
    if (href === "/admin/traceflow") {
      return location.pathname === "/admin/traceflow";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <TooltipProvider delayDuration={0}>
      <aside className={cn(
        "bg-slate-900 text-white flex flex-col transition-all duration-300 min-h-screen",
        collapsed ? "w-16" : "w-64"
      )}>
        {/* Logo */}
        <div className="p-4 border-b border-slate-800">
          <Link to="/admin/traceflow" className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-[#00C2D8]/30 blur-xl rounded-full" />
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#0B3D91] to-[#00C2D8] flex items-center justify-center">
                <Activity className="h-5 w-5 text-white" />
              </div>
            </div>
            {!collapsed && (
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg tracking-tight">TRACEFLOW</span>
                  <Crown className="h-3 w-3 text-[#FF8A00]" />
                </div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">DXI Engine</span>
              </div>
            )}
          </Link>
        </div>

        {/* Back to ATLAS */}
        <div className="px-3 py-2 border-b border-slate-800">
          <Link to="/admin">
            <Button 
              variant="ghost" 
              size="sm" 
              className={cn(
                "w-full text-slate-400 hover:text-white hover:bg-slate-800",
                collapsed && "justify-center px-2"
              )}
            >
              <ChevronLeft className="h-4 w-4" />
              {!collapsed && <span className="ml-2">Back to ATLAS</span>}
            </Button>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.href);
            
            if (collapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Link
                      to={item.href}
                      className={cn(
                        "flex items-center justify-center p-3 rounded-xl transition-all",
                        active
                          ? "bg-gradient-to-r from-[#0B3D91] to-[#00C2D8] text-white shadow-lg shadow-[#00C2D8]/25"
                          : "text-slate-400 hover:text-white hover:bg-slate-800"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="flex flex-col">
                    <span className="font-semibold">{item.label}</span>
                    <span className="text-xs text-muted-foreground">{item.description}</span>
                  </TooltipContent>
                </Tooltip>
              );
            }

            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group",
                  active
                    ? "bg-gradient-to-r from-[#0B3D91] to-[#00C2D8] text-white shadow-lg shadow-[#00C2D8]/25"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5 transition-transform group-hover:scale-110",
                  active && "text-white"
                )} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{item.label}</span>
                    {item.badge && (
                      <Badge 
                        className={cn(
                          "text-[9px] h-4 px-1.5",
                          item.badge === "Live" 
                            ? "bg-emerald-500/20 text-emerald-400" 
                            : "bg-[#FF8A00]/20 text-[#FF8A00]"
                        )}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                  <span className={cn(
                    "text-[10px]",
                    active ? "text-white/70" : "text-slate-500"
                  )}>{item.description}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800">
          {!collapsed && (
            <div className="bg-gradient-to-r from-[#0B3D91]/20 to-[#00C2D8]/20 rounded-xl p-3 mb-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs text-slate-300">Live Ingestion</span>
              </div>
              <div className="text-xl font-bold text-white">4.2K</div>
              <div className="text-[10px] text-slate-400">events/second</div>
            </div>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCollapse?.(!collapsed)}
            className={cn(
              "w-full text-slate-400 hover:text-white hover:bg-slate-800",
              collapsed && "justify-center px-2"
            )}
          >
            <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
            {!collapsed && <span className="ml-2">Collapse</span>}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  );
};

export default TraceflowNav;
