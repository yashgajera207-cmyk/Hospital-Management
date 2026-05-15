"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

import {
  LayoutDashboard,
  Stethoscope,
  Users,
  CalendarDays,
  LogOut,
  HeartPulse,
  Bell,
  Search,
  Menu,
  X,
} from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [mobileMenu, setMobileMenu] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const navLinks = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    {
      name: "Doctors",
      href: "/admin/doctors",
      icon: <Stethoscope size={18} />,
    },
    {
      name: "Patients",
      href: "/admin/patients",
      icon: <Users size={18} />,
    },
    {
      name: "Appointments",
      href: "/admin/appointments",
      icon: <CalendarDays size={18} />,
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#020817]/95 backdrop-blur-2xl">
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-blue-500/5"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* TOP NAVBAR */}
        <div className="h-20 flex items-center justify-between">
          {/* LEFT SIDE */}
          <div className="flex items-center gap-8">
            {/* LOGO */}
            <Link href="/dashboard" className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-50 rounded-full"></div>

                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-xl shadow-cyan-500/20">
                  <HeartPulse size={28} className="text-white" />
                </div>
              </div>

              <div className="hidden sm:block">
                <h1 className="text-2xl font-black tracking-tight text-white">
                  MediCare+
                </h1>

                <p className="text-sm text-cyan-400">Hospital Management</p>
              </div>
            </Link>

            {/* DESKTOP NAVIGATION */}
            <nav className="hidden lg:flex items-center gap-2 bg-white/5 border border-white/10 p-2 rounded-2xl">
              {navLinks.map((link, index) => {
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={index}
                    href={link.href}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300
                      
                      ${
                        isActive
                          ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg"
                          : "text-gray-300 hover:bg-white/10 hover:text-white"
                      }
                    `}
                  >
                    {link.icon}

                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3">
            {/* SEARCH */}
            <div className="hidden md:flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-3 rounded-2xl">
              <Search size={18} className="text-gray-400" />

              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent outline-none text-sm text-white placeholder:text-gray-500 w-28 lg:w-36"
              />
            </div>

            {/* NOTIFICATION */}
            <button className="relative w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all">
              <Bell size={20} className="text-white" />

              <span className="absolute top-2 right-2 w-3 h-3 rounded-full bg-red-500 border-2 border-[#020817]"></span>
            </button>

            {/* LOGOUT BUTTON */}
            <button
              onClick={logout}
              className="flex items-center justify-center gap-2 min-w-[115px] sm:min-w-[130px] h-12 px-4 sm:px-5 rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold shadow-lg shadow-red-500/20 hover:shadow-red-500/40 hover:scale-105 transition-all duration-300 active:scale-[0.98]"
            >
              <LogOut size={18} className="text-white" />

              <span className="whitespace-nowrap text-sm">Logout</span>
            </button>

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="lg:hidden w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white"
            >
              {mobileMenu ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {mobileMenu && (
          <div className="lg:hidden pb-6">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-4 space-y-3 backdrop-blur-xl">
              {/* SEARCH */}
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-4 rounded-2xl">
                <Search size={18} className="text-gray-400" />

                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent outline-none text-sm text-white placeholder:text-gray-500 w-full"
                />
              </div>

              {/* MOBILE LINKS */}
              {navLinks.map((link, index) => {
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={index}
                    href={link.href}
                    onClick={() => setMobileMenu(false)}
                    className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-semibold transition-all duration-300
                      
                      ${
                        isActive
                          ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                          : "text-gray-300 hover:bg-white/10 hover:text-white"
                      }
                    `}
                  >
                    {link.icon}

                    <span>{link.name}</span>
                  </Link>
                );
              })}

              {/* MOBILE LOGOUT */}
              <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-3 px-5 py-4 rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold"
              >
                <LogOut size={18} />

                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
