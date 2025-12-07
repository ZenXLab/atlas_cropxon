import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Brain, Sparkles, AlertTriangle, DollarSign, FileCheck, Send, Lock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTenant } from "../TenantLayout";
import { cn } from "@/lib/utils";

const mockData = {
  attritionRisks: [
    { team: "Operations", risk: 23, status: "high" },
    { team: "Sales", risk: 15, status: "medium" },
    { team: "Engineering", risk: 8, status: "low" },
    { team: "Marketing", risk: 12, status: "medium" },
    { team: "HR", risk: 5, status: "low" },
  ],
  highRiskEmployees: [
    { name: "John Smith", team: "Ops", score: 0.78, action: "Schedule 1-on-1" },
    { name: "Sarah Lee", team: "Sales", score: 0.72, action: "Review workload" },
    { name: "Mike Chen", team: "Ops", score: 0.68, action: "Career discussion" },
  ],
  payrollAnomalies: [
    { type: "Overtime spike", severity: "warning", amount: "₹45,000" },
    { type: "Duplicate entry", severity: "danger", amount: "₹12,500" },
  ],
  complianceRisks: [
    { type: "PF Filing", deadline: "Feb 15", status: "warning" },
    { type: "ESIC Update", deadline: "Feb 28", status: "ok" },
  ],
};

