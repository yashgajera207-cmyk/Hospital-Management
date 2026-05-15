"use client";

import { useEffect, useMemo, useState } from "react";

import Navbar from "../components/Navbar";

import {
  Search,
  CalendarDays,
  Stethoscope,
  Mail,
  Phone,
  MapPin,
  FileText,
  CheckCircle2,
  UserRound,
} from "lucide-react";

export default function CompletedPatients() {
  const [patients, setPatients] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [allDoctors, setAllDoctors] = useState([]);

  const [doctorFilter, setDoctorFilter] = useState("All");

  const [dateFilter, setDateFilter] = useState("");

  // ======================================
  // FETCH COMPLETED RECORDS
  // ======================================

useEffect(() => {
  fetchCompletedPatients();

  fetchDoctors();
}, []);

  const fetchCompletedPatients = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/completed-records");

      const data = await res.json();

      if (data.success) {
        const formattedPatients = data.records.map((patient) => ({
          id: patient.id,

          recordId: patient.record_id,

          name: patient.name,

          phone: patient.phone,

          email: patient.email,

          gender: patient.gender,

          address: patient.address,

          description: patient.description,

          doctor: patient.doctor,

          wardType: patient.ward_type,

          status: patient.status,

          type: patient.type,

          completedDate: patient.completed_date,

          completedTime: patient.completed_time,

          createdAt: patient.created_at,
        }));

        setPatients(formattedPatients);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // ======================================
  // FILTER
  // ======================================

  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      const matchSearch =
        patient.name?.toLowerCase().includes(search.toLowerCase()) ||
        patient.doctor?.toLowerCase().includes(search.toLowerCase()) ||
        patient.phone?.toLowerCase().includes(search.toLowerCase());

      const matchDoctor =
        doctorFilter === "All" ? true : patient.doctor === doctorFilter;

      const matchDate = dateFilter
        ? patient.completedDate === new Date(dateFilter).toLocaleDateString()
        : true;

      return matchSearch && matchDoctor && matchDate;
    });
  }, [patients, search, doctorFilter, dateFilter]);

  // ======================================
  // UNIQUE DOCTORS
  // ======================================
  const uniqueDoctors = ["All", ...allDoctors.map((doctor) => doctor.name)];
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
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#030712] text-white p-6 md:p-10">
        {/* ======================================
            HEADER
        ====================================== */}

        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <CheckCircle2 className="text-green-400" />
              </div>

              <div>
                <h1 className="text-5xl font-black">Completed Records</h1>

                <p className="text-gray-400 mt-2">
                  Professional patient completion history
                </p>
              </div>
            </div>
          </div>

          {/* FILTERS */}

          <div className="flex flex-col lg:flex-row gap-4">
            {/* SEARCH */}

            <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-4 rounded-2xl backdrop-blur-xl">
              <Search size={20} className="text-gray-400" />

              <input
                type="text"
                placeholder="Search patient, phone, doctor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent outline-none text-white w-full"
              />
            </div>

            {/* DOCTOR FILTER */}

            <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-4 rounded-2xl backdrop-blur-xl">
              <Stethoscope size={20} className="text-cyan-400" />

              <select
                value={doctorFilter}
                onChange={(e) => setDoctorFilter(e.target.value)}
                className="bg-transparent outline-none text-white"
              >
                {uniqueDoctors.map((doctor, index) => (
                  <option key={index} value={doctor} className="bg-[#0B1120]">
                    {doctor}
                  </option>
                ))}
              </select>
            </div>

            {/* DATE FILTER */}

            <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-4 rounded-2xl backdrop-blur-xl">
              <CalendarDays size={20} className="text-green-400" />

              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="bg-transparent outline-none text-white"
              />
            </div>
          </div>
        </div>

        {/* ======================================
            STATS
        ====================================== */}

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-6 shadow-2xl">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-green-100">Total Completed</p>

                <h2 className="text-5xl font-black mt-4">{patients.length}</h2>
              </div>

              <CheckCircle2 size={34} />
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl p-6 shadow-2xl">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-cyan-100">Active Doctors</p>

                <h2 className="text-5xl font-black mt-4">
                  {uniqueDoctors.length - 1}
                </h2>
              </div>

              <Stethoscope size={34} />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl p-6 shadow-2xl">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-purple-100">Filtered Records</p>

                <h2 className="text-5xl font-black mt-4">
                  {filteredPatients.length}
                </h2>
              </div>

              <UserRound size={34} />
            </div>
          </div>
        </div>

        {/* ======================================
            TABLE
        ====================================== */}

        <div className="overflow-x-auto rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-xl">
          <table className="w-full min-w-[1700px]">
            <thead className="bg-white/10 border-b border-white/10">
              <tr>
                <th className="text-left px-6 py-5">ID</th>

                <th className="text-left px-6 py-5">Patient</th>

                <th className="text-left px-6 py-5">Phone</th>

                <th className="text-left px-6 py-5">Gender</th>

                <th className="text-left px-6 py-5">Address</th>

                <th className="text-left px-6 py-5">Description</th>

                <th className="text-left px-6 py-5">Doctor</th>

                <th className="text-left px-6 py-5">Ward</th>

                <th className="text-left px-6 py-5">Type</th>

                <th className="text-left px-6 py-5">Date</th>

                <th className="text-left px-6 py-5">Time</th>

                <th className="text-left px-6 py-5">Status</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="13" className="text-center py-20 text-gray-400">
                    Loading records...
                  </td>
                </tr>
              ) : filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-all"
                  >
                    {/* ID */}

                    <td className="px-6 py-6">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-bold">
                        {patient.recordId}
                      </div>
                    </td>

                    {/* PATIENT */}

                    <td className="px-6 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-2xl font-black shadow-xl">
                          {patient.name?.charAt(0)}
                        </div>

                        <div>
                          <h2 className="font-bold text-lg">{patient.name}</h2>

                          <p className="text-gray-400 text-sm">
                            Record #{patient.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* PHONE */}

                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2 text-cyan-400">
                        <Phone size={16} />

                        <span>{patient.phone}</span>
                      </div>
                    </td>
                    {/* GENDER */}

                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2 text-pink-400">
                        <span>{patient.gender}</span>
                      </div>
                    </td>

                    {/* ADDRESS */}

                    <td className="px-6 py-6">
                      <div className="flex items-start gap-2 text-gray-300 max-w-[250px]">
                        <MapPin size={16} />

                        <span className="line-clamp-3">{patient.address}</span>
                      </div>
                    </td>

                    {/* DESCRIPTION */}

                    <td className="px-6 py-6 max-w-[320px]">
                      <div className="flex items-start gap-2 text-gray-300">
                        <FileText size={16} />

                        <p className="line-clamp-4 whitespace-pre-line">
                          {patient.description || "No Description"}
                        </p>
                      </div>
                    </td>

                    {/* DOCTOR */}

                    <td className="px-6 py-6">
                      <div className="px-4 py-2 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 inline-flex">
                        {patient.doctor}
                      </div>
                    </td>

                    {/* WARD */}

                    <td className="px-6 py-6">
                      <div className="px-4 py-2 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 inline-flex">
                        {patient.wardType}
                      </div>
                    </td>

                    {/* TYPE */}

                    <td className="px-6 py-6">
                      <div className="px-4 py-2 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 inline-flex">
                        {patient.type}
                      </div>
                    </td>

                    {/* DATE */}

                    <td className="px-6 py-6">{patient.completedDate}</td>

                    {/* TIME */}

                    <td className="px-6 py-6">{patient.completedTime}</td>

                    {/* STATUS */}

                    <td className="px-6 py-6">
                      <div className="px-4 py-2 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400 inline-flex items-center gap-2">
                        <CheckCircle2 size={16} />

                        {patient.status}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="13" className="text-center py-20 text-gray-400">
                    No completed patient records found
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
