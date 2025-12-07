import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { 
  Key, 
  Users, 
  Shield, 
  Plus,
  Search,
  RefreshCw,
  Edit,
  Trash2,
  Clock,
  Globe,
  Lock,
  Unlock,
  UserCheck,
  Settings
} from 'lucide-react';

const roles = [
  { id: 'super_admin', name: 'Super Admin', description: 'Full system access', users: 2, permissions: ['all'] },
  { id: 'admin', name: 'Admin', description: 'Platform management', users: 5, permissions: ['tenants', 'users', 'billing', 'analytics'] },
  { id: 'support', name: 'Support', description: 'Customer support access', users: 12, permissions: ['tickets', 'users.view', 'tenants.view'] },
  { id: 'sales', name: 'Sales', description: 'CRM and pipeline access', users: 8, permissions: ['crm', 'quotes', 'leads'] },
  { id: 'finance', name: 'Finance', description: 'Billing and invoices', users: 3, permissions: ['billing', 'invoices', 'revenue'] },
];

const permissions = [
  { category: 'Tenant Management', items: ['tenants.view', 'tenants.create', 'tenants.edit', 'tenants.delete'] },
  { category: 'User Management', items: ['users.view', 'users.create', 'users.edit', 'users.delete'] },
  { category: 'Billing', items: ['billing.view', 'billing.manage', 'invoices.create', 'refunds.process'] },
  { category: 'Analytics', items: ['analytics.view', 'reports.export', 'dashboards.create'] },
  { category: 'Support', items: ['tickets.view', 'tickets.respond', 'tickets.escalate', 'tickets.close'] },
  { category: 'Security', items: ['audit.view', 'security.manage', 'access.control'] },
];

const activeSessions = [
  { id: 1, user: 'admin@cropxon.com', role: 'Super Admin', ip: '103.45.XX.XX', location: 'Mumbai, India', lastActive: '2 mins ago', device: 'Chrome / Windows' },
  { id: 2, user: 'rahul@cropxon.com', role: 'Admin', ip: '45.67.XX.XX', location: 'Bangalore, India', lastActive: '15 mins ago', device: 'Firefox / macOS' },
  { id: 3, user: 'priya@cropxon.com', role: 'Support', ip: '78.90.XX.XX', location: 'Delhi, India', lastActive: '1 hour ago', device: 'Safari / iOS' },
];

export const AdminAccessControl = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [createRoleOpen, setCreateRoleOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10">
            <Key className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">Access Control</h1>
            <p className="text-muted-foreground">Manage roles, permissions, and sessions</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Dialog open={createRoleOpen} onOpenChange={setCreateRoleOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Role
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Role</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Role Name</label>
                    <Input placeholder="e.g. Marketing Manager" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Role ID</label>
                    <Input placeholder="marketing_manager" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Input placeholder="Describe what this role can do" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-3 block">Permissions</label>
                  <div className="max-h-[300px] overflow-y-auto space-y-4">
                    {permissions.map((category) => (
                      <div key={category.category} className="p-4 bg-muted/50 rounded-lg">
                        <p className="font-medium mb-3">{category.category}</p>
                        <div className="grid grid-cols-2 gap-2">
                          {category.items.map((perm) => (
                            <div key={perm} className="flex items-center gap-2">
                              <Checkbox id={perm} />
                              <label htmlFor={perm} className="text-sm">{perm}</label>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <Button className="w-full">Create Role</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-primary mb-2">
              <Shield className="w-4 h-4" />
              <span className="text-xs font-medium">Total Roles</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{roles.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-blue-500 mb-2">
              <Users className="w-4 h-4" />
              <span className="text-xs font-medium">Admin Users</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{roles.reduce((acc, r) => acc + r.users, 0)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-green-500 mb-2">
              <UserCheck className="w-4 h-4" />
              <span className="text-xs font-medium">Active Sessions</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{activeSessions.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-orange-500 mb-2">
              <Lock className="w-4 h-4" />
              <span className="text-xs font-medium">Permissions</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{permissions.reduce((acc, p) => acc + p.items.length, 0)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="roles" className="space-y-4">
        <TabsList>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="permissions">Permissions Matrix</TabsTrigger>
          <TabsTrigger value="sessions">Active Sessions</TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roles.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase())).map((role) => (
              <Card key={role.id} className="hover:border-primary/50 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{role.name}</CardTitle>
                    <Badge variant="secondary">{role.users} users</Badge>
                  </div>
                  <CardDescription>{role.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {role.permissions.slice(0, 3).map((perm) => (
                      <Badge key={perm} variant="outline" className="text-xs">
                        {perm}
                      </Badge>
                    ))}
                    {role.permissions.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{role.permissions.length - 3} more
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="w-3 h-3 mr-1" /> Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="permissions">
          <Card>
            <CardHeader>
              <CardTitle>Permission Matrix</CardTitle>
              <CardDescription>Role-based permission assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Permission</TableHead>
                      {roles.map((role) => (
                        <TableHead key={role.id} className="text-center">{role.name}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {permissions.map((category) => (
                      <>
                        <TableRow key={category.category} className="bg-muted/30">
                          <TableCell colSpan={roles.length + 1} className="font-medium">
                            {category.category}
                          </TableCell>
                        </TableRow>
                        {category.items.map((perm) => (
                          <TableRow key={perm}>
                            <TableCell className="text-sm">{perm}</TableCell>
                            {roles.map((role) => (
                              <TableCell key={`${role.id}-${perm}`} className="text-center">
                                <Checkbox 
                                  checked={role.permissions.includes('all') || role.permissions.some(p => perm.startsWith(p.split('.')[0]))}
                                />
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions">
          <Card>
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>Currently logged in admin users</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeSessions.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell className="font-medium">{session.user}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{session.role}</Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{session.ip}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Globe className="w-3 h-3 text-muted-foreground" />
                          {session.location}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{session.device}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          {session.lastActive}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="text-destructive">
                          <Unlock className="w-3 h-3 mr-1" /> Revoke
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAccessControl;