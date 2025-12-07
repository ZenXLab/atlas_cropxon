import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, Users, Calendar, FileCheck, Plus, ArrowRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTenant } from "../TenantLayout";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
  conversionRate: 12.5,
};

export const RecruitmentWidget: React.FC = () => {
  const navigate = useNavigate();
  const { isTrialMode } = useTenant();
  const [animatedStats, setAnimatedStats] = useState({
    openRoles: 0,
    candidates: 0,
    interviewsThisWeek: 0,
    offersPending: 0,
  });

  useEffect(() => {
    const duration = 800;
    const steps = 30;
    const interval = duration / steps;
    let step = 0;
    
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      setAnimatedStats({
        openRoles: Math.round(mockData.openRoles * easeOut),
        candidates: Math.round(mockData.candidates * easeOut),
        interviewsThisWeek: Math.round(mockData.interviewsThisWeek * easeOut),
        offersPending: Math.round(mockData.offersPending * easeOut),
      });
      
      if (step >= steps) clearInterval(timer);
    }, interval);
    
    return () => clearInterval(timer);
  }, []);

  const stats = [
    { label: "Open Roles", value: animatedStats.openRoles, icon: Briefcase, color: "#005EEB" },
    { label: "Candidates", value: animatedStats.candidates, icon: Users, color: "#00C2FF" },
    { label: "Interviews", value: animatedStats.interviewsThisWeek, icon: Calendar, color: "#FFB020" },
    { label: "Offers", value: animatedStats.offersPending, icon: FileCheck, color: "#0FB07A" },
  ];

  const pipelineStages = [
    { label: "Applied", count: mockData.pipeline.applied, color: "#6B7280" },
    { label: "Interviewing", count: mockData.pipeline.interviewing, color: "#FFB020" },
    { label: "Offer", count: mockData.pipeline.offer, color: "#0FB07A" },
  ];

  const handlePostJob = () => {
    toast.success("Opening job posting form...");
    navigate("/tenant/recruitment");
  };

  return (
    <div className="widget-card relative bg-white rounded-xl border border-gray-200/80 p-6 h-[280px] flex flex-col animate-scale-in stagger-3" style={{ boxShadow: "var(--widget-shadow)" }}>
      {isTrialMode && <div className="trial-watermark">TRIAL</div>}
      
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-[#0F1E3A] text-lg">Recruitment</h3>
          <p className="text-xs text-[#6B7280] mt-0.5">
            <span className="text-[#0FB07A] font-medium">{mockData.conversionRate}%</span> conversion rate
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-[#005EEB] hover:text-[#004ACC] hover:bg-[#005EEB]/5 text-sm gap-1 group"
          onClick={() => navigate("/tenant/recruitment")}
        >
          View All 
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {stats.map((stat, i) => (
          <button
            key={stat.label}
            onClick={() => {
              toast.info(`Viewing ${stat.label.toLowerCase()}`);
              navigate("/tenant/recruitment");
            }}
            className="text-center p-2 rounded-xl hover:bg-[#F7F9FC] transition-all group animate-fade-up"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 transition-transform group-hover:scale-110"
              style={{ backgroundColor: `${stat.color}15` }}
            >
              <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
            </div>
            <p className="text-xl font-bold text-[#0F1E3A] group-hover:text-[#005EEB] transition-colors">{stat.value}</p>
            <p className="text-[10px] text-[#6B7280] font-medium">{stat.label}</p>
          </button>
        ))}
      </div>

      {/* Mini Pipeline */}
      <div className="flex-1 bg-gradient-to-br from-[#F7F9FC] to-[#EEF2F6] rounded-xl p-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Hiring Pipeline</p>
          <TrendingUp className="w-3.5 h-3.5 text-[#0FB07A]" />
        </div>
        <div className="flex gap-2">
          {pipelineStages.map((stage, i) => (
            <button
              key={stage.label}
              onClick={() => {
                toast.info(`${stage.count} candidates at ${stage.label} stage`);
                navigate("/tenant/recruitment");
              }}
              className={cn(
                "flex-1 bg-white rounded-xl p-3 border border-gray-100 hover:border-[#005EEB]/30 transition-all group hover-lift animate-fade-up"
              )}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <div
                  className="w-2 h-2 rounded-full status-indicator"
                  style={{ backgroundColor: stage.color }}
                />
                <span className="text-[10px] text-[#6B7280] font-medium">{stage.label}</span>
              </div>
              <p className="text-xl font-bold text-[#0F1E3A] group-hover:text-[#005EEB] transition-colors">{stage.count}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Action */}
      <Button
        size="sm"
        className="w-full mt-4 action-btn-primary text-white gap-2 h-10"
        onClick={handlePostJob}
      >
        <Plus className="w-4 h-4" /> Post New Job
      </Button>
    </div>
  );
};