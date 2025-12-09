import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Maximize2,
  Monitor,
  Smartphone,
  Tablet,
  AlertTriangle,
  MousePointer,
  Clock,
  Activity,
  Code,
  GitBranch,
  ExternalLink,
  Copy,
  Sparkles,
  Zap,
  Network,
  Eye,
  EyeOff,
  ChevronRight,
  FileCode,
  Bug
} from "lucide-react";
import { cn } from "@/lib/utils";

const timelineEvents = [
  { time: "0:00", type: "pageview", label: "Page Load", page: "/checkout" },
  { time: "0:12", type: "click", label: "Add to Cart Button" },
  { time: "0:18", type: "input", label: "Email Input Focus" },
  { time: "0:34", type: "error", label: "Validation Error" },
  { time: "0:45", type: "rage_click", label: "Rage Click Detected" },
  { time: "1:02", type: "api_error", label: "API 500 Error" },
  { time: "1:15", type: "click", label: "Retry Button" },
  { time: "1:28", type: "success", label: "Form Submitted" },
];

const aiSummary = {
  tldr: "User experienced checkout friction due to OTP validation failure. Rage clicks detected on submit button. Root cause traced to API timeout.",
  keyMoments: [
    { time: "0:34", description: "First validation error appeared" },
    { time: "0:45", description: "User showed frustration (rage clicks)" },
    { time: "1:02", description: "Backend API returned 500 error" },
  ],
  rootCause: {
    description: "Payment gateway timeout causing validation state mismatch",
    code: "ComponentX at /src/components/Checkout/OTPInput.tsx::line53",
    commit: "abc123f",
    confidence: 92
  },
  suggestedFix: {
    description: "Add retry logic with exponential backoff for OTP validation API calls",
    code: `// Suggested fix in OTPInput.tsx
const validateOTP = async (otp: string) => {
  return await retryWithBackoff(
    () => api.validateOTP(otp),
    { maxRetries: 3, initialDelay: 1000 }
  );
};`,
    confidence: 87
  }
};

