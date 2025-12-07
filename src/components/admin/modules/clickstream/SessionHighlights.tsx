import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, MousePointerClick, XCircle, FileX, Zap, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

interface SessionEvent {
  type: number;
  timestamp: number;
  data?: any;
}

interface SessionRecording {
  id: string;
  session_id: string;
  events: SessionEvent[];
  start_time: string;
  duration_ms: number | null;
  metadata: any;
}

interface SessionHighlight {
  type: "rage_click" | "dead_click" | "form_abandonment" | "error_click";
  timestamp: number;
  description: string;
  severity: "low" | "medium" | "high";
  element?: string;
  page?: string;
}

interface SessionHighlightsProps {
  recording: SessionRecording | null;
  onSeekTo?: (timestamp: number) => void;
}

// Detect rage clicks (multiple clicks in quick succession on same element)
const detectRageClicks = (events: SessionEvent[]): SessionHighlight[] => {
  const highlights: SessionHighlight[] = [];
  const clickEvents = events.filter(e => e.type === 3 && e.data?.type === 2); // Mouse click events
  
  let consecutiveClicks = 0;
  let lastClickTime = 0;
  let lastElement = "";
  
  for (const event of clickEvents) {
    const timeDiff = event.timestamp - lastClickTime;
    const currentElement = event.data?.source?.selector || event.data?.source?.id || "";
    
    if (timeDiff < 500 && currentElement === lastElement) {
      consecutiveClicks++;
      if (consecutiveClicks >= 3) {
        highlights.push({
          type: "rage_click",
          timestamp: event.timestamp,
          description: `User rapidly clicked ${consecutiveClicks + 1} times - frustration detected`,
          severity: consecutiveClicks >= 5 ? "high" : "medium",
          element: currentElement,
        });
      }
    } else {
      consecutiveClicks = 0;
    }
    
    lastClickTime = event.timestamp;
    lastElement = currentElement;
  }
  
  return highlights;
};

// Detect dead clicks (clicks that don't result in any DOM changes)
const detectDeadClicks = (events: SessionEvent[]): SessionHighlight[] => {
  const highlights: SessionHighlight[] = [];
  
  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    if (event.type === 3 && event.data?.type === 2) { // Mouse click
      // Check if any DOM mutation follows within 100ms
      const followingEvents = events.slice(i + 1, i + 5);
      const hasDomChange = followingEvents.some(e => 
        e.type === 3 && e.data?.type === 0 && // Mutation
        e.timestamp - event.timestamp < 100
      );
      
      if (!hasDomChange) {
        // Check if it's likely an interactive element
        const selector = event.data?.source?.selector || "";
        const isLikelyButton = selector.includes("button") || 
                              selector.includes("btn") || 
                              selector.includes("link") ||
                              selector.includes("a[");
        
        if (isLikelyButton) {
          highlights.push({
            type: "dead_click",
            timestamp: event.timestamp,
            description: "Click on element that didn't respond",
            severity: "low",
            element: selector,
          });
        }
      }
    }
  }
  
  return highlights.slice(0, 10); // Limit to prevent noise
};

// Detect form abandonment (input focus followed by page navigation without submit)
const detectFormAbandonment = (events: SessionEvent[]): SessionHighlight[] => {
  const highlights: SessionHighlight[] = [];
  let lastFormInteraction: SessionEvent | null = null;
  let formInputCount = 0;
  
  for (const event of events) {
    // Detect input/focus events
    if (event.type === 3 && (event.data?.type === 5 || event.data?.type === 6)) { // Focus/blur
      lastFormInteraction = event;
      formInputCount++;
    }
    
    // Detect navigation away
    if (event.type === 4 && lastFormInteraction && formInputCount > 2) { // Meta event (page change)
      highlights.push({
        type: "form_abandonment",
        timestamp: lastFormInteraction.timestamp,
        description: `User abandoned form after ${formInputCount} field interactions`,
        severity: formInputCount > 5 ? "high" : "medium",
      });
      lastFormInteraction = null;
      formInputCount = 0;
    }
  }
  
  return highlights;
};

