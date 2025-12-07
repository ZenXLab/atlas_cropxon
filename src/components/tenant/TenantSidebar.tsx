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
  badgeVariant?: "default" | "warning" | "danger";
}

interface NavGroup {
  title: string;
  items: NavItem[];
  defaultOpen?: boolean;
}

const primaryNav: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/tenant/dashboard" },
  { label: "Workforce", icon: Users, path: "/tenant/workforce" },
  { label: "Attendance & Leave", icon: Calendar, path: "/tenant/attendance" },
  { label: "Payroll", icon: DollarSign, path: "/tenant/payroll", badge: "Processing", badgeVariant: "warning" },
  { label: "Tasks & Projects", icon: FolderKanban, path: "/tenant/projects" },
  { label: "Documents", icon: FileText, path: "/tenant/documents" },
  { label: "Announcements", icon: MessageSquare, path: "/tenant/announcements" },
  { label: "My Requests", icon: ClipboardList, path: "/tenant/requests" },
  { label: "Notifications", icon: Bell, path: "/tenant/notifications" },
];

const verticesNav: NavGroup = {
  title: "Vertices",
  defaultOpen: true,
  items: [
    { label: "Recruitment", icon: Briefcase, path: "/tenant/recruitment" },
    { label: "Compliance", icon: FileCheck, path: "/tenant/compliance" },
    { label: "Finance & Billing", icon: CreditCard, path: "/tenant/finance" },
    { label: "Insurance & Claims", icon: Shield, path: "/tenant/insurance" },
    { label: "BGV", icon: UserCheck, path: "/tenant/bgv", badge: "12", badgeVariant: "warning" },
    { label: "EMS", icon: Building, path: "/tenant/ems" },
    { label: "Performance", icon: Target, path: "/tenant/performance" },
    { label: "OpZenix", icon: Zap, path: "/tenant/automations" },
    { label: "Proxima AI", icon: Brain, path: "/tenant/intelligence" },
    { label: "Identity & Access", icon: Key, path: "/tenant/identity" },
    { label: "Risk & Governance", icon: AlertTriangle, path: "/tenant/risk" },
    { label: "Managed Ops", icon: Headphones, path: "/tenant/managed-ops" },
  ],
};

const settingsNav: NavGroup = {
  title: "Settings",
  items: [
    { label: "Organization", icon: Building, path: "/tenant/settings" },
    { label: "Integrations", icon: Zap, path: "/tenant/settings/integrations" },
    { label: "API Keys", icon: Key, path: "/tenant/settings/api-keys" },
    { label: "Billing", icon: CreditCard, path: "/tenant/settings/billing" },
  ],
};

export const TenantSidebar: React.FC = () => {
  const { sidebarCollapsed, setSidebarCollapsed } = useTenant();
  const [verticesOpen, setVerticesOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const renderNavItem = (item: NavItem, collapsed: boolean) => {
    const Icon = item.icon;
    const active = isActive(item.path);

    const content = (
      <NavLink
        to={item.path}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
          "hover:bg-[#F7F9FC] group",
          active && "bg-[#005EEB]/5 text-[#005EEB]",
          !active && "text-[#6B7280]",
          collapsed && "justify-center px-2"
        )}
      >
        <Icon className={cn(
          "w-5 h-5 flex-shrink-0 transition-colors",
          active ? "text-[#005EEB]" : "text-[#6B7280] group-hover:text-[#0F1E3A]"
        )} />
        {!collapsed && (
          <>
            <span className={cn(
              "flex-1 text-sm font-medium transition-colors",
              active ? "text-[#005EEB]" : "group-hover:text-[#0F1E3A]"
            )}>
              {item.label}
            </span>
            {item.badge && (
              <Badge
                variant="outline"
                className={cn(
                  "text-xs px-1.5 py-0",
                  item.badgeVariant === "warning" && "border-[#FFB020] text-[#FFB020] bg-[#FFB020]/10",
                  item.badgeVariant === "danger" && "border-[#E23E57] text-[#E23E57] bg-[#E23E57]/10",
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
          <TooltipContent side="right" className="font-medium">
            {item.label}
            {item.badge && <span className="ml-2 text-xs opacity-70">({item.badge})</span>}
          </TooltipContent>
        </Tooltip>
      );
    }

    return <div key={item.path}>{content}</div>;
  };

  const renderGroup = (group: NavGroup, open: boolean, setOpen: (v: boolean) => void) => (
    <div className="mt-4">
      {!sidebarCollapsed && (
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-[#6B7280] uppercase tracking-wider hover:text-[#0F1E3A] transition-colors"
        >
          {group.title}
          {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      )}
      {(open || sidebarCollapsed) && (
        <div className="space-y-0.5">
          {group.items.map((item) => renderNavItem(item, sidebarCollapsed))}
        </div>
      )}
    </div>
  );

  return (
    <aside
      className={cn(
        "fixed left-0 top-[72px] bottom-0 bg-white border-r border-gray-200 transition-all duration-300 z-40 overflow-hidden",
        sidebarCollapsed ? "w-[72px]" : "w-[280px]"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Toggle Button */}
        <div className={cn(
          "flex items-center p-3 border-b border-gray-100",
          sidebarCollapsed ? "justify-center" : "justify-end"
        )}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="h-8 w-8 rounded-lg hover:bg-[#F7F9FC]"
          >
            {sidebarCollapsed ? (
              <PanelLeft className="w-4 h-4 text-[#6B7280]" />
            ) : (
              <PanelLeftClose className="w-4 h-4 text-[#6B7280]" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {/* Primary Nav */}
          {primaryNav.map((item) => renderNavItem(item, sidebarCollapsed))}

          {/* Vertices */}
          {renderGroup(verticesNav, verticesOpen, setVerticesOpen)}

          {/* Settings */}
          {renderGroup(settingsNav, settingsOpen, setSettingsOpen)}
        </nav>
      </div>
    </aside>
  );
};
