import { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

// Dev mode bypass key
export const DEV_MODE_KEY = "atlas_dev_mode";
export const DEV_MODE_TYPE_KEY = "atlas_dev_mode_type";

// Mock user for dev mode
const createMockUser = (type: "admin" | "client"): User => ({
  id: type === "admin" ? "dev-admin-user-id" : "dev-client-user-id",
  email: type === "admin" ? "admin@cropxon.dev" : "client@cropxon.dev",
  aud: "authenticated",
  role: "authenticated",
  app_metadata: {},
  user_metadata: { full_name: type === "admin" ? "Dev Admin" : "Dev Client" },
  created_at: new Date().toISOString(),
} as User);

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDevMode, setIsDevMode] = useState(false);

  useEffect(() => {
    // Check for dev mode first
    const devMode = localStorage.getItem(DEV_MODE_KEY) === "true";
    const devType = localStorage.getItem(DEV_MODE_TYPE_KEY) as "admin" | "client" | null;
    
    if (devMode && devType) {
      setIsDevMode(true);
      setUser(createMockUser(devType));
      setLoading(false);
      return;
    }

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    // Clear dev mode
    localStorage.removeItem(DEV_MODE_KEY);
    localStorage.removeItem(DEV_MODE_TYPE_KEY);
    setIsDevMode(false);
    setUser(null);
    setSession(null);
    await supabase.auth.signOut();
  };

  const signUp = async (email: string, password: string, metadata?: Record<string, unknown>) => {
    const redirectUrl = `${window.location.origin}/portal`;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: metadata
      }
    });
    if (error) throw error;
    return data;
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  // Enable dev mode
  const enableDevMode = (type: "admin" | "client") => {
    localStorage.setItem(DEV_MODE_KEY, "true");
    localStorage.setItem(DEV_MODE_TYPE_KEY, type);
    setIsDevMode(true);
    setUser(createMockUser(type));
  };

  return { user, session, loading, signOut, signUp, signIn, isDevMode, enableDevMode };
};
