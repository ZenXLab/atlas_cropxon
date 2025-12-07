import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Calendar,
  DollarSign,
  Briefcase,
  FileCheck,
  CreditCard,
  Shield,
  UserCheck,
  FolderKanban,
  Building,
  Target,
  Zap,
  Brain,
  Key,
  AlertTriangle,
  Headphones,
  Settings,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeft,
  Bell,
  FileText,
  MessageSquare,
  ClipboardList,
  LucideIcon,
  Link2,
  Database,
  Globe,
} from "lucide-react";
import { useTenant } from "./TenantLayout";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface NavItem {
  label: string;
  icon: LucideIcon;
  path: string;
  badge?: string;
  badgeVariant?: "default" | "warning" | "danger" | "success";
}

interface NavModule {
  title: string;
  icon: LucideIcon;
  color: string;
  items: NavItem[];
}

const primaryNav: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/tenant/dashboard" },
];

const coreModules: NavModule[] = [
  {
    title: "Workforce Management",
    icon: Users,
    color: "#005EEB",
    items: [
      { label: "Employee Directory", icon: Users, path: "/tenant/workforce" },
      { label: "Attendance & Leave", icon: Calendar, path: "/tenant/attendance" },
      { label: "Documents", icon: FileText, path: "/tenant/documents" },
      { label: "Announcements", icon: MessageSquare, path: "/tenant/announcements" },
    ],
  },
  {
    title: "Payroll & Finance",
    icon: DollarSign,
    color: "#0FB07A",
    items: [
      { label: "Payroll", icon: DollarSign, path: "/tenant/payroll", badge: "Processing", badgeVariant: "warning" },
      { label: "Finance & Billing", icon: CreditCard, path: "/tenant/finance" },
      { label: "Insurance & Claims", icon: Shield, path: "/tenant/insurance" },
    ],
  },
  {
    title: "Talent & Hiring",
    icon: Briefcase,
    color: "#00C2FF",
    items: [
      { label: "Recruitment", icon: Briefcase, path: "/tenant/recruitment" },
      { label: "BGV", icon: UserCheck, path: "/tenant/bgv", badge: "12", badgeVariant: "warning" },
      { label: "Performance", icon: Target, path: "/tenant/performance" },
    ],
  },
  {
    title: "Operations",
    icon: FolderKanban,
    color: "#FFB020",
    items: [
      { label: "Tasks & Projects", icon: FolderKanban, path: "/tenant/projects" },
      { label: "EMS / Assets", icon: Building, path: "/tenant/ems" },
      { label: "My Requests", icon: ClipboardList, path: "/tenant/requests" },
      { label: "Notifications", icon: Bell, path: "/tenant/notifications" },
    ],
  },
  {
    title: "Compliance & Risk",
    icon: FileCheck,
    color: "#E23E57",
    items: [
      { label: "Compliance", icon: FileCheck, path: "/tenant/compliance" },
      { label: "Risk & Governance", icon: AlertTriangle, path: "/tenant/risk" },
      { label: "Identity & Access", icon: Key, path: "/tenant/identity" },
    ],
  },
  {
    title: "Intelligence & Automation",
    icon: Brain,
    color: "#8B5CF6",
    items: [
      { label: "Proxima AI", icon: Brain, path: "/tenant/intelligence" },
      { label: "OpZenix", icon: Zap, path: "/tenant/automations" },
      { label: "Managed Ops", icon: Headphones, path: "/tenant/managed-ops" },
    ],
  },
];

const settingsModule: NavModule = {
  title: "Settings",
  icon: Settings,
  color: "#6B7280",
  items: [
    { label: "Organization", icon: Building, path: "/tenant/settings" },
    { label: "Integrations", icon: Link2, path: "/tenant/settings/integrations" },
    { label: "API Keys", icon: Key, path: "/tenant/settings/api-keys" },
    { label: "Billing & Plans", icon: CreditCard, path: "/tenant/settings/billing" },
    { label: "Data Export", icon: Database, path: "/tenant/settings/export" },
    { label: "Custom Domain", icon: Globe, path: "/tenant/settings/domain" },
  ],
};

