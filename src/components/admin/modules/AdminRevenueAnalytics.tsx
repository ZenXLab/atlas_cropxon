import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Calendar,
  Download,
  RefreshCw
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const revenueData = [
  { month: 'Jan', mrr: 45000, arr: 540000, newMrr: 8000, churned: 2000 },
  { month: 'Feb', mrr: 51000, arr: 612000, newMrr: 9000, churned: 3000 },
  { month: 'Mar', mrr: 58000, arr: 696000, newMrr: 10000, churned: 3000 },
  { month: 'Apr', mrr: 65000, arr: 780000, newMrr: 11000, churned: 4000 },
  { month: 'May', mrr: 73000, arr: 876000, newMrr: 12000, churned: 4000 },
  { month: 'Jun', mrr: 82000, arr: 984000, newMrr: 14000, churned: 5000 },
  { month: 'Jul', mrr: 91000, arr: 1092000, newMrr: 15000, churned: 6000 },
  { month: 'Aug', mrr: 99000, arr: 1188000, newMrr: 14000, churned: 6000 },
  { month: 'Sep', mrr: 108000, arr: 1296000, newMrr: 16000, churned: 7000 },
  { month: 'Oct', mrr: 118000, arr: 1416000, newMrr: 17000, churned: 7000 },
  { month: 'Nov', mrr: 128000, arr: 1536000, newMrr: 18000, churned: 8000 },
  { month: 'Dec', mrr: 142000, arr: 1704000, newMrr: 22000, churned: 8000 },
];

const cohortData = [
  { cohort: 'Jan 2024', m0: 100, m1: 92, m2: 88, m3: 85, m4: 82, m5: 80 },
  { cohort: 'Feb 2024', m0: 100, m1: 94, m2: 90, m3: 87, m4: 84 },
  { cohort: 'Mar 2024', m0: 100, m1: 93, m2: 89, m3: 86 },
  { cohort: 'Apr 2024', m0: 100, m1: 95, m2: 91 },
  { cohort: 'May 2024', m0: 100, m1: 94 },
  { cohort: 'Jun 2024', m0: 100 },
];

const planDistribution = [
  { name: 'Enterprise', value: 35, color: 'hsl(262, 83%, 58%)' },
  { name: 'Professional', value: 45, color: 'hsl(188, 94%, 43%)' },
  { name: 'Starter', value: 20, color: 'hsl(190, 30%, 40%)' },
];

export const AdminRevenueAnalytics = () => {
  const [timeRange, setTimeRange] = useState('12m');

  const stats = {
    mrr: 142000,
    mrrGrowth: 10.9,
    arr: 1704000,
    arrGrowth: 10.9,
    arpu: 850,
    arpuGrowth: 5.2,
    ltv: 12500,
    ltvGrowth: 8.3,
    cac: 2800,
    cacRatio: 4.5,
    churnRate: 2.8,
    nrr: 112
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10">
            <TrendingUp className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">Revenue Analytics</h1>
            <p className="text-muted-foreground">MRR, ARR, cohort analysis, and revenue metrics</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3m">3 Months</SelectItem>
              <SelectItem value="6m">6 Months</SelectItem>
              <SelectItem value="12m">12 Months</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card className="bg-gradient-to-br from-green-500/10 to-transparent border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">MRR</span>
              <Badge className="bg-green-500/20 text-green-500 text-[10px]">
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
                {stats.mrrGrowth}%
              </Badge>
            </div>
            <p className="text-2xl font-bold text-foreground">₹{(stats.mrr / 1000).toFixed(0)}K</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">ARR</span>
              <Badge className="bg-blue-500/20 text-blue-500 text-[10px]">
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
                {stats.arrGrowth}%
              </Badge>
            </div>
            <p className="text-2xl font-bold text-foreground">₹{(stats.arr / 100000).toFixed(1)}L</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">ARPU</span>
              <Badge className="bg-purple-500/20 text-purple-500 text-[10px]">
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
                {stats.arpuGrowth}%
              </Badge>
            </div>
            <p className="text-2xl font-bold text-foreground">₹{stats.arpu}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-500/10 to-transparent border-cyan-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">LTV</span>
              <Badge className="bg-cyan-500/20 text-cyan-500 text-[10px]">
                <ArrowUpRight className="w-3 h-3 mr-0.5" />
                {stats.ltvGrowth}%
              </Badge>
            </div>
            <p className="text-2xl font-bold text-foreground">₹{(stats.ltv / 1000).toFixed(1)}K</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-transparent border-orange-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">LTV:CAC</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.cacRatio}:1</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500/10 to-transparent border-red-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">Churn</span>
              <Badge className="bg-red-500/20 text-red-500 text-[10px]">
                <ArrowDownRight className="w-3 h-3 mr-0.5" />
                0.3%
              </Badge>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.churnRate}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* MRR Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle>MRR Growth</CardTitle>
            <CardDescription>Monthly recurring revenue trend</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="mrrGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(190, 15%, 20%)" />
                  <XAxis dataKey="month" stroke="hsl(190, 30%, 40%)" fontSize={12} />
                  <YAxis stroke="hsl(190, 30%, 40%)" fontSize={12} tickFormatter={(v) => `₹${v/1000}K`} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(190, 40%, 12%)', 
                      border: '1px solid hsl(190, 25%, 22%)',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, 'MRR']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="mrr" 
                    stroke="hsl(262, 83%, 58%)" 
                    strokeWidth={2}
                    fill="url(#mrrGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Plan Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Plan</CardTitle>
            <CardDescription>Distribution across pricing tiers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={planDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {planDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(190, 40%, 12%)', 
                      border: '1px solid hsl(190, 25%, 22%)',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => [`${value}%`, 'Revenue Share']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* New vs Churned MRR */}
        <Card>
          <CardHeader>
            <CardTitle>Net MRR Movement</CardTitle>
            <CardDescription>New revenue vs churn</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(190, 15%, 20%)" />
                  <XAxis dataKey="month" stroke="hsl(190, 30%, 40%)" fontSize={12} />
                  <YAxis stroke="hsl(190, 30%, 40%)" fontSize={12} tickFormatter={(v) => `₹${v/1000}K`} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(190, 40%, 12%)', 
                      border: '1px solid hsl(190, 25%, 22%)',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => [`₹${value.toLocaleString()}`]}
                  />
                  <Legend />
                  <Bar dataKey="newMrr" name="New MRR" fill="hsl(160, 84%, 39%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="churned" name="Churned" fill="hsl(0, 84%, 60%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* NRR Trend */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Net Revenue Retention</CardTitle>
              <CardDescription>Expansion minus churn</CardDescription>
            </div>
            <Badge className="bg-green-500/20 text-green-500 text-lg px-3 py-1">
              {stats.nrr}%
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                <div>
                  <p className="text-sm text-muted-foreground">Expansion Revenue</p>
                  <p className="text-xl font-bold text-green-500">+₹18,400</p>
                </div>
                <ArrowUpRight className="w-6 h-6 text-green-500" />
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                <div>
                  <p className="text-sm text-muted-foreground">Churned Revenue</p>
                  <p className="text-xl font-bold text-red-500">-₹8,200</p>
                </div>
                <ArrowDownRight className="w-6 h-6 text-red-500" />
              </div>
              <div className="flex items-center justify-between p-4 bg-primary/10 rounded-xl border border-primary/20">
                <div>
                  <p className="text-sm text-muted-foreground">Net Change</p>
                  <p className="text-xl font-bold text-primary">+₹10,200</p>
                </div>
                <Target className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminRevenueAnalytics;