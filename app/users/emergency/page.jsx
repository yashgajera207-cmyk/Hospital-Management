"use client";

import { Ambulance, PhoneCall } from "lucide-react";

export default function EmergencyPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center p-6">
      <div className="max-w-3xl w-full bg-white/5 border border-red-500/20 rounded-[40px] p-10 text-center">
        <div className="bg-red-500/20 w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-8">
          <Ambulance size={60} className="text-red-400" />
        </div>

        <h1 className="text-5xl font-black">Emergency Support</h1>

        <p className="text-gray-400 text-lg mt-5 leading-relaxed">
          If you are facing any medical emergency, contact our emergency support
          immediately.
        </p>

        <div className="mt-10 bg-red-500/10 border border-red-500/20 rounded-3xl p-8">
          <p className="text-gray-400 text-lg">Emergency Helpline</p>

          <h2 className="text-5xl font-black text-red-400 mt-4">108</h2>
        </div>

        <button className="mt-10 w-full bg-red-500 hover:bg-red-400 py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 transition-all duration-300">
          <PhoneCall size={28} />
          Call Emergency
        </button>
      </div>
    </div>
  );
}
