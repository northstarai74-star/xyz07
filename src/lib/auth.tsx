import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "./supabase";

type Result = { error: string | null };

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  /** True until the saved session has been read back, so the UI can avoid a signed-out flash. */
  loading: boolean;
  /** False when the Supabase env vars are missing, so the UI can explain instead of breaking. */
  configured: boolean;
  signIn: (email: string, password: string) => Promise<Result>;
  signUp: (email: string, password: string) => Promise<Result & { needsConfirmation: boolean }>;
  signOut: () => Promise<Result>;
};

const NOT_CONFIGURED = "Accounts are unavailable: this site has no Supabase connection configured.";

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(supabase !== null);

  useEffect(() => {
    if (!supabase) return;
    let active = true;

    // supabase-js keeps the session in localStorage and refreshes the access
    // token on its own; this reads back whatever is already there.
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setLoading(false);
    });

    // Fires on sign in, sign out, token refresh, and on changes made in another tab.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setLoading(false);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string): Promise<Result> => {
    if (!supabase) return { error: NOT_CONFIGURED };
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    return { error: error?.message ?? null };
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    if (!supabase) return { error: NOT_CONFIGURED, needsConfirmation: false };
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { emailRedirectTo: `${window.location.origin}/account` },
    });
    if (error) return { error: error.message, needsConfirmation: false };
    // With "Confirm email" on (the Supabase default) no session is returned
    // until the link in the confirmation email is opened.
    return { error: null, needsConfirmation: data.session === null };
  }, []);

  const signOut = useCallback(async (): Promise<Result> => {
    if (!supabase) return { error: NOT_CONFIGURED };
    const { error } = await supabase.auth.signOut();
    return { error: error?.message ?? null };
  }, []);

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      session,
      loading,
      configured: supabase !== null,
      signIn,
      signUp,
      signOut,
    }),
    [session, loading, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

/** "priya.sharma@gmail.com" -> "Priya" — a friendlier greeting than the raw address. */
export function displayName(user: User) {
  const local = (user.email ?? "").split("@")[0].split(/[._-]/)[0];
  return local ? local.charAt(0).toUpperCase() + local.slice(1) : "there";
}
