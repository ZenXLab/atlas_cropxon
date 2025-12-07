import React from "react";
import { useNavigate } from "react-router-dom";
import { Shield, FileText, Clock, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTenant } from "../TenantLayout";
import { toast } from "sonner";

const mockData = {
  claimsOpen: 8,
  avgResolution: "3 days",
  claimsApproved: 24,
  totalCoverage: 2500000,
};

export const InsuranceWidget: React.FC = () => {
  const navigate = useNavigate();
  const { isTrialMode } = useTenant();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
      notation: 'compact',
    }).format(amount);
  };

  const handleViewClaims = () => {
    toast.info("Opening claims dashboard...");
    navigate("/tenant/insurance");
  };

  return (
    <div className="widget-card relative bg-white rounded-xl border border-gray-200/80 p-5 h-[160px] flex flex-col animate-scale-in stagger-5" style={{ boxShadow: "var(--widget-shadow)" }}>
      {isTrialMode && <div className="trial-watermark">TRIAL</div>}
      
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#00C2FF]/10 flex items-center justify-center">
            <Shield className="w-4 h-4 text-[#00C2FF]" />
          </div>
          <h3 className="font-semibold text-[#0F1E3A]">Insurance & Claims</h3>
        </div>
        <span className="text-[10px] text-[#6B7280] bg-[#F7F9FC] px-2 py-1 rounded-full">
          Coverage: {formatCurrency(mockData.totalCoverage)}
        </span>
      </div>

      <div className="flex gap-3 flex-1">
        <button
          onClick={() => {
            toast.info(`${mockData.claimsOpen} claims pending review`);
            navigate("/tenant/insurance");
          }}
          className="flex-1 flex flex-col items-center justify-center p-3 bg-gradient-to-br from-[#FFB020]/15 to-[#FFB020]/5 rounded-xl hover:from-[#FFB020]/20 hover:to-[#FFB020]/10 transition-all group hover-lift relative"
        >
          {mockData.claimsOpen > 0 && <div className="notification-dot" />}
          <FileText className="w-5 h-5 text-[#FFB020] mb-1 group-hover:scale-110 transition-transform" />
          <p className="text-2xl font-bold text-[#0F1E3A] group-hover:text-[#005EEB] transition-colors">{mockData.claimsOpen}</p>
          <p className="text-xs text-[#6B7280] font-medium">Claims Open</p>
        </button>
        <button
          onClick={() => {
            toast.success(`Average resolution time: ${mockData.avgResolution}`);
            navigate("/tenant/insurance");
          }}
          className="flex-1 flex flex-col items-center justify-center p-3 bg-gradient-to-br from-[#0FB07A]/15 to-[#0FB07A]/5 rounded-xl hover:from-[#0FB07A]/20 hover:to-[#0FB07A]/10 transition-all group hover-lift"
        >
          <Clock className="w-5 h-5 text-[#0FB07A] mb-1 group-hover:scale-110 transition-transform" />
          <p className="text-2xl font-bold text-[#0F1E3A] group-hover:text-[#005EEB] transition-colors">{mockData.avgResolution}</p>
          <p className="text-xs text-[#6B7280] font-medium">Avg Resolution</p>
        </button>
      </div>

      <Button
        size="sm"
        variant="ghost"
        className="w-full mt-2 text-[#005EEB] hover:text-[#004ACC] hover:bg-[#005EEB]/5 gap-1 group"
        onClick={handleViewClaims}
      >
        View All Claims 
        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
  );
};