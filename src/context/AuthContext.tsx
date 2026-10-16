"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isConfigured: boolean;
  isAuthModalOpen: boolean;
  authModalTab: "signin" | "signup" | "reset";
  openAuthModal: (tab?: "signin" | "signup" | "reset") => void;
  closeAuthModal: () => void;
  setupNoticeOpen: boolean;
  setSetupNoticeOpen: (open: boolean) => void;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUpWithEmail: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<{ error: Error | null; data?: unknown }>;
  signOut: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isConfigured] = useState<boolean>(isSupabaseConfigured());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"signin" | "signup" | "reset">("signin");
  const [setupNoticeOpen, setSetupNoticeOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  function openAuthModal(tab: "signin" | "signup" | "reset" = "signin") {
    if (!isConfigured) {
      setSetupNoticeOpen(true);
      return;
    }
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  }

  function closeAuthModal() {
    setIsAuthModalOpen(false);
  }

  async function signInWithGoogle() {
    if (!isConfigured) {
      setSetupNoticeOpen(true);
      return { error: new Error("Supabase is not configured.") };
    }
    const supabase = createClient();
    if (!supabase) return { error: new Error("Client initialization failed.") };

    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    });

    return { error };
  }

  async function signInWithEmail(email: string, password: string) {
    if (!isConfigured) {
      setSetupNoticeOpen(true);
      return { error: new Error("Supabase is not configured.") };
    }
    const supabase = createClient();
    if (!supabase) return { error: new Error("Client initialization failed.") };

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error) {
      closeAuthModal();
    }
    return { error };
  }

  async function signUpWithEmail(email: string, password: string, displayName: string) {
    if (!isConfigured) {
      setSetupNoticeOpen(true);
      return { error: new Error("Supabase is not configured.") };
    }
    const supabase = createClient();
    if (!supabase) return { error: new Error("Client initialization failed.") };

    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: displayName,
          display_name: displayName,
        },
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    return { error, data };
  }

  async function signOut() {
    const supabase = createClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
  }

  async function sendPasswordReset(email: string) {
    if (!isConfigured) {
      setSetupNoticeOpen(true);
      return { error: new Error("Supabase is not configured.") };
    }
    const supabase = createClient();
    if (!supabase) return { error: new Error("Client initialization failed.") };

    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/auth/update-password`,
    });

    return { error };
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isConfigured,
        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        setupNoticeOpen,
        setSetupNoticeOpen,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        sendPasswordReset,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
