"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  HeartPulse,
  Shield,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
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

  // HANDLE REGISTER

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    setError("");

    setSuccess("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(formData),
      });

      const data = await res.json();

      // ERROR

      if (!res.ok) {
        setError(data.message);

        setLoading(false);

        return;
      }

      // SUCCESS

      setSuccess(data.message);

      // RESET FORM

      setFormData({
        name: "",
        email: "",
        password: "",
      });

      // REDIRECT

      setTimeout(() => {
        router.push("/login");
      }, 1500);
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
            Create Account
          </h1>

          <p className="text-gray-400 mt-3 text-center">
            Register for Hospital Management System
          </p>
        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-5 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {/* SUCCESS */}

        {success && (
          <div className="mb-5 bg-green-500/10 border border-green-500/20 text-green-400 text-sm rounded-xl px-4 py-3">
            {success}
          </div>
        )}

        {/* FORM */}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* NAME */}

          <div>
            <label className="text-sm text-gray-400 mb-3 block">
              Full Name
            </label>

            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-4">
              <User size={20} className="text-cyan-400" />

              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                className="bg-transparent outline-none text-white placeholder:text-gray-500 w-full"
                required
              />
            </div>
          </div>

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
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="bg-transparent outline-none text-white placeholder:text-gray-500 w-full"
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
                className="bg-transparent outline-none text-white placeholder:text-gray-500 w-full"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 py-4 rounded-2xl font-bold text-lg hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-cyan-500/20 disabled:opacity-50"
          >
            {loading ? "Registering..." : "Create Account"}
          </button>
        </form>

        {/* LOGIN */}

        <p className="text-center text-gray-400 mt-8">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-cyan-400 hover:text-cyan-300 font-semibold"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
