import { Button } from "@/components/ui/button";
import { Menu, Search, Plus } from "lucide-react";
import { NotificationBell } from "@/components/portal/NotificationBell";

interface PortalHeaderProps {
  setSidebarOpen: (open: boolean) => void;
  userId?: string;
}

export const PortalHeader = ({ setSidebarOpen, userId }: PortalHeaderProps) => {
  return (
    <header className="sticky top-0 z-30 bg-card/90 backdrop-blur-xl border-b border-border/60">
      <div className="flex items-center justify-between h-14 px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <button
            className="lg:hidden p-2 text-foreground hover:bg-muted/50 rounded-lg"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="hidden sm:flex items-center gap-2 bg-muted/50 rounded-xl px-3 py-2 w-64">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input 
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground w-full"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <NotificationBell userId={userId} />
          <Button size="sm" className="gap-2 hidden sm:flex">
            <Plus className="w-4 h-4" />
            New Request
          </Button>
        </div>
      </div>
    </header>
  );
};
