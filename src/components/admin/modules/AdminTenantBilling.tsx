import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CreditCard, 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  Calendar,
  Search,
  Download,
  RefreshCw,
  ArrowUpRight,
  AlertCircle,
  CheckCircle2,
  Clock,
  Building2
} from 'lucide-react';

interface BillingData {
  id: string;
  tenant_name: string;
  plan: string;
  status: string;
  mrr: number;
  next_billing: string;
  payment_method: string;
}

export const AdminTenantBilling = () => {
  const [billingData, setBillingData] = useState<BillingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    totalMRR: 0,
    totalARR: 0,
    activeSubs: 0,
    trialAccounts: 0,
    churned: 0,
    pastDue: 0
  });

  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    setLoading(true);
    try {
      const { data: tenants } = await supabase
        .from('client_tenants')
        .select('*')
        .order('created_at', { ascending: false });

      // Mock billing data based on tenants
      const mockBilling: BillingData[] = (tenants || []).map((tenant) => ({
        id: tenant.id,
        tenant_name: tenant.name,
        plan: tenant.tenant_type === 'enterprise' ? 'Enterprise' : tenant.tenant_type === 'business' ? 'Professional' : 'Starter',
        status: tenant.status === 'active' ? 'active' : tenant.status === 'pending' ? 'trial' : 'past_due',
        mrr: tenant.tenant_type === 'enterprise' ? 2499 : tenant.tenant_type === 'business' ? 999 : 299,
        next_billing: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        payment_method: Math.random() > 0.3 ? 'Card' : 'Invoice'
      }));

      setBillingData(mockBilling);
      
      // Calculate stats
      const totalMRR = mockBilling.reduce((acc, b) => b.status === 'active' ? acc + b.mrr : acc, 0);
      setStats({
        totalMRR,
        totalARR: totalMRR * 12,
        activeSubs: mockBilling.filter(b => b.status === 'active').length,
        trialAccounts: mockBilling.filter(b => b.status === 'trial').length,
        churned: Math.floor(mockBilling.length * 0.05),
        pastDue: mockBilling.filter(b => b.status === 'past_due').length
      });
    } catch (error) {
      console.error('Error fetching billing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = billingData.filter(b => 
    b.tenant_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusColors: Record<string, string> = {
    active: 'bg-green-500/10 text-green-500 border-green-500/20',
    trial: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    past_due: 'bg-red-500/10 text-red-500 border-red-500/20',
    cancelled: 'bg-gray-500/10 text-gray-500 border-gray-500/20'
  };

  const planColors: Record<string, string> = {
    Enterprise: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    Professional: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    Starter: 'bg-gray-500/10 text-gray-500 border-gray-500/20'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10">
            <CreditCard className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">Tenant Billing</h1>
            <p className="text-muted-foreground">Manage subscriptions, plans, and billing</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchBillingData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="bg-gradient-to-br from-green-500/10 to-transparent border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-green-500 mb-2">
              <DollarSign className="w-4 h-4" />
              <span className="text-xs font-medium">MRR</span>
            </div>
            <p className="text-2xl font-bold text-foreground">₹{stats.totalMRR.toLocaleString()}</p>
            <p className="text-xs text-green-500 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> +12.5%
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-blue-500 mb-2">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-medium">ARR</span>
            </div>
            <p className="text-2xl font-bold text-foreground">₹{(stats.totalARR / 1000).toFixed(0)}K</p>
            <p className="text-xs text-muted-foreground mt-1">Annual Revenue</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-purple-500 mb-2">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-medium">Active</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.activeSubs}</p>
            <p className="text-xs text-muted-foreground mt-1">Subscriptions</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-500/10 to-transparent border-cyan-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-cyan-500 mb-2">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-medium">Trials</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.trialAccounts}</p>
            <p className="text-xs text-muted-foreground mt-1">Active Trials</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-transparent border-orange-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-orange-500 mb-2">
              <AlertCircle className="w-4 h-4" />
              <span className="text-xs font-medium">Past Due</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.pastDue}</p>
            <p className="text-xs text-muted-foreground mt-1">Overdue</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500/10 to-transparent border-red-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-500 mb-2">
              <TrendingDown className="w-4 h-4" />
              <span className="text-xs font-medium">Churned</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stats.churned}</p>
            <p className="text-xs text-muted-foreground mt-1">This Month</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="subscriptions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="plans">Plans & Pricing</TabsTrigger>
        </TabsList>

        <TabsContent value="subscriptions" className="space-y-4">
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search tenants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Table */}
          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tenant</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>MRR</TableHead>
                      <TableHead>Next Billing</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((billing) => (
                      <TableRow key={billing.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Building2 className="w-4 h-4 text-primary" />
                            </div>
                            <span className="font-medium">{billing.tenant_name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={planColors[billing.plan]}>
                            {billing.plan}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[billing.status]}>
                            {billing.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">₹{billing.mrr}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="w-3 h-3 text-muted-foreground" />
                            {new Date(billing.next_billing).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>{billing.payment_method}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <ArrowUpRight className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <CardTitle>Recent Invoices</CardTitle>
              <CardDescription>All generated invoices across tenants</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">Invoice history will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans">
          <div className="grid md:grid-cols-3 gap-6">
            {['Starter', 'Professional', 'Enterprise'].map((plan) => (
              <Card key={plan} className={plan === 'Professional' ? 'border-primary shadow-lg shadow-primary/10' : ''}>
                <CardHeader>
                  <CardTitle>{plan}</CardTitle>
                  <CardDescription>
                    {plan === 'Starter' && '₹299/mo • Up to 25 employees'}
                    {plan === 'Professional' && '₹999/mo • Up to 100 employees'}
                    {plan === 'Enterprise' && '₹2499/mo • Unlimited employees'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant={plan === 'Professional' ? 'default' : 'outline'} className="w-full">
                    Edit Plan
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminTenantBilling;