import React from "react";
import { useNavigate } from "react-router-dom";
import { Shield, FileText, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTenant } from "../TenantLayout";

const mockData = {
  claimsOpen: 8,
  avgResolution: "3 days",
};

export const InsuranceWidget: React.FC = () => {
  const navigate = useNavigate();
  const { isTrialMode } = useTenant();

  return (
    <div className="widget-card relative bg-white rounded-xl border border-gray-200 p-5 h-[160px] flex flex-col" style={{ boxShadow: "var(--widget-shadow)" }}>
      {isTrialMode && <div className="trial-watermark">TRIAL</div>}
      
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-[#0F1E3A]">Insurance & Claims</h3>
        <Shield className="w-5 h-5 text-[#00C2FF]" />
      </div>

      <div className="flex gap-3 flex-1">
        <div className="flex-1 flex flex-col items-center justify-center p-3 bg-[#FFB020]/10 rounded-lg">
          <FileText className="w-5 h-5 text-[#FFB020] mb-1" />
          <p className="text-2xl font-bold text-[#0F1E3A]">{mockData.claimsOpen}</p>
          <p className="text-xs text-[#6B7280]">Claims Open</p>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-3 bg-[#0FB07A]/10 rounded-lg">
          <Clock className="w-5 h-5 text-[#0FB07A] mb-1" />
          <p className="text-2xl font-bold text-[#0F1E3A]">{mockData.avgResolution}</p>
          <p className="text-xs text-[#6B7280]">Avg Resolution</p>
        </div>
      </div>

      <Button
        size="sm"
        variant="ghost"
        className="w-full mt-2 text-[#005EEB] hover:text-[#004ACC] gap-1"
        onClick={() => navigate("/tenant/insurance")}
      >
        Open Claims <ArrowRight className="w-3 h-3" />
      </Button>
    </div>
  );
};
