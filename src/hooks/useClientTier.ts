import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, DEV_MODE_KEY, DEV_MODE_TYPE_KEY } from "./useAuth";

export type ClientTier = "basic" | "standard" | "advanced" | "enterprise";

// Module access by tier
export const tierModules: Record<ClientTier, string[]> = {
  basic: [
    "Dashboard",
    "Projects",
    "Files",
    "Invoices",
    "Tickets",
    "Settings",
  ],
  standard: [
    "Dashboard",
    "Projects",
    "Files",
    "Invoices",
    "Tickets",
    "Meetings",
    "Team",
    "Feedback",
    "Settings",
  ],
  advanced: [
    "Dashboard",
    "Projects",
    "Files",
    "Invoices",
    "Tickets",
    "Meetings",
    "AI Dashboard",
    "Team",
    "Feedback",
    "Resources",
    "Settings",
  ],
  enterprise: [
    "Dashboard",
    "Projects",
    "Files",
    "Invoices",
    "Tickets",
    "Meetings",
    "AI Dashboard",
    "MSP Monitoring",
    "Team",
    "Feedback",
    "Resources",
    "Settings",
  ],
};

// Map client types to dashboard tiers
export const clientTypeToDashboardTier: Record<string, ClientTier> = {
  individual: "basic",
  small_business: "standard",
  msme: "standard",
  startup: "advanced",
  enterprise: "enterprise",
};

export const useClientTier = () => {
  const { user, isDevMode } = useAuth();
  const [tier, setTier] = useState<ClientTier>("basic");
  const [clientType, setClientType] = useState<string>("individual");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClientTier = async () => {
      // Dev mode ONLY works in development builds
      const isDevBuild = import.meta.env.DEV === true;
      
      if (isDevBuild) {
        const devMode = localStorage.getItem(DEV_MODE_KEY) === "true";
        const devType = localStorage.getItem(DEV_MODE_TYPE_KEY);
        
        if (devMode && devType === "client") {
          setTier("enterprise"); // Full access in dev mode
          setClientType("enterprise");
          setLoading(false);
          return;
        }

        if (user?.id.startsWith("dev-")) {
          setTier("enterprise"); // Full access for dev users
          setLoading(false);
          return;
        }
      }

      if (!user) {
        setTier("basic");
        setLoading(false);
        return;
      }

      try {
        // Check onboarding session for dashboard tier
        const { data: onboardingData } = await supabase
          .from("onboarding_sessions")
          .select("dashboard_tier, client_type")
          .eq("user_id", user.id)
          .maybeSingle();

        if (onboardingData) {
          const dashboardTier = (onboardingData.dashboard_tier as ClientTier) || "basic";
          setTier(dashboardTier);
          setClientType(onboardingData.client_type || "individual");
        } else {
          // Default to basic if no onboarding data
          setTier("basic");
        }
      } catch (error) {
        console.error("Error fetching client tier:", error);
        setTier("basic");
      } finally {
        setLoading(false);
      }
    };

    fetchClientTier();
  }, [user, isDevMode]);

  // Get allowed modules for current tier
  const allowedModules = tierModules[tier];

  // Check if a specific module is allowed
  const isModuleAllowed = (moduleName: string) => {
    return allowedModules.includes(moduleName);
  };

  return { tier, clientType, loading, allowedModules, isModuleAllowed };
};
