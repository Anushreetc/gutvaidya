"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserProfile } from "@/types/ecommerce";
import { createClient } from "@/lib/supabase/client";

interface AuthContextType {
  user: any | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  setDemoUser: (role: "customer" | "admin") => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  const fetchProfile = async (userId: string, email: string) => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (!error && data) {
        setProfile(data as UserProfile);
      } else {
        // Fallback default profile
        setProfile({
          id: userId,
          name: email.split("@")[0],
          email: email,
          role: "customer",
          created_at: new Date().toISOString(),
        });
      }
    } catch (e) {
      console.error("Error fetching profile", e);
    }
  };

  useEffect(() => {
    // Check saved demo user first (for dev/preview when Supabase keys are not yet configured)
    const savedDemo = localStorage.getItem("gutvaidya_demo_user");
    if (savedDemo) {
      try {
        const parsed = JSON.parse(savedDemo);
        setUser({ id: parsed.id, email: parsed.email });
        setProfile(parsed);
        setIsLoading(false);
        return;
      } catch (e) {
        console.error(e);
      }
    }

    if (!supabase) {
      setIsLoading(false);
      return;
    }

    // Live Supabase Auth
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id, session.user.email || "");
      }
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id, session.user.email || "");
      } else {
        setUser(null);
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    localStorage.removeItem("gutvaidya_demo_user");
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (user?.id) {
      await fetchProfile(user.id, user.email || "");
    }
  };

  const setDemoUser = (role: "customer" | "admin") => {
    const demoProfile: UserProfile = {
      id: role === "admin" ? "demo-admin-id" : "demo-customer-id",
      name: role === "admin" ? "Vaidya Admin" : "Demo Customer",
      email: role === "admin" ? "admin@gutvaidya.in" : "customer@example.com",
      role: role,
      created_at: new Date().toISOString(),
    };
    localStorage.setItem("gutvaidya_demo_user", JSON.stringify(demoProfile));
    setUser({ id: demoProfile.id, email: demoProfile.email });
    setProfile(demoProfile);
  };

  const isAdmin = profile?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAdmin,
        isLoading,
        signOut,
        refreshProfile,
        setDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
