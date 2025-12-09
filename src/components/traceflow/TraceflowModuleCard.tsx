import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Lock, Sparkles, type LucideIcon } from "lucide-react";

interface TraceflowModuleCardProps {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  isEnabled: boolean;
  isLocked?: boolean;
  isNew?: boolean;
  stats?: { label: string; value: string }[];
  onToggle?: (id: string, enabled: boolean) => void;
  onClick?: () => void;
}

export const TraceflowModuleCard = ({
  id,
  title,
  description,
  icon: Icon,
  color,
  isEnabled,
  isLocked = false,
  isNew = false,
  stats,
  onToggle,
  onClick,
}: TraceflowModuleCardProps) => {
  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all cursor-pointer group",
        isEnabled && !isLocked
          ? "bg-slate-800/60 border-slate-700 hover:border-[#00C2D8]/50 hover:shadow-lg hover:shadow-[#00C2D8]/10"
          : "bg-slate-800/30 border-slate-700/50 opacity-75",
        isLocked && "cursor-not-allowed"
      )}
      onClick={onClick}
    >
      {/* Gradient Accent */}
      <div
        className={cn(
          "absolute top-0 left-0 right-0 h-1 transition-opacity",
          `bg-gradient-to-r ${color}`,
          isEnabled ? "opacity-100" : "opacity-30"
        )}
      />

      {/* Badges */}
      <div className="absolute top-3 right-3 flex items-center gap-2">
        {isNew && (
          <Badge className="bg-[#FF8A00]/20 text-[#FF8A00] border-[#FF8A00]/30 text-[10px]">
            <Sparkles className="h-2.5 w-2.5 mr-1" />
            NEW
          </Badge>
        )}
        {isLocked && (
          <Badge className="bg-slate-700/50 text-slate-400 border-slate-600 text-[10px]">
            <Lock className="h-2.5 w-2.5 mr-1" />
            LOCKED
          </Badge>
        )}
      </div>

      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110",
              `bg-gradient-to-br ${color}`
            )}
          >
            <Icon className="h-5 w-5 text-white" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-white truncate">{title}</h3>
              {onToggle && !isLocked && (
                <Switch
                  checked={isEnabled}
                  onCheckedChange={(checked) => onToggle(id, checked)}
                  onClick={(e) => e.stopPropagation()}
                  className="data-[state=checked]:bg-[#00C2D8]"
                />
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2">{description}</p>
          </div>
        </div>

        {/* Stats */}
        {stats && stats.length > 0 && isEnabled && (
          <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-700/50">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-lg font-bold text-white">{stat.value}</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
