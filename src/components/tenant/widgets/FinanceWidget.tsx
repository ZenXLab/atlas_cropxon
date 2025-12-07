import React from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, FileText, AlertTriangle, Download, TrendingUp, ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTenant } from "../TenantLayout";
import { toast } from "sonner";

const mockData = {
  mrr: 120000,
  outstandingPayouts: 45000,
  unreconciledInvoices: 7,
  growthPercent: 12.3,
  invoicesDue: 4,
};

export const FinanceWidget: React.FC = () => {
  const navigate = useNavigate();
  const { isTrialMode } = useTenant();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleCreateInvoice = () => {
    toast.success("Opening invoice creation form...");
    navigate("/tenant/finance");
  };

  return (
    <div className="widget-card relative bg-white rounded-xl border border-gray-200/80 p-6 h-[280px] flex flex-col animate-scale-in stagger-3" style={{ boxShadow: "var(--widget-shadow)" }}>
      {isTrialMode && <div className="trial-watermark">TRIAL</div>}
      
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-[#0F1E3A] text-lg">Finance & Billing</h3>
          <p className="text-xs text-[#6B7280] mt-0.5">
            <span className="text-[#0FB07A] font-medium">+{mockData.growthPercent}%</span> revenue growth
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-[#005EEB] hover:text-[#004ACC] hover:bg-[#005EEB]/5 text-sm gap-1 group"
          onClick={() => navigate("/tenant/finance")}
        >
          View All 
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>

      {/* KPIs */}
      <div className="space-y-3 flex-1">
        <button
          onClick={() => navigate("/tenant/finance")}
          className="flex items-center justify-between w-full p-3 bg-gradient-to-r from-[#005EEB]/10 via-[#005EEB]/5 to-transparent rounded-xl hover:from-[#005EEB]/15 hover:via-[#005EEB]/10 transition-all group hover-lift"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#005EEB]/20 to-[#005EEB]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5 text-[#005EEB]" />
            </div>
            <div className="text-left">
              <p className="text-[10px] text-[#6B7280] font-medium uppercase tracking-wide">Monthly Revenue</p>
              <p className="text-lg font-bold text-[#0F1E3A] group-hover:text-[#005EEB] transition-colors">{formatCurrency(mockData.mrr)}</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => {
            toast.info(`${formatCurrency(mockData.outstandingPayouts)} in outstanding payouts`);
            navigate("/tenant/finance");
          }}
          className="flex items-center justify-between w-full p-3 bg-gradient-to-r from-[#FFB020]/10 via-[#FFB020]/5 to-transparent rounded-xl hover:from-[#FFB020]/15 hover:via-[#FFB020]/10 transition-all group hover-lift"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#FFB020]/20 to-[#FFB020]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CreditCard className="w-5 h-5 text-[#FFB020]" />
            </div>
            <div className="text-left">
              <p className="text-[10px] text-[#6B7280] font-medium uppercase tracking-wide">Outstanding Payouts</p>
              <p className="text-lg font-bold text-[#FFB020]">{formatCurrency(mockData.outstandingPayouts)}</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => {
            toast.warning(`${mockData.unreconciledInvoices} invoices need reconciliation`);
            navigate("/tenant/finance?filter=unreconciled");
          }}
          className="flex items-center justify-between w-full p-3 bg-gradient-to-r from-[#E23E57]/10 via-[#E23E57]/5 to-transparent rounded-xl hover:from-[#E23E57]/15 hover:via-[#E23E57]/10 transition-all group hover-lift relative"
        >
          {mockData.unreconciledInvoices > 0 && <div className="notification-dot" />}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#E23E57]/20 to-[#E23E57]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-5 h-5 text-[#E23E57]" />
            </div>
            <div className="text-left">
              <p className="text-[10px] text-[#6B7280] font-medium uppercase tracking-wide">Unreconciled Invoices</p>
              <p className="text-lg font-bold text-[#E23E57]">{mockData.unreconciledInvoices}</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#E23E57] opacity-0 group-hover:opacity-100 transition-all" />
        </button>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4">
        <Button
          size="sm"
          className="flex-1 action-btn-primary text-white gap-2 h-10"
          onClick={handleCreateInvoice}
        >
          <Plus className="w-4 h-4" /> Create Invoice
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="border-gray-200 text-[#6B7280] hover:text-[#0F1E3A] hover:border-[#005EEB]/30 gap-2 h-10 hover-lift"
          onClick={() => toast.success("Generating financial report...")}
        >
          <Download className="w-4 h-4" /> Export
        </Button>
      </div>
    </div>
  );
};