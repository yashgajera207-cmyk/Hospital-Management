"use client";

import {
  FileDown,
  FileText,
  House,
} from "lucide-react";

import { useRouter } from "next/navigation";

export default function ReportsPage() {

  const router = useRouter();

  const reports = [
    {
      id: 1,
      name: "Blood Test Report",
      date: "12 May 2026",
    },

    {
      id: 2,
      name: "Heart Checkup Report",
      date: "18 May 2026",
    },

    {
      id: 3,
      name: "X-Ray Report",
      date: "22 May 2026",
    },
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-white p-6 md:p-10">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">

        {/* TITLE */}
        <div>

          <h1 className="text-5xl font-black">
            Medical Reports
          </h1>

          <p className="text-gray-400 mt-3 text-lg">
            Download and manage your medical reports
          </p>
        </div>

        {/* DASHBOARD BUTTON */}
        <button
          onClick={() =>
            router.push(
              "/users/dashboard"
            )
          }
          className="group relative overflow-hidden bg-gradient-to-r from-cyan-500 to-blue-600 p-[2px] rounded-2xl shadow-xl shadow-cyan-500/20 hover:scale-105 transition-all duration-300 self-start"
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

      {/* REPORT GRID */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

        {reports.map((report) => (

          <div
            key={report.id}
            className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl hover:border-cyan-500/20 transition-all duration-300 hover:scale-[1.02]"
          >

            {/* ICON */}
            <div className="bg-cyan-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">

              <FileText
                size={30}
                className="text-cyan-400"
              />
            </div>

            {/* REPORT NAME */}
            <h2 className="text-2xl font-bold">
              {report.name}
            </h2>

            {/* DATE */}
            <p className="text-gray-400 mt-3">
              {report.date}
            </p>

            {/* DOWNLOAD BUTTON */}
            <button className="w-full mt-8 flex items-center justify-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-600 py-4 rounded-2xl font-semibold hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-cyan-500/20">

              <FileDown size={20} />

              Download Report
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}