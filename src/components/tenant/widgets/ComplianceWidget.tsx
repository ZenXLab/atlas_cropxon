import React from "react";
import { useNavigate } from "react-router-dom";
import { FileCheck, Calendar, AlertTriangle, ArrowRight, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTenant } from "../TenantLayout";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const mockData = {
  upcomingDeadlines: 3,
  filingOverdue: 1,
  nextDeadline: "GST Filing - Jan 20",
  completedThisMonth: 8,
};

export const ComplianceWidget: React.FC = () => {
  const navigate = useNavigate();
  const { isTrialMode } = useTenant();

  const handleViewCalendar = () => {
    toast.info("Opening compliance calendar...");
    navigate("/tenant/compliance");
  };

  return (
    <div className="widget-card relative bg-white rounded-xl border border-gray-200/80 p-5 h-[160px] flex flex-col animate-scale-in stagger-4" style={{ boxShadow: "var(--widget-shadow)" }}>
      {isTrialMode && <div className="trial-watermark">TRIAL</div>}
      
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#005EEB]/10 flex items-center justify-center">
            <Shield className="w-4 h-4 text-[#005EEB]" />
          </div>
          <h3 className="font-semibold text-[#0F1E3A]">Compliance</h3>
        </div>
        <span className="text-[10px] text-[#6B7280] flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {mockData.nextDeadline}
        </span>
      </div>

      <div className="flex gap-3 flex-1">
        <button
          onClick={() => {
            toast.info(`${mockData.upcomingDeadlines} deadlines coming up`);
            navigate("/tenant/compliance");
          }}
          className="flex-1 flex flex-col items-center justify-center p-3 bg-gradient-to-br from-[#00C2FF]/15 to-[#00C2FF]/5 rounded-xl hover:from-[#00C2FF]/20 hover:to-[#00C2FF]/10 transition-all group hover-lift"
        >
          <Calendar className="w-5 h-5 text-[#00C2FF] mb-1 group-hover:scale-110 transition-transform" />
          <p className="text-2xl font-bold text-[#0F1E3A] group-hover:text-[#005EEB] transition-colors">{mockData.upcomingDeadlines}</p>
          <p className="text-xs text-[#6B7280] font-medium">Upcoming</p>
        </button>
        <button
          onClick={() => {
            toast.error(`${mockData.filingOverdue} overdue filing requires attention!`);
            navigate("/tenant/compliance");
          }}
          className={cn(
            "flex-1 flex flex-col items-center justify-center p-3 bg-gradient-to-br from-[#E23E57]/15 to-[#E23E57]/5 rounded-xl hover:from-[#E23E57]/20 hover:to-[#E23E57]/10 transition-all group hover-lift relative",
            mockData.filingOverdue > 0 && "animate-pulse-attention"
          )}
        >
          {mockData.filingOverdue > 0 && <div className="notification-dot" />}
          <AlertTriangle className="w-5 h-5 text-[#E23E57] mb-1 group-hover:scale-110 transition-transform" />
          <p className="text-2xl font-bold text-[#E23E57]">{mockData.filingOverdue}</p>
          <p className="text-xs text-[#6B7280] font-medium">Overdue</p>
        </button>
      </div>

      <Button
        size="sm"
        variant="ghost"
        className="w-full mt-2 text-[#005EEB] hover:text-[#004ACC] hover:bg-[#005EEB]/5 gap-1 group"
        onClick={handleViewCalendar}
      >
        Compliance Calendar 
        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
  );
};