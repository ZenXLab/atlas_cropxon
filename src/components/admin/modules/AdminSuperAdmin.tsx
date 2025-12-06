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
  Shield, Activity, FileDown, AlertTriangle, Search,
  Lock, Key, UserCog, Database, Download, Eye
} from "lucide-react";
import { format } from "date-fns";

export const AdminSuperAdmin = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: auditLogs } = useQuery({
    queryKey: ["super-admin-audit"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data;
    },
  });

  const { data: systemLogs } = useQuery({
    queryKey: ["super-admin-system"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("system_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data;
    },
  });

  const { data: userRoles } = useQuery({
    queryKey: ["super-admin-roles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("*, profiles(full_name, email)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const getLevelBadge = (level: string) => {
    switch (level?.toLowerCase()) {
      case "error": return <Badge variant="destructive">Error</Badge>;
      case "warning": return <Badge className="bg-yellow-500/10 text-yellow-500">Warning</Badge>;
      case "info": return <Badge variant="secondary">Info</Badge>;
      default: return <Badge variant="outline">{level}</Badge>;
    }
  };

  const getActionBadge = (action: string) => {
    if (action?.includes("create") || action?.includes("insert")) {
      return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Create</Badge>;
    }
    if (action?.includes("update") || action?.includes("edit")) {
      return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">Update</Badge>;
    }
    if (action?.includes("delete") || action?.includes("remove")) {
      return <Badge variant="destructive">Delete</Badge>;
    }
    return <Badge variant="outline">{action}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Super Admin</h1>
          <p className="text-muted-foreground">System administration, security logs, and data management</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
            <UserCog className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userRoles?.filter(r => r.role === "admin").length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Audit Events</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auditLogs?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">System Logs</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemLogs?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Security Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">
              {systemLogs?.filter(l => l.level === "error").length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="activity">
        <TabsList>
          <TabsTrigger value="activity" className="gap-2">
            <Activity className="h-4 w-4" />
            Activity Logs
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            Security Logs
          </TabsTrigger>
          <TabsTrigger value="admins" className="gap-2">
            <Key className="h-4 w-4" />
            Admin Users
          </TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Activity Logs</CardTitle>
                  <CardDescription>All admin actions and system events</CardDescription>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search logs..." className="pl-9 w-64" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {auditLogs?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No audit logs found</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Action</TableHead>
                      <TableHead>Entity</TableHead>
                      <TableHead>Entity ID</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLogs?.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{getActionBadge(log.action)}</TableCell>
                        <TableCell>{log.entity_type}</TableCell>
                        <TableCell className="font-mono text-xs">{log.entity_id?.slice(0, 8) || "-"}</TableCell>
                        <TableCell className="text-muted-foreground">{log.ip_address || "-"}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(new Date(log.created_at), "MMM d, HH:mm")}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
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

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Logs</CardTitle>
              <CardDescription>System errors, warnings, and security events</CardDescription>
            </CardHeader>
            <CardContent>
              {systemLogs?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No security logs found</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Level</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Timestamp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {systemLogs?.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{getLevelBadge(log.level)}</TableCell>
                        <TableCell><Badge variant="outline">{log.source}</Badge></TableCell>
                        <TableCell className="max-w-md truncate">{log.message}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(new Date(log.created_at), "MMM d, HH:mm")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admins" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Admin Users</CardTitle>
              <CardDescription>Users with administrative access</CardDescription>
            </CardHeader>
            <CardContent>
              {userRoles?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No admin users found</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Assigned</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userRoles?.map((role) => (
                      <TableRow key={role.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{(role.profiles as any)?.full_name || "Unknown"}</p>
                            <p className="text-sm text-muted-foreground">{(role.profiles as any)?.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={role.role === "admin" ? "bg-primary/10 text-primary" : ""}>
                            {role.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(new Date(role.created_at || new Date()), "MMM d, yyyy")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
