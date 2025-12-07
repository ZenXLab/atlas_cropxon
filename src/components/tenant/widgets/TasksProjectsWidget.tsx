import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FolderKanban, CheckCircle2, Circle, Clock, LayoutGrid, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useTenant } from "../TenantLayout";

const mockProjects = [
  { name: "ERP Migration", progress: 75, manager: "Sarah K.", color: "#005EEB" },
  { name: "Mobile App v2", progress: 45, manager: "John D.", color: "#0FB07A" },
  { name: "Data Analytics", progress: 90, manager: "Mike R.", color: "#00C2FF" },
];

const mockTasks = [
  { id: 1, title: "Review Q4 reports", priority: "high", assignee: "SK", completed: false },
  { id: 2, title: "Submit compliance docs", priority: "high", assignee: "JD", completed: false },
  { id: 3, title: "Team standup notes", priority: "medium", assignee: "MR", completed: true },
  { id: 4, title: "Update project timeline", priority: "low", assignee: "AP", completed: false },
];

export const TasksProjectsWidget: React.FC = () => {
  const navigate = useNavigate();
  const { isTrialMode } = useTenant();
  const [activeTab, setActiveTab] = useState<"projects" | "tasks" | "approvals">("projects");
  const [tasks, setTasks] = useState(mockTasks);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "#E23E57";
      case "medium": return "#FFB020";
      default: return "#6B7280";
    }
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  return (
    <div className="widget-card relative bg-white rounded-xl border border-gray-200 p-5 h-[520px] flex flex-col" style={{ boxShadow: "var(--widget-shadow)" }}>
      {isTrialMode && <div className="trial-watermark">TRIAL</div>}
      
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-[#0F1E3A] text-lg">Tasks & Projects</h3>
        <Button
          variant="ghost"
          size="sm"
          className="text-[#005EEB] hover:text-[#004ACC] text-sm gap-1"
          onClick={() => navigate("/tenant/projects")}
        >
          <LayoutGrid className="w-4 h-4" /> Kanban
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#F7F9FC] rounded-lg p-1 mb-4">
        {(["projects", "tasks", "approvals"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all capitalize",
              activeTab === tab
                ? "bg-white text-[#005EEB] shadow-sm"
                : "text-[#6B7280] hover:text-[#0F1E3A]"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "projects" && (
          <div className="space-y-3">
            {mockProjects.map((project) => (
              <div
                key={project.name}
                className="p-3 rounded-lg border border-gray-100 hover:border-[#005EEB]/30 transition-all cursor-pointer"
                onClick={() => navigate("/tenant/projects")}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: project.color }}
                    />
                    <span className="font-medium text-sm text-[#0F1E3A]">{project.name}</span>
                  </div>
                  <span className="text-xs font-semibold text-[#005EEB]">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-1.5 mb-2" />
                <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                  <User className="w-3 h-3" />
                  <span>{project.manager}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "tasks" && (
          <div className="space-y-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-[#005EEB]/30 transition-all",
                  task.completed && "opacity-60"
                )}
              >
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => toggleTask(task.id)}
                  className="border-gray-300"
                />
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "text-sm text-[#0F1E3A]",
                    task.completed && "line-through"
                  )}>
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className="px-1.5 py-0.5 rounded text-[10px] font-medium uppercase"
                      style={{
                        backgroundColor: `${getPriorityColor(task.priority)}15`,
                        color: getPriorityColor(task.priority),
                      }}
                    >
                      {task.priority}
                    </span>
                    <span className="text-xs text-[#6B7280]">Due today</span>
                  </div>
                </div>
                <Avatar className="w-7 h-7">
                  <AvatarFallback className="text-xs bg-[#005EEB]/10 text-[#005EEB]">
                    {task.assignee}
                  </AvatarFallback>
                </Avatar>
              </div>
            ))}
          </div>
        )}

        {activeTab === "approvals" && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <CheckCircle2 className="w-12 h-12 text-[#0FB07A] mb-3" />
            <p className="font-medium text-[#0F1E3A]">All caught up!</p>
            <p className="text-sm text-[#6B7280]">No pending approvals</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4">
        <Button
          size="sm"
          className="flex-1 bg-[#005EEB] hover:bg-[#004ACC] text-white gap-2"
          onClick={() => navigate("/tenant/projects")}
        >
          <FolderKanban className="w-4 h-4" /> Create Project
        </Button>
      </div>
    </div>
  );
};
