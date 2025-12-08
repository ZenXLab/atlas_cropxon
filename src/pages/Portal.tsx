import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useClientTier } from "@/hooks/useClientTier";
import { useEmployeeRole } from "@/hooks/useEmployeeRole";
import { supabase } from "@/integrations/supabase/client";
import { PortalSidebar } from "@/components/portal/PortalSidebar";
import { PortalHeader } from "@/components/portal/PortalHeader";
import { PortalDashboard } from "@/components/portal/PortalDashboard";
import { PortalProjects } from "@/components/portal/PortalProjects";
import { PortalFiles } from "@/components/portal/PortalFiles";
import { PortalInvoices } from "@/components/portal/PortalInvoices";
import { PortalTickets } from "@/components/portal/PortalTickets";
import { PortalMeetings } from "@/components/portal/PortalMeetings";
import { PortalTeam } from "@/components/portal/PortalTeam";
import { PortalSettings } from "@/components/portal/PortalSettings";
import { PortalAIDashboard } from "@/components/portal/PortalAIDashboard";
import { PortalFeedback } from "@/components/portal/PortalFeedback";
import { PortalResources } from "@/components/portal/PortalResources";
import { PortalMSPMonitoring } from "@/components/portal/PortalMSPMonitoring";

export default function Portal() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading, signOut } = useAuth();
  const { loading: tierLoading } = useClientTier();
  const { loading: roleLoading } = useEmployeeRole();
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/portal/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user && !user.id.startsWith("dev-")) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();
    setProfile(data);
  };

  if (loading || tierLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const renderContent = () => {
    const path = location.pathname;
    
    if (path === "/portal" || path === "/portal/") return <PortalDashboard userId={user?.id} />;
    if (path.startsWith("/portal/projects")) return <PortalProjects userId={user?.id} />;
    if (path.startsWith("/portal/files")) return <PortalFiles userId={user?.id} />;
    if (path.startsWith("/portal/invoices")) return <PortalInvoices userId={user?.id} />;
    if (path.startsWith("/portal/tickets")) return <PortalTickets userId={user?.id} />;
    if (path.startsWith("/portal/meetings")) return <PortalMeetings userId={user?.id} />;
    if (path.startsWith("/portal/team")) return <PortalTeam />;
    if (path.startsWith("/portal/settings")) return <PortalSettings userId={user?.id} profile={profile} />;
    if (path.startsWith("/portal/ai")) return <PortalAIDashboard userId={user?.id} />;
    if (path.startsWith("/portal/msp")) return <PortalMSPMonitoring />;
    if (path.startsWith("/portal/feedback")) return <PortalFeedback userId={user?.id} />;
    if (path.startsWith("/portal/resources")) return <PortalResources />;
    
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-heading font-bold mb-2">Coming Soon</h2>
        <p className="text-muted-foreground">This section is under development</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <PortalSidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        user={user}
        profile={profile}
        signOut={signOut}
      />

      {/* Main Content */}
      <div className="lg:pl-64">
        <PortalHeader setSidebarOpen={setSidebarOpen} userId={user?.id} />
        <main className="p-4 lg:p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