export const ProximaAIWidget: React.FC = () => {
  const navigate = useNavigate();
  const { isTrialMode } = useTenant();
  const [query, setQuery] = useState("");

  const getRiskColor = (status: string) => {
    switch (status) {
      case "high": return "#E23E57";
      case "medium": return "#FFB020";
      default: return "#0FB07A";
    }
  };

  return (
    <div className="widget-card relative bg-white rounded-xl border border-gray-200 p-6 col-span-3" style={{ boxShadow: "var(--widget-shadow)" }}>
      {isTrialMode && (
        <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-[#FFB020]/10 rounded-lg">
          <Lock className="w-4 h-4 text-[#FFB020]" />
          <span className="text-xs font-medium text-[#FFB020]">DEMO MODE</span>
        </div>
      )}
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#005EEB] to-[#00C2FF] flex items-center justify-center">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-[#0F1E3A] text-lg flex items-center gap-2">
            Proxima AI Insights
            <Sparkles className="w-4 h-4 text-[#00C2FF]" />
          </h3>
          <p className="text-sm text-[#6B7280]">Intelligent predictions and recommendations</p>
        </div>
      </div>

      {/* Three Column Layout */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Attrition Risk */}
        <div className="bg-[#F7F9FC] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-[#E23E57]" />
            <h4 className="font-semibold text-[#0F1E3A]">Attrition Risk</h4>
          </div>
          
          {/* Team Heatmap */}
          <div className="grid grid-cols-5 gap-1 mb-4">
            {mockData.attritionRisks.map((team) => (
              <div
                key={team.team}
                className="aspect-square rounded-lg flex flex-col items-center justify-center text-center p-1 cursor-pointer hover:scale-105 transition-transform"
                style={{ backgroundColor: `${getRiskColor(team.status)}20` }}
                title={`${team.team}: ${team.risk}% risk`}
              >
                <span className="text-lg font-bold" style={{ color: getRiskColor(team.status) }}>
                  {team.risk}%
                </span>
                <span className="text-[9px] text-[#6B7280] truncate w-full">{team.team}</span>
              </div>
            ))}
          </div>

          {/* High Risk Employees */}
          <p className="text-xs font-medium text-[#6B7280] mb-2">High Risk Employees</p>
          <div className="space-y-2">
            {mockData.highRiskEmployees.map((emp) => (
              <div
                key={emp.name}
                className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-100"
              >
                <div>
                  <p className="text-sm font-medium text-[#0F1E3A]">{emp.name}</p>
                  <p className="text-xs text-[#6B7280]">{emp.team}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-[#E23E57]">{(emp.score * 100).toFixed(0)}%</p>
                  <button className="text-[10px] text-[#005EEB] hover:underline">{emp.action}</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payroll Anomalies */}
        <div className="bg-[#F7F9FC] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5 text-[#FFB020]" />
            <h4 className="font-semibold text-[#0F1E3A]">Payroll Anomalies</h4>
          </div>
          
          <div className="space-y-3">
            {mockData.payrollAnomalies.map((anomaly, i) => (
              <div
                key={i}
                className={cn(
                  "p-3 rounded-lg border-l-4",
                  anomaly.severity === "danger" 
                    ? "bg-[#E23E57]/10 border-[#E23E57]" 
                    : "bg-[#FFB020]/10 border-[#FFB020]"
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-[#0F1E3A]">{anomaly.type}</span>
                  <span
                    className={cn(
                      "text-xs font-semibold uppercase px-2 py-0.5 rounded",
                      anomaly.severity === "danger" 
                        ? "bg-[#E23E57]/20 text-[#E23E57]" 
                        : "bg-[#FFB020]/20 text-[#FFB020]"
                    )}
                  >
                    {anomaly.severity}
                  </span>
                </div>
                <p className="text-lg font-bold text-[#0F1E3A]">{anomaly.amount}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-white rounded-lg border border-gray-100">
            <p className="text-xs text-[#6B7280] mb-2">Recommended Checkpoints</p>
            <ul className="space-y-1 text-sm text-[#0F1E3A]">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#005EEB]" />
                Review overtime entries
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#005EEB]" />
                Cross-check duplicate IDs
              </li>
            </ul>
          </div>
        </div>

        {/* Compliance Risk */}
        <div className="bg-[#F7F9FC] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-4">
            <FileCheck className="w-5 h-5 text-[#005EEB]" />
            <h4 className="font-semibold text-[#0F1E3A]">Compliance Risk</h4>
          </div>
          
          <div className="space-y-3 mb-4">
            {mockData.complianceRisks.map((risk) => (
              <div
                key={risk.type}
                className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100"
              >
                <div>
                  <p className="text-sm font-medium text-[#0F1E3A]">{risk.type}</p>
                  <p className="text-xs text-[#6B7280]">Deadline: {risk.deadline}</p>
                </div>
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    risk.status === "warning" ? "bg-[#FFB020]/20" : "bg-[#0FB07A]/20"
                  )}
                >
                  {risk.status === "warning" ? (
                    <AlertTriangle className="w-4 h-4 text-[#FFB020]" />
                  ) : (
                    <FileCheck className="w-4 h-4 text-[#0FB07A]" />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-[#005EEB]/5 rounded-lg border border-[#005EEB]/20">
            <p className="text-xs font-medium text-[#005EEB] mb-2">Mitigation Playbook</p>
            <button className="text-sm text-[#005EEB] hover:underline flex items-center gap-1">
              <Zap className="w-3 h-3" /> Auto-generate PF forms
            </button>
          </div>
        </div>
      </div>

      {/* Natural Language Query */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask ATLAS: Why is attrition risk high in Ops?"
            className="h-12 pl-4 pr-12 bg-[#F7F9FC] border-gray-200 rounded-xl focus:ring-2 focus:ring-[#005EEB]/20"
          />
          <Button
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-[#005EEB] hover:bg-[#004ACC] rounded-lg"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <Button
          variant="outline"
          className="h-12 px-6 border-gray-200 text-[#6B7280] hover:text-[#0F1E3A] gap-2"
          onClick={() => navigate("/tenant/intelligence")}
        >
          <Brain className="w-4 h-4" /> Open Proxima
        </Button>
      </div>

      {isTrialMode && (
        <p className="text-center text-xs text-[#6B7280] mt-4">
          Running in demo mode with synthetic predictions. 
          <button className="text-[#005EEB] hover:underline ml-1">Upgrade for real-time AI insights</button>
        </p>
      )}
    </div>
  );
};
