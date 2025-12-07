import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Plus, 
  Shield, 
  AlertTriangle, 
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Eye,
  Download,
  Calendar,
  BarChart3,
  AlertCircle,
  Flag,
  MoreVertical
} from "lucide-react";

const TenantRiskGovernance: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("risks");

  const riskStats = [
    { label: "Total Risks", value: "47", icon: AlertTriangle, color: "bg-amber-500", trend: "+3", trendUp: true },
    { label: "High Priority", value: "8", icon: Flag, color: "bg-red-500", trend: "-2", trendUp: false },
    { label: "Mitigated", value: "31", icon: CheckCircle, color: "bg-green-500", trend: "+5", trendUp: true },
    { label: "Pending Review", value: "8", icon: Clock, color: "bg-blue-500", trend: "0", trendUp: true },
  ];

  const riskMatrix = [
    { severity: "Critical", count: 3, color: "bg-red-500" },
    { severity: "High", count: 5, color: "bg-orange-500" },
    { severity: "Medium", count: 12, color: "bg-amber-500" },
    { severity: "Low", count: 27, color: "bg-green-500" },
  ];

  const risks = [
    { 
      id: "RSK-001", 
      title: "Data Privacy Compliance Gap",
      category: "Compliance",
      severity: "Critical",
      status: "Open",
      owner: "John Smith",
      dueDate: "2024-02-15",
      progress: 45
    },
    { 
      id: "RSK-002", 
      title: "Third-Party Vendor Security Assessment",
      category: "Security",
      severity: "High",
      status: "In Progress",
      owner: "Sarah Johnson",
      dueDate: "2024-02-28",
      progress: 70
    },
    { 
      id: "RSK-003", 
      title: "Employee Access Control Review",
      category: "Access",
      severity: "Medium",
      status: "In Progress",
      owner: "Mike Chen",
      dueDate: "2024-03-10",
      progress: 35
    },
    { 
      id: "RSK-004", 
      title: "Business Continuity Plan Update",
      category: "Operations",
      severity: "Medium",
      status: "Pending",
      owner: "Emily Davis",
      dueDate: "2024-03-20",
      progress: 10
    },
    { 
      id: "RSK-005", 
      title: "Financial Audit Preparation",
      category: "Finance",
      severity: "High",
      status: "In Progress",
      owner: "David Wilson",
      dueDate: "2024-02-20",
      progress: 85
    },
  ];

  const auditTrail = [
    { action: "Risk RSK-001 escalated to Critical", user: "System", time: "2 hours ago" },
    { action: "New compliance policy added", user: "John Smith", time: "5 hours ago" },
    { action: "Risk RSK-003 assigned to Mike Chen", user: "Sarah Johnson", time: "1 day ago" },
    { action: "Quarterly risk review completed", user: "Admin", time: "2 days ago" },
    { action: "RSK-005 status updated to In Progress", user: "David Wilson", time: "3 days ago" },
  ];

  const policies = [
    { name: "Data Protection Policy", version: "v3.2", lastUpdated: "2024-01-15", status: "Active" },
    { name: "Information Security Policy", version: "v2.8", lastUpdated: "2024-01-10", status: "Active" },
    { name: "Acceptable Use Policy", version: "v4.1", lastUpdated: "2023-12-20", status: "Active" },
    { name: "Incident Response Plan", version: "v2.0", lastUpdated: "2023-11-15", status: "Review" },
    { name: "Business Continuity Plan", version: "v1.5", lastUpdated: "2023-10-30", status: "Active" },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical": return "bg-red-100 text-red-700";
      case "High": return "bg-orange-100 text-orange-700";
      case "Medium": return "bg-amber-100 text-amber-700";
      case "Low": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open": return "bg-red-100 text-red-700";
      case "In Progress": return "bg-blue-100 text-blue-700";
      case "Pending": return "bg-amber-100 text-amber-700";
      case "Mitigated": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F1E3A]">Risk & Governance</h1>
          <p className="text-sm text-[#6B7280] mt-1">Risk management, policies, and audit trails</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
          <Button size="sm" className="gap-2 bg-[#0F1E3A] hover:bg-[#1a2d4f]">
            <Plus className="w-4 h-4" />
            Add Risk
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {riskStats.map((stat, index) => (
          <Card key={index} className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#6B7280]">{stat.label}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-2xl font-bold text-[#0F1E3A]">{stat.value}</p>
                    <span className={`text-xs flex items-center ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.trendUp ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                      {stat.trend}
                    </span>
                  </div>
                </div>
                <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Risk Matrix Overview */}
      <Card className="border border-gray-100 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-[#0F1E3A]">Risk Distribution by Severity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {riskMatrix.map((item, index) => (
              <div key={index} className="text-center">
                <div className={`w-full h-24 rounded-xl ${item.color} bg-opacity-20 flex items-center justify-center mb-2`}>
                  <span className={`text-3xl font-bold ${item.color.replace('bg-', 'text-')}`}>{item.count}</span>
                </div>
                <p className="text-sm font-medium text-[#0F1E3A]">{item.severity}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white border border-gray-200 p-1">
          <TabsTrigger value="risks" className="gap-2">
            <AlertTriangle className="w-4 h-4" />
            Risk Register
          </TabsTrigger>
          <TabsTrigger value="policies" className="gap-2">
            <FileText className="w-4 h-4" />
            Policies
          </TabsTrigger>
          <TabsTrigger value="audit" className="gap-2">
            <Eye className="w-4 h-4" />
            Audit Trail
          </TabsTrigger>
        </TabsList>

        <TabsContent value="risks" className="mt-4 space-y-4">
          {/* Risk Register */}
          <Card className="border border-gray-100 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-[#0F1E3A]">Risk Register</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                  <Input
                    placeholder="Search risks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-9 text-sm"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {risks.map((risk, index) => (
                  <div 
                    key={index}
                    className="p-4 rounded-xl border border-gray-100 hover:border-[#0F1E3A]/20 hover:bg-[#F7F9FC] transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xs font-mono text-[#6B7280]">{risk.id}</span>
                          <Badge className={getSeverityColor(risk.severity)}>{risk.severity}</Badge>
                          <Badge className={getStatusColor(risk.status)}>{risk.status}</Badge>
                          <Badge variant="outline" className="text-xs">{risk.category}</Badge>
                        </div>
                        <h3 className="font-semibold text-[#0F1E3A]">{risk.title}</h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-[#6B7280]">
                          <span>Owner: {risk.owner}</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Due: {risk.dueDate}
                          </span>
                        </div>
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-xs text-[#6B7280] mb-1">
                            <span>Mitigation Progress</span>
                            <span>{risk.progress}%</span>
                          </div>
                          <Progress value={risk.progress} className="h-2" />
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 ml-4">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="mt-4 space-y-4">
          {/* Policies */}
          <Card className="border border-gray-100 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-[#0F1E3A]">Policy Documents</CardTitle>
                <Button size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Policy
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 px-4 text-xs font-medium text-[#6B7280] uppercase">Policy Name</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-[#6B7280] uppercase">Version</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-[#6B7280] uppercase">Last Updated</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-[#6B7280] uppercase">Status</th>
                      <th className="text-right py-3 px-4 text-xs font-medium text-[#6B7280] uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {policies.map((policy, index) => (
                      <tr key={index} className="border-b border-gray-50 hover:bg-[#F7F9FC] transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-[#6B7280]" />
                            <span className="text-sm font-medium text-[#0F1E3A]">{policy.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-[#6B7280]">{policy.version}</td>
                        <td className="py-3 px-4 text-sm text-[#6B7280]">{policy.lastUpdated}</td>
                        <td className="py-3 px-4">
                          <Badge className={policy.status === "Active" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}>
                            {policy.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="mt-4 space-y-4">
          {/* Audit Trail */}
          <Card className="border border-gray-100 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-[#0F1E3A]">Audit Trail</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditTrail.map((entry, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-[#F7F9FC] transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#F7F9FC] flex items-center justify-center">
                      <Clock className="w-5 h-5 text-[#6B7280]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#0F1E3A]">{entry.action}</p>
                      <p className="text-xs text-[#6B7280]">By {entry.user}</p>
                    </div>
                    <span className="text-xs text-[#6B7280]">{entry.time}</span>
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

export default TenantRiskGovernance;
