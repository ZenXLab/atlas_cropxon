import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, MessageSquare, Zap, TrendingUp, Clock,
  CheckCircle, DollarSign
} from "lucide-react";

interface PortalAIDashboardProps {
  userId?: string;
}

export const PortalAIDashboard = ({ userId }: PortalAIDashboardProps) => {
  // Mock data for client AI usage
  const aiStats = {
    totalQueries: 156,
    automationsRun: 42,
    costSavings: 2450,
    avgResponseTime: 1.4,
    successRate: 96.8
  };

  const recentLogs = [
    { id: 1, query: "Process invoice #INV-2024-0123", status: "success", timestamp: new Date(), cost: 0.12 },
    { id: 2, query: "Generate project report", status: "success", timestamp: new Date(Date.now() - 3600000), cost: 0.08 },
    { id: 3, query: "Analyze customer feedback", status: "success", timestamp: new Date(Date.now() - 7200000), cost: 0.15 },
    { id: 4, query: "Extract data from document", status: "success", timestamp: new Date(Date.now() - 10800000), cost: 0.10 },
  ];

  const automations = [
    { id: 1, name: "Daily Report Generation", runs: 24, lastRun: "Today, 6:00 AM", savings: 120 },
    { id: 2, name: "Invoice Processing", runs: 18, lastRun: "Today, 9:30 AM", savings: 450 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">AI Automation Dashboard</h1>
        <p className="text-muted-foreground">Monitor your AI-powered automations and savings</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Queries</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{aiStats.totalQueries}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Automations</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{aiStats.automationsRun}</div>
            <p className="text-xs text-muted-foreground">Executed this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Cost Savings</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">${aiStats.costSavings}</div>
            <p className="text-xs text-muted-foreground">Estimated savings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{aiStats.successRate}%</div>
            <p className="text-xs text-muted-foreground">Query accuracy</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Queries */}
        <Card>
          <CardHeader>
            <CardTitle>Recent AI Queries</CardTitle>
            <CardDescription>Latest AI interactions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentLogs.map((log) => (
              <div key={log.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{log.query}</p>
                  <p className="text-xs text-muted-foreground">
                    {log.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                <Badge variant="outline">${log.cost.toFixed(2)}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Active Automations */}
        <Card>
          <CardHeader>
            <CardTitle>Active Automations</CardTitle>
            <CardDescription>Your automated workflows</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {automations.map((automation) => (
              <div key={automation.id} className="p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{automation.name}</h4>
                  <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Active</Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Runs</p>
                    <p className="font-medium">{automation.runs}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Last Run</p>
                    <p className="font-medium">{automation.lastRun}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Savings</p>
                    <p className="font-medium text-green-500">${automation.savings}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
