"use client";

import { useState, useEffect } from "react";

import Navbar from "../components/Navbar";

import {
  Stethoscope,
  Star,
  Mail,
  Clock3,
  MapPin,
  Search,
  Plus,
  X,
  Upload,
  Edit,
  Trash2,
} from "lucide-react";

export default function Doctors() {
  const [showForm, setShowForm] = useState(false);

  const [editingDoctor, setEditingDoctor] = useState(null);

  const [preview, setPreview] = useState("");

  const [search, setSearch] = useState("");

  const [doctors, setDoctors] = useState([]);

  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const [confirmBox, setConfirmBox] = useState({
    show: false,
    id: null,
  });

  const [newDoctor, setNewDoctor] = useState({
    name: "",
    department: "",
    experience: "",
    email: "",
    location: "",
    time: "",
    rating: "4.9",
    image: "",
  });

  // =========================
  // FETCH DOCTORS
  // =========================

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

      showToast("Unable to fetch doctors", "error");
    }
  };

  // =========================
  // TOAST
  // =========================

  const showToast = (message, type = "success") => {
    setToast({
      show: true,
      message,
      type,
    });

    setTimeout(() => {
      setToast({
        show: false,
        message: "",
        type: "success",
      });
    }, 3000);
  };

  // =========================
  // IMAGE UPLOAD
  // =========================

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast("Image size must be less than 2MB", "error");

      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setPreview(reader.result);

      setNewDoctor((prev) => ({
        ...prev,
        image: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  // =========================
  // EDIT DOCTOR
  // =========================

  const handleEditDoctor = (doctor) => {
    setEditingDoctor(doctor);

    setNewDoctor({
      name: doctor.name || "",
      department: doctor.department || "",
      experience: doctor.experience || "",
      email: doctor.email || "",
      location: doctor.location || "",
      time: doctor.time || "",
      rating: doctor.rating || "4.9",
      image: doctor.image || "",
    });

    setPreview(doctor.image || "");

    setShowForm(true);
  };

  // =========================
  // ADD / UPDATE
  // =========================

  const handleAddDoctor = async () => {
    try {
      setLoading(true);

      const method = editingDoctor ? "PUT" : "POST";

      const url = editingDoctor
        ? `/api/doctors/${editingDoctor.id}`
        : "/api/doctors";

      const res = await fetch(url, {
        method,

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(newDoctor),
      });

      const data = await res.json();

      if (!data.success) {
        showToast(data.message, "error");

        return;
      }

      await fetchDoctors();

      setPreview("");

      setEditingDoctor(null);

      setShowForm(false);

      setNewDoctor({
        name: "",
        department: "",
        experience: "",
        email: "",
        location: "",
        time: "",
        rating: "4.9",
        image: "",
      });

      showToast(
        editingDoctor
          ? "Doctor updated successfully"
          : "Doctor added successfully",
        "success",
      );
    } catch (error) {
      console.log(error);

      showToast("Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // DELETE
  // =========================

  const handleDeleteDoctor = (id) => {
    setConfirmBox({
      show: true,
      id,
    });
  };

  const confirmDeleteDoctor = async () => {
    try {
      const res = await fetch(`/api/doctors/${confirmBox.id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!data.success) {
        showToast(data.message, "error");

        return;
      }

      fetchDoctors();

      showToast("Doctor deleted successfully", "success");

      setConfirmBox({
        show: false,
        id: null,
      });
    } catch (error) {
      console.log(error);

      showToast("Unable to delete doctor", "error");
    }
  };

  // =========================
  // FILTER
  // =========================

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name?.toLowerCase().includes(search.toLowerCase()) ||
      doctor.department?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#030712] text-white p-6 md:p-10 relative overflow-hidden">
        {/* BG */}

        <div className="absolute top-0 left-0 w-[350px] h-[350px] bg-cyan-500/10 rounded-full blur-3xl"></div>

        <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-blue-600/10 rounded-full blur-3xl"></div>

        {/* HEADER */}

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
          <div>
            <h1 className="text-5xl font-black">Doctors Management</h1>

            <p className="text-gray-400 text-lg mt-3">
              Manage hospital doctors & specialists
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* SEARCH */}

            <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-4 rounded-2xl backdrop-blur-xl">
              <Search size={20} className="text-gray-400" />

              <input
                type="text"
                placeholder="Search doctors..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent outline-none text-white"
              />
            </div>

            {/* BUTTON */}

            <button
              onClick={() => {
                setEditingDoctor(null);

                setPreview("");

                setNewDoctor({
                  name: "",
                  department: "",
                  experience: "",
                  email: "",
                  location: "",
                  time: "",
                  rating: "4.9",
                  image: "",
                });

                setShowForm(true);
              }}
              className="flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-4 rounded-2xl font-semibold hover:scale-105 transition-all duration-300"
            >
              <Plus size={20} />
              Add Doctor
            </button>
          </div>
        </div>

        {/* GRID */}

        <div className="relative z-10 grid sm:grid-cols-2 2xl:grid-cols-3 gap-10">
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor) => (
              <div
                key={doctor.id}
                className="group relative bg-white/[0.04] border border-white/10 rounded-[36px] overflow-hidden backdrop-blur-2xl hover:border-cyan-400/40 transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_20px_80px_rgba(6,182,212,0.15)]"
              >
                {/* TOP IMAGE */}

                <div className="relative h-[360px] overflow-hidden">
                  <img
                    src={
                      doctor.image
                        ? doctor.image
                        : "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=1200&auto=format&fit=crop"
                    }
                    alt={doctor.name}
                    className="w-full h-full object-cover object-top group-hover:scale-110 transition-all duration-700"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=1200&auto=format&fit=crop";
                    }}
                  />

                  {/* OVERLAY */}

                  <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/30 to-transparent"></div>

                  {/* RATING */}

                  <div className="absolute top-5 right-5 bg-black/40 backdrop-blur-2xl border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-2">
                    <Star
                      size={16}
                      className="text-yellow-400 fill-yellow-400"
                    />

                    <span className="font-bold text-sm">
                      {doctor.rating || "4.9"}
                    </span>
                  </div>

                  {/* DEPARTMENT */}

                  <div className="absolute bottom-6 left-6">
                    <div className="bg-cyan-500/20 border border-cyan-400/20 backdrop-blur-2xl px-5 py-2 rounded-2xl">
                      <span className="text-cyan-300 text-sm font-bold tracking-wide uppercase">
                        {doctor.department}
                      </span>
                    </div>
                  </div>
                </div>

                {/* CONTENT */}

                <div className="p-8">
                  {/* NAME */}

                  <div className="mb-8">
                    <h2 className="text-3xl font-black leading-tight">
                      {doctor.name}
                    </h2>

                    <p className="text-gray-400 mt-3 text-lg">
                      {doctor.experience}
                    </p>
                  </div>

                  {/* DETAILS */}

                  <div className="space-y-4">
                    {/* TIME */}

                    <div className="flex items-center gap-4 bg-white/[0.03] border border-white/5 rounded-3xl px-5 py-5 hover:bg-white/[0.05] transition-all duration-300">
                      <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center">
                        <Clock3 className="text-cyan-400" />
                      </div>

                      <div>
                        <p className="text-gray-500 text-sm">Available Time</p>

                        <h3 className="font-bold text-lg">{doctor.time}</h3>
                      </div>
                    </div>

                    {/* LOCATION */}

                    <div className="flex items-center gap-4 bg-white/[0.03] border border-white/5 rounded-3xl px-5 py-5 hover:bg-white/[0.05] transition-all duration-300">
                      <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center">
                        <MapPin className="text-cyan-400" />
                      </div>

                      <div>
                        <p className="text-gray-500 text-sm">Location</p>

                        <h3 className="font-bold text-lg">{doctor.location}</h3>
                      </div>
                    </div>

                    {/* EMAIL */}

                    <div className="flex items-center gap-4 bg-white/[0.03] border border-white/5 rounded-3xl px-5 py-5 hover:bg-white/[0.05] transition-all duration-300">
                      <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center">
                        <Mail className="text-cyan-400" />
                      </div>

                      <div className="overflow-hidden">
                        <p className="text-gray-500 text-sm">Email Address</p>

                        <h3 className="font-bold text-base truncate max-w-[220px]">
                          {doctor.email}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* BUTTONS */}

                  <div className="grid grid-cols-2 gap-4 mt-8">
                    {/* EDIT */}

                    <button
                      onClick={() => handleEditDoctor(doctor)}
                      className="group/btn flex items-center justify-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-600 py-4 rounded-3xl font-bold text-lg hover:scale-[1.03] transition-all duration-300"
                    >
                      <Edit
                        size={20}
                        className="group-hover/btn rotate-12 transition-all duration-300"
                      />
                      Edit
                    </button>

                    {/* DELETE */}

                    <button
                      onClick={() => handleDeleteDoctor(doctor.id)}
                      className="group/btn flex items-center justify-center gap-3 bg-red-500/10 border border-red-500/20 py-4 rounded-3xl font-bold text-lg hover:bg-red-500 hover:text-white transition-all duration-300"
                    >
                      <Trash2
                        size={20}
                        className="group-hover/btn rotate-12 transition-all duration-300"
                      />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-32">
              <div className="w-32 h-32 rounded-full bg-cyan-500/10 flex items-center justify-center mb-8">
                <Stethoscope size={60} className="text-cyan-400" />
              </div>

              <h2 className="text-4xl font-black">No Doctors Found</h2>

              <p className="text-gray-400 text-lg mt-4">
                Add doctors or search with a different keyword
              </p>
            </div>
          )}
        </div>

        {/* MODAL */}

        {showForm && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-3xl bg-[#0B1120] border border-white/10 rounded-[32px] p-8 relative shadow-2xl overflow-y-auto max-h-[90vh]">
              {/* CLOSE */}

              <button
                onClick={() => {
                  setShowForm(false);

                  setEditingDoctor(null);
                }}
                className="absolute top-6 right-6 w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-red-500 transition-all duration-300"
              >
                <X size={22} />
              </button>

              {/* TITLE */}

              <div className="mb-10">
                <h2 className="text-4xl font-black">
                  {editingDoctor ? "Edit Doctor" : "Add New Doctor"}
                </h2>

                <p className="text-gray-400 mt-3">
                  Add or update doctor details
                </p>
              </div>

              {/* IMAGE */}

              <div className="mb-10">
                <label className="block text-sm font-semibold text-gray-300 mb-4">
                  Doctor Photo
                </label>

                <div className="flex items-center gap-6 flex-wrap">
                  <div className="w-36 h-36 rounded-3xl overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Stethoscope size={50} className="text-cyan-400" />
                    )}
                  </div>

                  <label className="cursor-pointer flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-4 rounded-2xl font-semibold hover:scale-105 transition-all duration-300">
                    <Upload size={20} />
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
              </div>

              {/* FORM */}

              <div className="grid md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Doctor Name"
                  value={newDoctor.name}
                  onChange={(e) =>
                    setNewDoctor({
                      ...newDoctor,
                      name: e.target.value,
                    })
                  }
                  className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-cyan-500"
                />

                <input
                  type="text"
                  placeholder="Department"
                  value={newDoctor.department}
                  onChange={(e) =>
                    setNewDoctor({
                      ...newDoctor,
                      department: e.target.value,
                    })
                  }
                  className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-cyan-500"
                />

                <input
                  type="text"
                  placeholder="Experience"
                  value={newDoctor.experience}
                  onChange={(e) =>
                    setNewDoctor({
                      ...newDoctor,
                      experience: e.target.value,
                    })
                  }
                  className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-cyan-500"
                />

                <input
                  type="email"
                  placeholder="Email"
                  value={newDoctor.email}
                  onChange={(e) =>
                    setNewDoctor({
                      ...newDoctor,
                      email: e.target.value,
                    })
                  }
                  className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-cyan-500"
                />

                <input
                  type="text"
                  placeholder="Location"
                  value={newDoctor.location}
                  onChange={(e) =>
                    setNewDoctor({
                      ...newDoctor,
                      location: e.target.value,
                    })
                  }
                  className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-cyan-500"
                />

                <input
                  type="text"
                  placeholder="Available Time"
                  value={newDoctor.time}
                  onChange={(e) =>
                    setNewDoctor({
                      ...newDoctor,
                      time: e.target.value,
                    })
                  }
                  className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-cyan-500"
                />
              </div>

              {/* SUBMIT */}

              <button
                onClick={handleAddDoctor}
                disabled={loading}
                className="w-full mt-8 bg-gradient-to-r from-cyan-500 to-blue-600 py-5 rounded-2xl font-bold text-lg hover:scale-[1.02] transition-all duration-300"
              >
                {loading
                  ? "Processing..."
                  : editingDoctor
                    ? "Update Doctor"
                    : "Add Doctor"}
              </button>
            </div>
          </div>
        )}

        {/* TOAST */}

        {toast.show && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200]">
            <div
              className={`px-6 py-5 rounded-3xl shadow-2xl border backdrop-blur-xl flex items-center gap-4 min-w-[320px]
              ${
                toast.type === "success"
                  ? "bg-green-500/20 border-green-500 text-green-300"
                  : "bg-red-500/20 border-red-500 text-red-300"
              }`}
            >
              <div className="text-3xl">
                {toast.type === "success" ? "✅" : "❌"}
              </div>

              <div>
                <h3 className="font-black text-lg capitalize">{toast.type}</h3>

                <p className="text-sm opacity-90">{toast.message}</p>
              </div>
            </div>
          </div>
        )}

        {/* CONFIRM */}

        {confirmBox.show && (
          <div className="fixed inset-0 bg-black/70 z-[300] flex items-center justify-center p-4">
            <div className="bg-[#0B1120] border border-white/10 rounded-[32px] p-8 w-full max-w-md">
              <h2 className="text-3xl font-black mb-4">Delete Doctor</h2>

              <p className="text-gray-400 mb-8">
                Are you sure you want to delete this doctor?
              </p>

              <div className="flex gap-4">
                <button
                  onClick={() =>
                    setConfirmBox({
                      show: false,
                      id: null,
                    })
                  }
                  className="flex-1 py-4 rounded-2xl bg-white/10 hover:bg-white/20 transition-all font-bold"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmDeleteDoctor}
                  className="flex-1 py-4 rounded-2xl bg-red-500 hover:bg-red-600 transition-all font-bold"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
