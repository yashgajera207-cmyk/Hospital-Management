"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import {
  Star,
  Mail,
  Clock3,
  MapPin,
  Search,
  House,
} from "lucide-react";

export default function UserDoctorsPage() {

  const router = useRouter();

  const [doctors, setDoctors] =
    useState([]);

  const [search, setSearch] =
    useState("");

  // FETCH DOCTORS
  useEffect(() => {

    fetchDoctors();

  }, []);

  const fetchDoctors =
    async () => {

      try {

        const res =
          await fetch(
            "/api/doctors"
          );

        const data =
          await res.json();

        if (data.success) {

          setDoctors(
            data.doctors
          );
        }

      } catch (error) {

        console.log(error);
      }
    };

  // FILTER
  const filteredDoctors =
    doctors.filter(
      (doctor) =>
        doctor.name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  return (
    <div className="min-h-screen bg-[#030712] text-white p-6 md:p-10">

      {/* HEADER */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-10">

        {/* LEFT */}
        <div>

          <h1 className="text-5xl font-black">
            Our Doctors
          </h1>

          <p className="text-gray-400 text-lg mt-3">
            Consult with expert specialists
          </p>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col lg:flex-row gap-4">

          {/* SEARCH */}
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-4 rounded-2xl w-full lg:w-[350px]">

            <Search
              size={20}
              className="text-gray-400"
            />

            <input
              type="text"
              placeholder="Search doctor..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="bg-transparent outline-none w-full text-white placeholder:text-gray-500"
            />
          </div>

          {/* DASHBOARD BUTTON */}
          <button
            onClick={() =>
              router.push(
                "/users/dashboard"
              )
            }
            className="group relative overflow-hidden bg-gradient-to-r from-cyan-500 to-blue-600 p-[2px] rounded-2xl shadow-xl shadow-cyan-500/20 hover:scale-105 transition-all duration-300"
          >

            <div className="flex items-center gap-3 bg-[#030712] px-7 py-4 rounded-2xl group-hover:bg-transparent transition-all duration-300">

              <House
                size={22}
                className="text-cyan-400 group-hover:text-white transition-all duration-300"
              />

              <span className="font-bold text-white">
                Dashboard
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* DOCTORS */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

        {filteredDoctors.map(
          (doctor) => (

            <div
              key={doctor.id}
              className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden backdrop-blur-xl hover:border-cyan-500/30 hover:-translate-y-2 transition-all duration-500"
            >

              {/* IMAGE */}
              <div className="relative h-72 overflow-hidden bg-gradient-to-br from-cyan-500/10 to-blue-500/10">

                {/* DOCTOR IMAGE */}
                <img
                  src={
                    doctor.image &&
                    doctor.image !== ""
                      ? doctor.image
                      : "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=1200&auto=format&fit=crop"
                  }
                  alt={doctor.name}
                  className="w-full h-full object-cover object-top hover:scale-110 transition-all duration-700"
                />

                {/* OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                {/* RATING */}
                <div className="absolute top-5 right-5 bg-black/40 backdrop-blur-xl px-4 py-2 rounded-2xl flex items-center gap-2 border border-white/10">

                  <Star
                    size={16}
                    className="text-yellow-400 fill-yellow-400"
                  />

                  <span className="text-sm font-semibold text-white">
                    {doctor.rating || "4.9"}
                  </span>
                </div>

                {/* NAME */}
                <div className="absolute bottom-5 left-5">

                  <h2 className="text-3xl font-black text-white drop-shadow-lg">
                    {doctor.name}
                  </h2>

                  <p className="text-cyan-300 font-medium mt-1">
                    {doctor.department}
                  </p>
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-7">

                {/* EXPERIENCE */}
                <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 px-4 py-2 rounded-2xl text-cyan-400 font-medium">

                  {doctor.experience}
                  {" "}
                  Experience
                </div>

                {/* DETAILS */}
                <div className="space-y-4 mt-6">

                  {/* TIME */}
                  <div className="flex items-center gap-4 bg-white/5 rounded-2xl p-4 text-gray-300">

                    <Clock3
                      size={20}
                      className="text-cyan-400"
                    />

                    <span className="font-medium">
                      {doctor.time}
                    </span>
                  </div>

                  {/* LOCATION */}
                  <div className="flex items-center gap-4 bg-white/5 rounded-2xl p-4 text-gray-300">

                    <MapPin
                      size={20}
                      className="text-cyan-400"
                    />

                    <span className="font-medium">
                      {doctor.location}
                    </span>
                  </div>

                  {/* EMAIL */}
                  <div className="flex items-center gap-4 bg-white/5 rounded-2xl p-4 text-gray-300">

                    <Mail
                      size={20}
                      className="text-cyan-400"
                    />

                    <span className="font-medium break-all">
                      {doctor.email}
                    </span>
                  </div>
                </div>

                {/* BUTTON */}
                <button
                  onClick={() =>
                    router.push(
                      "/users/appointments"
                    )
                  }
                  className="w-full mt-8 bg-gradient-to-r from-cyan-500 to-blue-600 py-4 rounded-2xl font-semibold hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-cyan-500/20"
                >
                  Book Appointment
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}