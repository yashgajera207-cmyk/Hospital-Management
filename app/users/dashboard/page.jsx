"use client";

import { useState, useEffect } from "react";

import {
  CalendarDays,
  HeartPulse,
  Bell,
  Activity,
  Users,
  ClipboardPlus,
  Stethoscope,
  LogOut,
  ShieldPlus,
} from "lucide-react";

import { useRouter } from "next/navigation";

export default function UserDashboard() {
  const router = useRouter();

  const [appointments, setAppointments] = useState([]);
  

  const [totalAppointments, setTotalAppointments] = useState(0);

  const [totalDoctors, setTotalDoctors] = useState(0);

  const [mounted, setMounted] = useState(false);

  // GET USER DATA
  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user"))
      : null;

  // ==========================
  // FETCH USER APPOINTMENTS
  // ==========================

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);
  const fetchAppointments = async () => {
    try {
      const res = await fetch("/api/appointments");

      const data = await res.json();

      if (data.success) {
        // FILTER ONLY CURRENT USER APPOINTMENTS
        const userAppointments = data.appointments.filter(
          (item) => item.user_email === user?.email,
        );

        setAppointments(userAppointments);

        // TOTAL APPOINTMENTS
        setTotalAppointments(userAppointments.length);

        // UNIQUE DOCTORS COUNT
        const uniqueDoctors = [
          ...new Set(userAppointments.map((item) => item.doctor_name)),
        ];

        setTotalDoctors(uniqueDoctors.length);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ==========================
  // LOGOUT
  // ==========================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");

    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white flex overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-[280px] bg-white/5 border-r border-white/10 backdrop-blur-xl hidden lg:flex flex-col justify-between">
        <div>
          {/* LOGO */}
          <div className="p-8 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-3 rounded-2xl shadow-lg shadow-cyan-500/20">
                <HeartPulse size={30} />
              </div>

              <div>
                <h1 className="text-2xl font-bold">MediCare Pro</h1>

                <p className="text-gray-400 text-sm">Patient Dashboard</p>
              </div>
            </div>
          </div>

          {/* MENU */}
          <nav className="p-6 space-y-3">
            {/* DASHBOARD */}
            <button
              onClick={() => router.push("/users/dashboard")}
              className="w-full flex items-center gap-4 bg-cyan-500/20 text-cyan-400 px-5 py-4 rounded-2xl font-semibold"
            >
              <Activity size={22} />
              Dashboard
            </button>

            {/* APPOINTMENTS */}
            <button
              onClick={() => router.push("/users/appointments")}
              className="w-full flex items-center gap-4 hover:bg-white/5 px-5 py-4 rounded-2xl transition-all duration-300"
            >
              <CalendarDays size={22} />
              Appointments
            </button>

            {/* REPORTS */}
            <button
              onClick={() => router.push("/users/reports")}
              className="w-full flex items-center gap-4 hover:bg-white/5 px-5 py-4 rounded-2xl transition-all duration-300"
            >
              <ClipboardPlus size={22} />
              Medical Reports
            </button>

            {/* DOCTORS */}
            <button
              onClick={() => router.push("/users/doctors")}
              className="w-full flex items-center gap-4 hover:bg-white/5 px-5 py-4 rounded-2xl transition-all duration-300"
            >
              <Stethoscope size={22} />
              Doctors
            </button>

            {/* NOTIFICATIONS */}
            <button
              onClick={() => router.push("/users/notifications")}
              className="w-full flex items-center gap-4 hover:bg-white/5 px-5 py-4 rounded-2xl transition-all duration-300"
            >
              <Bell size={22} />
              Notifications
            </button>

            {/* EMERGENCY */}
            <button
              onClick={() => router.push("/users/emergency")}
              className="w-full flex items-center gap-4 hover:bg-white/5 px-5 py-4 rounded-2xl transition-all duration-300"
            >
              <ShieldPlus size={22} />
              Emergency Support
            </button>
          </nav>
        </div>

        {/* LOGOUT */}
        <div className="p-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 py-4 rounded-2xl font-semibold transition-all duration-300"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 overflow-y-auto">
        {/* TOPBAR */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 px-6 md:px-10 py-8 border-b border-white/10 bg-white/5 backdrop-blur-xl">
          <div>
            <h1 className="text-4xl font-black">Welcome Back 👋</h1>

            <p className="text-gray-400 mt-2">
              Manage your healthcare activities and appointments
            </p>
          </div>

          {/* PROFILE */}
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-5 py-3 rounded-2xl">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold">
              {mounted && user?.name ? user.name.charAt(0).toUpperCase() : ""}
            </div>

            <div>
              <h3 className="font-semibold">{mounted ? user?.name : ""}</h3>
              <p className="text-sm text-gray-400">
                Patient
              </p>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="p-6 md:p-10">
          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {/* TOTAL APPOINTMENTS */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-400">Total Appointments</p>

                  <h2 className="text-4xl font-black mt-3">
                    {totalAppointments}
                  </h2>
                </div>

                <div className="bg-cyan-500/20 p-4 rounded-2xl text-cyan-400">
                  <CalendarDays size={28} />
                </div>
              </div>
            </div>

            {/* DOCTORS CONSULTED */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-400">Doctors Consulted</p>

                  <h2 className="text-4xl font-black mt-3">{totalDoctors}</h2>
                </div>

                <div className="bg-pink-500/20 p-4 rounded-2xl text-pink-400">
                  <Users size={28} />
                </div>
              </div>
            </div>

            {/* REPORTS */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-400">Reports</p>

                  <h2 className="text-4xl font-black mt-3">8</h2>
                </div>

                <div className="bg-green-500/20 p-4 rounded-2xl text-green-400">
                  <ClipboardPlus size={28} />
                </div>
              </div>
            </div>

            {/* HEALTH SCORE */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-400">Health Score</p>

                  <h2 className="text-4xl font-black mt-3">92%</h2>
                </div>

                <div className="bg-yellow-500/20 p-4 rounded-2xl text-yellow-400">
                  <HeartPulse size={28} />
                </div>
              </div>
            </div>
          </div>

          {/* LOWER SECTION */}
          <div className="grid lg:grid-cols-2 gap-8 mt-10">
            {/* ADVICE */}
            <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-xl">
              <div className="relative h-[320px]">
                <img
                  src="https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg"
                  alt="Doctor"
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#030712] to-transparent"></div>

                <div className="absolute bottom-8 left-8 right-8">
                  <h2 className="text-4xl font-black leading-tight">
                    Stay Healthy With Professional Medical Advice
                  </h2>

                  <p className="text-white/80 mt-4 leading-relaxed">
                    Regular checkups, proper hydration, healthy diet, and daily
                    exercise improve your overall health and immune system.
                  </p>
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 shadow-xl">
              <h2 className="text-3xl font-black mb-8">Quick Actions</h2>

              <div className="space-y-5">
                <button
                  onClick={() => router.push("/users/appointments")}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 py-5 rounded-2xl font-bold text-lg hover:scale-[1.02] transition-all duration-300"
                >
                  Book Appointment
                </button>

                <button
                  onClick={() => router.push("/users/reports")}
                  className="w-full bg-white/5 border border-white/10 hover:bg-white/10 py-5 rounded-2xl transition-all duration-300"
                >
                  Download Reports
                </button>

                <button
                  onClick={() => router.push("/users/doctors")}
                  className="w-full bg-white/5 border border-white/10 hover:bg-white/10 py-5 rounded-2xl transition-all duration-300"
                >
                  Contact Doctor
                </button>

                <button
                  onClick={() => router.push("/users/emergency")}
                  className="w-full bg-red-500/10 border border-red-500/20 hover:bg-red-500 hover:text-white py-5 rounded-2xl transition-all duration-300"
                >
                  Emergency Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
