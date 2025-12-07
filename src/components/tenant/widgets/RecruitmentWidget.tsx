import React from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, Users, Calendar, FileCheck, Plus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTenant } from "../TenantLayout";

const mockData = {
  openRoles: 8,
  candidates: 156,
  interviewsThisWeek: 12,
  offersPending: 3,
  pipeline: {
    applied: 45,
    interviewing: 28,
    offer: 5,
  },
};

export const RecruitmentWidget: React.FC = () => {
  const navigate = useNavigate();
  const { isTrialMode } = useTenant();

  return (
    <div className="widget-card relative bg-white rounded-xl border border-gray-200 p-5 h-[280px] flex flex-col" style={{ boxShadow: "var(--widget-shadow)" }}>
      {isTrialMode && <div className="trial-watermark">TRIAL</div>}
      
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-[#0F1E3A] text-lg">Recruitment</h3>
        <Button
          variant="ghost"
          size="sm"
          className="text-[#005EEB] hover:text-[#004ACC] text-sm gap-1"
          onClick={() => navigate("/tenant/recruitment")}
        >
          View All <ArrowRight className="w-3 h-3" />
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {[
          { label: "Open Roles", value: mockData.openRoles, icon: Briefcase, color: "#005EEB" },
          { label: "Candidates", value: mockData.candidates, icon: Users, color: "#00C2FF" },
          { label: "Interviews", value: mockData.interviewsThisWeek, icon: Calendar, color: "#FFB020" },
          { label: "Offers", value: mockData.offersPending, icon: FileCheck, color: "#0FB07A" },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-1"
              style={{ backgroundColor: `${stat.color}15` }}
            >
              <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
            </div>
            <p className="text-lg font-bold text-[#0F1E3A]">{stat.value}</p>
            <p className="text-[10px] text-[#6B7280]">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Mini Pipeline */}
      <div className="flex-1 bg-[#F7F9FC] rounded-lg p-3">
        <p className="text-xs font-medium text-[#6B7280] mb-2">Hiring Pipeline</p>
        <div className="flex gap-2">
          {[
            { label: "Applied", count: mockData.pipeline.applied, color: "#6B7280" },
            { label: "Interviewing", count: mockData.pipeline.interviewing, color: "#FFB020" },
            { label: "Offer", count: mockData.pipeline.offer, color: "#0FB07A" },
          ].map((stage) => (
            <div
              key={stage.label}
              className="flex-1 bg-white rounded-lg p-2 border border-gray-100"
            >
              <div className="flex items-center gap-1 mb-1">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: stage.color }}
                />
                <span className="text-[10px] text-[#6B7280]">{stage.label}</span>
              </div>
              <p className="text-lg font-semibold text-[#0F1E3A]">{stage.count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action */}
      <Button
        size="sm"
        className="w-full mt-4 bg-[#005EEB] hover:bg-[#004ACC] text-white gap-2"
        onClick={() => navigate("/tenant/recruitment")}
      >
        <Plus className="w-4 h-4" /> Post New Job
      </Button>
    </div>
  );
};
