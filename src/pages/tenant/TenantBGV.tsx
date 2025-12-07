import React, { useState } from "react";
import { UserCheck, Clock, CheckCircle2, XCircle, AlertTriangle, Search, Filter, Download, Plus, Eye, FileText, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

const bgvRequests = [
  { id: "BGV-001", name: "Ravi Kumar", position: "Senior Developer", status: "in-progress", progress: 65, submitted: "Dec 1, 2025", checks: ["Identity", "Education", "Employment"] },
  { id: "BGV-002", name: "Priya Sharma", position: "Product Manager", status: "completed", progress: 100, submitted: "Nov 28, 2025", checks: ["Identity", "Education", "Employment", "Criminal"] },
  { id: "BGV-003", name: "Amit Patel", position: "Data Analyst", status: "pending", progress: 0, submitted: "Dec 5, 2025", checks: ["Identity", "Education"] },
  { id: "BGV-004", name: "Sneha Reddy", position: "UI Designer", status: "failed", progress: 100, submitted: "Nov 25, 2025", checks: ["Identity", "Education", "Employment"] },
  { id: "BGV-005", name: "Vikram Singh", position: "DevOps Engineer", status: "in-progress", progress: 40, submitted: "Dec 3, 2025", checks: ["Identity", "Education", "Employment", "Criminal", "Address"] },
];

const checkTypes = [
  { name: "Identity Verification", count: 184, avgTime: "4 hrs", status: "active" },
  { name: "Education Verification", count: 156, avgTime: "24 hrs", status: "active" },
  { name: "Employment History", count: 142, avgTime: "48 hrs", status: "active" },
  { name: "Criminal Background", count: 98, avgTime: "72 hrs", status: "active" },
  { name: "Address Verification", count: 67, avgTime: "12 hrs", status: "active" },
];

const TenantBGV: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed": return <Badge className="bg-[#0FB07A]/10 text-[#0FB07A] border-[#0FB07A]/20"><CheckCircle2 className="w-3 h-3 mr-1" />Completed</Badge>;
      case "in-progress": return <Badge className="bg-[#005EEB]/10 text-[#005EEB] border-[#005EEB]/20"><Clock className="w-3 h-3 mr-1" />In Progress</Badge>;
      case "pending": return <Badge className="bg-[#FFB020]/10 text-[#FFB020] border-[#FFB020]/20"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case "failed": return <Badge className="bg-[#E23E57]/10 text-[#E23E57] border-[#E23E57]/20"><XCircle className="w-3 h-3 mr-1" />Failed</Badge>;
      default: return null;
    }
  };

  const getProgressColor = (progress: number, status: string) => {
    if (status === "failed") return "bg-[#E23E57]";
    if (progress === 100) return "bg-[#0FB07A]";
    return "bg-[#005EEB]";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F1E3A]">Background Verification</h1>
          <p className="text-sm text-[#6B7280] mt-1">Manage employee background checks and verification requests</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
          <Button className="bg-[#005EEB] hover:bg-[#004ACC] gap-2">
            <Plus className="w-4 h-4" />
            New BGV Request
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#FFB020]/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#FFB020]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F1E3A]">12</p>
                <p className="text-xs text-[#6B7280]">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#005EEB]/10 flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-[#005EEB]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F1E3A]">8</p>
                <p className="text-xs text-[#6B7280]">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#0FB07A]/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-[#0FB07A]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F1E3A]">184</p>
                <p className="text-xs text-[#6B7280]">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#E23E57]/10 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-[#E23E57]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F1E3A]">3</p>
                <p className="text-xs text-[#6B7280]">Failed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#8B5CF6]/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#8B5CF6]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F1E3A]">18h</p>
                <p className="text-xs text-[#6B7280]">Avg. TAT</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="requests" className="space-y-4">
        <TabsList className="bg-white border">
          <TabsTrigger value="requests">BGV Requests</TabsTrigger>
          <TabsTrigger value="checks">Check Types</TabsTrigger>
          <TabsTrigger value="providers">Providers</TabsTrigger>
        </TabsList>

        <TabsContent value="requests">
          <Card className="border-none shadow-sm">
            <CardHeader className="border-b bg-[#F7F9FC]/50">
              <div className="flex items-center justify-between">
                <div className="relative w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                  <Input
                    placeholder="Search by name or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-9 bg-white"
                  />
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="w-4 h-4" />
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#F7F9FC]">
                    <tr>
                      <th className="text-left p-4 text-xs font-semibold text-[#6B7280] uppercase">ID</th>
                      <th className="text-left p-4 text-xs font-semibold text-[#6B7280] uppercase">Candidate</th>
                      <th className="text-left p-4 text-xs font-semibold text-[#6B7280] uppercase">Position</th>
                      <th className="text-left p-4 text-xs font-semibold text-[#6B7280] uppercase">Checks</th>
                      <th className="text-left p-4 text-xs font-semibold text-[#6B7280] uppercase">Progress</th>
                      <th className="text-left p-4 text-xs font-semibold text-[#6B7280] uppercase">Status</th>
                      <th className="text-left p-4 text-xs font-semibold text-[#6B7280] uppercase">Submitted</th>
                      <th className="text-left p-4 text-xs font-semibold text-[#6B7280] uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bgvRequests.map((request) => (
                      <tr key={request.id} className="border-b border-gray-100 hover:bg-[#F7F9FC]/50 transition-colors">
                        <td className="p-4 font-medium text-[#005EEB]">{request.id}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#005EEB] to-[#00C2FF] flex items-center justify-center text-white text-xs font-bold">
                              {request.name.split(" ").map(n => n[0]).join("")}
                            </div>
                            <span className="font-medium text-[#0F1E3A]">{request.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-[#6B7280]">{request.position}</td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1">
                            {request.checks.slice(0, 2).map((check) => (
                              <Badge key={check} variant="outline" className="text-[10px] bg-white">{check}</Badge>
                            ))}
                            {request.checks.length > 2 && (
                              <Badge variant="outline" className="text-[10px] bg-white">+{request.checks.length - 2}</Badge>
                            )}
                          </div>
                        </td>
                        <td className="p-4 w-32">
                          <div className="flex items-center gap-2">
                            <Progress value={request.progress} className="h-2" />
                            <span className="text-xs text-[#6B7280] w-8">{request.progress}%</span>
                          </div>
                        </td>
                        <td className="p-4">{getStatusBadge(request.status)}</td>
                        <td className="p-4 text-sm text-[#6B7280]">{request.submitted}</td>
                        <td className="p-4">
                          <Button variant="ghost" size="sm" className="gap-1">
                            <Eye className="w-3 h-3" />
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="checks">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Available Check Types</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {checkTypes.map((check, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-[#F7F9FC] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#005EEB]/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-[#005EEB]" />
                    </div>
                    <div>
                      <p className="font-medium text-[#0F1E3A]">{check.name}</p>
                      <p className="text-xs text-[#6B7280]">Avg. TAT: {check.avgTime}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[#0F1E3A]">{check.count}</p>
                    <p className="text-xs text-[#6B7280]">Completed</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="providers">
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="text-center py-12 text-[#6B7280]">
                <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>BGV Provider configuration coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TenantBGV;