export const TraceflowSessionReplay = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [currentTime, setCurrentTime] = useState(45);
  const [showNetwork, setShowNetwork] = useState(true);
  const [showErrors, setShowErrors] = useState(true);
  const [showDOMHighlight, setShowDOMHighlight] = useState(true);
  const [deviceView, setDeviceView] = useState<"desktop" | "tablet" | "mobile">("mobile");

  const getEventIcon = (type: string) => {
    switch (type) {
      case "pageview": return <Eye className="h-3 w-3" />;
      case "click": return <MousePointer className="h-3 w-3" />;
      case "input": return <Code className="h-3 w-3" />;
      case "error": return <AlertTriangle className="h-3 w-3 text-amber-500" />;
      case "rage_click": return <Zap className="h-3 w-3 text-red-500" />;
      case "api_error": return <Bug className="h-3 w-3 text-red-500" />;
      case "success": return <Activity className="h-3 w-3 text-emerald-500" />;
      default: return <Activity className="h-3 w-3" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              <ChevronRight className="h-4 w-4 rotate-180 mr-1" />
              Back to Sessions
            </Button>
            <div className="h-4 w-px bg-border" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">Session #sess_abc123</span>
                <Badge variant="destructive" className="text-[10px]">Has Errors</Badge>
              </div>
              <span className="text-xs text-muted-foreground">Dec 9, 2025 • 4:32 duration • Mobile iOS</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <ExternalLink className="h-3 w-3 mr-1" />
              Share
            </Button>
            <Button className="bg-gradient-to-r from-[#0B3D91] to-[#00C2D8] text-white">
              <GitBranch className="h-3 w-3 mr-1" />
              Create Jira Ticket
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-57px)]">
        {/* Left Panel - Timeline & Controls */}
        <aside className="w-72 border-r bg-white/50 flex flex-col">
          {/* Playback Controls */}
          <div className="p-4 border-b bg-white/80">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button 
                size="icon" 
                className="h-10 w-10 bg-gradient-to-r from-[#0B3D91] to-[#00C2D8]"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>0:45</span>
                <span>4:32</span>
              </div>
              <Slider 
                value={[currentTime]} 
                max={272} 
                step={1}
                onValueChange={(v) => setCurrentTime(v[0])}
                className="cursor-pointer"
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Speed</span>
                <div className="flex gap-1">
                  {[0.5, 1, 2, 4].map((speed) => (
                    <Button
                      key={speed}
                      variant={playbackSpeed === speed ? "default" : "ghost"}
                      size="sm"
                      className={cn(
                        "h-6 px-2 text-xs",
                        playbackSpeed === speed && "bg-[#0B3D91]"
                      )}
                      onClick={() => setPlaybackSpeed(speed)}
                    >
                      {speed}x
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Events */}
          <ScrollArea className="flex-1 p-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Event Timeline
            </h3>
            <div className="space-y-1">
              {timelineEvents.map((event, index) => (
                <button
                  key={index}
                  className={cn(
                    "w-full flex items-center gap-3 p-2 rounded-lg text-left transition-all hover:bg-muted/50",
                    event.type === "rage_click" || event.type === "api_error" 
                      ? "bg-red-50 border border-red-200" 
                      : ""
                  )}
                >
                  <span className="text-xs font-mono text-muted-foreground w-8">{event.time}</span>
                  {getEventIcon(event.type)}
                  <span className="text-xs truncate flex-1">{event.label}</span>
                </button>
              ))}
            </div>
          </ScrollArea>

          {/* Overlay Toggles */}
          <div className="p-4 border-t bg-white/80 space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Overlays
            </h3>
            <div className="flex items-center justify-between">
              <Label htmlFor="network" className="text-xs">Network</Label>
              <Switch id="network" checked={showNetwork} onCheckedChange={setShowNetwork} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="errors" className="text-xs">Errors</Label>
              <Switch id="errors" checked={showErrors} onCheckedChange={setShowErrors} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="dom" className="text-xs">DOM Highlights</Label>
              <Switch id="dom" checked={showDOMHighlight} onCheckedChange={setShowDOMHighlight} />
            </div>
          </div>
        </aside>

        {/* Center - Replay Pane */}
        <main className="flex-1 p-6 flex flex-col">
          {/* Device Selector */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {[
                { id: "desktop", icon: Monitor, label: "Desktop" },
                { id: "tablet", icon: Tablet, label: "Tablet" },
                { id: "mobile", icon: Smartphone, label: "Mobile" },
              ].map((device) => (
                <Button
                  key={device.id}
                  variant={deviceView === device.id ? "default" : "ghost"}
                  size="sm"
                  className={cn(deviceView === device.id && "bg-[#0B3D91]")}
                  onClick={() => setDeviceView(device.id as any)}
                >
                  <device.icon className="h-3 w-3 mr-1" />
                  {device.label}
                </Button>
              ))}
            </div>
            <Button variant="ghost" size="sm">
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Device Frame */}
          <div className="flex-1 flex items-center justify-center bg-slate-100 rounded-2xl p-8">
            <div className={cn(
              "bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-slate-800 relative transition-all duration-300",
              deviceView === "mobile" && "w-[375px] h-[667px]",
              deviceView === "tablet" && "w-[768px] h-[500px]",
              deviceView === "desktop" && "w-full max-w-[900px] h-[500px] rounded-xl border-4"
            )}>
              {/* Notch for mobile */}
              {deviceView === "mobile" && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-2xl z-10" />
              )}
              
              {/* Mock Session Content */}
              <div className="h-full bg-gradient-to-b from-slate-50 to-white p-4 pt-8">
                <div className="space-y-4">
                  <div className="h-8 w-32 bg-slate-200 rounded animate-pulse" />
                  <div className="h-12 w-full bg-slate-100 rounded-lg border" />
                  <div className="h-12 w-full bg-slate-100 rounded-lg border" />
                  
                  {/* Highlighted error element */}
                  {showDOMHighlight && (
                    <div className="relative">
                      <div className="h-12 w-full bg-red-50 rounded-lg border-2 border-red-400 animate-pulse" />
                      <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px]">
                        Rage Click
                      </Badge>
                    </div>
                  )}
                  
                  <div className="h-10 w-full bg-gradient-to-r from-[#0B3D91] to-[#00C2D8] rounded-lg" />
                </div>
                
                {/* Network overlay */}
                {showNetwork && (
                  <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 text-white p-2 rounded-lg text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <Network className="h-3 w-3 text-red-400" />
                      <span>POST /api/validate-otp</span>
                      <Badge variant="destructive" className="text-[9px]">500</Badge>
                      <span className="text-red-400">2341ms</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Right Panel - AI Summary */}
        <aside className="w-96 border-l bg-white/50 flex flex-col">
          <Tabs defaultValue="summary" className="flex-1 flex flex-col">
            <TabsList className="mx-4 mt-4 grid grid-cols-3">
              <TabsTrigger value="summary" className="text-xs">AI Summary</TabsTrigger>
              <TabsTrigger value="code" className="text-xs">Code Context</TabsTrigger>
              <TabsTrigger value="logs" className="text-xs">Logs</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-4">
                  {/* TL;DR */}
                  <Card className="bg-gradient-to-br from-[#0B3D91]/5 to-[#00C2D8]/10 border-0">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="h-4 w-4 text-[#0B3D91]" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#0B3D91]">TL;DR</span>
                      </div>
                      <p className="text-sm leading-relaxed">{aiSummary.tldr}</p>
                    </CardContent>
                  </Card>

                  {/* Key Moments */}
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      Key Moments
                    </h4>
                    <div className="space-y-2">
                      {aiSummary.keyMoments.map((moment, i) => (
                        <button
                          key={i}
                          className="w-full flex items-center gap-3 p-2 rounded-lg bg-white hover:bg-muted/50 transition-all text-left border"
                        >
                          <span className="text-xs font-mono text-[#0B3D91] font-semibold">{moment.time}</span>
                          <span className="text-xs">{moment.description}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Root Cause */}
                  <Card className="border-l-4 border-l-red-500">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Bug className="h-4 w-4 text-red-500" />
                        Root Cause Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground mb-3">{aiSummary.rootCause.description}</p>
                      <div className="bg-slate-900 rounded-lg p-3 font-mono text-xs text-emerald-400 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileCode className="h-3 w-3" />
                          <span>{aiSummary.rootCause.code}</span>
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-white">
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <GitBranch className="h-3 w-3" />
                        <span>Commit: {aiSummary.rootCause.commit}</span>
                        <Badge variant="outline" className="text-[10px]">{aiSummary.rootCause.confidence}% confidence</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Suggested Fix */}
                  <Card className="border-l-4 border-l-emerald-500">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-emerald-500" />
                        Suggested Fix
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground mb-3">{aiSummary.suggestedFix.description}</p>
                      <div className="bg-slate-900 rounded-lg p-3 font-mono text-xs text-slate-300 overflow-x-auto">
                        <pre className="whitespace-pre-wrap">{aiSummary.suggestedFix.code}</pre>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <Badge variant="outline" className="text-[10px]">{aiSummary.suggestedFix.confidence}% confidence</Badge>
                        <Button size="sm" className="bg-[#FF8A00] hover:bg-[#FF8A00]/90 text-white text-xs">
                          Create PR with Fix
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Create Ticket */}
                  <Button className="w-full bg-gradient-to-r from-[#0B3D91] to-[#00C2D8] text-white">
                    <GitBranch className="h-4 w-4 mr-2" />
                    Create Jira Ticket with Full Context
                  </Button>
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="code" className="flex-1 p-4">
              <div className="bg-slate-900 rounded-lg p-4 h-full text-xs font-mono text-slate-300">
                <div className="text-emerald-400 mb-2">// OTPInput.tsx:53</div>
                <pre className="text-red-400">const validateOTP = async (otp) =&gt; {"{"}</pre>
                <pre className="text-slate-400 pl-4">const response = await api.post('/validate', {"{"} otp {"}"});</pre>
                <pre className="text-slate-400 pl-4">// No retry logic or timeout handling</pre>
                <pre className="text-slate-400 pl-4">return response.data;</pre>
                <pre className="text-red-400">{"}"}</pre>
              </div>
            </TabsContent>

            <TabsContent value="logs" className="flex-1 p-4">
              <div className="space-y-2 text-xs font-mono">
                <div className="bg-slate-100 p-2 rounded flex gap-2">
                  <span className="text-muted-foreground">10:45:02</span>
                  <span className="text-blue-600">[INFO]</span>
                  <span>User initiated OTP validation</span>
                </div>
                <div className="bg-red-50 p-2 rounded flex gap-2 border border-red-200">
                  <span className="text-muted-foreground">10:45:04</span>
                  <span className="text-red-600">[ERROR]</span>
                  <span>API timeout after 2341ms</span>
                </div>
                <div className="bg-amber-50 p-2 rounded flex gap-2 border border-amber-200">
                  <span className="text-muted-foreground">10:45:04</span>
                  <span className="text-amber-600">[WARN]</span>
                  <span>Rage click detected on submit button</span>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </aside>
      </div>
    </div>
  );
};

export default TraceflowSessionReplay;
