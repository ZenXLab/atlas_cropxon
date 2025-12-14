import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  AlertTriangle, 
  XCircle, 
  CheckCircle2,
  Eye,
  Lock,
  Globe,
  Activity,
  RefreshCw,
  Bell,
  MapPin,
  Clock,
  User,
  Server,
  FileWarning
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const threatData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  threats: Math.floor(Math.random() * 20),
  blocked: Math.floor(Math.random() * 15),
  anomalies: Math.floor(Math.random() * 5)
}));

const activeThreats = [
  { id: 1, type: 'Brute Force', severity: 'high', source: '185.234.XX.XX', target: 'Auth API', attempts: 1247, status: 'blocked', time: '2 mins ago' },
  { id: 2, type: 'SQL Injection', severity: 'critical', source: '103.45.XX.XX', target: '/api/users', attempts: 3, status: 'blocked', time: '15 mins ago' },
  { id: 3, type: 'Suspicious Login', severity: 'medium', source: 'Multiple IPs', target: 'admin@tenant.com', attempts: 5, status: 'monitoring', time: '1 hour ago' },
  { id: 4, type: 'Rate Limit Exceeded', severity: 'low', source: '45.67.XX.XX', target: '/api/quotes', attempts: 892, status: 'blocked', time: '2 hours ago' },
];

const securityAlerts = [
  { id: 1, title: 'New admin login from unknown location', severity: 'warning', time: '10 mins ago', acknowledged: false },
  { id: 2, title: 'SSL certificate expiring in 14 days', severity: 'info', time: '1 hour ago', acknowledged: true },
  { id: 3, title: 'Failed backup detected', severity: 'warning', time: '3 hours ago', acknowledged: false },
  { id: 4, title: 'Security patch available for Supabase', severity: 'info', time: '5 hours ago', acknowledged: true },
];

const geoBlocks = [
  { country: 'Russia', code: 'RU', blocked: 4521, lastAttempt: '5 mins ago' },
  { country: 'China', code: 'CN', blocked: 3890, lastAttempt: '12 mins ago' },
  { country: 'North Korea', code: 'KP', blocked: 892, lastAttempt: '1 hour ago' },
  { country: 'Iran', code: 'IR', blocked: 567, lastAttempt: '2 hours ago' },
];

export const AdminThreatDetection = () => {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'high': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'low': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'warning': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'info': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'blocked': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'monitoring': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'active': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-red-500/10">
            <Shield className="h-6 w-6 text-red-500" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">Threat Detection</h1>
            <p className="text-muted-foreground">Security monitoring and incident response</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge className="bg-green-500/20 text-green-500 px-3 py-1">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            All Systems Protected
          </Badge>
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Security Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-red-500/10 to-transparent border-red-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-500 mb-2">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-xs font-medium">Active Threats</span>
            </div>
            <p className="text-2xl font-bold text-foreground">0</p>
            <p className="text-xs text-green-500 mt-1">All blocked</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-transparent border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-green-500 mb-2">
              <Lock className="w-4 h-4" />
              <span className="text-xs font-medium">Blocked Today</span>
            </div>
            <p className="text-2xl font-bold text-foreground">2,847</p>
            <p className="text-xs text-muted-foreground mt-1">↓ 12% from yesterday</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500/10 to-transparent border-yellow-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-yellow-500 mb-2">
              <Eye className="w-4 h-4" />
              <span className="text-xs font-medium">Under Watch</span>
            </div>
            <p className="text-2xl font-bold text-foreground">12</p>
            <p className="text-xs text-muted-foreground mt-1">Suspicious activities</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-blue-500 mb-2">
              <Globe className="w-4 h-4" />
              <span className="text-xs font-medium">Geo-Blocked</span>
            </div>
            <p className="text-2xl font-bold text-foreground">4</p>
            <p className="text-xs text-muted-foreground mt-1">Countries</p>
          </CardContent>
        </Card>
      </div>

      {/* Threat Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Threat Activity (24h)</CardTitle>
          <CardDescription>Real-time threat detection and blocking</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={threatData}>
                <defs>
                  <linearGradient id="threatGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="blockedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0}/>
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
                <Area type="monotone" dataKey="threats" name="Threats" stroke="hsl(0, 84%, 60%)" fill="url(#threatGradient)" />
                <Area type="monotone" dataKey="blocked" name="Blocked" stroke="hsl(160, 84%, 39%)" fill="url(#blockedGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Active Threats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Recent Threat Events
            </CardTitle>
            <CardDescription>Last 24 hours</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 max-h-[400px] overflow-y-auto">
            {activeThreats.map((threat) => (
              <div key={threat.id} className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge className={getSeverityColor(threat.severity)}>
                      {threat.severity}
                    </Badge>
                    <span className="font-medium">{threat.type}</span>
                  </div>
                  <Badge className={getStatusColor(threat.status)}>
                    {threat.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    {threat.source}
                  </div>
                  <div className="flex items-center gap-1">
                    <Server className="w-3 h-3" />
                    {threat.target}
                  </div>
                  <div className="flex items-center gap-1">
                    <Activity className="w-3 h-3" />
                    {threat.attempts} attempts
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {threat.time}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Security Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-yellow-500" />
              Security Alerts
            </CardTitle>
            <CardDescription>Notifications and advisories</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 max-h-[400px] overflow-y-auto">
            {securityAlerts.map((alert) => (
              <div key={alert.id} className={`p-4 rounded-lg ${alert.acknowledged ? 'bg-muted/30' : 'bg-muted/50 border-l-4 border-yellow-500'}`}>
                <div className="flex items-start justify-between mb-2">
                  <p className="font-medium text-sm">{alert.title}</p>
                  <Badge className={getSeverityColor(alert.severity)}>
                    {alert.severity}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{alert.time}</span>
                  {!alert.acknowledged && (
                    <Button variant="ghost" size="sm" className="h-6 text-xs">
                      Acknowledge
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Geo-Blocking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-500" />
            Geo-Blocking Rules
          </CardTitle>
          <CardDescription>Countries blocked from accessing the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            {geoBlocks.map((geo) => (
              <div key={geo.code} className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{geo.country}</span>
                  <Badge className="bg-red-500/20 text-red-500">{geo.code}</Badge>
                </div>
                <p className="text-2xl font-bold text-foreground">{geo.blocked.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Last: {geo.lastAttempt}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminThreatDetection;