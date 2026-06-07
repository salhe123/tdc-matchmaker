"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Lock, Heart, Eye, EyeOff } from "lucide-react";
import { MATCHMAKER_CREDENTIALS } from "@/data/customers";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTimeout(() => {
      if (username === MATCHMAKER_CREDENTIALS.username && password === MATCHMAKER_CREDENTIALS.password) {
        localStorage.setItem("tdc_session", JSON.stringify({ loggedIn: true, name: MATCHMAKER_CREDENTIALS.name }));
        router.push("/dashboard");
      } else {
        setError("Invalid credentials. Please try again.");
        setLoading(false);
      }
    }, 600);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 px-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg mb-4">
            <Heart className="w-8 h-8 text-white fill-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">TDC Matchmaker</h1>
          <p className="text-gray-500 mt-1 text-sm">Internal Portal — The Date Crew</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-rose-100">
          <h2 className="text-xl font-semibold text-gray-700 mb-6 text-center">Sign in to your account</h2>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="matchmaker@tdc.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-300 text-gray-700 placeholder-gray-400 text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-400" />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-300 text-gray-700 placeholder-gray-400 text-sm"
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rose-400">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-600 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold rounded-xl shadow hover:from-rose-600 hover:to-pink-700 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : "Sign In"}
            </button>
          </form>

          <div className="mt-6 p-4 bg-rose-50 rounded-xl border border-rose-100">
            <p className="text-xs font-semibold text-rose-600 mb-2">Sample Credentials</p>
            <div className="text-xs text-gray-600 space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-400">Username:</span>
                <span className="font-mono font-medium">matchmaker@tdc.com</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Password:</span>
                <span className="font-mono font-medium">TDC@2026</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">© 2024 The Date Crew. All rights reserved.</p>
      </div>
    </div>
  );
}
