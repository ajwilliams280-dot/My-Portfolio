"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function AdminLogin() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("Attempting sign in with:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log("Sign in response:", { data, error });

      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        console.log("Sign in successful, redirecting...");
        router.push("/admin/dashboard");
      }
    } catch (err: any) {
      console.error("Sign in exception:", err);
      setError(err.message || "An unexpected error occurred during sign in.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6 text-white">
      <div className="w-full max-w-sm bg-white/5 border border-white/10 rounded-2xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold tracking-widest uppercase mb-2 text-accent text-center">Admin Login</h1>
        <p className="text-white/50 text-sm mb-8 text-center">Sign in to manage your portfolio.</p>
        
        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div>
            <label className="block text-xs uppercase tracking-widest text-white/70 mb-2">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-accent outline-none transition-colors"
            />
          </div>
          
          <div>
            <label className="block text-xs uppercase tracking-widest text-white/70 mb-2">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-accent outline-none transition-colors"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-accent hover:bg-accent/80 text-white font-bold tracking-widest uppercase py-4 rounded-lg mt-2 transition-colors disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
          
          {error && (
            <div className="p-4 rounded-lg text-center text-sm bg-red-500/20 text-red-400 mt-2">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
