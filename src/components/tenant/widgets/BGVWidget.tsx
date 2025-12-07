import React from "react";
import { useNavigate } from "react-router-dom";
import { UserCheck, Clock, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTenant } from "../TenantLayout";

const mockData = {
  pending: 12,
  completed: 184,
  failed: 3,
  avgTurnaround: "18 hrs",
};

export const BGVWidget: React.FC = () => {
  const navigate = useNavigate();
  const { isTrialMode } = useTenant();

  return (
    <div className="widget-card relative bg-white rounded-xl border border-gray-200 p-5 h-[160px] flex flex-col" style={{ boxShadow: "var(--widget-shadow)" }}>
      {isTrialMode && <div className="trial-watermark">TRIAL</div>}
      
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-[#0F1E3A]">BGV Status</h3>
        <div className="flex items-center gap-1 px-2 py-1 bg-[#0FB07A]/10 rounded-full">
          <Clock className="w-3 h-3 text-[#0FB07A]" />
          <span className="text-[10px] font-medium text-[#0FB07A]">Avg: {mockData.avgTurnaround}</span>
        </div>
      </div>

      <div className="flex gap-3 flex-1">
        {[
          { label: "Pending", value: mockData.pending, icon: Clock, color: "#FFB020" },
          { label: "Completed", value: mockData.completed, icon: CheckCircle, color: "#0FB07A" },
          { label: "Failed", value: mockData.failed, icon: XCircle, color: "#E23E57" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex-1 flex flex-col items-center justify-center p-2 bg-[#F7F9FC] rounded-lg"
          >
            <stat.icon className="w-4 h-4 mb-1" style={{ color: stat.color }} />
            <p className="text-lg font-bold text-[#0F1E3A]">{stat.value}</p>
            <p className="text-[10px] text-[#6B7280]">{stat.label}</p>
          </div>
        ))}
      </div>

      <Button
        size="sm"
        variant="ghost"
        className="w-full mt-2 text-[#005EEB] hover:text-[#004ACC] gap-1"
        onClick={() => navigate("/tenant/bgv")}
      >
        View BGV Queue <ArrowRight className="w-3 h-3" />
      </Button>
    </div>
  );
};