export const TenantSidebar: React.FC = () => {
  const { sidebarCollapsed, setSidebarCollapsed } = useTenant();
  const [expandedModules, setExpandedModules] = useState<string[]>(["Workforce Management", "Payroll & Finance"]);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;
  const isModuleActive = (module: NavModule) => module.items.some(item => location.pathname === item.path);

  const toggleModule = (title: string) => {
    setExpandedModules(prev => 
      prev.includes(title) 
        ? prev.filter(m => m !== title)
        : [...prev, title]
    );
  };

  const renderNavItem = (item: NavItem, collapsed: boolean, indent: boolean = false) => {
    const Icon = item.icon;
    const active = isActive(item.path);

    const content = (
      <NavLink
        to={item.path}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
          "hover:bg-[#F7F9FC] hover:translate-x-0.5 group",
          active && "bg-[#005EEB]/8 text-[#005EEB] border-l-2 border-[#005EEB] -ml-[2px] pl-[14px]",
          !active && "text-[#6B7280]",
          collapsed && "justify-center px-2",
          indent && !collapsed && "ml-4"
        )}
      >
        <Icon className={cn(
          "w-4 h-4 flex-shrink-0 transition-all duration-200",
          active ? "text-[#005EEB]" : "text-[#9CA3AF] group-hover:text-[#6B7280] group-hover:scale-110"
        )} />
        {!collapsed && (
          <>
            <span className={cn(
              "flex-1 text-[13px] font-medium transition-colors duration-200",
              active ? "text-[#005EEB]" : "text-[#4B5563] group-hover:text-[#1F2937]"
            )}>
              {item.label}
            </span>
            {item.badge && (
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] px-1.5 py-0 h-5 font-medium animate-pulse",
                  item.badgeVariant === "warning" && "border-[#FFB020] text-[#FFB020] bg-[#FFB020]/10",
                  item.badgeVariant === "danger" && "border-[#E23E57] text-[#E23E57] bg-[#E23E57]/10",
                  item.badgeVariant === "success" && "border-[#0FB07A] text-[#0FB07A] bg-[#0FB07A]/10",
                  !item.badgeVariant && "border-[#6B7280] text-[#6B7280]"
                )}
              >
                {item.badge}
              </Badge>
            )}
          </>
        )}
      </NavLink>
    );

    if (collapsed) {
      return (
        <Tooltip key={item.path}>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="right" className="font-medium text-xs">
            {item.label}
            {item.badge && <span className="ml-2 opacity-70">({item.badge})</span>}
          </TooltipContent>
        </Tooltip>
      );
    }

    return <div key={item.path}>{content}</div>;
  };

  const renderModule = (module: NavModule) => {
    const isExpanded = expandedModules.includes(module.title);
    const hasActiveItem = isModuleActive(module);
    const Icon = module.icon;

    if (sidebarCollapsed) {
      return (
        <div key={module.title} className="space-y-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <div 
                className={cn(
                  "flex items-center justify-center p-2 rounded-lg cursor-pointer transition-all duration-200",
                  "hover:scale-105",
                  hasActiveItem ? "bg-[#005EEB]/10" : "hover:bg-[#F7F9FC]"
                )}
                style={{ borderLeft: hasActiveItem ? `2px solid ${module.color}` : undefined }}
              >
                <Icon className="w-5 h-5 transition-transform duration-200" style={{ color: module.color }} />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="font-medium text-xs">
              {module.title}
            </TooltipContent>
          </Tooltip>
        </div>
      );
    }

    return (
      <div key={module.title} className="mb-1">
        <button
          onClick={() => toggleModule(module.title)}
          className={cn(
            "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-all duration-200",
            "hover:bg-[#F7F9FC] group",
            hasActiveItem && "bg-[#F7F9FC]"
          )}
        >
          <div 
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200",
              "group-hover:scale-105",
              hasActiveItem ? "bg-opacity-15" : "bg-opacity-10"
            )}
            style={{ backgroundColor: `${module.color}15` }}
          >
            <Icon className="w-4 h-4 transition-transform duration-200" style={{ color: module.color }} />
          </div>
          <span className={cn(
            "flex-1 text-left text-[13px] font-semibold transition-colors duration-200",
            hasActiveItem ? "text-[#0F1E3A]" : "text-[#4B5563]"
          )}>
            {module.title}
          </span>
          <div className={cn(
            "transition-transform duration-300",
            isExpanded && "rotate-180"
          )}>
            <ChevronDown className="w-4 h-4 text-[#9CA3AF]" />
          </div>
        </button>

        <div className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}>
          <div className="mt-1 space-y-0.5 ml-2 border-l border-gray-100 pl-2">
            {module.items.map((item, index) => (
              <div 
                key={item.path}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {renderNavItem(item, false, true)}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-[72px] bottom-0 bg-white border-r border-gray-200 transition-all duration-300 z-40 flex flex-col",
        sidebarCollapsed ? "w-[72px]" : "w-[280px]"
      )}
    >
      <div className={cn(
        "flex items-center p-3 border-b border-gray-100",
        sidebarCollapsed ? "justify-center" : "justify-between"
      )}>
        {!sidebarCollapsed && (
          <span className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">Navigation</span>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="h-8 w-8 rounded-lg hover:bg-[#F7F9FC] transition-transform duration-200 hover:scale-105"
        >
          {sidebarCollapsed ? (
            <PanelLeft className="w-4 h-4 text-[#6B7280]" />
          ) : (
            <PanelLeftClose className="w-4 h-4 text-[#6B7280]" />
          )}
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        <div className="mb-4">
          {primaryNav.map((item) => renderNavItem(item, sidebarCollapsed))}
        </div>

        {!sidebarCollapsed && (
          <div className="mb-2">
            <span className="px-3 text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider">
              Modules
            </span>
          </div>
        )}
        <div className="space-y-1">
          {coreModules.map(renderModule)}
        </div>

        <div className="my-4 border-t border-gray-100" />

        {renderModule(settingsModule)}
      </nav>

      {!sidebarCollapsed && (
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-[#9CA3AF]">
            <span>ATLAS v2.0.1</span>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-[#0FB07A] animate-pulse" />
              <span>Connected</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
