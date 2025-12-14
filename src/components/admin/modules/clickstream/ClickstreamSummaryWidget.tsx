import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MousePointer, Eye, Users, TrendingUp, ArrowRight, Radio } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export const ClickstreamSummaryWidget = () => {
  const { data: events } = useQuery({
    queryKey: ["clickstream-summary"],
    queryFn: async () => {
      const since = new Date();
      since.setHours(since.getHours() - 24);
      
      const { data, error } = await supabase
        .from("clickstream_events")
        .select("*")
        .gte("created_at", since.toISOString())
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    refetchInterval: 30000,
  });

  const stats = {
    totalEvents: events?.length || 0,
    uniqueSessions: new Set(events?.map(e => e.session_id)).size,
    clicks: events?.filter(e => e.event_type === "click").length || 0,
    pageViews: events?.filter(e => e.event_type === "pageview").length || 0,
  };

  const metrics = [
    { label: "Events", value: stats.totalEvents, icon: TrendingUp, color: "text-primary" },
    { label: "Sessions", value: stats.uniqueSessions, icon: Users, color: "text-purple-600" },
    { label: "Clicks", value: stats.clicks, icon: MousePointer, color: "text-red-500" },
    { label: "Views", value: stats.pageViews, icon: Eye, color: "text-blue-500" },
  ];

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <MousePointer className="h-5 w-5 text-primary" />
          Clickstream Analytics
        </CardTitle>
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-xs">
              <Radio className="h-2 w-2 mr-1 animate-pulse" />
              Live
            </Badge>
          </motion.div>
          <Link to="/admin/clickstream">
            <Button variant="ghost" size="sm" className="gap-1 h-7 text-xs">
              View All <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-3">
          {metrics.map((metric) => (
            <div key={metric.label} className="text-center p-2 rounded-lg bg-muted/30">
              <metric.icon className={`h-4 w-4 mx-auto mb-1 ${metric.color}`} />
              <p className="text-lg font-bold">{metric.value}</p>
              <p className="text-[10px] text-muted-foreground">{metric.label}</p>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground text-center mt-3">
          Last 24 hours
        </p>
      </CardContent>
    </Card>
  );
};
