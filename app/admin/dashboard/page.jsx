"use client";

import { useState, useEffect } from "react";

import Navbar from "../components/Navbar";

import {
  Users,
  Stethoscope,
  CalendarDays,
  BedDouble,
  TrendingUp,
  ShieldCheck,
  BadgeCheck,
  Activity,
} from "lucide-react";

export default function Dashboard() {
  const [doctors, setDoctors] = useState([]);

  const [patients, setPatients] = useState([]);

  const [appointments, setAppointments] = useState([]);

  const [completedPatients, setCompletedPatients] = useState([]);

  // =========================
  // FETCH DATA
  // =========================

  useEffect(() => {
    fetchDoctors();

    fetchPatients();

    fetchAppointments();

    fetchCompletedPatients();
  }, []);

  // =========================
  // FETCH DOCTORS
  // =========================

  const fetchDoctors = async () => {
    try {
      const res = await fetch("/api/doctors");

      const data = await res.json();

      if (data.success) {
        setDoctors(data.doctors);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // =========================
  // FETCH PATIENTS
  // =========================

  const fetchPatients = async () => {
    try {
      const res = await fetch("/api/patients");

      const data = await res.json();

      if (data.success) {
        setPatients(data.patients);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // =========================
  // FETCH APPOINTMENTS
  // =========================

  const fetchAppointments = async () => {
    try {
      const res = await fetch("/api/appointments");

      const data = await res.json();

      if (data.success) {
        setAppointments(data.appointments);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // =========================
  // COMPLETED PATIENTS
  // =========================

  const fetchCompletedPatients = () => {
    const completed =
      JSON.parse(localStorage.getItem("completedPatients")) || [];

    setCompletedPatients(completed);
  };

  // =========================
  // ICU / GENERAL
  // =========================

  const icuPatients = patients.filter(
    (patient) => patient.ward_type === "ICU",
  ).length;

  const generalPatients = patients.filter(
    (patient) => patient.ward_type === "General",
  ).length;

  const availableICU = 50 - icuPatients;

  const availableGeneral = 100 - generalPatients;

  // =========================
  // PERCENTAGES
  // =========================

  const icuPercentage = Math.min((icuPatients / 50) * 100, 100);

  const generalPercentage = Math.min((generalPatients / 100) * 100, 100);
  const completedPercentage = Math.min(
    appointments.length > 0
      ? Math.round((completedPatients.length / appointments.length) * 100)
      : 0,
    100,
  );

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#030712] text-white p-6 md:p-10 relative overflow-x-hidden">
        {/* GLOW */}

        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-3xl"></div>

        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-3xl"></div>

        {/* HEADER */}

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
          <div>
            <h1 className="text-5xl font-black">Hospital Dashboard</h1>

            <p className="text-gray-400 mt-3 text-lg">
              Real-time hospital analytics
            </p>
          </div>

          {/* STATUS */}

          <div className="bg-white/10 border border-white/10 backdrop-blur-xl rounded-3xl px-6 py-4 flex items-center gap-4">
            <div className="bg-green-500/20 p-3 rounded-2xl">
              <ShieldCheck className="text-green-400" />
            </div>

            <div>
              <h3 className="font-bold text-lg">System Status</h3>

              <p className="text-green-400 text-sm">All Systems Operational</p>
            </div>
          </div>
        </div>

        {/* STATS */}

        <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-6 mb-10">
          {/* DOCTORS */}

          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl p-6">
            <div className="flex justify-between">
              <div>
                <p>Doctors</p>

                <h2 className="text-5xl font-black mt-4">{doctors.length}</h2>
              </div>

              <Stethoscope size={32} />
            </div>
          </div>

          {/* PATIENTS */}

          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-6">
            <div className="flex justify-between">
              <div>
                <p>Patients</p>

                <h2 className="text-5xl font-black mt-4">{patients.length}</h2>
              </div>

              <Users size={32} />
            </div>
          </div>

          {/* APPOINTMENTS */}

          <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl p-6">
            <div className="flex justify-between">
              <div>
                <p>Appointments</p>

                <h2 className="text-5xl font-black mt-4">
                  {appointments.length}
                </h2>
              </div>

              <CalendarDays size={32} />
            </div>
          </div>

          {/* COMPLETED */}

          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl p-6">
            <div className="flex justify-between">
              <div>
                <p>Completed</p>

                <h2 className="text-5xl font-black mt-4">
                  {completedPatients.length}
                </h2>
              </div>

              <BadgeCheck size={32} />
            </div>
          </div>

          {/* BEDS */}

          <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-3xl p-6">
            <div className="flex justify-between">
              <div>
                <p>Available Beds</p>

                <h2 className="text-3xl font-black mt-4">
                  {availableICU + availableGeneral}
                </h2>
              </div>

              <BedDouble size={32} />
            </div>
          </div>
        </div>

        {/* ANALYTICS */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10 w-full">
          {/* HOSPITAL ACTIVITY */}

          <div className="bg-white/10 border border-white/10 rounded-3xl p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold">Hospital Activity</h2>

                <p className="text-gray-400 mt-2">ICU & General analytics</p>
              </div>

              <TrendingUp className="text-cyan-400" />
            </div>

            <div className="space-y-8">
              {/* ICU */}

              <div>
                <div className="flex justify-between mb-2">
                  <span>ICU Cases</span>

                  <span>{icuPatients}/50</span>
                </div>

                <div className="w-full overflow-hidden bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-red-500 h-3 rounded-full max-w-full"
                    style={{
                      width: `${icuPercentage}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* GENERAL */}

              <div>
                <div className="flex justify-between mb-2">
                  <span>General Cases</span>

                  <span>{generalPatients}/100</span>
                </div>

                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full"
                    style={{
                      width: `${generalPercentage}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* COMPLETED */}

              <div>
                <div className="flex justify-between mb-2">
                  <span>Completed Treatments</span>

                  <span>{completedPercentage}%</span>
                </div>

                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-cyan-500 h-3 rounded-full"
                    style={{
                      width: `${completedPercentage}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* BEDS */}

          <div className="bg-white/10 border border-white/10 rounded-3xl p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold">Bed Availability</h2>

                <p className="text-gray-400 mt-2">ICU & General beds</p>
              </div>

              <Activity className="text-purple-400" />
            </div>

            <div className="space-y-6">
              <div className="bg-white/5 rounded-3xl p-6">
                <h3 className="text-xl font-bold">ICU Beds</h3>

                <p className="text-5xl font-black mt-4 text-red-400">
                  {availableICU}
                </p>

                <p className="text-gray-400 mt-2">Available out of 50</p>
              </div>

              <div className="bg-white/5 rounded-3xl p-6">
                <h3 className="text-xl font-bold">General Beds</h3>

                <p className="text-5xl font-black mt-4 text-green-400">
                  {availableGeneral}
                </p>

                <p className="text-gray-400 mt-2">Available out of 100</p>
              </div>
            </div>
          </div>
        </div>

        {/* RECENT SECTION */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
          {/* RECENT PATIENTS */}

          <div className="bg-white/10 border border-white/10 rounded-3xl p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold">Recent Patients</h2>

                <p className="text-gray-400 mt-2">Latest admitted patients</p>
              </div>
            </div>

            <div className="space-y-4">
              {patients.slice(0, 5).map((patient) => (
                <div
                  key={patient.id}
                  className="bg-white/5 rounded-2xl p-5 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-bold text-lg">{patient.name}</h3>

                    <p className="text-gray-400 text-sm">{patient.doctor}</p>
                  </div>

                  <span className="bg-cyan-500/20 text-cyan-400 px-4 py-2 rounded-full text-sm">
                    {patient.ward_type}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RECENT APPOINTMENTS */}

          <div className="bg-white/10 border border-white/10 rounded-3xl p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold">Recent Appointments</h2>

                <p className="text-gray-400 mt-2">
                  Latest appointment activity
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {appointments.slice(0, 5).map((appointment) => (
                <div
                  key={appointment.id}
                  className="bg-white/5 rounded-2xl p-5 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-bold text-lg">
                      {appointment.patient_name}
                    </h3>

                    <p className="text-gray-400 text-sm">
                      {appointment.doctor_name}
                    </p>
                  </div>

                  <span className="bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm">
                    {appointment.status || "Pending"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
