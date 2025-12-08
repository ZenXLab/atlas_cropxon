import { AlertTriangle, Info, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { portalWidgetCatalog } from "@/hooks/usePortalDashboardLayout";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface RestrictedWidgetsIndicatorProps {
  restrictedWidgetIds: string[];
}

export const RestrictedWidgetsIndicator = ({ restrictedWidgetIds }: RestrictedWidgetsIndicatorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  if (restrictedWidgetIds.length === 0) return null;

  const restrictedWidgets = restrictedWidgetIds
    .map(id => portalWidgetCatalog.find(w => w.id === id))
    .filter(Boolean);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex items-center justify-between p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
            <Lock className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              {restrictedWidgetIds.length} widget{restrictedWidgetIds.length > 1 ? 's' : ''} restricted by admin
            </p>
            <p className="text-xs text-muted-foreground">
              Your organization admin has limited access to some widgets
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Info className="w-4 h-4 text-muted-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left" className="max-w-xs">
                <p className="text-sm">
                  These widgets have been disabled for your role by your organization's admin. 
                  Contact your admin if you need access to these features.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1 text-xs">
              {isOpen ? (
                <>Hide <ChevronUp className="w-3 h-3" /></>
              ) : (
                <>Show <ChevronDown className="w-3 h-3" /></>
              )}
            </Button>
          </CollapsibleTrigger>
        </div>
      </div>
      <CollapsibleContent>
        <div className="mt-2 p-3 bg-muted/30 rounded-lg">
          <div className="flex flex-wrap gap-2">
            {restrictedWidgets.map(widget => widget && (
              <TooltipProvider key={widget.id}>
                <Tooltip>
                  <TooltipTrigger>
                    <Badge variant="secondary" className="gap-1 text-xs opacity-60">
                      <Lock className="w-3 h-3" />
                      {widget.name}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">{widget.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Restricted by organization admin
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
