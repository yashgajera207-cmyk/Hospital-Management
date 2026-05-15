"use client";

import { useState, useEffect } from "react";

import Navbar from "../components/Navbar";

import {
  CalendarDays,
  Stethoscope,
  Search,
  Trash2,
  CheckCircle2,
  XCircle,
  BadgeCheck,
  Eye,
  Phone,
  Mail,
  MapPin,
  FileText,
  Clock3,
  VenusAndMars,
} from "lucide-react";

import { useRouter } from "next/navigation";

export default function AppointmentsPage() {
  const router = useRouter();

  const [search, setSearch] = useState("");

  const [appointments, setAppointments] = useState([]);

  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const [appointmentTimes, setAppointmentTimes] = useState({});

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const [confirmBox, setConfirmBox] = useState({
    show: false,
    message: "",
    onConfirm: null,
  });

  const [recoveryModal, setRecoveryModal] = useState({
    show: false,
    appointment: null,
    score: "",
  });

  // ==========================
  // FETCH APPOINTMENTS
  // ==========================

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await fetch("/api/appointments");

      const data = await res.json();

      if (data.success) {
        setAppointments(data.appointments || []);
      }
    } catch (error) {
      console.log(error);

      showToast("Unable to load appointments", "error");
    }
  };

  // ==========================
  // TOAST
  // ==========================

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

  // ==========================
  // FORMAT TIME
  // ==========================

  const formatTime = (time) => {
    if (!time) return "Not Assigned";

    const [hours, minutes] = time.split(":");

    let hour = parseInt(hours);

    const ampm = hour >= 12 ? "PM" : "AM";

    hour = hour % 12;

    hour = hour ? hour : 12;

    return `${hour}:${minutes} ${ampm}`;
  };

  // ==========================
  // FILTER APPOINTMENTS
  // ==========================

  const filteredAppointments = appointments.filter((appointment) =>
    appointment.patient_name?.toLowerCase().includes(search.toLowerCase()),
  );

  // ==========================
  // HANDLE TIME CHANGE
  // ==========================

  const handleTimeChange = (id, value) => {
    setAppointmentTimes({
      ...appointmentTimes,
      [id]: value,
    });
  };

  // ==========================
  // UPDATE STATUS
  // ==========================

  const updateStatus = async (id, status) => {
    try {
      const appointment = appointments.find((item) => item.id === id);

      const selectedTime = appointmentTimes[id] || appointment.appointment_time;

      // ==========================
      // REJECT PATIENT
      // ==========================

      if (status === "Rejected") {
        // ADD TO COMPLETED TABLE

        const completedResponse = await fetch("/api/completed-appointments", {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            patient_name: appointment.patient_name,

            doctor_name: appointment.doctor_name,

            gender: appointment.gender,

            phone: appointment.phone,

            email: appointment.email,

            address: appointment.address,

            appointment_date: appointment.appointment_date,

            symptoms: appointment.symptoms,

            health_score: 0,

            status: "Rejected",
          }),
        });

        const completedData = await completedResponse.json();

        if (!completedData.success) {
          showToast("Unable to reject patient", "error");

          return;
        }

        // DELETE FROM APPOINTMENTS

        const deleteResponse = await fetch(`/api/appointments/${id}`, {
          method: "DELETE",
        });

        const deleteData = await deleteResponse.json();

        if (!deleteData.success) {
          showToast("Unable to remove appointment", "error");

          return;
        }

        // UPDATE UI

        setAppointments((prev) => prev.filter((item) => item.id !== id));

        showToast("Patient rejected successfully", "success");

        return;
      }

      // ==========================
      // ACCEPT PATIENT
      // ==========================

      if (!selectedTime) {
        showToast("Please assign appointment time", "warning");

        return;
      }

      const res = await fetch(`/api/appointments/${id}`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          status,

          appointment_date: appointment.appointment_date,

          appointment_time: selectedTime,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        showToast("Unable to update status", "error");

        return;
      }

      showToast(`Appointment ${status} successfully`, "success");

      fetchAppointments();
    } catch (error) {
      console.log(error);

      showToast("Something went wrong", "error");
    }
  };

  // ==========================
  // DELETE APPOINTMENT
  // ==========================

  const deleteAppointment = async (id) => {
    try {
      setConfirmBox({
        show: true,

        message: "Are you sure you want to delete this appointment?",

        onConfirm: async () => {
          const res = await fetch(`/api/appointments/${id}`, {
            method: "DELETE",
          });

          const data = await res.json();

          if (!data.success) {
            showToast("Unable to delete appointment", "error");

            return;
          }

          setAppointments((prev) => prev.filter((item) => item.id !== id));

          showToast("Appointment deleted successfully", "success");

          setConfirmBox({
            show: false,
            message: "",
            onConfirm: null,
          });
        },
      });
    } catch (error) {
      console.log(error);

      showToast("Unable to delete appointment", "error");
    }
  };

  // ==========================
  // COMPLETE PATIENT
  // ==========================

  const completePatient = async (appointment, healthScore) => {
    try {
      // ==========================
      // ADD TO COMPLETED TABLE
      // ==========================

      const completedResponse = await fetch("/api/completed-appointments", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          patient_name: appointment.patient_name,

          doctor_name: appointment.doctor_name,

          gender: appointment.gender,

          phone: appointment.phone,

          email: appointment.email,

          address: appointment.address,

          appointment_date: appointment.appointment_date,

          symptoms: appointment.symptoms,

          health_score: healthScore,

          status: "Completed",
        }),
      });

      const completedData = await completedResponse.json();

      if (!completedData.success) {
        showToast("Unable to complete treatment", "error");

        return;
      }

      // ==========================
      // DELETE FROM APPOINTMENTS
      // ==========================

      const deleteResponse = await fetch(
        `/api/appointments/${appointment.id}`,
        {
          method: "DELETE",
        },
      );

      const deleteData = await deleteResponse.json();

      if (!deleteData.success) {
        showToast("Unable to remove appointment", "error");

        return;
      }

      // ==========================
      // UPDATE UI
      // ==========================

      setAppointments((prev) =>
        prev.filter((item) => item.id !== appointment.id),
      );

      showToast(
        `${appointment.patient_name} treatment completed successfully`,
        "success",
      );

      setRecoveryModal({
        show: false,
        appointment: null,
        score: "",
      });

      router.push("/admin/completed-appointments");
    } catch (error) {
      console.log(error);

      showToast("Something went wrong", "error");
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#030712] text-white p-6 md:p-10">
        {/* HEADER */}

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
          <div>
            <h1 className="text-5xl font-black">Appointments</h1>

            <p className="text-gray-400 mt-3">Manage all appointments</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => router.push("/admin/completed-appointments")}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-4 rounded-2xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg"
            >
              View Completed Appointments
            </button>

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
          </div>
        </div>

        {/* CARDS */}

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-white/5 border border-white/10 rounded-[32px] p-7 backdrop-blur-xl hover:border-cyan-500/40 transition-all duration-300"
            >
              <h2 className="text-3xl font-black mb-6">
                {appointment.patient_name}
              </h2>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Stethoscope className="text-cyan-400" />

                  <span>{appointment.doctor_name}</span>
                </div>

                <div className="flex items-center gap-3">
                  <VenusAndMars className="text-pink-400" />

                  <span>{appointment.gender}</span>
                </div>

                <div className="flex items-center gap-3">
                  <CalendarDays className="text-purple-400" />

                  <span>{formatDate(appointment.appointment_date)}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Clock3 className="text-green-400" />

                  <span>{formatTime(appointment.appointment_time)}</span>
                </div>
              </div>

              {/* TIME */}

              <div className="mt-5">
                <label className="block text-sm text-gray-400 mb-2">
                  Set Appointment Time
                </label>

                <input
                  type="time"
                  value={
                    appointmentTimes[appointment.id] ||
                    appointment.appointment_time ||
                    ""
                  }
                  onChange={(e) =>
                    handleTimeChange(appointment.id, e.target.value)
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 outline-none text-white"
                />
              </div>

              {/* STATUS */}

              <div className="mt-6">
                <span className="px-4 py-2 rounded-2xl text-sm font-bold bg-yellow-500/20 text-yellow-400">
                  {appointment.status || "Pending"}
                </span>
              </div>

              {/* BUTTONS */}

              <div className="grid grid-cols-5 gap-3 mt-8">
                {/* VIEW */}

                <button
                  onClick={() => setSelectedAppointment(appointment)}
                  className="bg-blue-500/20 py-4 rounded-2xl flex items-center justify-center hover:bg-blue-500 transition-all"
                >
                  <Eye size={18} />
                </button>

                {/* ACCEPT */}

                <button
                  onClick={() => updateStatus(appointment.id, "Accepted")}
                  className="bg-green-500/20 py-4 rounded-2xl flex items-center justify-center hover:bg-green-500 transition-all"
                >
                  <CheckCircle2 size={18} />
                </button>

                {/* REJECT */}

                <button
                  onClick={() => updateStatus(appointment.id, "Rejected")}
                  className="bg-red-500/20 py-4 rounded-2xl flex items-center justify-center hover:bg-red-500 transition-all"
                >
                  <XCircle size={18} />
                </button>

                {/* COMPLETE */}

                <button
                  onClick={() =>
                    setRecoveryModal({
                      show: true,
                      appointment,
                      score: "",
                    })
                  }
                  className="bg-purple-500 py-4 rounded-2xl flex items-center justify-center hover:bg-purple-600 transition-all"
                >
                  <BadgeCheck size={18} />
                </button>

                {/* DELETE */}

                <button
                  onClick={() => deleteAppointment(appointment.id)}
                  className="bg-red-600/20 py-4 rounded-2xl flex items-center justify-center hover:bg-red-600 transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* DETAILS MODAL */}

        {selectedAppointment && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-[#111827] w-full max-w-2xl rounded-[32px] p-8 border border-white/10">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-black">Patient Details</h2>

                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="bg-red-500 px-4 py-2 rounded-xl hover:bg-red-600 transition-all"
                >
                  Close
                </button>
              </div>

              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <Phone className="text-cyan-400" />

                  <span>Phone : {selectedAppointment.phone}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="text-green-400" />

                  <span>Email : {selectedAppointment.email}</span>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="text-red-400" />

                  <span>Address : {selectedAppointment.address}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Stethoscope className="text-purple-400" />

                  <span>Doctor : {selectedAppointment.doctor_name}</span>
                </div>

                <div className="flex items-center gap-3">
                  <CalendarDays className="text-yellow-400" />

                  <span>
                    Date : {formatDate(selectedAppointment.appointment_date)}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <VenusAndMars className="text-pink-400" />

                  <span>Gender : {selectedAppointment.gender}</span>
                </div>

                <div className="flex items-start gap-3">
                  <FileText className="text-pink-400 mt-1" />

                  <span>Symptoms : {selectedAppointment.symptoms}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* EMPTY */}

        {filteredAppointments.length === 0 && (
          <div className="text-center py-20">
            <h2 className="text-3xl font-bold text-gray-400">
              No Appointments Found
            </h2>
          </div>
        )}

        {/* RECOVERY MODAL */}

        {recoveryModal.show && (
          <div className="fixed inset-0 bg-black/70 z-[120] flex items-center justify-center p-4">
            <div className="bg-[#111827] border border-white/10 rounded-[32px] p-8 w-full max-w-md shadow-2xl">
              <h2 className="text-3xl font-black mb-3">Complete Treatment</h2>

              <p className="text-gray-400 mb-6">
                Enter patient recovery percentage
              </p>

              <input
                type="number"
                placeholder="Recovery Percentage"
                value={recoveryModal.score}
                onChange={(e) =>
                  setRecoveryModal({
                    ...recoveryModal,
                    score: e.target.value,
                  })
                }
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none text-white mb-6"
              />

              <div className="flex gap-4">
                <button
                  onClick={() =>
                    setRecoveryModal({
                      show: false,
                      appointment: null,
                      score: "",
                    })
                  }
                  className="flex-1 py-4 rounded-2xl bg-white/10 hover:bg-white/20 transition-all font-bold"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    const healthScore = Number(recoveryModal.score);

                    if (
                      isNaN(healthScore) ||
                      healthScore < 0 ||
                      healthScore > 100
                    ) {
                      showToast("Enter valid recovery percentage", "warning");

                      return;
                    }

                    completePatient(recoveryModal.appointment, healthScore);
                  }}
                  className="flex-1 py-4 rounded-2xl bg-purple-500 hover:bg-purple-600 transition-all font-bold"
                >
                  Complete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TOAST */}

        {toast.show && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] animate-bounce">
            <div
              className={`min-w-[320px] px-6 py-5 rounded-3xl shadow-2xl border backdrop-blur-xl flex items-center gap-4
              ${
                toast.type === "success"
                  ? "bg-green-500/20 border-green-500 text-green-300"
                  : toast.type === "error"
                    ? "bg-red-500/20 border-red-500 text-red-300"
                    : "bg-yellow-500/20 border-yellow-500 text-yellow-300"
              }`}
            >
              <div className="text-3xl">
                {toast.type === "success"
                  ? "✅"
                  : toast.type === "error"
                    ? "❌"
                    : "⚠️"}
              </div>

              <div>
                <h3 className="font-black text-lg capitalize">{toast.type}</h3>

                <p className="text-sm opacity-90">{toast.message}</p>
              </div>
            </div>
          </div>
        )}

        {/* CONFIRM BOX */}

        {confirmBox.show && (
          <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4">
            <div className="bg-[#111827] border border-white/10 rounded-[32px] p-8 w-full max-w-md shadow-2xl">
              <h2 className="text-3xl font-black mb-4">Confirmation</h2>

              <p className="text-gray-300 text-lg mb-8">{confirmBox.message}</p>

              <div className="flex gap-4">
                <button
                  onClick={() =>
                    setConfirmBox({
                      show: false,
                      message: "",
                      onConfirm: null,
                    })
                  }
                  className="flex-1 py-4 rounded-2xl bg-white/10 hover:bg-white/20 transition-all font-bold"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmBox.onConfirm}
                  className="flex-1 py-4 rounded-2xl bg-red-500 hover:bg-red-600 transition-all font-bold"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
