"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import {
  Bell,
  CheckCircle2,
  CalendarDays,
  Clock3,
  UserRound,
  Stethoscope,
  House,
  XCircle,
  AlertCircle,
} from "lucide-react";

export default function NotificationsPage() {
  const router = useRouter();

  const [appointments, setAppointments] = useState([]);

  const [loading, setLoading] = useState(true);

  // =========================
  // FORMAT DATE
  // =========================

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // =========================
  // FORMAT TIME
  // =========================

  const formatTime = (time) => {
    if (!time) return "";

    const [hours, minutes] = time.split(":");

    let hour = parseInt(hours);

    const ampm = hour >= 12 ? "PM" : "AM";

    // 24H → 12H
    hour = hour % 12;

    // 0 = 12
    hour = hour ? hour : 12;

    return `${hour}:${minutes} ${ampm}`;
  };

  // =========================
  // FETCH APPOINTMENTS
  // =========================

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      // GET LOGGED USER
      const user = JSON.parse(localStorage.getItem("user"));

      const res = await fetch(`/api/appointments?email=${user.email}`);

      const data = await res.json();

      if (data.success) {
        setAppointments(data.appointments);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-12">
          {/* LEFT */}
          <div className="flex items-center gap-4">
            <div className="bg-cyan-500/20 p-4 rounded-2xl">
              <Bell size={32} className="text-cyan-400" />
            </div>

            <div>
              <h1 className="text-5xl font-black">Notifications</h1>

              <p className="text-gray-400 mt-2 text-lg">
                Appointment updates & alerts
              </p>
            </div>
          </div>

          {/* DASHBOARD BUTTON */}
          <button
            onClick={() => router.push("/users/dashboard")}
            className="group relative overflow-hidden bg-gradient-to-r from-cyan-500 to-blue-600 p-[2px] rounded-2xl shadow-xl shadow-cyan-500/20 hover:scale-105 transition-all duration-300 self-start"
          >
            <div className="flex items-center gap-3 bg-[#030712] px-7 py-4 rounded-2xl group-hover:bg-transparent transition-all duration-300">
              <House
                size={22}
                className="text-cyan-400 group-hover:text-white transition-all duration-300"
              />

              <span className="font-bold text-white">Dashboard</span>
            </div>
          </button>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="text-center py-20 text-gray-400 text-xl">
            Loading notifications...
          </div>
        )}

        {/* EMPTY */}
        {!loading && appointments.length === 0 && (
          <div className="bg-white/5 border border-white/10 rounded-[32px] p-12 text-center">
            <Bell size={60} className="mx-auto text-cyan-400 mb-6" />

            <h2 className="text-3xl font-bold">No Notifications Found</h2>

            <p className="text-gray-400 mt-4">
              Book an appointment to receive notifications.
            </p>
          </div>
        )}

        {/* NOTIFICATIONS */}
        <div className="space-y-8">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-xl hover:border-cyan-500/20 transition-all duration-300"
            >
              <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">
                {/* LEFT */}
                <div className="flex items-start gap-5">
                  {/* STATUS ICON */}
                  <div
                    className={`p-4 rounded-2xl ${
                      appointment.status === "Accepted"
                        ? "bg-green-500/20"
                        : appointment.status === "Rejected"
                          ? "bg-red-500/20"
                          : "bg-yellow-500/20"
                    }`}
                  >
                    {appointment.status === "Accepted" ? (
                      <CheckCircle2 size={30} className="text-green-400" />
                    ) : appointment.status === "Rejected" ? (
                      <XCircle size={30} className="text-red-400" />
                    ) : (
                      <AlertCircle size={30} className="text-yellow-400" />
                    )}
                  </div>

                  {/* CONTENT */}
                  <div>
                    <h2 className="text-3xl font-black">
                      Appointment Notification
                    </h2>

                    <p className="text-gray-400 mt-3 leading-relaxed max-w-2xl">
                      Your appointment request has been updated by admin. Check
                      your latest appointment details below.
                    </p>

                    {/* STATUS */}
                    <div
                      className={`mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-2xl border font-semibold ${
                        appointment.status === "Accepted"
                          ? "bg-green-500/10 border-green-500/20 text-green-400"
                          : appointment.status === "Rejected"
                            ? "bg-red-500/10 border-red-500/20 text-red-400"
                            : "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      Status: {appointment.status || "Pending"}
                    </div>
                  </div>
                </div>

                {/* RIGHT DETAILS */}
                <div className="grid sm:grid-cols-2 gap-5 xl:min-w-[500px]">
                  {/* PATIENT */}
                  <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <UserRound size={20} className="text-cyan-400" />

                      <p className="text-gray-400 text-sm">Patient Name</p>
                    </div>

                    <h3 className="font-bold text-lg">
                      {appointment.patient_name}
                    </h3>
                  </div>

                  {/* DOCTOR */}
                  <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <Stethoscope size={20} className="text-cyan-400" />

                      <p className="text-gray-400 text-sm">Doctor</p>
                    </div>

                    <h3 className="font-bold text-lg">
                      {appointment.doctor_name}
                    </h3>
                  </div>

                  {/* DATE */}
                  <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <CalendarDays size={20} className="text-cyan-400" />

                      <p className="text-gray-400 text-sm">Appointment Date</p>
                    </div>

                    <h3 className="font-bold text-lg">
                      {formatDate(appointment.appointment_date)}
                    </h3>
                  </div>

                  {/* TIME */}
                  <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <Clock3 size={20} className="text-cyan-400" />

                      <p className="text-gray-400 text-sm">Appointment Time</p>
                    </div>

                    <h3 className="font-bold text-lg">
                      {formatTime(appointment.appointment_time)}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
