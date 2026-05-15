"use client";

import { useEffect, useMemo, useState } from "react";

import Navbar from "../components/Navbar";

import {
  Search,
  CalendarDays,
  Stethoscope,
  User,
  Phone,
  Mail,
  MapPin,
  VenusAndMars,
  Activity,
} from "lucide-react";

export default function CompletedAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [doctorFilter, setDoctorFilter] = useState("");

  const [genderFilter, setGenderFilter] = useState("");

  const [dateFilter, setDateFilter] = useState("");

  // ==========================
  // FETCH DATA
  // ==========================

  useEffect(() => {
    fetchCompletedAppointments();

    fetchDoctors();
  }, []);
  const fetchCompletedAppointments = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/completed-appointments");

      const data = await res.json();

      if (data.success) {
        setAppointments(data.appointments || []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // UNIQUE DOCTORS
  // ==========================

  const [allDoctors, setAllDoctors] = useState([]);
  const doctors = [
  ...new Set(
    allDoctors.map(
      (doctor) => doctor.name,
    ),
  ),
];

  // ==========================
  // FETCH DOCTORS
  // ==========================

  const fetchDoctors = async () => {
    try {
      const res = await fetch("/api/doctors");

      const data = await res.json();

      if (data.success) {
        setAllDoctors(data.doctors || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ==========================
  // FILTER DATA
  // ==========================

  const filteredAppointments = useMemo(() => {
    return appointments.filter((item) => {
      const matchesSearch =
        item.patient_name?.toLowerCase().includes(search.toLowerCase()) ||
        item.phone?.includes(search);

      const matchesDoctor = doctorFilter
        ? item.doctor_name === doctorFilter
        : true;

      const matchesGender = genderFilter ? item.gender === genderFilter : true;

      const matchesDate = dateFilter
        ? new Date(item.appointment_date).toISOString().split("T")[0] ===
          dateFilter
        : true;

      return matchesSearch && matchesDoctor && matchesGender && matchesDate;
    });
  }, [appointments, search, doctorFilter, genderFilter, dateFilter]);

  // ==========================
  // FORMAT DATE
  // ==========================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#030712] text-white p-4 md:p-8">
        {/* HEADER */}

        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">
              Completed Appointments
            </h1>

            <p className="text-gray-400 mt-3 text-lg">
              View all completed patient treatments
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 w-full xl:w-auto">
            {/* SEARCH */}

            <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-4 rounded-2xl backdrop-blur-xl">
              <Search size={20} className="text-cyan-400" />

              <input
                type="text"
                placeholder="Search patient..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent outline-none text-white placeholder:text-gray-500 w-full"
              />
            </div>

            {/* DOCTOR FILTER */}

            <select
              value={doctorFilter}
              onChange={(e) => setDoctorFilter(e.target.value)}
              className="bg-white/5 border border-white/10 px-5 py-4 rounded-2xl outline-none text-white backdrop-blur-xl"
            >
              <option value="" className="bg-[#111827]">
                All Doctors
              </option>

              {doctors.map((doctor, index) => (
                <option key={index} value={doctor} className="bg-[#111827]">
                  {doctor}
                </option>
              ))}
            </select>

            {/* GENDER FILTER */}

            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="bg-white/5 border border-white/10 px-5 py-4 rounded-2xl outline-none text-white backdrop-blur-xl"
            >
              <option value="" className="bg-[#111827]">
                All Gender
              </option>

              <option value="Male" className="bg-[#111827]">
                Male
              </option>

              <option value="Female" className="bg-[#111827]">
                Female
              </option>
            </select>

            {/* DATE FILTER */}

            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-white/5 border border-white/10 px-5 py-4 rounded-2xl outline-none text-white backdrop-blur-xl"
            />
          </div>
        </div>

        {/* TABLE */}

        <div className="overflow-x-auto rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
          <table className="w-full min-w-[1400px]">
            <thead className="bg-white/10">
              <tr>
                <th className="text-left px-6 py-5 text-gray-300 font-semibold">
                  Patient
                </th>

                <th className="text-left px-6 py-5 text-gray-300 font-semibold">
                  Gender
                </th>

                <th className="text-left px-6 py-5 text-gray-300 font-semibold">
                  Doctor
                </th>

                <th className="text-left px-6 py-5 text-gray-300 font-semibold">
                  Phone
                </th>


                <th className="text-left px-6 py-5 text-gray-300 font-semibold">
                  Address
                </th>

                <th className="text-left px-6 py-5 text-gray-300 font-semibold">
                  Appointment Date
                </th>

                <th className="text-left px-6 py-5 text-gray-300 font-semibold">
                  Symptoms
                </th>

                <th className="text-left px-6 py-5 text-gray-300 font-semibold">
                  Recovery
                </th>

                <th className="text-left px-6 py-5 text-gray-300 font-semibold">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="10"
                    className="text-center py-20 text-gray-400 text-2xl font-bold"
                  >
                    Loading...
                  </td>
                </tr>
              ) : filteredAppointments.length > 0 ? (
                filteredAppointments.map((item, index) => (
                  <tr
                    key={`${item.id}-${index}`}
                    className="border-t border-white/10 hover:bg-white/5 transition-all duration-300"
                  >
                    {/* PATIENT */}

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-cyan-500/20 flex items-center justify-center">
                          <User size={20} className="text-cyan-400" />
                        </div>

                        <div>
                          <p className="font-bold text-white">
                            {item.patient_name}
                          </p>

                          <p className="text-sm text-gray-400">
                            ID : {item.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* GENDER */}

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <VenusAndMars size={18} className="text-pink-400" />

                        <span>{item.gender || "N/A"}</span>
                      </div>
                    </td>

                    {/* DOCTOR */}

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <Stethoscope size={18} className="text-purple-400" />

                        <span>{item.doctor_name}</span>
                      </div>
                    </td>

                    {/* PHONE */}

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <Phone size={18} className="text-green-400" />

                        <span>{item.phone}</span>
                      </div>
                    </td>



                    {/* ADDRESS */}

                    <td className="px-6 py-5">
                      <div className="flex items-start gap-2">
                        <MapPin size={18} className="text-red-400 mt-1" />

                        <span className="max-w-[250px]">{item.address}</span>
                      </div>
                    </td>

                    {/* DATE */}

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <CalendarDays size={18} className="text-cyan-400" />

                        <span>{formatDate(item.appointment_date)}</span>
                      </div>
                    </td>

                    {/* SYMPTOMS */}

                    <td className="px-6 py-5">
                      <div className="flex items-start gap-2">
                        <Activity size={18} className="text-orange-400 mt-1" />

                        <span className="max-w-[250px]">{item.symptoms}</span>
                      </div>
                    </td>

                    {/* RECOVERY */}

                    <td className="px-6 py-5">
                      <span className="bg-green-500/20 text-green-400 px-4 py-2 rounded-2xl font-bold">
                        {item.health_score}%
                      </span>
                    </td>

                    {/* STATUS */}

                    <td className="px-6 py-5">
                      <span
                        className={`px-4 py-2 rounded-xl text-sm font-bold
                         ${
                           item.status === "Completed"
                             ? "bg-green-500/20 text-green-400"
                             : "bg-red-500/20 text-red-400"
                         }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="text-center py-20">
                    <h2 className="text-3xl font-black text-gray-400">
                      No Completed Appointments Found
                    </h2>

                    <p className="text-gray-500 mt-3">
                      Try changing filters or search
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
