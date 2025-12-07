import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, UserX, Palmtree, FileDown, Users, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTenant } from "../TenantLayout";
import { toast } from "sonner";

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
  const [animatedPercent, setAnimatedPercent] = useState(0);

  useEffect(() => {
    const duration = 1200;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;
    
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setAnimatedPercent(Math.round(mockData.presentPercent * easeOut));
      if (step >= steps) clearInterval(timer);
    }, interval);
    
    return () => clearInterval(timer);
  }, []);

  const getPresenceColor = (present: number, total: number) => {
    const ratio = present / total;
    if (ratio >= 0.9) return "#0FB07A";
    if (ratio >= 0.7) return "#FFB020";
    return "#E23E57";
  };

  const handleMarkAttendance = () => {
    toast.success("Opening attendance marking interface...");
    navigate("/tenant/attendance");
  };

  const circumference = 2 * Math.PI * 56;
  const strokeDasharray = `${(animatedPercent / 100) * circumference} ${circumference}`;

  return (
    <div className="widget-card relative bg-white rounded-xl border border-gray-200/80 p-6 h-[520px] flex flex-col animate-scale-in stagger-1" style={{ boxShadow: "var(--widget-shadow)" }}>
      {isTrialMode && <div className="trial-watermark">TRIAL</div>}
      
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-[#0F1E3A] text-lg">Attendance Overview</h3>
        <div className="flex gap-1 bg-[#F7F9FC] rounded-lg p-1">
          {(["today", "week", "month"] as const).map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-all capitalize",
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
      <div className="flex gap-5 mb-5">
        {/* Big Circle */}
        <div className="relative w-36 h-36 flex-shrink-0">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="72"
              cy="72"
              r="56"
              fill="none"
              stroke="#F7F9FC"
              strokeWidth="14"
            />
            <circle
              cx="72"
              cy="72"
              r="56"
              fill="none"
              stroke="url(#attendanceGradient)"
              strokeWidth="14"
              strokeDasharray={strokeDasharray}
              strokeLinecap="round"
              className="transition-all duration-1000"
              style={{ filter: "drop-shadow(0 4px 6px rgba(15, 176, 122, 0.3))" }}
            />
            <defs>
              <linearGradient id="attendanceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0FB07A" />
                <stop offset="100%" stopColor="#00C2FF" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-[#0F1E3A] animate-number-count">{animatedPercent}%</span>
            <span className="text-xs text-[#6B7280] font-medium">Present</span>
          </div>
        </div>

        {/* Stats List */}
        <div className="flex-1 space-y-2">
          {[
            { label: "Late", value: mockData.late, icon: Clock, color: "#FFB020" },
            { label: "Absent", value: mockData.absent, icon: UserX, color: "#E23E57" },
            { label: "On Leave", value: mockData.onLeave, icon: Palmtree, color: "#00C2FF" },
          ].map((stat, i) => (
            <button
              key={stat.label}
              onClick={() => {
                toast.info(`Viewing ${stat.label.toLowerCase()} employees`);
                navigate(`/tenant/attendance?filter=${stat.label.toLowerCase()}`);
              }}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F7F9FC] transition-all w-full text-left group hover-lift animate-fade-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <span className="flex-1 text-sm text-[#6B7280] font-medium">{stat.label}</span>
              <span className="text-xl font-bold text-[#0F1E3A] group-hover:text-[#005EEB] transition-colors">{stat.value}</span>
              <ArrowUpRight className="w-4 h-4 text-[#6B7280] opacity-0 group-hover:opacity-100 transition-all" />
            </button>
          ))}
        </div>
      </div>

      {/* Team Heatmap */}
      <div className="flex-1">
        <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-3">Team Presence</p>
        <div className="grid grid-cols-3 gap-2">
          {mockData.teams.map((team, i) => (
            <button
              key={team.name}
              onClick={() => {
                toast.info(`Viewing ${team.name} attendance`);
                navigate(`/tenant/attendance?team=${team.name}`);
              }}
              className="p-3 rounded-xl border border-gray-100 hover:border-[#005EEB]/30 transition-all text-left group hover-lift animate-fade-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-3.5 h-3.5 text-[#6B7280]" />
                <span className="text-xs text-[#6B7280] font-medium truncate">{team.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full status-indicator"
                  style={{ backgroundColor: getPresenceColor(team.present, team.total) }}
                />
                <span className="text-base font-bold text-[#0F1E3A] group-hover:text-[#005EEB] transition-colors">
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
          className="flex-1 action-btn-primary text-white gap-2 h-10"
          onClick={handleMarkAttendance}
        >
          <Calendar className="w-4 h-4" /> Mark Attendance
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="border-gray-200 text-[#6B7280] hover:text-[#0F1E3A] hover:border-[#005EEB]/30 gap-2 h-10 hover-lift"
          onClick={() => toast.success("Exporting attendance report...")}
        >
          <FileDown className="w-4 h-4" /> Export
        </Button>
      </div>
    </div>
  );
};