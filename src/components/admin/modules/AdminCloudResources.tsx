import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Cloud, 
  Server, 
  Database, 
  HardDrive,
  Cpu,
  MemoryStick,
  Globe,
  Zap,
  DollarSign,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Settings,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const usageData = Array.from({ length: 7 }, (_, i) => ({
  day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
  compute: Math.floor(Math.random() * 40) + 60,
  storage: Math.floor(Math.random() * 20) + 30,
  bandwidth: Math.floor(Math.random() * 30) + 20
}));

const costBreakdown = [
  { name: 'Compute', value: 45, color: 'hsl(262, 83%, 58%)' },
  { name: 'Storage', value: 25, color: 'hsl(188, 94%, 43%)' },
  { name: 'Bandwidth', value: 15, color: 'hsl(160, 84%, 39%)' },
  { name: 'Database', value: 15, color: 'hsl(330, 81%, 60%)' },
];

const resources = [
  { id: 1, name: 'Primary Database', type: 'PostgreSQL', region: 'Asia South (Mumbai)', status: 'healthy', cpu: 45, memory: 68, storage: 42 },
  { id: 2, name: 'Redis Cache', type: 'Redis 7.0', region: 'Asia South (Mumbai)', status: 'healthy', cpu: 12, memory: 35, storage: 15 },
  { id: 3, name: 'Edge Functions', type: 'Deno Runtime', region: 'Global CDN', status: 'healthy', cpu: 28, memory: 42, storage: 5 },
  { id: 4, name: 'File Storage', type: 'S3 Compatible', region: 'Asia South (Mumbai)', status: 'healthy', cpu: 0, memory: 0, storage: 28 },
  { id: 5, name: 'Realtime Server', type: 'WebSocket', region: 'Asia South (Mumbai)', status: 'healthy', cpu: 22, memory: 38, storage: 2 },
];

export const AdminCloudResources = () => {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blue-500/10">
            <Cloud className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">Cloud Resources</h1>
            <p className="text-muted-foreground">Infrastructure and resource management</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button>
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-blue-500 mb-2">
              <DollarSign className="w-4 h-4" />
              <span className="text-xs font-medium">Monthly Cost</span>
            </div>
            <p className="text-2xl font-bold text-foreground">$487</p>
            <p className="text-xs text-green-500 flex items-center gap-1 mt-1">
              <TrendingDown className="w-3 h-3" /> -8% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-purple-500 mb-2">
              <Server className="w-4 h-4" />
              <span className="text-xs font-medium">Active Services</span>
            </div>
            <p className="text-2xl font-bold text-foreground">5</p>
            <p className="text-xs text-muted-foreground mt-1">All healthy</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-500/10 to-transparent border-cyan-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-cyan-500 mb-2">
              <Globe className="w-4 h-4" />
              <span className="text-xs font-medium">Regions</span>
            </div>
            <p className="text-2xl font-bold text-foreground">3</p>
            <p className="text-xs text-muted-foreground mt-1">India, Singapore, US</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-transparent border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-green-500 mb-2">
              <Zap className="w-4 h-4" />
              <span className="text-xs font-medium">Uptime</span>
            </div>
            <p className="text-2xl font-bold text-foreground">99.99%</p>
            <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Resource Usage Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Resource Usage (7 Days)</CardTitle>
            <CardDescription>Compute, storage, and bandwidth utilization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={usageData}>
                  <defs>
                    <linearGradient id="computeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="storageGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(188, 94%, 43%)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(188, 94%, 43%)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(190, 15%, 20%)" />
                  <XAxis dataKey="day" stroke="hsl(190, 30%, 40%)" fontSize={12} />
                  <YAxis stroke="hsl(190, 30%, 40%)" fontSize={12} unit="%" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(190, 40%, 12%)', 
                      border: '1px solid hsl(190, 25%, 22%)',
                      borderRadius: '8px'
                    }}
                  />
                  <Area type="monotone" dataKey="compute" name="Compute" stroke="hsl(262, 83%, 58%)" fill="url(#computeGrad)" />
                  <Area type="monotone" dataKey="storage" name="Storage" stroke="hsl(188, 94%, 43%)" fill="url(#storageGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Cost Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Cost Breakdown</CardTitle>
            <CardDescription>Monthly spending by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] flex items-center">
              <ResponsiveContainer width="50%" height="100%">
                <PieChart>
                  <Pie
                    data={costBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {costBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3">
                {costBreakdown.map((item) => (
                  <div key={item.name} className="flex items-center justify-between gap-8">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm">{item.name}</span>
                    </div>
                    <span className="font-medium">${(487 * item.value / 100).toFixed(0)}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resources List */}
      <Card>
        <CardHeader>
          <CardTitle>Active Resources</CardTitle>
          <CardDescription>All running cloud services and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {resources.map((resource) => (
              <div key={resource.id} className="p-4 bg-muted/50 rounded-xl">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      {resource.type.includes('PostgreSQL') && <Database className="w-5 h-5 text-primary" />}
                      {resource.type.includes('Redis') && <Zap className="w-5 h-5 text-cyan-500" />}
                      {resource.type.includes('Deno') && <Cpu className="w-5 h-5 text-purple-500" />}
                      {resource.type.includes('S3') && <HardDrive className="w-5 h-5 text-green-500" />}
                      {resource.type.includes('WebSocket') && <Globe className="w-5 h-5 text-orange-500" />}
                    </div>
                    <div>
                      <p className="font-medium">{resource.name}</p>
                      <p className="text-sm text-muted-foreground">{resource.type} • {resource.region}</p>
                    </div>
                  </div>
                  <Badge className="bg-green-500/10 text-green-500">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    {resource.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {resource.cpu > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">CPU</span>
                        <span className="text-xs font-medium">{resource.cpu}%</span>
                      </div>
                      <Progress value={resource.cpu} className="h-1.5" />
                    </div>
                  )}
                  {resource.memory > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">Memory</span>
                        <span className="text-xs font-medium">{resource.memory}%</span>
                      </div>
                      <Progress value={resource.memory} className="h-1.5" />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">Storage</span>
                      <span className="text-xs font-medium">{resource.storage}%</span>
                    </div>
                    <Progress value={resource.storage} className="h-1.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCloudResources;