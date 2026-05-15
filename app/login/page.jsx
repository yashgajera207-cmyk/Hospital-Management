"use client";

import Link from "next/link";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { Mail, Lock, Eye, EyeOff, HeartPulse } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // HANDLE INPUT

  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  };

  // HANDLE LOGIN

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(formData),
      });

      const data = await res.json();

      // LOGIN FAILED

      if (!res.ok) {
        setError(data.message);

        setLoading(false);

        return;
      }

      // SAVE USER

      localStorage.setItem("user", JSON.stringify(data.user));

      // SAVE ROLE

      localStorage.setItem("role", data.role);

      // REDIRECT

      router.push(data.redirect);
    } catch (error) {
      console.log(error);

      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center px-6 py-10 relative overflow-hidden">
      {/* GLOW */}

      <div className="absolute top-0 left-0 w-[350px] h-[350px] bg-cyan-500/10 rounded-full blur-3xl"></div>

      <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-blue-600/10 rounded-full blur-3xl"></div>

      {/* CARD */}

      <div className="relative z-10 w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[32px] p-8 shadow-2xl">
        {/* LOGO */}

        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <HeartPulse size={40} className="text-white" />
          </div>

          <h1 className="text-4xl font-black text-white mt-6">
            Hospital Login
          </h1>

          <p className="text-gray-400 mt-3 text-center">Welcome back to HMS</p>
        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-5 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {/* FORM */}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* EMAIL */}

          <div>
            <label className="text-sm text-gray-400 mb-3 block">
              Email Address
            </label>

            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-4">
              <Mail size={20} className="text-cyan-400" />

              <input
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                className="bg-transparent outline-none text-white w-full"
                required
              />
            </div>
          </div>

          {/* PASSWORD */}

          <div>
            <label className="text-sm text-gray-400 mb-3 block">Password</label>

            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-4">
              <Lock size={20} className="text-cyan-400" />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                className="bg-transparent outline-none text-white w-full"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 py-4 rounded-2xl font-bold text-lg"
          >
            {loading ? "Logging..." : "Login"}
          </button>
        </form>

        {/* REGISTER */}

        <p className="text-center text-gray-400 mt-8">
          Don't have account?{" "}
          <Link href="/register" className="text-cyan-400">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
