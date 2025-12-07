import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, UserPlus, FileDown, Upload, TrendingUp, Briefcase, Clock, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTenant } from "../TenantLayout";
import { toast } from "sonner";

const mockData = {
  total: 184,
  active: 172,
  probation: 8,
  contractors: 4,
  trend: [65, 72, 80, 95, 110, 125, 140, 152, 165, 175, 180, 184],
  newThisMonth: 12,
  growthPercent: 8.5,
};

export const WorkforceWidget: React.FC = () => {
  const navigate = useNavigate();
  const { isTrialMode } = useTenant();
  const [animatedValues, setAnimatedValues] = useState({ total: 0, active: 0, probation: 0, contractors: 0 });

  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const interval = duration / steps;
    let step = 0;
    
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      setAnimatedValues({
        total: Math.round(mockData.total * easeOut),
        active: Math.round(mockData.active * easeOut),
        probation: Math.round(mockData.probation * easeOut),
        contractors: Math.round(mockData.contractors * easeOut),
      });
      
      if (step >= steps) clearInterval(timer);
    }, interval);
    
    return () => clearInterval(timer);
  }, []);

  const handleInvite = () => {
    toast.success("Opening employee invitation form...");
    navigate("/tenant/workforce");
  };

  const handleImport = () => {
    toast.info("Import feature: Upload CSV/Excel file to bulk import employees");
  };

  const handleExport = () => {
    toast.success("Generating workforce report...");
  };

  const kpis = [
    { label: "Total", value: animatedValues.total, icon: Users, color: "#005EEB", bgColor: "bg-[#005EEB]/10" },
    { label: "Active", value: animatedValues.active, icon: TrendingUp, color: "#0FB07A", bgColor: "bg-[#0FB07A]/10" },
    { label: "On Probation", value: animatedValues.probation, icon: Clock, color: "#FFB020", bgColor: "bg-[#FFB020]/10" },
    { label: "Contractors", value: animatedValues.contractors, icon: Briefcase, color: "#6B7280", bgColor: "bg-[#6B7280]/10" },
  ];

  return (
    <div className="widget-card relative bg-white rounded-xl border border-gray-200/80 p-6 h-[520px] flex flex-col animate-scale-in" style={{ boxShadow: "var(--widget-shadow)" }}>
      {isTrialMode && <div className="trial-watermark">TRIAL</div>}
      
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-semibold text-[#0F1E3A] text-lg">Workforce Snapshot</h3>
          <p className="text-xs text-[#6B7280] mt-0.5">
            <span className="text-[#0FB07A] font-medium">+{mockData.newThisMonth} new</span> this month
          </p>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-[#005EEB] hover:text-[#004ACC] hover:bg-[#005EEB]/5 text-sm gap-1 group"
          onClick={() => navigate("/tenant/workforce")}
        >
          View All
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {kpis.map((kpi, i) => (
          <button
            key={kpi.label}
            onClick={() => navigate("/tenant/workforce")}
            className={cn(
              "kpi-card flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-[#005EEB]/30 text-left group animate-fade-up",
              kpi.bgColor.replace("/10", "/5")
            )}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div
              className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", kpi.bgColor)}
            >
              <kpi.icon className="w-6 h-6" style={{ color: kpi.color }} />
            </div>
            <div>
              <p className="text-3xl font-bold text-[#0F1E3A] group-hover:text-[#005EEB] transition-colors animate-number-count" style={{ animationDelay: `${i * 100 + 200}ms` }}>
                {kpi.value}
              </p>
              <p className="text-xs text-[#6B7280] font-medium">{kpi.label}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Sparkline Chart */}
      <div className="flex-1 bg-gradient-to-br from-[#F7F9FC] to-[#EEF2F6] rounded-xl p-4 mb-4 relative overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Headcount Trend</p>
          <span className="text-xs font-medium text-[#0FB07A] flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            +{mockData.growthPercent}%
          </span>
        </div>
        <div className="h-[100px] flex items-end gap-1.5">
          {mockData.trend.map((value, i) => (
            <div
              key={i}
              className="chart-bar flex-1 bg-gradient-to-t from-[#005EEB] to-[#00C2FF] rounded-t-sm cursor-pointer animate-bar-grow"
              style={{ 
                height: `${(value / Math.max(...mockData.trend)) * 100}%`,
                animationDelay: `${i * 50}ms`
              }}
              onClick={() => toast.info(`Month ${i + 1}: ${value} employees`)}
            />
          ))}
        </div>
        <div className="flex justify-between mt-3">
          <span className="text-[10px] text-[#6B7280] font-medium">Jan</span>
          <span className="text-[10px] text-[#6B7280] font-medium">Dec</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2">
        <Button
          size="sm"
          className="flex-1 action-btn-primary text-white gap-2 h-10"
          onClick={handleInvite}
        >
          <UserPlus className="w-4 h-4" /> Invite
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex-1 border-gray-200 text-[#6B7280] hover:text-[#0F1E3A] hover:border-[#005EEB]/30 gap-2 h-10 hover-lift"
          onClick={handleImport}
        >
          <Upload className="w-4 h-4" /> Import
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex-1 border-gray-200 text-[#6B7280] hover:text-[#0F1E3A] hover:border-[#005EEB]/30 gap-2 h-10 hover-lift"
          onClick={handleExport}
        >
          <FileDown className="w-4 h-4" /> Export
        </Button>
      </div>
    </div>
  );
};