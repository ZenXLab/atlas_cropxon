import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, DEV_MODE_KEY, DEV_MODE_TYPE_KEY } from "./useAuth";

export const useUserRole = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminRole = async () => {
      // Dev mode ONLY works in development builds
      const isDevBuild = import.meta.env.DEV === true;
      
      if (isDevBuild) {
        const devMode = localStorage.getItem(DEV_MODE_KEY) === "true";
        const devType = localStorage.getItem(DEV_MODE_TYPE_KEY);
        
        if (devMode && devType === "admin") {
          setIsAdmin(true);
          setLoading(false);
          return;
        }

        // Skip DB check for dev mode users in development
        if (user?.id.startsWith("dev-")) {
          setIsAdmin(devType === "admin");
          setLoading(false);
          return;
        }
      }

      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle();

        if (error) {
          console.error('Error checking admin role:', error);
          setIsAdmin(false);
        } else {
          setIsAdmin(!!data);
        }
      } catch (err) {
        console.error('Error:', err);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminRole();
  }, [user]);

  return { isAdmin, loading };
};
