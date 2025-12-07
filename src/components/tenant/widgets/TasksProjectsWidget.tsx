import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FolderKanban, CheckCircle2, LayoutGrid, User, Plus, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useTenant } from "../TenantLayout";
import { toast } from "sonner";

const mockProjects = [
  { name: "ERP Migration", progress: 75, manager: "Sarah K.", color: "#005EEB", status: "On Track" },
  { name: "Mobile App v2", progress: 45, manager: "John D.", color: "#0FB07A", status: "At Risk" },
  { name: "Data Analytics", progress: 90, manager: "Mike R.", color: "#00C2FF", status: "Ahead" },
];

const mockTasks = [
  { id: 1, title: "Review Q4 reports", priority: "high", assignee: "SK", completed: false, dueDate: "Today" },
  { id: 2, title: "Submit compliance docs", priority: "high", assignee: "JD", completed: false, dueDate: "Tomorrow" },
  { id: 3, title: "Team standup notes", priority: "medium", assignee: "MR", completed: true, dueDate: "Done" },
  { id: 4, title: "Update project timeline", priority: "low", assignee: "AP", completed: false, dueDate: "This week" },
];

const mockApprovals = [
  { id: 1, type: "Leave Request", from: "Alex P.", status: "pending" },
  { id: 2, type: "Expense Claim", from: "Maria S.", status: "pending" },
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "On Track": return "#0FB07A";
      case "At Risk": return "#FFB020";
      case "Ahead": return "#00C2FF";
      default: return "#6B7280";
    }
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        toast.success(t.completed ? "Task unmarked" : "Task completed!");
        return { ...t, completed: !t.completed };
      }
      return t;
    }));
  };

  const handleApprove = (id: number, type: string) => {
    toast.success(`${type} approved!`);
  };

  const handleReject = (id: number, type: string) => {
    toast.error(`${type} rejected`);
  };

  return (
    <div className="widget-card relative bg-white rounded-xl border border-gray-200/80 p-6 h-[520px] flex flex-col animate-scale-in stagger-2" style={{ boxShadow: "var(--widget-shadow)" }}>
      {isTrialMode && <div className="trial-watermark">TRIAL</div>}
      
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-[#0F1E3A] text-lg">Tasks & Projects</h3>
        <Button
          variant="ghost"
          size="sm"
          className="text-[#005EEB] hover:text-[#004ACC] hover:bg-[#005EEB]/5 text-sm gap-1 group"
          onClick={() => navigate("/tenant/projects")}
        >
          <LayoutGrid className="w-4 h-4" /> Kanban
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#F7F9FC] rounded-xl p-1 mb-4">
        {(["projects", "tasks", "approvals"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "flex-1 px-3 py-2 text-xs font-medium rounded-lg transition-all capitalize relative",
              activeTab === tab
                ? "bg-white text-[#005EEB] shadow-sm"
                : "text-[#6B7280] hover:text-[#0F1E3A]"
            )}
          >
            {tab}
            {tab === "approvals" && mockApprovals.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#E23E57] text-white text-[10px] rounded-full flex items-center justify-center">
                {mockApprovals.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === "projects" && (
          <div className="space-y-3">
            {mockProjects.map((project, i) => (
              <button
                key={project.name}
                className="w-full p-4 rounded-xl border border-gray-100 hover:border-[#005EEB]/30 transition-all text-left group hover-lift animate-fade-up"
                style={{ animationDelay: `${i * 100}ms` }}
                onClick={() => {
                  toast.info(`Viewing ${project.name} details`);
                  navigate("/tenant/projects");
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: project.color }}
                    />
                    <span className="font-semibold text-sm text-[#0F1E3A] group-hover:text-[#005EEB] transition-colors">{project.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                      style={{ 
                        backgroundColor: `${getStatusColor(project.status)}15`,
                        color: getStatusColor(project.status)
                      }}
                    >
                      {project.status}
                    </span>
                    <span className="text-sm font-bold text-[#005EEB]">{project.progress}%</span>
                  </div>
                </div>
                <div className="relative h-2 bg-[#F7F9FC] rounded-full overflow-hidden mb-2">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000 progress-animated"
                    style={{ 
                      width: `${project.progress}%`,
                      background: `linear-gradient(90deg, ${project.color}, ${project.color}90)`
                    }}
                  />
                </div>
                <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                  <User className="w-3 h-3" />
                  <span>{project.manager}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {activeTab === "tasks" && (
          <div className="space-y-2">
            {tasks.map((task, i) => (
              <div
                key={task.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-[#005EEB]/30 transition-all animate-fade-up",
                  task.completed && "opacity-60 bg-[#F7F9FC]"
                )}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => toggleTask(task.id)}
                  className="border-gray-300 data-[state=checked]:bg-[#0FB07A] data-[state=checked]:border-[#0FB07A]"
                />
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "text-sm text-[#0F1E3A] font-medium",
                    task.completed && "line-through text-[#6B7280]"
                  )}>
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className="px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase"
                      style={{
                        backgroundColor: `${getPriorityColor(task.priority)}15`,
                        color: getPriorityColor(task.priority),
                      }}
                    >
                      {task.priority}
                    </span>
                    <span className="text-xs text-[#6B7280]">{task.dueDate}</span>
                  </div>
                </div>
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-xs bg-[#005EEB]/10 text-[#005EEB] font-medium">
                    {task.assignee}
                  </AvatarFallback>
                </Avatar>
              </div>
            ))}
          </div>
        )}

        {activeTab === "approvals" && (
          <div className="space-y-3">
            {mockApprovals.length > 0 ? (
              mockApprovals.map((approval, i) => (
                <div
                  key={approval.id}
                  className="p-4 rounded-xl border border-gray-100 animate-fade-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm font-medium text-[#0F1E3A]">{approval.type}</p>
                      <p className="text-xs text-[#6B7280]">from {approval.from}</p>
                    </div>
                    <span className="text-[10px] font-medium px-2 py-1 rounded-full bg-[#FFB020]/15 text-[#FFB020] uppercase">
                      Pending
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-[#0FB07A] hover:bg-[#0A9566] text-white h-8"
                      onClick={() => handleApprove(approval.id, approval.type)}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-[#E23E57]/30 text-[#E23E57] hover:bg-[#E23E57]/10 h-8"
                      onClick={() => handleReject(approval.id, approval.type)}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-8">
                <div className="w-16 h-16 rounded-full bg-[#0FB07A]/10 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8 text-[#0FB07A]" />
                </div>
                <p className="font-semibold text-[#0F1E3A] mb-1">All caught up!</p>
                <p className="text-sm text-[#6B7280]">No pending approvals</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4">
        <Button
          size="sm"
          className="flex-1 action-btn-primary text-white gap-2 h-10"
          onClick={() => {
            toast.success("Opening project creation form...");
            navigate("/tenant/projects");
          }}
        >
          <FolderKanban className="w-4 h-4" /> Create Project
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="border-gray-200 text-[#6B7280] hover:text-[#0F1E3A] hover:border-[#005EEB]/30 gap-2 h-10 hover-lift"
          onClick={() => {
            toast.info("Opening AI task assistant...");
          }}
        >
          <Sparkles className="w-4 h-4" /> AI Assist
        </Button>
      </div>
    </div>
  );
};