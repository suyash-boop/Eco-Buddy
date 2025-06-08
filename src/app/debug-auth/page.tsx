"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";

export default function DebugAuth() {
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const { data: { user } } = await supabase.auth.getUser();
        
        setSession(session);
        setUser(user);
        console.log("Session:", session);
        console.log("User:", user);
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Auth Status</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Session:</h2>
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold">User:</h2>
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold">Cookies:</h2>
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
            {document.cookie}
          </pre>
        </div>
      </div>
    </div>
  );
}