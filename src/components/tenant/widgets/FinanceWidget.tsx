import React from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, FileText, AlertTriangle, Download, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTenant } from "../TenantLayout";

const mockData = {
  mrr: 120000,
  outstandingPayouts: 45000,
  unreconciledInvoices: 7,
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

  return (
    <div className="widget-card relative bg-white rounded-xl border border-gray-200 p-5 h-[280px] flex flex-col" style={{ boxShadow: "var(--widget-shadow)" }}>
      {isTrialMode && <div className="trial-watermark">TRIAL</div>}
      
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-[#0F1E3A] text-lg">Finance & Billing</h3>
        <Button
          variant="ghost"
          size="sm"
          className="text-[#005EEB] hover:text-[#004ACC] text-sm gap-1"
          onClick={() => navigate("/tenant/finance")}
        >
          View All <ArrowRight className="w-3 h-3" />
        </Button>
      </div>

      {/* KPIs */}
      <div className="space-y-3 flex-1">
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-[#005EEB]/5 to-transparent rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#005EEB]/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[#005EEB]" />
            </div>
            <div>
              <p className="text-xs text-[#6B7280]">Monthly Revenue</p>
              <p className="text-lg font-bold text-[#0F1E3A]">{formatCurrency(mockData.mrr)}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-[#FFB020]/5 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#FFB020]/10 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-[#FFB020]" />
            </div>
            <div>
              <p className="text-xs text-[#6B7280]">Outstanding Payouts</p>
              <p className="text-lg font-bold text-[#FFB020]">{formatCurrency(mockData.outstandingPayouts)}</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate("/tenant/finance?filter=unreconciled")}
          className="flex items-center justify-between w-full p-3 bg-[#E23E57]/5 rounded-lg hover:bg-[#E23E57]/10 transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#E23E57]/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-[#E23E57]" />
            </div>
            <div className="text-left">
              <p className="text-xs text-[#6B7280]">Unreconciled Invoices</p>
              <p className="text-lg font-bold text-[#E23E57]">{mockData.unreconciledInvoices}</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#E23E57]" />
        </button>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4">
        <Button
          size="sm"
          className="flex-1 bg-[#005EEB] hover:bg-[#004ACC] text-white gap-2"
          onClick={() => navigate("/tenant/finance")}
        >
          <FileText className="w-4 h-4" /> Create Invoice
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="border-gray-200 text-[#6B7280] hover:text-[#0F1E3A] gap-2"
        >
          <Download className="w-4 h-4" /> Export
        </Button>
      </div>
    </div>
  );
};
