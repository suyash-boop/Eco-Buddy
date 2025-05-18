"use client"; // This context needs to be client-side

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient'; // Adjust path if needed
import { Session, User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

// Provide default values matching the interface structure
const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true, // Start in loading state
  signOut: async () => {}, // Default empty async function
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Fetch initial session
    const fetchSession = async () => {
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error);
        setSession(null);
        setUser(null);
      } else {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
      }
      setLoading(false); // Initial load complete
    };

    fetchSession();

    // Listen for auth state changes (sign in, sign out, token refresh)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        console.log("Auth state changed:", _event, newSession);
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setLoading(false); // Update loading state on changes too
      }
    );

    // Cleanup listener on component unmount
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
    } else {
      // State updates handled by onAuthStateChange listener
      // Optionally redirect after sign out
      router.push('/signin'); // Redirect to sign-in page after logout
      router.refresh(); // Ensure state is refreshed across server/client components
    }
    setLoading(false);
  };

  const value = {
    session,
    user,
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};