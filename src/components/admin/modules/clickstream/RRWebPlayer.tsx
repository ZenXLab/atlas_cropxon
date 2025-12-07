import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Video, 
  Clock,
  Monitor,
  RefreshCw
} from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import rrwebPlayer from "rrweb-player";
import "rrweb-player/dist/style.css";

interface SessionRecording {
  id: string;
  session_id: string;
  events: any[];
  start_time: string;
  end_time: string | null;
  duration_ms: number | null;
  page_count: number | null;
  event_count: number | null;
  metadata: any;
  created_at: string;
}

export const RRWebPlayer = () => {
  const [selectedRecording, setSelectedRecording] = useState<SessionRecording | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const playerRef = useRef<rrwebPlayer | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch recordings from database
  const { data: recordings, isLoading, refetch } = useQuery({
    queryKey: ["session-recordings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("session_recordings")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) {
        console.error("Error fetching recordings:", error);
        throw error;
      }
      
      return (data || []) as SessionRecording[];
    },
  });

  // Initialize player when recording is selected
  useEffect(() => {
    if (!selectedRecording || !containerRef.current) return;

    // Clean up existing player
    if (playerRef.current) {
      playerRef.current.pause();
      playerRef.current = null;
      containerRef.current.innerHTML = "";
    }

    const events = selectedRecording.events;
    if (!events || events.length < 2) {
      console.warn("Not enough events to play");
      return;
    }

    try {
      playerRef.current = new rrwebPlayer({
        target: containerRef.current,
        props: {
          events: events,
          width: 800,
          height: 450,
          autoPlay: false,
          showController: false,
          speedOption: [0.5, 1, 2, 4],
        },
      });

      // Listen to player events
      playerRef.current.addEventListener("ui-update-current-time", (e: any) => {
        const currentTime = e.payload;
        const totalTime = selectedRecording.duration_ms || 1;
        setProgress((currentTime / totalTime) * 100);
      });

      playerRef.current.addEventListener("finish", () => {
        setIsPlaying(false);
        setProgress(100);
      });

      console.log("rrweb player initialized with", events.length, "events");
    } catch (err) {
      console.error("Error initializing rrweb player:", err);
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.pause();
      }
    };
  }, [selectedRecording]);

  const handlePlay = () => {
    if (playerRef.current) {
      playerRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (playerRef.current) {
      playerRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (value: number[]) => {
    if (playerRef.current && selectedRecording?.duration_ms) {
      const time = (value[0] / 100) * selectedRecording.duration_ms;
      playerRef.current.goto(time);
      setProgress(value[0]);
    }
  };

  const handleSpeedChange = (speed: string) => {
    if (playerRef.current) {
      playerRef.current.setSpeed(Number(speed));
    }
  };

  const formatDuration = (ms: number | null) => {
    if (!ms) return "0:00";
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-16">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Video className="h-6 w-6" />
            Session Replay (rrweb)
          </h2>
          <p className="text-muted-foreground">
            Watch real user sessions with DOM recording
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-500/30">
            Pro Feature
          </Badge>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Session List */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recorded Sessions</CardTitle>
            <CardDescription>
              {recordings?.length || 0} sessions available
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[500px] overflow-y-auto">
              {recordings?.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  <Video className="h-12 w-12 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No recordings yet</p>
                  <p className="text-xs">Sessions will appear as users browse</p>
                </div>
              ) : (
                recordings?.map((recording, idx) => (
                  <motion.button
                    key={recording.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    onClick={() => {
                      setSelectedRecording(recording);
                      setIsPlaying(false);
                      setProgress(0);
                    }}
                    className={`w-full p-3 border-b text-left transition-colors hover:bg-muted/50 ${
                      selectedRecording?.id === recording.id
                        ? "bg-primary/10 border-l-2 border-l-primary"
                        : ""
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs text-muted-foreground">
                        {recording.session_id.slice(0, 12)}...
                      </span>
                      <Badge variant="outline" className="text-[10px]">
                        {recording.event_count || 0} events
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span>
                        {format(new Date(recording.start_time), "MMM d, HH:mm")}
                      </span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">
                        {formatDuration(recording.duration_ms)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Monitor className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {recording.metadata?.screenWidth}x{recording.metadata?.screenHeight}
                      </span>
                    </div>
                  </motion.button>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Player */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                Playback
                {isPlaying && (
                  <Badge variant="outline" className="ml-2 bg-red-500/10 text-red-500 border-red-500/30">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse mr-1" />
                    Playing
                  </Badge>
                )}
              </CardTitle>
              <Select defaultValue="1" onValueChange={handleSpeedChange}>
                <SelectTrigger className="w-20 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.5">0.5x</SelectItem>
                  <SelectItem value="1">1x</SelectItem>
                  <SelectItem value="2">2x</SelectItem>
                  <SelectItem value="4">4x</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {!selectedRecording ? (
              <div className="h-[450px] flex items-center justify-center bg-muted/30 rounded-lg border-2 border-dashed">
                <div className="text-center text-muted-foreground">
                  <Video className="h-16 w-16 mx-auto mb-4 opacity-30" />
                  <p>Select a session to watch</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Player Container */}
                <div 
                  ref={containerRef} 
                  className="bg-slate-900 rounded-lg overflow-hidden"
                  style={{ minHeight: "450px" }}
                />

                {/* Progress Bar */}
                <div className="space-y-2">
                  <Slider
                    value={[progress]}
                    onValueChange={handleSeek}
                    max={100}
                    step={0.1}
                    className="cursor-pointer"
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {formatDuration((progress / 100) * (selectedRecording.duration_ms || 0))}
                    </span>
                    <span>{formatDuration(selectedRecording.duration_ms)}</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleSeek([0])}
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    onClick={isPlaying ? handlePause : handlePlay}
                    className="h-12 w-12"
                  >
                    {isPlaying ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5 ml-0.5" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleSeek([100])}
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
