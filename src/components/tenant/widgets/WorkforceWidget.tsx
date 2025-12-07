import React from "react";
import { useNavigate } from "react-router-dom";
import { Users, UserPlus, FileDown, Upload, TrendingUp, Briefcase, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTenant } from "../TenantLayout";

const mockData = {
  total: 184,
  active: 172,
  probation: 8,
  contractors: 4,
  trend: [65, 72, 80, 95, 110, 125, 140, 152, 165, 175, 180, 184],
};

export const WorkforceWidget: React.FC = () => {
  const navigate = useNavigate();
  const { isTrialMode } = useTenant();

  return (
    <div className="widget-card relative bg-white rounded-xl border border-gray-200 p-5 h-[520px] flex flex-col" style={{ boxShadow: "var(--widget-shadow)" }}>
      {isTrialMode && <div className="trial-watermark">TRIAL</div>}
      
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-[#0F1E3A] text-lg">Workforce Snapshot</h3>
        <Button variant="ghost" size="sm" className="text-[#005EEB] hover:text-[#004ACC] text-sm">
          View All
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {[
          { label: "Total", value: mockData.total, icon: Users, color: "#005EEB" },
          { label: "Active", value: mockData.active, icon: TrendingUp, color: "#0FB07A" },
          { label: "On Probation", value: mockData.probation, icon: Clock, color: "#FFB020" },
          { label: "Contractors", value: mockData.contractors, icon: Briefcase, color: "#6B7280" },
        ].map((kpi, i) => (
          <button
            key={kpi.label}
            onClick={() => navigate("/tenant/workforce")}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-[#005EEB]/30 hover:bg-[#F7F9FC] transition-all text-left group",
              "animate-counter"
            )}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${kpi.color}10` }}
            >
              <kpi.icon className="w-5 h-5" style={{ color: kpi.color }} />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#0F1E3A] group-hover:text-[#005EEB] transition-colors">
                {kpi.value}
              </p>
              <p className="text-xs text-[#6B7280]">{kpi.label}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Sparkline Chart */}
      <div className="flex-1 bg-[#F7F9FC] rounded-lg p-4 mb-4">
        <p className="text-xs font-medium text-[#6B7280] mb-3">Headcount Trend (12 months)</p>
        <div className="h-[120px] flex items-end gap-1">
          {mockData.trend.map((value, i) => (
            <div
              key={i}
              className="flex-1 bg-gradient-to-t from-[#005EEB] to-[#00C2FF] rounded-t transition-all hover:opacity-80"
              style={{ height: `${(value / Math.max(...mockData.trend)) * 100}%` }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[10px] text-[#6B7280]">Jan</span>
          <span className="text-[10px] text-[#6B7280]">Dec</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2">
        <Button
          size="sm"
          className="flex-1 bg-[#005EEB] hover:bg-[#004ACC] text-white gap-2"
          onClick={() => navigate("/tenant/workforce")}
        >
          <UserPlus className="w-4 h-4" /> Invite
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex-1 border-gray-200 text-[#6B7280] hover:text-[#0F1E3A] gap-2"
        >
          <Upload className="w-4 h-4" /> Import
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex-1 border-gray-200 text-[#6B7280] hover:text-[#0F1E3A] gap-2"
        >
          <FileDown className="w-4 h-4" /> Export
        </Button>
      </div>
    </div>
  );
};
