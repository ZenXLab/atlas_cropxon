import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DollarSign, CheckCircle, Play, Eye, TrendingUp, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTenant } from "../TenantLayout";
import { toast } from "sonner";

const mockData = {
  status: "review",
  grossPayroll: 1850000,
  netPayout: 1620000,
  pendingPayslips: 12,
  nextRun: "Jan 31, 2026",
  changePercent: 5.2,
};

const statusSteps = [
  { key: "draft", label: "Draft", icon: AlertCircle },
  { key: "review", label: "Review", icon: Eye },
  { key: "processing", label: "Processing", icon: Play },
  { key: "complete", label: "Complete", icon: CheckCircle },
];

export const PayrollWidget: React.FC = () => {
  const navigate = useNavigate();
  const { isTrialMode } = useTenant();
  const [isHovered, setIsHovered] = useState(false);

  const currentIndex = statusSteps.findIndex(s => s.key === mockData.status);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleRunPayroll = () => {
    toast.success("Opening payroll run wizard...");
    navigate("/tenant/payroll");
  };

  return (
    <div 
      className="widget-card relative bg-white rounded-xl border border-gray-200/80 p-6 h-[280px] flex flex-col animate-scale-in stagger-2" 
      style={{ boxShadow: "var(--widget-shadow)" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isTrialMode && <div className="trial-watermark">TRIAL</div>}
      
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-[#0F1E3A] text-lg">Payroll Cycle</h3>
          <p className="text-xs text-[#6B7280] mt-0.5">Next: <span className="font-medium text-[#005EEB]">{mockData.nextRun}</span></p>
        </div>
        <div className="flex items-center gap-1 text-xs text-[#0FB07A] bg-[#0FB07A]/10 px-2 py-1 rounded-full">
          <TrendingUp className="w-3 h-3" />
          <span className="font-medium">+{mockData.changePercent}%</span>
        </div>
      </div>

      {/* Status Timeline */}
      <div className="flex items-center justify-between mb-5 px-1">
        {statusSteps.map((step, i) => {
          const StepIcon = step.icon;
          return (
            <React.Fragment key={step.key}>
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center mb-1.5 transition-all duration-500",
                    i < currentIndex && "bg-gradient-to-br from-[#0FB07A] to-[#00C2FF] text-white shadow-lg shadow-[#0FB07A]/30",
                    i === currentIndex && "bg-gradient-to-br from-[#FFB020] to-[#FF9500] text-white shadow-lg shadow-[#FFB020]/30 animate-glow-pulse",
                    i > currentIndex && "bg-[#F7F9FC] text-[#6B7280]"
                  )}
                >
                  <StepIcon className="w-4 h-4" />
                </div>
                <span className={cn(
                  "text-[10px] font-medium transition-colors",
                  i <= currentIndex ? "text-[#0F1E3A]" : "text-[#6B7280]"
                )}>
                  {step.label}
                </span>
              </div>
              {i < statusSteps.length - 1 && (
                <div className={cn(
                  "flex-1 h-1 mx-2 rounded-full transition-all duration-500",
                  i < currentIndex 
                    ? "bg-gradient-to-r from-[#0FB07A] to-[#00C2FF]" 
                    : "bg-[#F7F9FC]"
                )} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Key Numbers */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <button
          onClick={() => navigate("/tenant/payroll")}
          className="text-center p-3 bg-gradient-to-br from-[#F7F9FC] to-[#EEF2F6] rounded-xl hover:from-[#EEF2F6] hover:to-[#E5EAF0] transition-all hover-lift"
        >
          <p className="text-[10px] text-[#6B7280] font-medium mb-1 uppercase tracking-wide">Gross Payroll</p>
          <p className="text-sm font-bold text-[#0F1E3A]">{formatCurrency(mockData.grossPayroll)}</p>
        </button>
        <button
          onClick={() => navigate("/tenant/payroll")}
          className="text-center p-3 bg-gradient-to-br from-[#0FB07A]/10 to-[#0FB07A]/5 rounded-xl hover:from-[#0FB07A]/15 hover:to-[#0FB07A]/10 transition-all hover-lift"
        >
          <p className="text-[10px] text-[#6B7280] font-medium mb-1 uppercase tracking-wide">Net Payout</p>
          <p className="text-sm font-bold text-[#0FB07A]">{formatCurrency(mockData.netPayout)}</p>
        </button>
        <button
          onClick={() => {
            toast.info(`${mockData.pendingPayslips} payslips awaiting approval`);
            navigate("/tenant/payroll");
          }}
          className="text-center p-3 bg-gradient-to-br from-[#FFB020]/15 to-[#FFB020]/5 rounded-xl hover:from-[#FFB020]/20 hover:to-[#FFB020]/10 transition-all hover-lift relative"
        >
          <div className="notification-dot" />
          <p className="text-[10px] text-[#6B7280] font-medium mb-1 uppercase tracking-wide">Pending</p>
          <p className="text-sm font-bold text-[#FFB020]">{mockData.pendingPayslips} slips</p>
        </button>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-auto">
        <Button
          size="sm"
          className="flex-1 bg-gradient-to-r from-[#E23E57] to-[#D63150] hover:from-[#D63150] hover:to-[#C02848] text-white gap-2 h-10 shadow-lg shadow-[#E23E57]/30 hover:shadow-xl hover:shadow-[#E23E57]/40 transition-all"
          onClick={handleRunPayroll}
        >
          <DollarSign className="w-4 h-4" /> Run Payroll
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="border-gray-200 text-[#6B7280] hover:text-[#0F1E3A] hover:border-[#005EEB]/30 gap-2 h-10 hover-lift"
          onClick={() => {
            toast.info("Opening payroll preview...");
            navigate("/tenant/payroll");
          }}
        >
          <Eye className="w-4 h-4" /> Preview
        </Button>
      </div>
    </div>
  );
};