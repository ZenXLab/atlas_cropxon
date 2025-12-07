import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Users, 
  Search, 
  UserPlus,
  Mail,
  Phone,
  Shield,
  Building2,
  MoreVertical,
  Edit,
  Trash2,
  Key,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Lock,
  Unlock,
  ChevronRight,
  Filter,
  Download,
  Upload,
  Settings,
  Crown,
  User
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

// Define available portal modules that can be unlocked
const portalModules = [
  { id: "dashboard", name: "Dashboard", description: "Overview and quick stats", category: "core", isCore: true },
  { id: "projects", name: "Projects", description: "View assigned projects and tasks", category: "work" },
  { id: "files", name: "Files", description: "Access and upload files", category: "work" },
  { id: "invoices", name: "Invoices", description: "View invoices and payment history", category: "billing" },
  { id: "tickets", name: "Support Tickets", description: "Create and track support requests", category: "support" },
  { id: "meetings", name: "Meetings", description: "Schedule and join meetings", category: "support" },
  { id: "ai-dashboard", name: "AI Dashboard", description: "Proxima AI insights and analytics", category: "intelligence", isNew: true },
  { id: "msp-monitoring", name: "MSP Monitoring", description: "Server and infrastructure monitoring", category: "intelligence" },
  { id: "team", name: "Team Directory", description: "View team members and contacts", category: "organization" },
  { id: "feedback", name: "Feedback", description: "Submit and track feedback", category: "organization" },
  { id: "resources", name: "Resources", description: "Access knowledge base and guides", category: "organization" },
  { id: "settings", name: "Settings", description: "Profile and preferences", category: "core", isCore: true },
];

// Define roles
const roles = [
  { id: "admin", name: "Admin", description: "Full access to all features", color: "bg-red-500" },
  { id: "manager", name: "Manager", description: "Can manage team and view reports", color: "bg-purple-500" },
  { id: "employee", name: "Employee", description: "Standard employee access", color: "bg-blue-500" },
  { id: "contractor", name: "Contractor", description: "Limited external access", color: "bg-gray-500" },
];

// Mock employees data
const mockEmployees = [
  {
    id: "1",
    name: "Priya Sharma",
    email: "priya@company.com",
    phone: "+91 98765 43210",
    role: "admin",
    department: "Human Resources",
    status: "active",
    lastLogin: "2024-01-15T10:30:00",
    enabledModules: ["dashboard", "projects", "files", "invoices", "tickets", "meetings", "ai-dashboard", "msp-monitoring", "team", "feedback", "resources", "settings"],
    newModules: ["ai-dashboard"],
  },
  {
    id: "2",
    name: "Rajesh Kumar",
    email: "rajesh@company.com",
    phone: "+91 98765 43211",
    role: "manager",
    department: "Engineering",
    status: "active",
    lastLogin: "2024-01-14T14:20:00",
    enabledModules: ["dashboard", "projects", "files", "tickets", "meetings", "team", "settings"],
    newModules: [],
  },
  {
    id: "3",
    name: "Anita Patel",
    email: "anita@company.com",
    phone: "+91 98765 43212",
    role: "employee",
    department: "Finance",
    status: "active",
    lastLogin: "2024-01-15T09:15:00",
    enabledModules: ["dashboard", "invoices", "tickets", "settings"],
    newModules: [],
  },
  {
    id: "4",
    name: "Vikram Singh",
    email: "vikram@company.com",
    phone: "+91 98765 43213",
    role: "employee",
    department: "Operations",
    status: "pending",
    lastLogin: null,
    enabledModules: ["dashboard", "settings"],
    newModules: [],
  },
  {
    id: "5",
    name: "External Consultant",
    email: "consultant@external.com",
    phone: "+91 98765 43214",
    role: "contractor",
    department: "Consulting",
    status: "inactive",
    lastLogin: "2024-01-10T16:00:00",
    enabledModules: ["dashboard", "projects", "files"],
    newModules: [],
  },
];