export const SessionHighlights = ({ recording, onSeekTo }: SessionHighlightsProps) => {
  const highlights = useMemo(() => {
    if (!recording?.events?.length) return [];
    
    const events = recording.events as SessionEvent[];
    const allHighlights: SessionHighlight[] = [
      ...detectRageClicks(events),
      ...detectDeadClicks(events),
      ...detectFormAbandonment(events),
    ];
    
    // Sort by timestamp
    return allHighlights.sort((a, b) => a.timestamp - b.timestamp);
  }, [recording]);

  const highlightStats = useMemo(() => ({
    rageClicks: highlights.filter(h => h.type === "rage_click").length,
    deadClicks: highlights.filter(h => h.type === "dead_click").length,
    formAbandonment: highlights.filter(h => h.type === "form_abandonment").length,
    highSeverity: highlights.filter(h => h.severity === "high").length,
  }), [highlights]);

  const getHighlightIcon = (type: string) => {
    switch (type) {
      case "rage_click": return <Zap className="h-4 w-4 text-red-500" />;
      case "dead_click": return <XCircle className="h-4 w-4 text-amber-500" />;
      case "form_abandonment": return <FileX className="h-4 w-4 text-purple-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-500/10 text-red-600 border-red-500/30";
      case "medium": return "bg-amber-500/10 text-amber-600 border-amber-500/30";
      default: return "bg-gray-500/10 text-gray-600 border-gray-500/30";
    }
  };

  const formatTimestamp = (ts: number) => {
    if (!recording) return "0:00";
    const startTime = recording.events[0]?.timestamp || 0;
    const elapsed = (ts - startTime) / 1000;
    const minutes = Math.floor(elapsed / 60);
    const seconds = Math.floor(elapsed % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (!recording) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">
            <MousePointerClick className="h-12 w-12 mx-auto mb-2 opacity-30" />
            <p>Select a recording to view highlights</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          Session Highlights
        </CardTitle>
        <CardDescription>
          Auto-detected UX issues and friction points
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Stats Summary */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="text-center p-2 bg-red-500/10 rounded-lg">
            <div className="text-lg font-bold text-red-600">{highlightStats.rageClicks}</div>
            <div className="text-[10px] text-muted-foreground">Rage Clicks</div>
          </div>
          <div className="text-center p-2 bg-amber-500/10 rounded-lg">
            <div className="text-lg font-bold text-amber-600">{highlightStats.deadClicks}</div>
            <div className="text-[10px] text-muted-foreground">Dead Clicks</div>
          </div>
          <div className="text-center p-2 bg-purple-500/10 rounded-lg">
            <div className="text-lg font-bold text-purple-600">{highlightStats.formAbandonment}</div>
            <div className="text-[10px] text-muted-foreground">Form Abandon</div>
          </div>
          <div className="text-center p-2 bg-destructive/10 rounded-lg">
            <div className="text-lg font-bold text-destructive">{highlightStats.highSeverity}</div>
            <div className="text-[10px] text-muted-foreground">High Severity</div>
          </div>
        </div>

        {/* Highlights List */}
        <ScrollArea className="h-[250px]">
          {highlights.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No issues detected</p>
              <p className="text-xs">This session appears smooth!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {highlights.map((highlight, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => onSeekTo?.(highlight.timestamp)}
                  className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start gap-2">
                    {getHighlightIcon(highlight.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className={getSeverityColor(highlight.severity)}>
                          {highlight.severity}
                        </Badge>
                        <span className="text-xs text-muted-foreground font-mono">
                          @ {formatTimestamp(highlight.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm">{highlight.description}</p>
                      {highlight.element && (
                        <p className="text-xs text-muted-foreground mt-1 truncate font-mono">
                          {highlight.element}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
