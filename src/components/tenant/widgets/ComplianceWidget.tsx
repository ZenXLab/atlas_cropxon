import React from "react";
import { useNavigate } from "react-router-dom";
import { FileCheck, Calendar, AlertTriangle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTenant } from "../TenantLayout";

const mockData = {
  upcomingDeadlines: 3,
  filingOverdue: 1,
};

export const ComplianceWidget: React.FC = () => {
  const navigate = useNavigate();
  const { isTrialMode } = useTenant();

  return (
    <div className="widget-card relative bg-white rounded-xl border border-gray-200 p-5 h-[160px] flex flex-col" style={{ boxShadow: "var(--widget-shadow)" }}>
      {isTrialMode && <div className="trial-watermark">TRIAL</div>}
      
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-[#0F1E3A]">Compliance</h3>
        <FileCheck className="w-5 h-5 text-[#005EEB]" />
      </div>

      <div className="flex gap-3 flex-1">
        <div className="flex-1 flex flex-col items-center justify-center p-3 bg-[#00C2FF]/10 rounded-lg">
          <Calendar className="w-5 h-5 text-[#00C2FF] mb-1" />
          <p className="text-2xl font-bold text-[#0F1E3A]">{mockData.upcomingDeadlines}</p>
          <p className="text-xs text-[#6B7280]">Upcoming</p>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-3 bg-[#E23E57]/10 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-[#E23E57] mb-1 animate-pulse" />
          <p className="text-2xl font-bold text-[#E23E57]">{mockData.filingOverdue}</p>
          <p className="text-xs text-[#6B7280]">Overdue</p>
        </div>
      </div>

      <Button
        size="sm"
        variant="ghost"
        className="w-full mt-2 text-[#005EEB] hover:text-[#004ACC] gap-1"
        onClick={() => navigate("/tenant/compliance")}
      >
        Compliance Calendar <ArrowRight className="w-3 h-3" />
      </Button>
    </div>
  );
};