const TenantEmployees: React.FC = () => {
  const [employees, setEmployees] = useState(mockEmployees);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedEmployee, setSelectedEmployee] = useState<typeof mockEmployees[0] | null>(null);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         emp.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === "all" || emp.role === selectedRole;
    const matchesStatus = selectedStatus === "all" || emp.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const toggleModuleForEmployee = (employeeId: string, moduleId: string) => {
    setEmployees(prev => prev.map(emp => {
      if (emp.id === employeeId) {
        const hasModule = emp.enabledModules.includes(moduleId);
        return {
          ...emp,
          enabledModules: hasModule
            ? emp.enabledModules.filter(m => m !== moduleId)
            : [...emp.enabledModules, moduleId],
          newModules: hasModule 
            ? emp.newModules.filter(m => m !== moduleId)
            : [...emp.newModules, moduleId]
        };
      }
      return emp;
    }));
    toast.success("Module access updated");
  };

  const sendCredentials = (employee: typeof mockEmployees[0]) => {
    toast.success(`Login credentials sent to ${employee.email}`);
  };

  const resetPassword = (employee: typeof mockEmployees[0]) => {
    toast.success(`Password reset link sent to ${employee.email}`);
  };

  const getRoleBadge = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (!role) return null;
    return (
      <Badge className={`${role.color} text-white text-xs`}>
        {role.name}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="outline" className="border-green-500 text-green-600 bg-green-50"><CheckCircle2 className="w-3 h-3 mr-1" />Active</Badge>;
      case "pending":
        return <Badge variant="outline" className="border-amber-500 text-amber-600 bg-amber-50"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case "inactive":
        return <Badge variant="outline" className="border-gray-500 text-gray-600 bg-gray-50"><XCircle className="w-3 h-3 mr-1" />Inactive</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0F1E3A] flex items-center gap-2">
            <Users className="w-6 h-6 text-[#005EEB]" />
            Employee Portal Access
          </h1>
          <p className="text-sm text-[#6B7280] mt-1">
            Manage employee credentials and unlock portal features
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-[#005EEB] hover:bg-[#0052CC]">
                <UserPlus className="w-4 h-4 mr-2" />
                Invite Employee
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Invite New Employee</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input type="email" placeholder="john@company.com" />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Select defaultValue="employee">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map(role => (
                        <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Input placeholder="Engineering" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsInviteOpen(false)}>Cancel</Button>
                <Button onClick={() => {
                  toast.success("Invitation sent successfully!");
                  setIsInviteOpen(false);
                }}>
                  <Send className="w-4 h-4 mr-2" />
                  Send Invitation
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Employees", value: employees.length, icon: Users, color: "#005EEB" },
          { label: "Active", value: employees.filter(e => e.status === "active").length, icon: CheckCircle2, color: "#0FB07A" },
          { label: "Pending Setup", value: employees.filter(e => e.status === "pending").length, icon: Clock, color: "#FFB020" },
          { label: "Inactive", value: employees.filter(e => e.status === "inactive").length, icon: XCircle, color: "#E23E57" },
        ].map((stat, idx) => (
          <Card key={idx} className="border-gray-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#6B7280]">{stat.label}</p>
                  <p className="text-2xl font-bold text-[#0F1E3A]">{stat.value}</p>
                </div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${stat.color}15` }}>
                  <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <Input
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedRole} onValueChange={setSelectedRole}>
          <SelectTrigger className="w-40">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {roles.map(role => (
              <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Employee List */}
      <div className="grid gap-4">
        <AnimatePresence>
          {filteredEmployees.map((employee, index) => (
            <motion.div
              key={employee.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="border-gray-100 hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#005EEB] to-[#00C2FF] flex items-center justify-center text-white font-bold text-lg">
                        {employee.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-[#0F1E3A]">{employee.name}</h3>
                          {getRoleBadge(employee.role)}
                          {getStatusBadge(employee.status)}
                        </div>
                        <p className="text-sm text-[#6B7280] mt-0.5">{employee.email}</p>
                        <p className="text-xs text-[#9CA3AF] mt-1">{employee.department}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => sendCredentials(employee)}
                        disabled={employee.status !== "pending"}
                      >
                        <Send className="w-4 h-4 mr-1" />
                        Send Credentials
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedEmployee(selectedEmployee?.id === employee.id ? null : employee)}
                      >
                        <Settings className="w-4 h-4 mr-1" />
                        Manage Access
                        <ChevronRight className={`w-4 h-4 ml-1 transition-transform ${selectedEmployee?.id === employee.id ? "rotate-90" : ""}`} />
                      </Button>
                    </div>
                  </div>

                  {/* Module Access Panel */}
                  <AnimatePresence>
                    {selectedEmployee?.id === employee.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium text-[#0F1E3A] flex items-center gap-2">
                              <Unlock className="w-4 h-4 text-[#005EEB]" />
                              Portal Module Access
                            </h4>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" onClick={() => resetPassword(employee)}>
                                <RefreshCw className="w-4 h-4 mr-1" />
                                Reset Password
                              </Button>
                            </div>
                          </div>
                          
                          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {portalModules.map(module => {
                              const isEnabled = employee.enabledModules.includes(module.id);
                              const isNew = employee.newModules.includes(module.id);
                              
                              return (
                                <div
                                  key={module.id}
                                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                                    isEnabled 
                                      ? "bg-[#005EEB]/5 border-[#005EEB]/30" 
                                      : "bg-gray-50 border-gray-200"
                                  } ${module.isCore ? "opacity-60" : ""}`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                      isEnabled ? "bg-[#005EEB]/10" : "bg-gray-100"
                                    }`}>
                                      {isEnabled ? (
                                        <Unlock className="w-4 h-4 text-[#005EEB]" />
                                      ) : (
                                        <Lock className="w-4 h-4 text-gray-400" />
                                      )}
                                    </div>
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <span className={`text-sm font-medium ${isEnabled ? "text-[#0F1E3A]" : "text-gray-500"}`}>
                                          {module.name}
                                        </span>
                                        {isNew && (
                                          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] px-1.5 py-0">
                                            <Sparkles className="w-3 h-3 mr-0.5" />
                                            NEW
                                          </Badge>
                                        )}
                                      </div>
                                      <p className="text-xs text-gray-400">{module.description}</p>
                                    </div>
                                  </div>
                                  
                                  <Switch
                                    checked={isEnabled}
                                    onCheckedChange={() => toggleModuleForEmployee(employee.id, module.id)}
                                    disabled={module.isCore}
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredEmployees.length === 0 && (
        <Card className="border-gray-100">
          <CardContent className="p-12 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[#0F1E3A] mb-2">No employees found</h3>
            <p className="text-[#6B7280]">Try adjusting your search or filters</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TenantEmployees;