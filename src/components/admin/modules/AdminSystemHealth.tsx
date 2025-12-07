import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Cpu, 
  HardDrive, 
  MemoryStick,
  Wifi,
  Database,
  Server,
  Cloud,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Clock,
  Zap,
  Globe
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const performanceData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  cpu: Math.floor(Math.random() * 40) + 20,
  memory: Math.floor(Math.random() * 30) + 40,
  requests: Math.floor(Math.random() * 1000) + 500
}));

const services = [
  { name: 'API Gateway', status: 'healthy', latency: 45, uptime: 99.99 },
  { name: 'Database Primary', status: 'healthy', latency: 12, uptime: 99.98 },
  { name: 'Database Replica', status: 'healthy', latency: 15, uptime: 99.97 },
  { name: 'Redis Cache', status: 'healthy', latency: 3, uptime: 99.99 },
  { name: 'Edge Functions', status: 'healthy', latency: 89, uptime: 99.95 },
  { name: 'Storage CDN', status: 'healthy', latency: 28, uptime: 99.99 },
  { name: 'Email Service', status: 'degraded', latency: 450, uptime: 98.5 },
  { name: 'Background Jobs', status: 'healthy', latency: 0, uptime: 99.9 },
];

const incidents = [
  { id: 1, title: 'Email delivery delays', status: 'investigating', time: '15 mins ago', severity: 'warning' },
  { id: 2, title: 'Scheduled maintenance complete', status: 'resolved', time: '2 hours ago', severity: 'info' },
];

export const AdminSystemHealth = () => {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const overallHealth = services.filter(s => s.status === 'healthy').length / services.length * 100;
  const avgLatency = services.reduce((acc, s) => acc + s.latency, 0) / services.length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'degraded': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'down': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'degraded': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'down': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-green-500/10">
            <Activity className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">System Health</h1>
            <p className="text-muted-foreground">Real-time infrastructure monitoring</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={overallHealth === 100 ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}>
            <CheckCircle2 className="w-3 h-3 mr-1" />
            {overallHealth.toFixed(0)}% Operational
          </Badge>
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-500/10 to-transparent border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-green-500 mb-2">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-medium">Uptime</span>
            </div>
            <p className="text-2xl font-bold text-foreground">99.97%</p>
            <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-blue-500 mb-2">
              <Zap className="w-4 h-4" />
              <span className="text-xs font-medium">Avg Latency</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{avgLatency.toFixed(0)}ms</p>
            <p className="text-xs text-muted-foreground mt-1">P50 response</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-purple-500 mb-2">
              <Globe className="w-4 h-4" />
              <span className="text-xs font-medium">Requests/min</span>
            </div>
            <p className="text-2xl font-bold text-foreground">1.2K</p>
            <p className="text-xs text-muted-foreground mt-1">Current rate</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-500/10 to-transparent border-cyan-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-cyan-500 mb-2">
              <Server className="w-4 h-4" />
              <span className="text-xs font-medium">Services</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{services.filter(s => s.status === 'healthy').length}/{services.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Healthy</p>
          </CardContent>
        </Card>
      </div>

      {/* Resource Usage */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-blue-500" />
                <span className="font-medium">CPU Usage</span>
              </div>
              <span className="text-lg font-bold">34%</span>
            </div>
            <Progress value={34} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">4 cores / 8 vCPU</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MemoryStick className="w-4 h-4 text-purple-500" />
                <span className="font-medium">Memory</span>
              </div>
              <span className="text-lg font-bold">62%</span>
            </div>
            <Progress value={62} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">5.0 GB / 8 GB</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-green-500" />
                <span className="font-medium">Storage</span>
              </div>
              <span className="text-lg font-bold">28%</span>
            </div>
            <Progress value={28} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">28 GB / 100 GB</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Services */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>System Performance</CardTitle>
            <CardDescription>CPU and Memory over last 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(188, 94%, 43%)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(188, 94%, 43%)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="memGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(190, 15%, 20%)" />
                  <XAxis dataKey="time" stroke="hsl(190, 30%, 40%)" fontSize={10} />
                  <YAxis stroke="hsl(190, 30%, 40%)" fontSize={10} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(190, 40%, 12%)', 
                      border: '1px solid hsl(190, 25%, 22%)',
                      borderRadius: '8px'
                    }}
                  />
                  <Area type="monotone" dataKey="cpu" name="CPU %" stroke="hsl(188, 94%, 43%)" fill="url(#cpuGradient)" />
                  <Area type="monotone" dataKey="memory" name="Memory %" stroke="hsl(262, 83%, 58%)" fill="url(#memGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Services Status */}
        <Card>
          <CardHeader>
            <CardTitle>Service Status</CardTitle>
            <CardDescription>All infrastructure components</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[250px] overflow-y-auto">
              {services.map((service) => (
                <div key={service.name} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(service.status)}
                    <div>
                      <p className="font-medium text-sm">{service.name}</p>
                      <p className="text-xs text-muted-foreground">{service.uptime}% uptime</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(service.status)}>
                      {service.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{service.latency}ms</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Incidents */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Incidents</CardTitle>
          <CardDescription>System alerts and resolved issues</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {incidents.map((incident) => (
              <div key={incident.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  {incident.severity === 'warning' ? (
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  )}
                  <div>
                    <p className="font-medium">{incident.title}</p>
                    <p className="text-sm text-muted-foreground">{incident.time}</p>
                  </div>
                </div>
                <Badge className={incident.status === 'resolved' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}>
                  {incident.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSystemHealth;