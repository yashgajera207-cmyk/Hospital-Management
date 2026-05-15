"use client";

import { useRouter } from "next/navigation";
import {
  HeartPulse,
  Activity,
  Brain,
  Bone,
  Heart,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Star,
  Stethoscope,
  Microscope,
  Eye,
  HeartHandshake,
  Waves,
  MonitorSmartphone,
} from "lucide-react";

export default function Home() {
  const router = useRouter();

  const surgeries = [
    {
      title: "Cardiac Surgery",
      desc: "Advanced bypass, valve replacement and robotic heart surgery.",
      icon: <Heart className="text-cyan-400" size={34} />,
    },
    {
      title: "Neurosurgery",
      desc: "Brain tumour removal and spinal cord surgical systems.",
      icon: <Brain className="text-violet-400" size={34} />,
    },
    {
      title: "Orthopedic Surgery",
      desc: "Joint replacement and trauma reconstruction procedures.",
      icon: <Bone className="text-green-400" size={34} />,
    },
    {
      title: "Robotic Surgery",
      desc: "AI-assisted precision surgery with modern robotic systems.",
      icon: <MonitorSmartphone className="text-orange-400" size={34} />,
    },
    {
      title: "Ophthalmic Surgery",
      desc: "Advanced eye surgery and laser correction systems.",
      icon: <Eye className="text-sky-400" size={34} />,
    },
    {
      title: "Organ Transplant",
      desc: "Dedicated ICU and 24/7 transplant coordination care.",
      icon: <HeartHandshake className="text-pink-400" size={34} />,
    },
  ];

  const departments = [
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Oncology",
    "Pediatrics",
    "Dermatology",
    "Gynecology",
    "Ophthalmology",
  ];

  const reports = [
    {
      title: "Expert Doctors",
      value: "500+",
      color: "text-cyan-400",
    },
    {
      title: "Surgeries Done",
      value: "50K+",
      color: "text-pink-400",
    },
    {
      title: "Success Rate",
      value: "98.6%",
      color: "text-green-400",
    },
    {
      title: "Specialities",
      value: "32",
      color: "text-yellow-400",
    },
  ];

  return (
    <main className="min-h-screen bg-[#030817] text-white overflow-hidden relative">
      {/* GRID BACKGROUND */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* BLUR */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full" />

      {/* NAVBAR */}
      <header className="relative z-20 flex justify-between items-center px-6 md:px-16 py-6 border-b border-white/10 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="bg-cyan-400 p-3 rounded-2xl shadow-lg shadow-cyan-500/30">
            <HeartPulse className="text-black" size={28} />
          </div>

          <div>
            <h1 className="text-2xl font-black">MediCare Pro</h1>
            <p className="text-gray-400 text-sm">Smart Surgical Management</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/login")}
            className="px-6 py-3 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 font-semibold"
          >
            Login
          </button>

          <button
            onClick={() => router.push("/register")}
            className="px-6 py-3 rounded-2xl bg-cyan-400 text-black font-bold hover:bg-cyan-300 shadow-lg shadow-cyan-500/30 transition-all duration-300"
          >
            Register
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="relative z-10 px-6 md:px-16 pt-24 pb-20">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* LEFT */}
          <div>
            <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 px-5 py-2 rounded-full mb-8">
              <ShieldCheck className="text-cyan-400" size={16} />

              <span className="text-cyan-300 text-sm font-semibold">
                WORLD-CLASS MEDICAL EXPERTS
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black leading-[0.95] tracking-tight">
              Expert
              <br />
              Doctors.
              <br />
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Advanced
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-violet-500 bg-clip-text text-transparent">
                Surgery.
              </span>
              <br />
              Trusted Care.
            </h1>

            <p className="mt-10 text-lg text-gray-300 leading-8 max-w-2xl">
              Connect with world-class surgeons and advanced healthcare systems
              with real-time monitoring and surgical management.
            </p>

            {/* BUTTONS */}
            <div className="flex flex-wrap gap-5 mt-10">
              <button
                onClick={() => router.push("/login")}
                className="bg-cyan-400 hover:bg-cyan-300 text-black px-8 py-4 rounded-2xl font-bold text-lg flex items-center gap-3 transition-all duration-300 shadow-lg shadow-cyan-500/30"
              >
                Login Portal
              </button>

              <button className="border border-white/10 hover:bg-white/10 px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300">
                Emergency: 108
              </button>
            </div>

            {/* SMALL INFO */}
            <div className="flex flex-wrap gap-8 mt-10 text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-cyan-400" size={18} />
                HIPAA Compliant
              </div>

              <div className="flex items-center gap-2">
                <Activity className="text-green-400" size={18} />
                24/7 Emergency
              </div>

              <div className="flex items-center gap-2">
                <Microscope className="text-pink-400" size={18} />
                JCI Accredited
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative">
            {/* FLOATING CARD */}
            <div className="absolute -top-6 left-6 z-20 bg-[#0d1430] border border-violet-500/20 px-6 py-4 rounded-3xl backdrop-blur-xl shadow-2xl">
              <p className="text-gray-400 text-sm">Next Procedure</p>

              <h3 className="text-violet-400 text-2xl font-bold">
                Neurosurgery • 9:30 AM
              </h3>
            </div>

            {/* MAIN CARD */}
            <div className="bg-gradient-to-b from-[#071226] to-[#071120] border border-white/10 rounded-[40px] p-8 shadow-[0_0_80px_rgba(0,255,255,0.08)]">
              {/* TOP STATUS */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Surgical Status</p>

                    <h2 className="text-4xl font-black mt-2">
                      Operation Active
                    </h2>
                  </div>

                  <div className="w-20 h-20 rounded-3xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                    <Activity className="text-green-400" size={40} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-10">
                  <div className="bg-[#091325] rounded-2xl p-5 text-center border border-white/5">
                    <h3 className="text-cyan-400 text-3xl font-black">
                      1,200+
                    </h3>

                    <p className="text-gray-400 text-sm mt-2">Surgeries</p>
                  </div>

                  <div className="bg-[#091325] rounded-2xl p-5 text-center border border-white/5">
                    <h3 className="text-violet-400 text-3xl font-black">18</h3>

                    <p className="text-gray-400 text-sm mt-2">Years Exp</p>
                  </div>

                  <div className="bg-[#091325] rounded-2xl p-5 text-center border border-white/5">
                    <h3 className="text-yellow-400 text-3xl font-black">
                      4.9★
                    </h3>

                    <p className="text-gray-400 text-sm mt-2">Rating</p>
                  </div>
                </div>
              </div>

              {/* SYSTEM STATUS */}
              <div className="mt-6 bg-[#08111f] border border-white/10 rounded-3xl p-6 flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center">
                  <Waves className="text-green-400" />
                </div>

                <div>
                  <p className="text-gray-400 text-sm">System Status</p>

                  <h3 className="text-green-400 text-2xl font-bold">
                    3 Active • All Clear
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REPORTS */}
      <section className="relative z-10 px-6 md:px-16 py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {reports.map((item, index) => (
            <div
              key={index}
              className="bg-white/5 border border-white/10 rounded-[30px] p-8 backdrop-blur-xl"
            >
              <h3 className={`text-5xl font-black ${item.color}`}>
                {item.value}
              </h3>

              <p className="text-gray-400 mt-3 text-lg">{item.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SURGERIES */}
      <section className="relative z-10 px-6 md:px-16 py-24">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-pink-500/10 border border-pink-500/20 px-5 py-2 rounded-full">
            <Activity className="text-pink-400" size={16} />

            <span className="text-pink-300 text-sm font-semibold">
              SURGICAL EXCELLENCE
            </span>
          </div>

          <h2 className="text-5xl md:text-7xl font-black mt-6">
            Advanced Surgical
            <span className="bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent">
              {" "}
              Procedures
            </span>
          </h2>

          <p className="text-gray-400 max-w-3xl mx-auto mt-6 text-lg leading-8">
            State-of-the-art operating theatres with robotic systems and modern
            healthcare technology.
          </p>
        </div>

        {/* CARDS */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {surgeries.map((item, index) => (
            <div
              key={index}
              className="bg-white/5 border border-white/10 rounded-[36px] p-8 backdrop-blur-xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-8">
                {item.icon}
              </div>

              <h3 className="text-3xl font-black mb-5">{item.title}</h3>

              <p className="text-gray-400 text-lg leading-8">{item.desc}</p>

              <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-3">
                <CheckCircle2 className="text-green-400" />

                <span className="text-green-400 font-semibold">
                  Available • 24/7 Emergency OT
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DEPARTMENTS */}
      <section className="relative z-10 px-6 md:px-16 py-24">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 px-5 py-2 rounded-full">
            <Stethoscope className="text-cyan-400" size={16} />

            <span className="text-cyan-300 text-sm font-semibold">
              OUR SPECIALITIES
            </span>
          </div>

          <h2 className="text-5xl md:text-7xl font-black mt-6">
            All Medical
            <span className="text-cyan-400"> Departments</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {departments.map((item, index) => (
            <div
              key={index}
              className="bg-white/5 border border-white/10 rounded-[32px] p-10 text-center hover:-translate-y-2 transition-all duration-300"
            >
              <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8">
                <HeartPulse className="text-cyan-400" size={34} />
              </div>

              <h3 className="text-3xl font-black">{item}</h3>

              <p className="text-gray-400 mt-3">Professional Specialists</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="relative z-10 px-6 md:px-16 py-24">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-black">
            Loved by
            <span className="text-cyan-400"> Patients</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="bg-white/5 border border-white/10 rounded-[32px] p-8"
            >
              <div className="flex gap-1 text-yellow-400">
                <Star fill="currentColor" size={18} />
                <Star fill="currentColor" size={18} />
                <Star fill="currentColor" size={18} />
                <Star fill="currentColor" size={18} />
                <Star fill="currentColor" size={18} />
              </div>

              <p className="text-gray-300 leading-8 mt-6">
                Outstanding treatment and advanced surgery experience with
                highly professional healthcare systems.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 md:px-16 py-20">
        <div className="bg-gradient-to-r from-[#081a36] to-[#07142c] border border-cyan-500/20 rounded-[40px] p-16 text-center">
          <h2 className="text-5xl md:text-7xl font-black leading-tight">
            Ready to Join
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              {" "}
              MediCare Pro?
            </span>
          </h2>

          <p className="text-gray-400 mt-8 text-xl max-w-3xl mx-auto leading-8">
            Register to access your smart healthcare management dashboard and
            surgery portal.
          </p>

          <div className="flex flex-wrap justify-center gap-5 mt-10">
            <button
              onClick={() => router.push("/register")}
              className="bg-cyan-400 hover:bg-cyan-300 text-black px-8 py-4 rounded-2xl font-bold text-lg flex items-center gap-3 transition-all duration-300 shadow-lg shadow-cyan-500/30"
            >
              Create Account
              <ArrowRight />
            </button>

            <button
              onClick={() => router.push("/login")}
              className="border border-white/10 hover:bg-white/10 px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/10 px-6 md:px-16 py-8 flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-3">
          <div className="bg-cyan-400 p-2 rounded-xl">
            <HeartPulse className="text-black" size={20} />
          </div>

          <h3 className="text-xl font-black">MediCare Pro</h3>
        </div>

        <p className="text-gray-500">
          © 2025 MediCare Pro. All rights reserved.
        </p>

        <div className="flex gap-6 text-gray-400">
          <button>Privacy</button>
          <button>Terms</button>
          <button>Support</button>
        </div>
      </footer>
    </main>
  );
}
