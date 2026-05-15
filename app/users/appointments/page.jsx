"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  CalendarDays,
  User,
  Phone,
  FileText,
  Stethoscope,
  Send,
  Bell,
  House,
  Mail,
  MapPin,
} from "lucide-react";

export default function AppointmentPage() {
  const router = useRouter();

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    patientName: "",
    phone: "",
    email: "",
    gender: "",
    address: "",
    doctor: "",
    date: "",
    symptoms: "",
  });

  // ==========================
  // FETCH DOCTORS
  // ==========================

  useEffect(() => {
    fetchDoctors();
  }, []);

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

  // ==========================
  // HANDLE INPUT
  // ==========================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  // ==========================
  // SUBMIT FORM
  // ==========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccess("");
    setError("");

    // VALIDATION

    if (
      !formData.patientName.trim() ||
      !formData.phone.trim() ||
      !formData.email.trim() ||
      !formData.gender.trim() ||
      !formData.address.trim() ||
      !formData.doctor.trim() ||
      !formData.date.trim() ||
      !formData.symptoms.trim()
    ) {
      setError("All fields are required");

      return;
    }

    // EMAIL VALIDATION

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
      setError("Enter valid email address");

      return;
    }

    // PHONE VALIDATION

    if (formData.phone.length !== 10) {
      setError("Phone number must be 10 digits");

      return;
    }

    setLoading(true);

    try {
      // LOGIN CHECK
      const userData = localStorage.getItem("user");

      if (!userData) {
        setError("Please login first");

        setLoading(false);

        router.push("/login");

        return;
      }

      const user = JSON.parse(userData);

      // SEND DATA
      const updatedData = {
        ...formData,
        userEmail: user.email,
      };

      const res = await fetch("/api/appointments", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(updatedData),
      });

      const data = await res.json();

      // API ERROR
      if (!data.success) {
        setError(data.message || "Failed to book appointment");

        setLoading(false);

        return;
      }

      // SUCCESS
      setSuccess("Appointment Booked Successfully");

      // RESET FORM
      setFormData({
        patientName: "",
        phone: "",
        email: "",
        gender: "",
        address: "",
        doctor: "",
        date: "",
        symptoms: "",
      });
      // REDIRECT
      setTimeout(() => {
        router.push("/users/notifications");
      }, 1500);
    } catch (error) {
      console.log(error);

      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white p-6 md:p-10 relative overflow-hidden">
      {/* GLOW */}
      <div className="absolute top-0 left-0 w-[350px] h-[350px] bg-cyan-500/10 rounded-full blur-3xl"></div>

      <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-blue-600/10 rounded-full blur-3xl"></div>

      {/* HEADER */}
      <div className="relative z-10 mb-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* LEFT */}
        <div>
          <h1 className="text-5xl font-black">Book Appointment</h1>

          <p className="text-gray-400 text-lg mt-3">
            Schedule your doctor consultation
          </p>
        </div>

        {/* RIGHT BUTTONS */}
        <div className="flex items-center gap-4">
          {/* DASHBOARD */}
          <button
            onClick={() => router.push("/users/dashboard")}
            className="group relative overflow-hidden bg-gradient-to-r from-cyan-500 to-blue-600 p-[2px] rounded-2xl shadow-xl shadow-cyan-500/20 hover:scale-105 transition-all duration-300"
          >
            <div className="flex items-center gap-3 bg-[#030712] px-6 py-4 rounded-2xl group-hover:bg-transparent transition-all duration-300">
              <House
                size={22}
                className="text-cyan-400 group-hover:text-white"
              />

              <span className="font-bold">Dashboard</span>
            </div>
          </button>

          {/* NOTIFICATIONS */}
          <button
            onClick={() => router.push("/users/notifications")}
            className="group relative overflow-hidden bg-gradient-to-r from-cyan-500 to-blue-600 p-[2px] rounded-2xl shadow-xl shadow-cyan-500/20 hover:scale-105 transition-all duration-300"
          >
            <div className="flex items-center gap-3 bg-[#030712] px-6 py-4 rounded-2xl group-hover:bg-transparent transition-all duration-300">
              <Bell
                size={22}
                className="text-cyan-400 group-hover:text-white"
              />

              <span className="font-bold">Notifications</span>
            </div>
          </button>
        </div>
      </div>

      {/* FORM CARD */}
      <div className="relative z-10 max-w-5xl mx-auto bg-white/5 border border-white/10 rounded-[32px] backdrop-blur-xl p-8 md:p-10 shadow-2xl">
        {/* SUCCESS MESSAGE */}
        {success && (
          <div className="mb-6 bg-green-500/10 border border-green-500/20 text-green-400 px-5 py-4 rounded-2xl font-semibold">
            {success}
          </div>
        )}

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 px-5 py-4 rounded-2xl font-semibold">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
          {/* PATIENT NAME */}
          <div>
            <label className="block text-sm text-gray-400 mb-3">
              Patient Name
            </label>

            <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-4 rounded-2xl">
              <User size={20} className="text-cyan-400" />

              <input
                type="text"
                name="patientName"
                placeholder="Enter patient name"
                value={formData.patientName}
                onChange={handleChange}
                required
                className="bg-transparent outline-none w-full text-white placeholder:text-gray-500"
              />
            </div>
          </div>

          {/* PHONE */}
          <div>
            <label className="block text-sm text-gray-400 mb-3">
              Phone Number
            </label>

            <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <div className="px-5 text-cyan-400 font-semibold border-r border-white/10">
                +91
              </div>

              <div className="flex items-center gap-3 px-5 py-4 w-full">
                <Phone size={20} className="text-cyan-400" />

                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter 10 digit number"
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
                  required
                  maxLength={10}
                  className="bg-transparent outline-none w-full text-white placeholder:text-gray-500"
                />
              </div>
            </div>
          </div>
          {/* EMAIL */}
          <div>
            <label className="block text-sm text-gray-400 mb-3">
              Email Address
            </label>

            <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-4 rounded-2xl">
              <Mail size={20} className="text-cyan-400" />

              <input
                type="email"
                name="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-transparent outline-none w-full text-white placeholder:text-gray-500"
              />
            </div>
          </div>

          {/* GENDER */}
          <div>
            <label className="block text-sm text-gray-400 mb-3">Gender</label>

            <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-4 rounded-2xl">
              <User size={20} className="text-cyan-400" />

              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="bg-transparent outline-none w-full text-white"
              >
                <option value="" className="bg-black">
                  Select Gender
                </option>

                <option value="Male" className="bg-black">
                  Male
                </option>

                <option value="Female" className="bg-black">
                  Female
                </option>

                <option value="Other" className="bg-black">
                  Other
                </option>
              </select>
            </div>
          </div>
          {/* ADDRESS */}
          <div>
            <label className="block text-sm text-gray-400 mb-3">Address</label>

            <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-4 rounded-2xl">
              <MapPin size={20} className="text-cyan-400" />

              <input
                type="text"
                name="address"
                placeholder="Enter address"
                value={formData.address}
                onChange={handleChange}
                required
                className="bg-transparent outline-none w-full text-white placeholder:text-gray-500"
              />
            </div>
          </div>

          {/* DOCTOR */}
          <div>
            <label className="block text-sm text-gray-400 mb-3">
              Select Doctor
            </label>

            <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-4 rounded-2xl">
              <Stethoscope size={20} className="text-cyan-400" />

              <select
                name="doctor"
                value={formData.doctor}
                onChange={handleChange}
                required
                className="bg-transparent outline-none w-full text-white"
              >
                <option value="" className="bg-black">
                  Select Doctor
                </option>

                {doctors.map((doctor) => (
                  <option
                    key={doctor.id}
                    value={doctor.name}
                    className="bg-black"
                  >
                    {doctor.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* DATE */}
          <div>
            <label className="block text-sm text-gray-400 mb-3">
              Appointment Date
            </label>

            <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-4 rounded-2xl">
              <CalendarDays size={20} className="text-cyan-400" />

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                required
                className="bg-transparent outline-none w-full text-white"
              />
            </div>
          </div>

          {/* SYMPTOMS */}
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-400 mb-3">
              Symptoms / Notes
            </label>

            <div className="flex gap-3 bg-white/5 border border-white/10 px-5 py-4 rounded-2xl">
              <FileText size={20} className="text-cyan-400 mt-1" />

              <textarea
                rows="5"
                name="symptoms"
                placeholder="Describe symptoms..."
                value={formData.symptoms}
                onChange={handleChange}
                required
                className="bg-transparent outline-none w-full text-white placeholder:text-gray-500 resize-none"
              ></textarea>
            </div>
          </div>

          {/* BUTTON */}
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-600 py-5 rounded-2xl font-bold text-lg hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-cyan-500/20"
            >
              <Send size={22} />

              {loading ? "Booking..." : "Book Appointment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
