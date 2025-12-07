import React from "react";
import { Shield, Users, FileText, Clock, CheckCircle2, AlertTriangle, Download, Plus, Heart, Stethoscope, Car, Home } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

const insurancePlans = [
  { id: 1, name: "Group Health Insurance", provider: "ICICI Lombard", coverage: "₹5,00,000", enrolled: 156, type: "health", premium: "₹12,500/yr", renewalDate: "Mar 31, 2026" },
  { id: 2, name: "Term Life Insurance", provider: "HDFC Life", coverage: "₹25,00,000", enrolled: 142, type: "life", premium: "₹8,000/yr", renewalDate: "Jun 30, 2026" },
  { id: 3, name: "Personal Accident", provider: "Bajaj Allianz", coverage: "₹10,00,000", enrolled: 184, type: "accident", premium: "₹2,500/yr", renewalDate: "Dec 31, 2025" },
];

const claims = [
  { id: "CLM-001", employee: "Priya Sharma", type: "Medical", amount: 45000, status: "approved", date: "Dec 1, 2025" },
  { id: "CLM-002", employee: "Rahul Verma", type: "Medical", amount: 28000, status: "pending", date: "Dec 3, 2025" },
  { id: "CLM-003", employee: "Amit Kumar", type: "Medical", amount: 15000, status: "processing", date: "Dec 5, 2025" },
  { id: "CLM-004", employee: "Neha Gupta", type: "Accident", amount: 75000, status: "approved", date: "Nov 28, 2025" },
];

const TenantInsurance: React.FC = () => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved": return <Badge className="bg-[#0FB07A]/10 text-[#0FB07A] border-[#0FB07A]/20"><CheckCircle2 className="w-3 h-3 mr-1" />Approved</Badge>;
      case "pending": return <Badge className="bg-[#FFB020]/10 text-[#FFB020] border-[#FFB020]/20"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case "processing": return <Badge className="bg-[#005EEB]/10 text-[#005EEB] border-[#005EEB]/20"><Clock className="w-3 h-3 mr-1" />Processing</Badge>;
      case "rejected": return <Badge className="bg-[#E23E57]/10 text-[#E23E57] border-[#E23E57]/20"><AlertTriangle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default: return null;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "health": return <Heart className="w-5 h-5 text-[#E23E57]" />;
      case "life": return <Shield className="w-5 h-5 text-[#005EEB]" />;
      case "accident": return <Stethoscope className="w-5 h-5 text-[#FFB020]" />;
      default: return <Shield className="w-5 h-5 text-[#6B7280]" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F1E3A]">Insurance & Claims</h1>
          <p className="text-sm text-[#6B7280] mt-1">Manage group insurance plans and employee claims</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
          <Button className="bg-[#005EEB] hover:bg-[#004ACC] gap-2">
            <Plus className="w-4 h-4" />
            New Claim
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#005EEB]/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#005EEB]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F1E3A]">3</p>
                <p className="text-xs text-[#6B7280]">Active Plans</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#0FB07A]/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-[#0FB07A]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F1E3A]">184</p>
                <p className="text-xs text-[#6B7280]">Enrolled Members</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#FFB020]/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#FFB020]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F1E3A]">8</p>
                <p className="text-xs text-[#6B7280]">Open Claims</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#8B5CF6]/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#8B5CF6]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F1E3A]">3 days</p>
                <p className="text-xs text-[#6B7280]">Avg. Resolution</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="plans" className="space-y-4">
        <TabsList className="bg-white border">
          <TabsTrigger value="plans">Insurance Plans</TabsTrigger>
          <TabsTrigger value="claims">Claims</TabsTrigger>
          <TabsTrigger value="enrollment">Enrollment</TabsTrigger>
        </TabsList>

        <TabsContent value="plans">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {insurancePlans.map((plan) => (
              <Card key={plan.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-lg bg-[#F7F9FC] flex items-center justify-center">
                      {getTypeIcon(plan.type)}
                    </div>
                    <Badge variant="outline" className="text-xs">{plan.provider}</Badge>
                  </div>
                  <CardTitle className="text-lg mt-3">{plan.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-[#6B7280]">Coverage</p>
                      <p className="font-semibold text-[#0F1E3A]">{plan.coverage}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#6B7280]">Premium</p>
                      <p className="font-semibold text-[#0F1E3A]">{plan.premium}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#6B7280]">Enrolled</p>
                      <p className="font-semibold text-[#0F1E3A]">{plan.enrolled} members</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#6B7280]">Renewal</p>
                      <p className="font-semibold text-[#0F1E3A]">{plan.renewalDate}</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">Manage Plan</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="claims">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Recent Claims</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#F7F9FC]">
                    <tr>
                      <th className="text-left p-4 text-xs font-semibold text-[#6B7280] uppercase">Claim ID</th>
                      <th className="text-left p-4 text-xs font-semibold text-[#6B7280] uppercase">Employee</th>
                      <th className="text-left p-4 text-xs font-semibold text-[#6B7280] uppercase">Type</th>
                      <th className="text-left p-4 text-xs font-semibold text-[#6B7280] uppercase">Amount</th>
                      <th className="text-left p-4 text-xs font-semibold text-[#6B7280] uppercase">Status</th>
                      <th className="text-left p-4 text-xs font-semibold text-[#6B7280] uppercase">Date</th>
                      <th className="text-left p-4 text-xs font-semibold text-[#6B7280] uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {claims.map((claim) => (
                      <tr key={claim.id} className="border-b border-gray-100 hover:bg-[#F7F9FC]/50 transition-colors">
                        <td className="p-4 font-medium text-[#005EEB]">{claim.id}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#005EEB] to-[#00C2FF] flex items-center justify-center text-white text-xs font-bold">
                              {claim.employee.split(" ").map(n => n[0]).join("")}
                            </div>
                            <span className="font-medium text-[#0F1E3A]">{claim.employee}</span>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-[#6B7280]">{claim.type}</td>
                        <td className="p-4 font-semibold text-[#0F1E3A]">{formatCurrency(claim.amount)}</td>
                        <td className="p-4">{getStatusBadge(claim.status)}</td>
                        <td className="p-4 text-sm text-[#6B7280]">{claim.date}</td>
                        <td className="p-4">
                          <Button variant="ghost" size="sm">View</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="enrollment">
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="text-center py-12 text-[#6B7280]">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Enrollment management coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TenantInsurance;
