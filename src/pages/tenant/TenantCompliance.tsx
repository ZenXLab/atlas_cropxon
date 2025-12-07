import React from "react";
import { FileCheck, Calendar, AlertTriangle, CheckCircle2, Clock, Download, Plus, FileText, Building2, Scale } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const upcomingDeadlines = [
  { id: 1, title: "PF Monthly Return", dueDate: "Dec 15, 2025", status: "upcoming", daysLeft: 8, type: "PF" },
  { id: 2, title: "ESIC Return Q3", dueDate: "Dec 20, 2025", status: "upcoming", daysLeft: 13, type: "ESIC" },
  { id: 3, title: "Professional Tax", dueDate: "Dec 31, 2025", status: "upcoming", daysLeft: 24, type: "PT" },
  { id: 4, title: "TDS Return Q3", dueDate: "Jan 15, 2026", status: "upcoming", daysLeft: 39, type: "TDS" },
];

const complianceItems = [
  { id: 1, title: "PF Registration", status: "compliant", lastUpdated: "Oct 15, 2025", category: "Statutory" },
  { id: 2, title: "ESIC Registration", status: "compliant", lastUpdated: "Oct 15, 2025", category: "Statutory" },
  { id: 3, title: "GST Registration", status: "compliant", lastUpdated: "Sep 1, 2025", category: "Tax" },
  { id: 4, title: "Shop & Establishment", status: "pending-renewal", lastUpdated: "Dec 31, 2025", category: "License" },
  { id: 5, title: "Fire Safety Certificate", status: "action-required", lastUpdated: "Nov 30, 2025", category: "Safety" },
  { id: 6, title: "Labour Welfare Fund", status: "compliant", lastUpdated: "Jun 30, 2025", category: "Statutory" },
];

const TenantCompliance: React.FC = () => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "compliant": return <Badge className="bg-[#0FB07A]/10 text-[#0FB07A] border-[#0FB07A]/20"><CheckCircle2 className="w-3 h-3 mr-1" />Compliant</Badge>;
      case "pending-renewal": return <Badge className="bg-[#FFB020]/10 text-[#FFB020] border-[#FFB020]/20"><Clock className="w-3 h-3 mr-1" />Pending Renewal</Badge>;
      case "action-required": return <Badge className="bg-[#E23E57]/10 text-[#E23E57] border-[#E23E57]/20"><AlertTriangle className="w-3 h-3 mr-1" />Action Required</Badge>;
      default: return null;
    }
  };

  const getDaysLeftColor = (days: number) => {
    if (days <= 7) return "text-[#E23E57]";
    if (days <= 14) return "text-[#FFB020]";
    return "text-[#0FB07A]";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F1E3A]">Compliance & Statutory</h1>
          <p className="text-sm text-[#6B7280] mt-1">Manage statutory filings, licenses, and regulatory compliance</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
          <Button className="bg-[#005EEB] hover:bg-[#004ACC] gap-2">
            <Plus className="w-4 h-4" />
            Add Compliance Item
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#0FB07A]/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-[#0FB07A]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F1E3A]">12</p>
                <p className="text-xs text-[#6B7280]">Compliant Items</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#FFB020]/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#FFB020]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F1E3A]">3</p>
                <p className="text-xs text-[#6B7280]">Upcoming Deadlines</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#E23E57]/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-[#E23E57]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F1E3A]">1</p>
                <p className="text-xs text-[#6B7280]">Action Required</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#005EEB]/10 flex items-center justify-center">
                <Scale className="w-5 h-5 text-[#005EEB]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F1E3A]">92%</p>
                <p className="text-xs text-[#6B7280]">Compliance Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Deadlines */}
        <Card className="border-none shadow-sm lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#005EEB]" />
              Upcoming Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingDeadlines.map((deadline) => (
              <div key={deadline.id} className="p-3 bg-[#F7F9FC] rounded-lg hover:bg-[#F0F4F8] transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-xs">{deadline.type}</Badge>
                  <span className={`text-xs font-semibold ${getDaysLeftColor(deadline.daysLeft)}`}>
                    {deadline.daysLeft} days left
                  </span>
                </div>
                <p className="font-medium text-sm text-[#0F1E3A]">{deadline.title}</p>
                <p className="text-xs text-[#6B7280] mt-1">Due: {deadline.dueDate}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Compliance Items */}
        <Card className="border-none shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Compliance Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="statutory">Statutory</TabsTrigger>
                <TabsTrigger value="tax">Tax</TabsTrigger>
                <TabsTrigger value="license">License</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-3">
                {complianceItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-[#F7F9FC] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[#005EEB]/10 flex items-center justify-center">
                        <FileCheck className="w-5 h-5 text-[#005EEB]" />
                      </div>
                      <div>
                        <p className="font-medium text-[#0F1E3A]">{item.title}</p>
                        <p className="text-xs text-[#6B7280]">{item.category} • Last updated: {item.lastUpdated}</p>
                      </div>
                    </div>
                    {getStatusBadge(item.status)}
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="statutory">
                {complianceItems.filter(i => i.category === "Statutory").map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-[#F7F9FC] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[#005EEB]/10 flex items-center justify-center">
                        <FileCheck className="w-5 h-5 text-[#005EEB]" />
                      </div>
                      <div>
                        <p className="font-medium text-[#0F1E3A]">{item.title}</p>
                        <p className="text-xs text-[#6B7280]">{item.category} • Last updated: {item.lastUpdated}</p>
                      </div>
                    </div>
                    {getStatusBadge(item.status)}
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="tax">
                {complianceItems.filter(i => i.category === "Tax").map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-[#F7F9FC] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[#005EEB]/10 flex items-center justify-center">
                        <FileCheck className="w-5 h-5 text-[#005EEB]" />
                      </div>
                      <div>
                        <p className="font-medium text-[#0F1E3A]">{item.title}</p>
                        <p className="text-xs text-[#6B7280]">{item.category} • Last updated: {item.lastUpdated}</p>
                      </div>
                    </div>
                    {getStatusBadge(item.status)}
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="license">
                {complianceItems.filter(i => i.category === "License" || i.category === "Safety").map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-[#F7F9FC] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[#005EEB]/10 flex items-center justify-center">
                        <FileCheck className="w-5 h-5 text-[#005EEB]" />
                      </div>
                      <div>
                        <p className="font-medium text-[#0F1E3A]">{item.title}</p>
                        <p className="text-xs text-[#6B7280]">{item.category} • Last updated: {item.lastUpdated}</p>
                      </div>
                    </div>
                    {getStatusBadge(item.status)}
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TenantCompliance;
