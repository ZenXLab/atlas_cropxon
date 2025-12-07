import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Plus, 
  Users, 
  Shield, 
  Key, 
  Lock,
  Fingerprint,
  Smartphone,
  Globe,
  Settings,
  UserCheck,
  UserX,
  Clock,
  AlertTriangle,
  CheckCircle,
  MoreVertical,
  Edit,
  Trash2
} from "lucide-react";

const TenantIdentityAccess: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("roles");

  const securityStats = [
    { label: "Total Users", value: "1,248", icon: Users, color: "bg-blue-500" },
    { label: "Active Sessions", value: "847", icon: UserCheck, color: "bg-green-500" },
    { label: "2FA Enabled", value: "89%", icon: Smartphone, color: "bg-purple-500" },
    { label: "Pending Access", value: "12", icon: Clock, color: "bg-amber-500" },
  ];

  const roles = [
    { 
      name: "Super Admin", 
      description: "Full system access with all permissions",
      users: 3,
      permissions: ["All Modules", "User Management", "Settings", "Billing"],
      color: "bg-red-100 text-red-700"
    },
    { 
      name: "HR Manager", 
      description: "Access to HR, Payroll, and Workforce modules",
      users: 8,
      permissions: ["Workforce", "Payroll", "Recruitment", "Performance"],
      color: "bg-blue-100 text-blue-700"
    },
    { 
      name: "Finance Admin", 
      description: "Access to Finance, Payroll, and Billing",
      users: 5,
      permissions: ["Finance", "Payroll", "Insurance", "Reports"],
      color: "bg-green-100 text-green-700"
    },
    { 
      name: "Department Head", 
      description: "Team management and approvals",
      users: 24,
      permissions: ["Team View", "Approvals", "Attendance", "Performance"],
      color: "bg-purple-100 text-purple-700"
    },
    { 
      name: "Employee", 
      description: "Basic self-service access",
      users: 1208,
      permissions: ["Self Profile", "Attendance", "Leave", "Documents"],
      color: "bg-gray-100 text-gray-700"
    },
  ];

  const ssoProviders = [
    { name: "Google Workspace", status: "Connected", icon: "G", users: 1248 },
    { name: "Microsoft Azure AD", status: "Not Connected", icon: "M", users: 0 },
    { name: "Okta", status: "Not Connected", icon: "O", users: 0 },
    { name: "SAML 2.0", status: "Available", icon: "S", users: 0 },
  ];

  const securityPolicies = [
    { name: "Password Complexity", description: "Minimum 12 characters with special chars", enabled: true },
    { name: "Two-Factor Authentication", description: "Required for all admin roles", enabled: true },
    { name: "Session Timeout", description: "Auto logout after 30 minutes inactivity", enabled: true },
    { name: "IP Whitelisting", description: "Restrict access to specific IP ranges", enabled: false },
    { name: "Device Management", description: "Only approved devices can access", enabled: false },
    { name: "Login Alerts", description: "Email notification on new device login", enabled: true },
  ];

  const recentActivity = [
    { user: "John Smith", action: "Role changed to HR Manager", time: "2 hours ago", type: "role" },
    { user: "Sarah Johnson", action: "2FA enabled", time: "5 hours ago", type: "security" },
    { user: "Mike Chen", action: "Password reset", time: "1 day ago", type: "password" },
    { user: "Emily Davis", action: "Access revoked", time: "2 days ago", type: "access" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F1E3A]">Identity & Access</h1>
          <p className="text-sm text-[#6B7280] mt-1">User roles, permissions, and SSO configuration</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <Shield className="w-4 h-4" />
            Security Audit
          </Button>
          <Button size="sm" className="gap-2 bg-[#0F1E3A] hover:bg-[#1a2d4f]">
            <Plus className="w-4 h-4" />
            Create Role
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {securityStats.map((stat, index) => (
          <Card key={index} className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#6B7280]">{stat.label}</p>
                  <p className="text-2xl font-bold text-[#0F1E3A] mt-1">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white border border-gray-200 p-1">
          <TabsTrigger value="roles" className="gap-2">
            <Shield className="w-4 h-4" />
            Roles & Permissions
          </TabsTrigger>
          <TabsTrigger value="sso" className="gap-2">
            <Key className="w-4 h-4" />
            SSO & Integrations
          </TabsTrigger>
          <TabsTrigger value="policies" className="gap-2">
            <Lock className="w-4 h-4" />
            Security Policies
          </TabsTrigger>
          <TabsTrigger value="activity" className="gap-2">
            <Clock className="w-4 h-4" />
            Activity Log
          </TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="mt-4 space-y-4">
          {/* Roles List */}
          <Card className="border border-gray-100 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-[#0F1E3A]">User Roles</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                  <Input
                    placeholder="Search roles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-9 text-sm"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {roles.map((role, index) => (
                <div 
                  key={index}
                  className="p-4 rounded-xl border border-gray-100 hover:border-[#0F1E3A]/20 hover:bg-[#F7F9FC] transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`px-3 py-1 rounded-lg ${role.color} text-xs font-medium`}>
                        {role.users} users
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#0F1E3A]">{role.name}</h3>
                        <p className="text-sm text-[#6B7280] mt-1">{role.description}</p>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {role.permissions.map((perm, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {perm}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sso" className="mt-4 space-y-4">
          {/* SSO Providers */}
          <Card className="border border-gray-100 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-[#0F1E3A]">Single Sign-On Providers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {ssoProviders.map((provider, index) => (
                <div 
                  key={index}
                  className="p-4 rounded-xl border border-gray-100 hover:border-[#0F1E3A]/20 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-[#F7F9FC] flex items-center justify-center text-xl font-bold text-[#0F1E3A]">
                      {provider.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#0F1E3A]">{provider.name}</h3>
                      <p className="text-sm text-[#6B7280]">
                        {provider.users > 0 ? `${provider.users} users synced` : "Not configured"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge 
                      className={`${
                        provider.status === "Connected" 
                          ? "bg-green-100 text-green-700" 
                          : provider.status === "Available"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {provider.status}
                    </Badge>
                    <Button 
                      variant={provider.status === "Connected" ? "outline" : "default"}
                      size="sm"
                    >
                      {provider.status === "Connected" ? "Configure" : "Connect"}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="mt-4 space-y-4">
          {/* Security Policies */}
          <Card className="border border-gray-100 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-[#0F1E3A]">Security Policies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {securityPolicies.map((policy, index) => (
                <div 
                  key={index}
                  className="p-4 rounded-xl border border-gray-100 hover:border-[#0F1E3A]/20 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg ${policy.enabled ? 'bg-green-100' : 'bg-gray-100'} flex items-center justify-center`}>
                      {policy.enabled ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#0F1E3A]">{policy.name}</h3>
                      <p className="text-sm text-[#6B7280]">{policy.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch checked={policy.enabled} />
                    <Button variant="ghost" size="sm">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="mt-4 space-y-4">
          {/* Activity Log */}
          <Card className="border border-gray-100 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-[#0F1E3A]">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-[#F7F9FC] transition-colors"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.type === 'role' ? 'bg-blue-100' :
                      activity.type === 'security' ? 'bg-green-100' :
                      activity.type === 'password' ? 'bg-amber-100' :
                      'bg-red-100'
                    }`}>
                      {activity.type === 'role' ? <Shield className="w-5 h-5 text-blue-600" /> :
                       activity.type === 'security' ? <Lock className="w-5 h-5 text-green-600" /> :
                       activity.type === 'password' ? <Key className="w-5 h-5 text-amber-600" /> :
                       <UserX className="w-5 h-5 text-red-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#0F1E3A]">{activity.user}</p>
                      <p className="text-sm text-[#6B7280]">{activity.action}</p>
                    </div>
                    <span className="text-xs text-[#6B7280]">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TenantIdentityAccess;
