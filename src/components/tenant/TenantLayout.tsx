import React, { useState, createContext, useContext } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { TenantHeader } from "./TenantHeader";
import { TenantSidebar } from "./TenantSidebar";
import "@/styles/tenant-theme.css";

interface TenantContextType {
  isTrialMode: boolean;
  setTrialMode: (mode: boolean) => void;
  trialDaysLeft: number;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  tenantName: string;
  tenantLogo: string | null;
  currentPlan: "Starter" | "Pro" | "Business" | "Enterprise";
  billingCycleEnd: string;
}

const TenantContext = createContext<TenantContextType | null>(null);

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) throw new Error("useTenant must be used within TenantProvider");
  return context;
};

export const TenantLayout: React.FC = () => {
  const [isTrialMode, setTrialMode] = useState(true);
  const [trialDaysLeft] = useState(9);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [tenantName] = useState("ACME Pharma Pvt Ltd");
  const [tenantLogo] = useState<string | null>(null);
  const [currentPlan] = useState<"Starter" | "Pro" | "Business" | "Enterprise">("Pro");
  const [billingCycleEnd] = useState("2025-01-31");
  const location = useLocation();

  const isOnboarding = location.pathname === "/tenant/onboarding";

  return (
    <TenantContext.Provider
      value={{
        isTrialMode,
        setTrialMode,
        trialDaysLeft,
        sidebarCollapsed,
        setSidebarCollapsed,
        tenantName,
        tenantLogo,
        currentPlan,
        billingCycleEnd,
      }}
    >
      <div className="tenant-portal min-h-screen bg-[#F7F9FC] flex flex-col">
        <TenantHeader />
        
        <div className="flex flex-1">
          {!isOnboarding && <TenantSidebar />}
          
          <main
            className={`flex-1 transition-all duration-300 ${
              isOnboarding 
                ? "pt-0" 
                : sidebarCollapsed 
                  ? "ml-[72px]" 
                  : "ml-[280px]"
            }`}
            style={{ 
              paddingTop: "72px",
              minHeight: "100vh"
            }}
          >
            <div className="p-6 max-w-[1600px] mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </TenantContext.Provider>
  );
};
