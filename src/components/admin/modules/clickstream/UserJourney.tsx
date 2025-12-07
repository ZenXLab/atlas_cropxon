import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Route, ArrowRight, Clock, Target, Radio, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

interface UserJourneyProps {
  events: Array<{
    session_id: string;
    event_type: string;
    page_url: string | null;
    element_text: string | null;
    created_at: string;
    metadata?: unknown;
  }>;
}

interface JourneyPath {
  sessionId: string;
  steps: Array<{
    page: string;
    action: string;
    timestamp: string;
    element?: string;
  }>;
  converted: boolean;
  duration: number;
}

export const UserJourney = ({ events }: UserJourneyProps) => {
  // Build user journeys from events
  const journeys = useMemo((): JourneyPath[] => {
    const sessionMap = new Map<string, JourneyPath>();

    // Sort events by time
    const sortedEvents = [...events].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    sortedEvents.forEach((event) => {
      if (!sessionMap.has(event.session_id)) {
        sessionMap.set(event.session_id, {
          sessionId: event.session_id,
          steps: [],
          converted: false,
          duration: 0,
        });
      }

      const journey = sessionMap.get(event.session_id)!;
      
      // Add step
      journey.steps.push({
        page: event.page_url || "Unknown",
        action: event.event_type,
        timestamp: event.created_at,
        element: event.element_text || undefined,
      });

      // Check for conversion
      if (
        event.page_url?.includes("/onboarding") ||
        event.page_url?.includes("/get-quote") ||
        (event.event_type === "click" && event.element_text?.toLowerCase().includes("quote"))
      ) {
        journey.converted = true;
      }
    });

    // Calculate duration for each journey
    return Array.from(sessionMap.values())
      .map((journey) => {
        if (journey.steps.length > 1) {
          const start = new Date(journey.steps[0].timestamp).getTime();
          const end = new Date(journey.steps[journey.steps.length - 1].timestamp).getTime();
          journey.duration = Math.round((end - start) / 1000);
        }
        return journey;
      })
      .filter((j) => j.steps.length >= 2)
      .sort((a, b) => b.steps.length - a.steps.length)
      .slice(0, 8);
  }, [events]);

  // Calculate common paths
  const commonPaths = useMemo(() => {
    const pathCounts = new Map<string, number>();
    
    journeys.forEach((journey) => {
      const path = journey.steps
        .slice(0, 3)
        .map((s) => s.page)
        .join(" → ");
      pathCounts.set(path, (pathCounts.get(path) || 0) + 1);
    });

    return Array.from(pathCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [journeys]);

  const convertedJourneys = journeys.filter((j) => j.converted).length;
  const avgSteps = journeys.length > 0 
    ? Math.round(journeys.reduce((sum, j) => sum + j.steps.length, 0) / journeys.length)
    : 0;

  const getPageColor = (page: string) => {
    if (page === "/" || page.includes("home")) return "from-violet-500 to-purple-600";
    if (page.includes("pricing")) return "from-emerald-500 to-teal-600";
    if (page.includes("feature") || page.includes("module")) return "from-blue-500 to-indigo-600";
    if (page.includes("contact") || page.includes("quote")) return "from-amber-500 to-orange-600";
    if (page.includes("onboarding") || page.includes("auth")) return "from-pink-500 to-rose-600";
    return "from-gray-500 to-slate-600";
  };

  return (
    <Card className="overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-background via-background to-primary/5">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Route className="h-5 w-5 text-primary" />
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent font-bold">
                User Journey Paths
              </span>
              <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />
            </CardTitle>
            <CardDescription>Complete path visualization from entry to conversion</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
              <Radio className="h-3 w-3 mr-1 animate-pulse" />
              Live
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <motion.div
            className="p-3 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-lg border border-primary/20"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-2xl font-bold text-primary">{journeys.length}</div>
            <div className="text-xs text-muted-foreground">Unique Journeys</div>
          </motion.div>
          <motion.div
            className="p-3 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-lg border border-emerald-500/20"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="text-2xl font-bold text-emerald-600">{convertedJourneys}</div>
            <div className="text-xs text-muted-foreground">Converted</div>
          </motion.div>
          <motion.div
            className="p-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-lg border border-amber-500/20"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-2xl font-bold text-amber-600">{avgSteps}</div>
            <div className="text-xs text-muted-foreground">Avg Steps</div>
          </motion.div>
        </div>

        {/* Common Paths */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold mb-3 text-muted-foreground">Most Common Paths</h4>
          <div className="space-y-2">
            {commonPaths.map(([path, count], idx) => (
              <motion.div
                key={path}
                className="flex items-center justify-between p-2 bg-muted/50 rounded-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="flex items-center gap-2 text-sm overflow-hidden">
                  {path.split(" → ").map((page, pIdx, arr) => (
                    <span key={pIdx} className="flex items-center gap-1">
                      <span className="truncate max-w-24 font-medium">{page}</span>
                      {pIdx < arr.length - 1 && (
                        <ArrowRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      )}
                    </span>
                  ))}
                </div>
                <Badge variant="secondary" className="ml-2 flex-shrink-0">{count} users</Badge>
              </motion.div>
            ))}
            {commonPaths.length === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                Not enough data to show common paths
              </div>
            )}
          </div>
        </div>

        {/* Journey Visualization */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-muted-foreground">Recent Journeys</h4>
          {journeys.slice(0, 5).map((journey, idx) => (
            <motion.div
              key={journey.sessionId}
              className="p-3 bg-muted/30 rounded-xl border border-border/50 overflow-hidden"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">
                    {journey.sessionId.slice(0, 12)}...
                  </span>
                  {journey.converted && (
                    <Badge className="bg-emerald-500 text-white text-[10px]">
                      <Target className="h-2 w-2 mr-1" />
                      Converted
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {journey.duration > 60 
                    ? `${Math.round(journey.duration / 60)}m` 
                    : `${journey.duration}s`}
                </div>
              </div>

              {/* Journey Path */}
              <div className="flex items-center gap-1 overflow-x-auto pb-2">
                {journey.steps.slice(0, 6).map((step, sIdx) => (
                  <div key={sIdx} className="flex items-center gap-1 flex-shrink-0">
                    <motion.div
                      className={`px-2 py-1 bg-gradient-to-r ${getPageColor(step.page)} text-white text-[10px] rounded-full whitespace-nowrap`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: idx * 0.1 + sIdx * 0.05 }}
                    >
                      {step.page === "/" ? "Home" : step.page.replace("/", "").slice(0, 12)}
                    </motion.div>
                    {sIdx < Math.min(journey.steps.length - 1, 5) && (
                      <ArrowRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                    )}
                  </div>
                ))}
                {journey.steps.length > 6 && (
                  <Badge variant="outline" className="text-[10px] flex-shrink-0">
                    +{journey.steps.length - 6} more
                  </Badge>
                )}
              </div>
            </motion.div>
          ))}
          {journeys.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Route className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No user journeys recorded yet</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
