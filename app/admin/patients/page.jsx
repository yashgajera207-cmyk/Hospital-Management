"use client";

import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import Navbar from "../components/Navbar";

import {
  Search,
  UserRound,
  HeartPulse,
  Trash2,
  Activity,
  Eye,
  Stethoscope,
  Plus,
} from "lucide-react";

export default function Patients() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const [doctorFilter, setDoctorFilter] = useState("All");

  const [selectedPatient, setSelectedPatient] = useState(null);

  const [showForm, setShowForm] = useState(false);

  const [patients, setPatients] = useState([]);

  const [doctors, setDoctors] = useState([]);

  // FORM

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    gender: "",
    address: "",
    description: "",
    doctor: "",
    wardType: "General",
  });

  // ==========================
  // LOAD PATIENTS
  // ==========================

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch("/api/patients");

        const data = await res.json();

        if (data.success) {
          const formattedPatients = data.patients.map((patient) => ({
            id: patient.id,

            name: patient.name,

            phone: patient.phone,

            gender: patient.gender,

            email: patient.email,

            address: patient.address,

            description: patient.description || "",

            doctor: patient.doctor,

            wardType: patient.ward_type,

            status: patient.status || "Admitted",
          }));

          setPatients(formattedPatients);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchPatients();
  }, []);

  // ==========================
  // LOAD DOCTORS
  // ==========================

  useEffect(() => {
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

    fetchDoctors();
  }, []);

  // ==========================
  // FILTER
  // ==========================

  const filteredPatients = patients.filter((patient) => {
    const matchSearch =
      patient.name?.toLowerCase().includes(search.toLowerCase()) ||
      patient.phone?.toLowerCase().includes(search.toLowerCase()) ||
      patient.doctor?.toLowerCase().includes(search.toLowerCase());

    const matchDoctor =
      doctorFilter === "All" ? true : patient.doctor === doctorFilter;

    return matchSearch && matchDoctor;
  });

  // ==========================
  // STATS
  // ==========================

  const successfulTreatments = patients.filter(
    (p) => p.status === "Recovering",
  ).length;

  const successPercentage =
    patients.length > 0
      ? Math.round((successfulTreatments / patients.length) * 100)
      : 0;

  // ==========================
  // UPDATE STATUS
  // ==========================

  const updateStatus = (id, value) => {
    const updatedPatients = patients.map((patient) =>
      patient.id === id
        ? {
            ...patient,
            status: value,
          }
        : patient,
    );

    setPatients(updatedPatients);
  };

  // ==========================
  // DELETE
  // ==========================

  const deletePatient = async (id) => {
    try {
      const res = await fetch(`/api/patients/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message || "Unable to delete patient");

        return;
      }

      const updatedPatients = patients.filter((patient) => patient.id !== id);

      setPatients(updatedPatients);

      toast.success("Patient deleted successfully");
    } catch (error) {
      console.log(error);

     toast.warning("All fields are required");
    }
  };
  // ==========================
  // COMPLETE PATIENT
  // ==========================

  const completePatient = async (patient) => {
    try {
      // Current Date & Time

      const currentDate = new Date();

      const completedDate = currentDate.toLocaleDateString();

      const completedTime = currentDate.toLocaleTimeString();

      // ==========================
      // SAVE INTO DATABASE
      // ==========================

      const completedRes = await fetch("/api/completed-records", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          record_id: patient.id,

          name: patient.name,

          phone: patient.phone,

          email: patient.email,

          gender: patient.gender,

          address: patient.address,

          description: patient.description,

          doctor: patient.doctor,

          ward_type: patient.wardType,

          status: "Completed",

          type: "Patient",

          completed_date: completedDate,

          completed_time: completedTime,
        }),
      });

      const completedData = await completedRes.json();

      if (!completedData.success) {
       toast.error("Unable to save completed record");

        return;
      }

      // ==========================
      // DELETE FROM PATIENT TABLE
      // ==========================

      const deleteRes = await fetch(`/api/patients/${patient.id}`, {
        method: "DELETE",
      });

      const deleteData = await deleteRes.json();

      if (!deleteData.success) {
        toast.error("Unable to delete patient");

        return;
      }

      // ==========================
      // REMOVE FROM UI
      // ==========================

      const updatedPatients = patients.filter((p) => p.id !== patient.id);

      setPatients(updatedPatients);

      toast.success("Patient completed successfully");
    } catch (error) {
      console.log(error);

      toast.error("Server error");
    }
  };
  // ==========================
  // ADD PATIENT
  // ==========================

  const addPatient = async () => {
    try {
      if (
        !formData.name ||
        !formData.phone ||
        !formData.email ||
        !formData.gender ||
        !formData.address ||
        !formData.description ||
        !formData.doctor
      ) {
        toast.warning("All fields are required");

        return;
      }

      if (formData.phone.length !== 10) {
        toast.warning("Mobile number must be 10 digits");

        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(formData.email)) {
        toast.warning("Enter valid email address");

        return;
      }

      const res = await fetch("/api/patients", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name: formData.name,

          phone: `+91${formData.phone}`,

          email: formData.email,

          gender: formData.gender,

          address: formData.address,

          description: formData.description,

          doctor: formData.doctor,

          wardType: formData.wardType,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error(data.message || "Unable to add patient");

        return;
      }

      const newPatient = {
        id: data.patient?.id || Math.floor(Math.random() * 100000),

        ...formData,

        phone: `+91${formData.phone}`,
        gender: formData.gender,
        description: formData.description,
        status: "Admitted",
      };

      setPatients([newPatient, ...patients]);

      setFormData({
        name: "",
        phone: "",
        email: "",
        gender: "",
        address: "",
        description: "",
        doctor: "",
        wardType: "General",
      });

      setShowForm(false);

      toast.success("Patient added successfully");
    } catch (error) {
      console.log(error);

      toast.error("Server error");
    }
  };
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#030712] text-white p-6 md:p-10">
        {/* HEADER */}

        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-10">
          <div>
            <h1 className="text-5xl font-black">Patients Management</h1>

            <p className="text-gray-400 mt-3">
              Manage hospital patients & records
            </p>
          </div>

          {/* RIGHT */}

          <div className="flex flex-col sm:flex-row gap-4">
            {/* SEARCH */}

            <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-4 rounded-2xl">
              <Search size={20} className="text-gray-400" />

              <input
                type="text"
                placeholder="Search patient..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent outline-none text-white"
              />
            </div>

            {/* FILTER */}

            <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-4 rounded-2xl">
              <Stethoscope size={20} className="text-cyan-400" />

              <select
                value={doctorFilter}
                onChange={(e) => setDoctorFilter(e.target.value)}
                className="bg-transparent outline-none text-white"
              >
                <option className="bg-[#0B1120]">All</option>

                {doctors.map((doctor, index) => (
                  <option
                    key={index}
                    value={doctor.name}
                    className="bg-[#0B1120]"
                  >
                    {doctor.name}
                  </option>
                ))}
              </select>
            </div>

            {/* ADD BUTTON */}

            <div className="flex gap-4">
              {/* COMPLETE PATIENT PAGE BUTTON */}

              <button
                onClick={() => router.push("/admin/completed")}
                className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4 rounded-2xl font-bold flex items-center gap-3 hover:scale-105 transition-all duration-300 shadow-lg"
              >
                <Activity size={20} />
                View Complete Patients
              </button>

              {/* ADD PATIENT BUTTON */}

              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-4 rounded-2xl font-bold flex items-center gap-3 hover:scale-105 transition-all duration-300 shadow-lg"
              >
                <Plus size={20} />
                Add Patient
              </button>
            </div>
          </div>
        </div>

        {/* FORM */}

        {showForm && (
          <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 mb-10">
            <h2 className="text-3xl font-black mb-8">Add New Patient</h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* NAME */}

              <input
                type="text"
                placeholder="Patient Name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
                className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none text-white"
              />

              {/* PHONE */}

              <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="px-5 text-cyan-400 font-semibold border-r border-white/10">
                  +91
                </div>

                <input
                  type="tel"
                  placeholder="Enter 10 digit number"
                  required
                  maxLength={10}
                  value={formData.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");

                    if (value.length <= 10) {
                      setFormData({
                        ...formData,
                        phone: value,
                      });
                    }
                  }}
                  className="bg-transparent px-5 py-4 outline-none text-white w-full"
                />
              </div>

              {/* EMAIL */}

              <input
                type="email"
                placeholder="Email Address"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value,
                  })
                }
                className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none text-white"
              />

              {/* GENDER */}

              <select
                required
                value={formData.gender}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    gender: e.target.value,
                  })
                }
                className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none text-white"
              >
                <option value="" className="bg-[#0B1120]">
                  Select Gender
                </option>

                <option value="Male" className="bg-[#0B1120]">
                  Male
                </option>

                <option value="Female" className="bg-[#0B1120]">
                  Female
                </option>

                <option value="Other" className="bg-[#0B1120]">
                  Other
                </option>
              </select>

              {/* ADDRESS */}

              <input
                type="text"
                placeholder="Address"
                required
                value={formData.address}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: e.target.value,
                  })
                }
                className="md:col-span-2 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none text-white"
              />

              {/* DESCRIPTION */}

              <textarea
                placeholder="Patient Description"
                required
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
                className="md:col-span-2 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none text-white min-h-[140px]"
              ></textarea>

              {/* DOCTOR */}

              <select
                required
                value={formData.doctor}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    doctor: e.target.value,
                  })
                }
                className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none text-white"
              >
                <option value="" className="bg-[#0B1120]">
                  Select Doctor
                </option>

                {doctors.map((doctor, index) => (
                  <option
                    key={index}
                    value={doctor.name}
                    className="bg-[#0B1120]"
                  >
                    {doctor.name}
                  </option>
                ))}
              </select>

              {/* WARD */}

              <select
                required
                value={formData.wardType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    wardType: e.target.value,
                  })
                }
                className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none text-white"
              >
                <option value="General" className="bg-[#0B1120]">
                  General
                </option>

                <option value="ICU" className="bg-[#0B1120]">
                  ICU
                </option>

                <option value="Private" className="bg-[#0B1120]">
                  Private
                </option>
              </select>
            </div>
            <button
              onClick={addPatient}
              className="mt-8 bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 rounded-2xl font-bold"
            >
              Save Patient
            </button>
          </div>
        )}

        {/* STATS */}

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl p-6">
            <div className="flex justify-between">
              <div>
                <p>Total Patients</p>

                <h2 className="text-5xl font-black mt-4">{patients.length}</h2>
              </div>

              <UserRound size={30} />
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-3xl p-6">
            <div className="flex justify-between">
              <div>
                <p>Critical Cases</p>

                <h2 className="text-5xl font-black mt-4">
                  {patients.filter((p) => p.status === "Critical").length}
                </h2>
              </div>

              <HeartPulse size={30} />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-6">
            <div className="flex justify-between">
              <div>
                <p>Successful Treatments</p>

                <h2 className="text-5xl font-black mt-4">
                  {successPercentage}%
                </h2>
              </div>

              <Activity size={30} />
            </div>
          </div>
        </div>

        {/* PATIENTS */}

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredPatients.map((patient) => (
            <div
              key={patient.id}
              className="bg-white/5 border border-white/10 rounded-[32px] p-7 backdrop-blur-xl hover:border-cyan-500/30 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-24 h-24 rounded-[28px] bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-4xl font-black shadow-2xl shadow-cyan-500/20">
                  {patient.name?.charAt(0)}
                </div>

                <div className="px-4 py-2 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/20">
                  {patient.status}
                </div>
              </div>

              <h2 className="text-3xl font-black">{patient.name}</h2>

              <p className="text-cyan-400 mt-3">{patient.phone}</p>
              <p className="text-pink-200 mt-2 text-lg">{patient.gender}</p>

              <p className="text-gray-400 mt-2 break-all">{patient.email}</p>

              <p className="text-gray-500 mt-2 line-clamp-2">
                {patient.address}
              </p>

              <div className="flex flex-wrap gap-3 mt-5">
                <div className="px-4 py-2 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                  {patient.doctor}
                </div>

                <div className="px-4 py-2 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                  {patient.wardType}
                </div>
              </div>

              <div className="flex flex-col gap-4 mt-8">
                <button
                  onClick={() => setSelectedPatient(patient)}
                  className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-600 py-4 rounded-2xl font-semibold hover:scale-[1.02] transition-all"
                >
                  <Eye size={18} />
                  View Patient Details
                </button>

                <div className="flex gap-4">
                  <select
                    value={patient.status}
                    onChange={(e) => updateStatus(patient.id, e.target.value)}
                    className="flex-1 px-4 py-4 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 outline-none"
                  >
                    <option className="bg-[#0B1120]">Admitted</option>

                    <option className="bg-[#0B1120]">Recovering</option>

                    <option className="bg-[#0B1120]">Critical</option>

                    <option className="bg-[#0B1120]">Stable</option>
                  </select>

                  {/* COMPLETE BUTTON */}

                  <button
                    onClick={async () => await completePatient(patient)}
                    className="px-5 py-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500 hover:text-white transition-all font-semibold"
                  >
                    Complete
                  </button>

                  <button
                    onClick={() => deletePatient(patient.id)}
                    className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                  >
                    <Trash2 size={22} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* MODAL */}

        {selectedPatient && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-3xl bg-[#0B1120] border border-white/10 rounded-[40px] overflow-hidden shadow-2xl">
              {/* HEADER */}

              <div className="relative bg-gradient-to-r from-cyan-500 to-blue-600 p-10">
                <button
                  onClick={() => setSelectedPatient(null)}
                  className="absolute top-5 right-5 w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 transition-all text-white text-2xl"
                >
                  ×
                </button>

                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="w-36 h-36 rounded-[32px] bg-white/10 backdrop-blur-xl flex items-center justify-center text-6xl font-black border border-white/20">
                    {selectedPatient.name?.charAt(0)}
                  </div>

                  <div>
                    <h2 className="text-5xl font-black text-white">
                      {selectedPatient.name}
                    </h2>

                    <p className="text-cyan-100 mt-3 text-xl">
                      {selectedPatient.phone}
                    </p>
                    <p className="text-pink-200 mt-2 text-lg">
                      {selectedPatient.gender}
                    </p>
                    <div className="flex flex-wrap gap-3 mt-5">
                      <div className="px-5 py-2 rounded-2xl bg-white/10 border border-white/20 text-white">
                        {selectedPatient.doctor}
                      </div>

                      <div className="px-5 py-2 rounded-2xl bg-purple-500/20 border border-purple-400/20 text-purple-200">
                        {selectedPatient.wardType}
                      </div>

                      <div className="px-5 py-2 rounded-2xl bg-green-500/20 border border-green-400/20 text-green-200">
                        {selectedPatient.status}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* BODY */}

              <div className="p-10 grid md:grid-cols-2 gap-8">
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                  <p className="text-gray-400 text-sm mb-2">Email Address</p>

                  <h3 className="text-xl font-semibold break-all">
                    {selectedPatient.email}
                  </h3>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                  <p className="text-gray-400 text-sm mb-2">Phone Number</p>

                  <h3 className="text-xl font-semibold">
                    {selectedPatient.phone}
                  </h3>
                </div>

                <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-6">
                  <p className="text-gray-400 text-sm mb-2">Address</p>

                  <h3 className="text-xl font-semibold text-gray-200 leading-relaxed">
                    {selectedPatient.address}
                  </h3>
                </div>

                {/* DESCRIPTION */}

                <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-6">
                  <p className="text-gray-400 text-sm mb-2">Description</p>

                  <h3 className="text-xl font-semibold text-gray-200 leading-relaxed whitespace-pre-line">
                    {selectedPatient.description || "No Description"}
                  </h3>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
