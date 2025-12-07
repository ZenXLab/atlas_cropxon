import React from "react";
import { useNavigate } from "react-router-dom";
import { DollarSign, AlertCircle, CheckCircle, Play, FileText, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTenant } from "../TenantLayout";

const mockData = {
  status: "review",
  grossPayroll: 1850000,
  netPayout: 1620000,
  pendingPayslips: 12,
  nextRun: "Jan 31, 2026",
};

const statusSteps = [
  { key: "draft", label: "Draft" },
  { key: "review", label: "Review" },
  { key: "processing", label: "Processing" },
  { key: "complete", label: "Complete" },
];

export const PayrollWidget: React.FC = () => {
  const navigate = useNavigate();
  const { isTrialMode } = useTenant();

  const currentIndex = statusSteps.findIndex(s => s.key === mockData.status);

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
        <h3 className="font-semibold text-[#0F1E3A] text-lg">Payroll Cycle</h3>
        <span className="text-xs text-[#6B7280]">Next: {mockData.nextRun}</span>
      </div>

      {/* Status Timeline */}
      <div className="flex items-center justify-between mb-5 px-2">
        {statusSteps.map((step, i) => (
          <React.Fragment key={step.key}>
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center mb-1 transition-all",
                  i < currentIndex && "bg-[#0FB07A] text-white",
                  i === currentIndex && "bg-[#FFB020] text-white animate-pulse",
                  i > currentIndex && "bg-[#F7F9FC] text-[#6B7280]"
                )}
              >
                {i < currentIndex ? (
                  <CheckCircle className="w-4 h-4" />
                ) : i === currentIndex ? (
                  <Play className="w-4 h-4" />
                ) : (
                  <span className="text-xs font-medium">{i + 1}</span>
                )}
              </div>
              <span className={cn(
                "text-[10px] font-medium",
                i <= currentIndex ? "text-[#0F1E3A]" : "text-[#6B7280]"
              )}>
                {step.label}
              </span>
            </div>
            {i < statusSteps.length - 1 && (
              <div className={cn(
                "flex-1 h-0.5 mx-1",
                i < currentIndex ? "bg-[#0FB07A]" : "bg-[#F7F9FC]"
              )} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Key Numbers */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center p-2 bg-[#F7F9FC] rounded-lg">
          <p className="text-xs text-[#6B7280] mb-1">Gross Payroll</p>
          <p className="text-sm font-semibold text-[#0F1E3A]">{formatCurrency(mockData.grossPayroll)}</p>
        </div>
        <div className="text-center p-2 bg-[#F7F9FC] rounded-lg">
          <p className="text-xs text-[#6B7280] mb-1">Net Payout</p>
          <p className="text-sm font-semibold text-[#0FB07A]">{formatCurrency(mockData.netPayout)}</p>
        </div>
        <div className="text-center p-2 bg-[#FFB020]/10 rounded-lg">
          <p className="text-xs text-[#6B7280] mb-1">Pending</p>
          <p className="text-sm font-semibold text-[#FFB020]">{mockData.pendingPayslips} slips</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-auto">
        <Button
          size="sm"
          className="flex-1 bg-[#E23E57] hover:bg-[#C73550] text-white gap-2"
          onClick={() => navigate("/tenant/payroll")}
        >
          <DollarSign className="w-4 h-4" /> Run Payroll
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="border-gray-200 text-[#6B7280] hover:text-[#0F1E3A] gap-2"
          onClick={() => navigate("/tenant/payroll")}
        >
          <Eye className="w-4 h-4" /> Preview
        </Button>
      </div>
    </div>
  );
};
