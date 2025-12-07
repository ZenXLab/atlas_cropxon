import React, { useState } from "react";
import { CreditCard, TrendingUp, TrendingDown, DollarSign, FileText, Download, Plus, ArrowUpRight, ArrowDownRight, Receipt, Building2, RefreshCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateInvoiceModal } from "@/components/tenant/modals/CreateInvoiceModal";

const invoices = [
  { id: "INV-2025-001", client: "TechCorp Solutions", amount: 125000, status: "paid", date: "Dec 1, 2025", dueDate: "Dec 15, 2025" },
  { id: "INV-2025-002", client: "Global Industries", amount: 87500, status: "pending", date: "Dec 5, 2025", dueDate: "Dec 20, 2025" },
  { id: "INV-2025-003", client: "Startup Inc", amount: 45000, status: "overdue", date: "Nov 15, 2025", dueDate: "Nov 30, 2025" },
  { id: "INV-2025-004", client: "Enterprise Ltd", amount: 235000, status: "draft", date: "Dec 7, 2025", dueDate: "Dec 22, 2025" },
];

const recentTransactions = [
  { id: 1, description: "Payroll December 2025", amount: -2450000, type: "expense", date: "Dec 5, 2025", category: "Payroll" },
  { id: 2, description: "Invoice #INV-2025-001 Payment", amount: 125000, type: "income", date: "Dec 3, 2025", category: "Revenue" },
  { id: 3, description: "AWS Cloud Services", amount: -45000, type: "expense", date: "Dec 1, 2025", category: "Infrastructure" },
  { id: 4, description: "Office Rent - December", amount: -180000, type: "expense", date: "Dec 1, 2025", category: "Rent" },
  { id: 5, description: "Software Licenses", amount: -32000, type: "expense", date: "Nov 28, 2025", category: "Software" },
];

const TenantFinance: React.FC = () => {
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid": return <Badge className="bg-[#0FB07A]/10 text-[#0FB07A] border-[#0FB07A]/20">Paid</Badge>;
      case "pending": return <Badge className="bg-[#FFB020]/10 text-[#FFB020] border-[#FFB020]/20">Pending</Badge>;
      case "overdue": return <Badge className="bg-[#E23E57]/10 text-[#E23E57] border-[#E23E57]/20">Overdue</Badge>;
      case "draft": return <Badge className="bg-[#6B7280]/10 text-[#6B7280] border-[#6B7280]/20">Draft</Badge>;
      default: return null;
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
          <h1 className="text-2xl font-bold text-[#0F1E3A]">Finance & Billing</h1>
          <p className="text-sm text-[#6B7280] mt-1">Manage invoices, payments, and financial reporting</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
          <Button className="bg-[#005EEB] hover:bg-[#004ACC] gap-2" onClick={() => setShowInvoiceModal(true)}>
            <Plus className="w-4 h-4" />
            Create Invoice
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[#6B7280] mb-1">Total Revenue (MTD)</p>
                <p className="text-2xl font-bold text-[#0F1E3A]">₹12.5L</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="w-3 h-3 text-[#0FB07A]" />
                  <span className="text-xs text-[#0FB07A]">+12.5% vs last month</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[#0FB07A]/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[#0FB07A]" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[#6B7280] mb-1">Total Expenses (MTD)</p>
                <p className="text-2xl font-bold text-[#0F1E3A]">₹27.1L</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowDownRight className="w-3 h-3 text-[#E23E57]" />
                  <span className="text-xs text-[#E23E57]">+5.2% vs last month</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[#E23E57]/10 flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-[#E23E57]" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[#6B7280] mb-1">Outstanding Invoices</p>
                <p className="text-2xl font-bold text-[#0F1E3A]">₹1.32L</p>
                <p className="text-xs text-[#6B7280] mt-1">3 invoices pending</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[#FFB020]/10 flex items-center justify-center">
                <Receipt className="w-5 h-5 text-[#FFB020]" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[#6B7280] mb-1">Cash Balance</p>
                <p className="text-2xl font-bold text-[#0F1E3A]">₹45.8L</p>
                <p className="text-xs text-[#6B7280] mt-1">Across 3 accounts</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[#005EEB]/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-[#005EEB]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="invoices" className="space-y-4">
        <TabsList className="bg-white border">
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="reimbursements">Reimbursements</TabsTrigger>
          <TabsTrigger value="gst">GST Dashboard</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices">
          <Card className="border-none shadow-sm">
            <CardHeader className="border-b bg-[#F7F9FC]/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">All Invoices</CardTitle>
                <Button variant="outline" size="sm" className="gap-2">
                  <RefreshCcw className="w-4 h-4" />
                  Sync
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#F7F9FC]">
                    <tr>
                      <th className="text-left p-4 text-xs font-semibold text-[#6B7280] uppercase">Invoice #</th>
                      <th className="text-left p-4 text-xs font-semibold text-[#6B7280] uppercase">Client</th>
                      <th className="text-left p-4 text-xs font-semibold text-[#6B7280] uppercase">Amount</th>
                      <th className="text-left p-4 text-xs font-semibold text-[#6B7280] uppercase">Status</th>
                      <th className="text-left p-4 text-xs font-semibold text-[#6B7280] uppercase">Date</th>
                      <th className="text-left p-4 text-xs font-semibold text-[#6B7280] uppercase">Due Date</th>
                      <th className="text-left p-4 text-xs font-semibold text-[#6B7280] uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((invoice) => (
                      <tr key={invoice.id} className="border-b border-gray-100 hover:bg-[#F7F9FC]/50 transition-colors">
                        <td className="p-4 font-medium text-[#005EEB]">{invoice.id}</td>
                        <td className="p-4 text-sm text-[#0F1E3A]">{invoice.client}</td>
                        <td className="p-4 text-sm font-semibold text-[#0F1E3A]">{formatCurrency(invoice.amount)}</td>
                        <td className="p-4">{getStatusBadge(invoice.status)}</td>
                        <td className="p-4 text-sm text-[#6B7280]">{invoice.date}</td>
                        <td className="p-4 text-sm text-[#6B7280]">{invoice.dueDate}</td>
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

        <TabsContent value="transactions">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-[#F7F9FC] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${tx.type === 'income' ? 'bg-[#0FB07A]/10' : 'bg-[#E23E57]/10'}`}>
                      {tx.type === 'income' ? (
                        <ArrowUpRight className="w-5 h-5 text-[#0FB07A]" />
                      ) : (
                        <ArrowDownRight className="w-5 h-5 text-[#E23E57]" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-[#0F1E3A]">{tx.description}</p>
                      <p className="text-xs text-[#6B7280]">{tx.category} • {tx.date}</p>
                    </div>
                  </div>
                  <span className={`font-semibold ${tx.type === 'income' ? 'text-[#0FB07A]' : 'text-[#E23E57]'}`}>
                    {tx.type === 'income' ? '+' : ''}{formatCurrency(tx.amount)}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reimbursements">
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="text-center py-12 text-[#6B7280]">
                <Receipt className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Reimbursements module coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gst">
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="text-center py-12 text-[#6B7280]">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>GST Dashboard coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CreateInvoiceModal open={showInvoiceModal} onOpenChange={setShowInvoiceModal} />
    </div>
  );
};

export default TenantFinance;
