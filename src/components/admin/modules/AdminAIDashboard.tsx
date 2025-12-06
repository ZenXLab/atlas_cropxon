import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Brain, MessageSquare, Zap, Target, TrendingUp, Clock,
  CheckCircle, XCircle, AlertTriangle, Search, Filter,
  Bot, Workflow, BarChart3, Activity
} from "lucide-react";
import { format } from "date-fns";

export const AdminAIDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("overview");

  // Mock data for AI metrics (in production, this would come from your AI service)
  const aiMetrics = {
    totalQueries: 1247,
    successRate: 94.2,
    avgResponseTime: 1.8,
    automationsRun: 856,
    costSavings: 12500,
    activeWorkflows: 8
  };

  const chatLogs = [
    { id: 1, user: "john@company.com", query: "How do I reset my password?", response: "You can reset your password by...", status: "success", timestamp: new Date(), responseTime: 1.2 },
    { id: 2, user: "sarah@startup.io", query: "What are the pricing plans?", response: "Our pricing plans include...", status: "success", timestamp: new Date(Date.now() - 3600000), responseTime: 0.9 },
    { id: 3, user: "mike@enterprise.com", query: "Integration with Salesforce", response: "To integrate with Salesforce...", status: "success", timestamp: new Date(Date.now() - 7200000), responseTime: 2.1 },
    { id: 4, user: "anna@tech.co", query: "API rate limits", response: "Error: Unable to process", status: "error", timestamp: new Date(Date.now() - 10800000), responseTime: 5.0 },
    { id: 5, user: "bob@agency.net", query: "Custom automation setup", response: "Custom automations can be...", status: "success", timestamp: new Date(Date.now() - 14400000), responseTime: 1.5 },
  ];

  const automations = [
    { id: 1, name: "Lead Score Calculation", triggers: 245, lastRun: new Date(), status: "active", type: "scheduled" },
    { id: 2, name: "Welcome Email Sequence", triggers: 89, lastRun: new Date(Date.now() - 3600000), status: "active", type: "event" },
    { id: 3, name: "Invoice Reminder", triggers: 156, lastRun: new Date(Date.now() - 7200000), status: "active", type: "scheduled" },
    { id: 4, name: "Ticket Auto-Assignment", triggers: 423, lastRun: new Date(Date.now() - 1800000), status: "active", type: "event" },
    { id: 5, name: "Project Status Update", triggers: 67, lastRun: new Date(Date.now() - 86400000), status: "paused", type: "scheduled" },
  ];

  const workflows = [
    { id: 1, name: "Client Onboarding", steps: 5, completions: 34, avgTime: "2.3 days", status: "active" },
    { id: 2, name: "Project Kickoff", steps: 8, completions: 21, avgTime: "4.1 days", status: "active" },
    { id: 3, name: "Invoice Processing", steps: 3, completions: 156, avgTime: "1.2 hours", status: "active" },
    { id: 4, name: "Support Escalation", steps: 4, completions: 89, avgTime: "45 mins", status: "active" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success": case "active": return "text-green-500";
      case "error": case "paused": return "text-red-500";
      case "warning": return "text-yellow-500";
      default: return "text-muted-foreground";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success": case "active": return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Active</Badge>;
      case "error": return <Badge variant="destructive">Error</Badge>;
      case "paused": return <Badge variant="secondary">Paused</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AI & Automation</h1>
        <p className="text-muted-foreground">Monitor AI performance, chatbot logs, and automation workflows</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Queries</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{aiMetrics.totalQueries.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{aiMetrics.successRate}%</div>
            <p className="text-xs text-muted-foreground">+2.1% improvement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{aiMetrics.avgResponseTime}s</div>
            <p className="text-xs text-muted-foreground">-0.3s from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Automations</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{aiMetrics.automationsRun}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Cost Savings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">${aiMetrics.costSavings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Estimated savings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Workflows</CardTitle>
            <Workflow className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{aiMetrics.activeWorkflows}</div>
            <p className="text-xs text-muted-foreground">Active workflows</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different sections */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-none lg:flex">
          <TabsTrigger value="overview" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="chatbot" className="gap-2">
            <Bot className="h-4 w-4" />
            Chatbot Logs
          </TabsTrigger>
          <TabsTrigger value="automations" className="gap-2">
            <Zap className="h-4 w-4" />
            Automations
          </TabsTrigger>
          <TabsTrigger value="workflows" className="gap-2">
            <Workflow className="h-4 w-4" />
            Workflows
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>AI Performance Overview</CardTitle>
                <CardDescription>Query processing and accuracy metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Successful Queries</span>
                  <span className="font-medium text-green-500">1,175</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Failed Queries</span>
                  <span className="font-medium text-red-500">72</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avg Confidence Score</span>
                  <span className="font-medium">87.3%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">RAG Retrieval Accuracy</span>
                  <span className="font-medium">91.2%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest AI agent interactions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {chatLogs.slice(0, 4).map((log) => (
                  <div key={log.id} className="flex items-center gap-3 text-sm">
                    {log.status === "success" ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="truncate">{log.query}</p>
                      <p className="text-xs text-muted-foreground">{log.user}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{log.responseTime}s</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="chatbot" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Chatbot Conversation Logs</CardTitle>
                  <CardDescription>All AI chatbot interactions and responses</CardDescription>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search conversations..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    className="pl-9 w-64" 
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Query</TableHead>
                    <TableHead>Response</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {chatLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.user}</TableCell>
                      <TableCell className="max-w-48 truncate">{log.query}</TableCell>
                      <TableCell className="max-w-48 truncate">{log.response}</TableCell>
                      <TableCell>
                        {log.status === "success" ? (
                          <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Success</Badge>
                        ) : (
                          <Badge variant="destructive">Error</Badge>
                        )}
                      </TableCell>
                      <TableCell>{log.responseTime}s</TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(log.timestamp, "MMM d, HH:mm")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automations" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Automation Triggers</CardTitle>
                  <CardDescription>Active automations and their execution history</CardDescription>
                </div>
                <Button>
                  <Zap className="h-4 w-4 mr-2" />
                  New Automation
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Automation</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Triggers</TableHead>
                    <TableHead>Last Run</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {automations.map((automation) => (
                    <TableRow key={automation.id}>
                      <TableCell className="font-medium">{automation.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{automation.type}</Badge>
                      </TableCell>
                      <TableCell>{automation.triggers}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(automation.lastRun, "MMM d, HH:mm")}
                      </TableCell>
                      <TableCell>{getStatusBadge(automation.status)}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Workflow Management</CardTitle>
                  <CardDescription>Multi-step automated workflows</CardDescription>
                </div>
                <Button>
                  <Workflow className="h-4 w-4 mr-2" />
                  Create Workflow
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {workflows.map((workflow) => (
                  <Card key={workflow.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold">{workflow.name}</h4>
                        {getStatusBadge(workflow.status)}
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Steps</p>
                          <p className="font-medium">{workflow.steps}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Completions</p>
                          <p className="font-medium">{workflow.completions}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Avg Time</p>
                          <p className="font-medium">{workflow.avgTime}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">View</Button>
                        <Button variant="outline" size="sm" className="flex-1">Edit</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
