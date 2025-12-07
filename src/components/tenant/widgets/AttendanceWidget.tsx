import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, UserX, Palmtree, FileDown, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTenant } from "../TenantLayout";

const mockData = {
  presentPercent: 86,
  late: 12,
  absent: 6,
  onLeave: 4,
  teams: [
    { name: "Engineering", present: 24, total: 28 },
    { name: "Sales", present: 18, total: 20 },
    { name: "Marketing", present: 12, total: 15 },
    { name: "HR", present: 6, total: 6 },
    { name: "Finance", present: 8, total: 10 },
    { name: "Operations", present: 14, total: 18 },
  ],
};

export const AttendanceWidget: React.FC = () => {
  const navigate = useNavigate();
  const { isTrialMode } = useTenant();
  const [dateRange, setDateRange] = useState<"today" | "week" | "month">("today");

  const getPresenceColor = (present: number, total: number) => {
    const ratio = present / total;
    if (ratio >= 0.9) return "#0FB07A";
    if (ratio >= 0.7) return "#FFB020";
    return "#E23E57";
  };

  return (
    <div className="widget-card relative bg-white rounded-xl border border-gray-200 p-5 h-[520px] flex flex-col" style={{ boxShadow: "var(--widget-shadow)" }}>
      {isTrialMode && <div className="trial-watermark">TRIAL</div>}
      
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-[#0F1E3A] text-lg">Attendance Overview</h3>
        <div className="flex gap-1 bg-[#F7F9FC] rounded-lg p-1">
          {(["today", "week", "month"] as const).map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded-md transition-all capitalize",
                dateRange === range
                  ? "bg-white text-[#005EEB] shadow-sm"
                  : "text-[#6B7280] hover:text-[#0F1E3A]"
              )}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Main Circle + Stats */}
      <div className="flex gap-4 mb-5">
        {/* Big Circle */}
        <div className="relative w-32 h-32 flex-shrink-0">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              fill="none"
              stroke="#F7F9FC"
              strokeWidth="12"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              fill="none"
              stroke="#0FB07A"
              strokeWidth="12"
              strokeDasharray={`${(mockData.presentPercent / 100) * 352} 352`}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-[#0F1E3A]">{mockData.presentPercent}%</span>
            <span className="text-xs text-[#6B7280]">Present</span>
          </div>
        </div>

        {/* Stats List */}
        <div className="flex-1 space-y-2">
          {[
            { label: "Late", value: mockData.late, icon: Clock, color: "#FFB020" },
            { label: "Absent", value: mockData.absent, icon: UserX, color: "#E23E57" },
            { label: "On Leave", value: mockData.onLeave, icon: Palmtree, color: "#00C2FF" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#F7F9FC] transition-all cursor-pointer"
              onClick={() => navigate(`/tenant/attendance?filter=${stat.label.toLowerCase()}`)}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
              </div>
              <span className="flex-1 text-sm text-[#6B7280]">{stat.label}</span>
              <span className="text-lg font-semibold text-[#0F1E3A]">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Team Heatmap */}
      <div className="flex-1">
        <p className="text-xs font-medium text-[#6B7280] mb-3">Team Presence</p>
        <div className="grid grid-cols-3 gap-2">
          {mockData.teams.map((team) => (
            <button
              key={team.name}
              onClick={() => navigate(`/tenant/attendance?team=${team.name}`)}
              className="p-2 rounded-lg border border-gray-100 hover:border-[#005EEB]/30 transition-all text-left"
            >
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-3 h-3 text-[#6B7280]" />
                <span className="text-xs text-[#6B7280] truncate">{team.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: getPresenceColor(team.present, team.total) }}
                />
                <span className="text-sm font-semibold text-[#0F1E3A]">
                  {team.present}/{team.total}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4">
        <Button
          size="sm"
          className="flex-1 bg-[#005EEB] hover:bg-[#004ACC] text-white gap-2"
        >
          <Calendar className="w-4 h-4" /> Mark Attendance
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="border-gray-200 text-[#6B7280] hover:text-[#0F1E3A] gap-2"
        >
          <FileDown className="w-4 h-4" /> Export
        </Button>
      </div>
    </div>
  );
};
