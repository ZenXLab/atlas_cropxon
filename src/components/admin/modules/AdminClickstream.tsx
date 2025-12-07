import { useState, useEffect, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { MousePointer, Eye, Link, BarChart3, Users, RefreshCw, Radio, FlaskConical, TrendingUp, Trash2, AlertTriangle, Download, FileSpreadsheet, ChevronDown, ChevronUp, Bell, Globe, Flame, Monitor, Video } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { ConversionFunnel } from "./clickstream/ConversionFunnel";
import { ClickHeatmap } from "./clickstream/ClickHeatmap";
import { SessionReplay } from "./clickstream/SessionReplay";
import { GeoAnalytics } from "./clickstream/GeoAnalytics";
import { UserJourney } from "./clickstream/UserJourney";
import { DateRangePicker } from "./clickstream/DateRangePicker";
import { DeviceAnalytics } from "./clickstream/DeviceAnalytics";
import { LiveSessionRecording } from "./clickstream/LiveSessionRecording";
import { RRWebPlayer } from "./clickstream/RRWebPlayer";
import { ClickstreamLayout } from "./clickstream/ClickstreamLayout";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export const AdminClickstream = () => {
  const [eventFilter, setEventFilter] = useState<string>("all");
  const [timeRange, setTimeRange] = useState<string>("24h");
  const [customDateRange, setCustomDateRange] = useState<{ from: Date; to: Date } | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [liveEventsCount, setLiveEventsCount] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [eventsExpanded, setEventsExpanded] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [activeSection, setActiveSection] = useState("overview");
  const queryClient = useQueryClient();

  const { data: events, isLoading, refetch } = useQuery({
    queryKey: ["clickstream-events", eventFilter, timeRange, customDateRange?.from?.toISOString(), customDateRange?.to?.toISOString()],
    queryFn: async () => {
      let query = supabase
        .from("clickstream_events")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500);

      if (eventFilter !== "all") {
        query = query.eq("event_type", eventFilter);
      }

      if (timeRange === "custom" && customDateRange) {
        query = query
          .gte("created_at", customDateRange.from.toISOString())
          .lte("created_at", customDateRange.to.toISOString());
      } else {
        const timeFilters: Record<string, number> = {
          "1h": 1,
          "24h": 24,
          "7d": 168,
          "30d": 720,
          "90d": 2160,
        };

        if (timeFilters[timeRange]) {
          const since = new Date();
          since.setHours(since.getHours() - timeFilters[timeRange]);
          query = query.gte("created_at", since.toISOString());
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      setLastUpdate(new Date());
      return data || [];
    },
    refetchInterval: 5000,
  });

  const { data: experiments } = useQuery({
    queryKey: ["ab-experiments-active"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ab_experiments")
        .select(`*, ab_variants (*), ab_user_assignments (*)`)
        .eq("status", "running");
      if (error) throw error;
      return data;
    },
  });

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('clickstream-realtime-v4')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'clickstream_events'
      }, (payload) => {
        setLiveEventsCount(prev => prev + 1);
        setLastUpdate(new Date());
        queryClient.invalidateQueries({ queryKey: ["clickstream-events"] });
        
        if (notificationsEnabled) {
          const newEvent = payload.new as any;
          const eventInfo = newEvent.event_type === 'pageview' 
            ? `Page: ${newEvent.page_url || 'Unknown'}`
            : newEvent.event_type === 'click'
              ? `Clicked: ${newEvent.element_text?.slice(0, 30) || 'Element'}`
              : `Action: ${newEvent.event_type}`;
          
          toast.info(`New ${newEvent.event_type} event`, {
            description: eventInfo,
            duration: 3000,
          });
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [queryClient, notificationsEnabled]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setLiveEventsCount(0);
    try {
      await refetch();
      toast.success("Data refreshed");
    } catch {
      toast.error("Failed to refresh");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDeleteAllData = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("clickstream_events")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000");
      if (error) throw error;
      await refetch();
      setLiveEventsCount(0);
      toast.success("All data deleted");
    } catch {
      toast.error("Delete failed");
    } finally {
      setIsDeleting(false);
    }
  };

  const exportToCSV = useCallback(() => {
    if (!events?.length) { toast.error("No data"); return; }
    const headers = ["Event Type", "Page URL", "Element ID", "Element Text", "Session ID", "User ID", "Created At"];
    const csvRows = [
      headers.join(","),
      ...events.map(e => [
        e.event_type, `"${e.page_url || ''}"`, `"${e.element_id || ''}"`,
        `"${(e.element_text || '').replace(/"/g, '""')}"`, e.session_id,
        e.user_id || '', format(new Date(e.created_at), "yyyy-MM-dd HH:mm:ss")
      ].join(","))
    ];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `clickstream_${format(new Date(), "yyyy-MM-dd_HH-mm")}.csv`;
    link.click();
    toast.success(`Exported ${events.length} events`);
  }, [events]);

  const stats = {
    totalEvents: events?.length || 0,
    uniqueSessions: new Set(events?.map(e => e.session_id)).size,
    clicks: events?.filter(e => e.event_type === "click").length || 0,
    pageViews: events?.filter(e => e.event_type === "pageview").length || 0,
  };

  const topPages = events?.reduce((acc, event) => {
    if (event.page_url) acc[event.page_url] = (acc[event.page_url] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const sortedPages = Object.entries(topPages).sort(([, a], [, b]) => b - a).slice(0, 5);

  const getEventBadge = (type: string) => {
    const colors: Record<string, string> = {
      click: "bg-primary/20 text-primary",
      pageview: "bg-secondary/20 text-secondary-foreground",
      scroll: "bg-accent/20 text-accent-foreground",
    };
    return colors[type] || colors.click;
  };

  // Render content based on active section
  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card><CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-primary/10"><BarChart3 className="h-5 w-5 text-primary" /></div>
                  <div><p className="text-2xl font-bold">{stats.totalEvents}</p><p className="text-sm text-muted-foreground">Total Events</p></div>
                </div>
              </CardContent></Card>
              <Card><CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-purple-500/10"><Users className="h-5 w-5 text-purple-600" /></div>
                  <div><p className="text-2xl font-bold">{stats.uniqueSessions}</p><p className="text-sm text-muted-foreground">Sessions</p></div>
                </div>
              </CardContent></Card>
              <Card><CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-red-500/10"><MousePointer className="h-5 w-5 text-red-500" /></div>
                  <div><p className="text-2xl font-bold">{stats.clicks}</p><p className="text-sm text-muted-foreground">Clicks</p></div>
                </div>
              </CardContent></Card>
              <Card><CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-blue-500/10"><Eye className="h-5 w-5 text-blue-500" /></div>
                  <div><p className="text-2xl font-bold">{stats.pageViews}</p><p className="text-sm text-muted-foreground">Page Views</p></div>
                </div>
              </CardContent></Card>
            </div>

            {/* Top Pages & Recent Events */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle className="text-base">Top Pages</CardTitle></CardHeader>
                <CardContent>
                  {sortedPages.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No page data</p>
                  ) : (
                    <div className="space-y-3">
                      {sortedPages.map(([page, count], idx) => (
                        <div key={page} className="flex items-center justify-between">
                          <span className="text-sm truncate flex-1">{page}</span>
                          <Badge variant="secondary">{count}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center justify-between">
                    Recent Events
                    <Button variant="ghost" size="sm" onClick={() => setEventsExpanded(!eventsExpanded)}>
                      {eventsExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {events?.slice(0, eventsExpanded ? 20 : 5).map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-2 rounded bg-muted/30">
                        <div className="flex items-center gap-2">
                          <Badge className={getEventBadge(event.event_type)}>{event.event_type}</Badge>
                          <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                            {event.element_text || event.page_url}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(event.created_at), "HH:mm:ss")}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "funnel":
        return <ConversionFunnel events={events || []} />;

      case "journeys":
        return <UserJourney events={events || []} />;

      case "clicks":
        return (
          <Card>
            <CardHeader><CardTitle>Click Analysis</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Element</TableHead>
                    <TableHead>Page</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events?.filter(e => e.event_type === "click").slice(0, 20).map(event => (
                    <TableRow key={event.id}>
                      <TableCell className="max-w-[200px] truncate">{event.element_text || event.element_id || "Unknown"}</TableCell>
                      <TableCell className="max-w-[150px] truncate">{event.page_url}</TableCell>
                      <TableCell>{format(new Date(event.created_at), "MMM d, HH:mm:ss")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        );

      case "click-heatmap":
      case "scroll-heatmap":
        return <ClickHeatmap events={events || []} />;

      case "session-replay":
        return <RRWebPlayer />;

      case "device-analytics":
        return <DeviceAnalytics events={events || []} />;

      case "geo-analytics":
        return <GeoAnalytics events={events || []} />;

      case "events":
        return (
          <Card>
            <CardHeader><CardTitle>All Events</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Element</TableHead>
                    <TableHead>Page</TableHead>
                    <TableHead>Session</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events?.slice(0, 50).map(event => (
                    <TableRow key={event.id}>
                      <TableCell><Badge className={getEventBadge(event.event_type)}>{event.event_type}</Badge></TableCell>
                      <TableCell className="max-w-[150px] truncate">{event.element_text || "-"}</TableCell>
                      <TableCell className="max-w-[150px] truncate">{event.page_url}</TableCell>
                      <TableCell className="font-mono text-xs">{event.session_id.slice(0, 8)}...</TableCell>
                      <TableCell>{format(new Date(event.created_at), "MMM d, HH:mm:ss")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        );

      default:
        return <div className="text-center py-12 text-muted-foreground">Select a section from the sidebar</div>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-3xl font-bold">Clickstream Analytics</h1>
            <p className="text-muted-foreground">Track user interactions and behavior</p>
          </div>
          <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }}>
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
              <Radio className="h-3 w-3 mr-1 animate-pulse" />Live
            </Badge>
          </motion.div>
          {liveEventsCount > 0 && (
            <Badge variant="secondary" className="bg-primary/10 text-primary">+{liveEventsCount} new</Badge>
          )}
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm"><Trash2 className="h-4 w-4 mr-1" />Delete All</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle><AlertTriangle className="h-5 w-5 inline mr-2 text-destructive" />Delete All Data?</AlertDialogTitle>
                <AlertDialogDescription>This will permanently delete {stats.totalEvents} events.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteAllData} disabled={isDeleting} className="bg-destructive">
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button variant="outline" size="sm" onClick={exportToCSV}><Download className="h-4 w-4 mr-1" />Export</Button>
          <Button variant={notificationsEnabled ? "secondary" : "outline"} size="sm" onClick={() => setNotificationsEnabled(!notificationsEnabled)}>
            <Bell className={`h-4 w-4 mr-1 ${notificationsEnabled ? "text-primary" : ""}`} />
            {notificationsEnabled ? "Alerts On" : "Alerts Off"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? "animate-spin" : ""}`} />Refresh
          </Button>
          <DateRangePicker 
            value={timeRange} 
            onChange={(value, range) => { setTimeRange(value); setCustomDateRange(range || null); }}
            customRange={customDateRange}
          />
          <Select value={eventFilter} onValueChange={setEventFilter}>
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              <SelectItem value="click">Clicks</SelectItem>
              <SelectItem value="pageview">Page Views</SelectItem>
              <SelectItem value="scroll">Scrolls</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tree Navigation Layout */}
      <ClickstreamLayout activeSection={activeSection} onSectionChange={setActiveSection}>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />)}
          </div>
        ) : (
          renderContent()
        )}
      </ClickstreamLayout>
    </div>
  );
};
