"use client";

import {
  Briefcase,
  Search,
  Globe,
  Shield,
  Clock3,
  Star,
  TrendingUp,
  ChevronDown,
  Sparkles,
} from "lucide-react";

export default function ServiceFinder() {
  return (
    <section className="bg-[#f7f7f7] py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Top Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#ca202f]/10 text-[#ca202f] text-sm font-semibold tracking-wide">
            <Sparkles size={16} />
            SMART DISCOVERY
          </div>
        </div>

        {/* Heading */}
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-[32px] font-bold text-slate-900 leading-tight">
            Find Services In Your{" "}
            <span className="text-[#ca202f]">Location</span>
          </h2>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
            Connect with{" "}
            <span className="font-bold text-slate-900">
              10,000+ verified professionals
            </span>{" "}
            across countries worldwide.
          </p>
        </div>

        {/* Search Box */}
        <div className="mt-14 rounded-[30px] bg-white border border-gray-200 shadow-[0_20px_80px_rgba(0,0,0,0.06)] overflow-hidden">
          {/* Top Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 lg:px-8 py-5 border-b border-gray-100 gap-3">
            <div className="flex items-center gap-3 text-slate-800 font-semibold">
              <span className="w-3 h-3 rounded-full bg-green-400 shadow-[0_0_15px_rgba(74,222,128,.7)]"></span>
              Global Service Search
            </div>

            <div className="flex items-center gap-2 text-slate-500 font-medium">
              <Globe size={18} />
              Worldwide
            </div>
          </div>

          {/* Inputs */}
          <div className="p-6 lg:p-8">
            <div className="grid lg:grid-cols-[1.4fr_1.2fr_.6fr] gap-5">
              {/* Country */}
              <div className="bg-[#f8fafc] rounded-3xl px-6 py-6 flex items-center gap-4 border border-gray-100 hover:border-[#ca202f]/40 transition">
                <div className="w-14 h-14 rounded-full bg-[#ca202f]/10 flex items-center justify-center shrink-0">
                  <Globe className="text-[#ca202f]" size={22} />
                </div>

                <div className="flex-1">
                  <p className="text-xs font-bold tracking-widest text-slate-500 uppercase">
                    Country
                  </p>
                  <input
                    type="text"
                    placeholder="Search country..."
                    className="w-full mt-2 bg-transparent outline-none text-lg text-slate-900 placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Service */}
              <div className="bg-[#f8fafc] rounded-3xl px-6 py-6 flex items-center gap-4 border border-gray-100 hover:border-[#ca202f]/40 transition cursor-pointer">
                <div className="w-14 h-14 rounded-full bg-[#ca202f]/10 flex items-center justify-center shrink-0">
                  <Briefcase className="text-[#ca202f]" size={22} />
                </div>

                <div className="flex-1">
                  <p className="text-xs font-bold tracking-widest text-slate-500 uppercase">
                    Service
                  </p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">
                    Select Service
                  </p>
                </div>

                <ChevronDown className="text-slate-400" />
              </div>

              {/* Button */}
              <button className="bg-[#ca202f] hover:bg-[#b61d2a] rounded-3xl text-white font-semibold text-xl px-8 py-6 flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transition-all">
                <Search size={22} />
                Search
              </button>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="border-t border-gray-100 px-6 lg:px-8 py-5 flex flex-wrap items-center gap-4 lg:gap-6">
            <div className="flex items-center gap-2 font-semibold text-slate-600">
              <TrendingUp size={16} className="text-[#ca202f]" />
              POPULAR
            </div>

            <Tag text="India" />
            <Tag text="USA" />
            <Tag text="UK" />
            <Tag text="UAE" />
            <Tag text="Canada" />

            <div className="lg:ml-auto flex flex-wrap gap-5 text-sm font-medium text-slate-600">
              <Info icon={<Shield size={16} />} text="Verified Experts" />
              <Info icon={<Clock3 size={16} />} text="24/7 Support" />
              <Info icon={<Star size={16} />} text="Trusted Worldwide" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Tag({ text }) {
  return (
    <div className="px-4 py-2 rounded-full border border-gray-200 bg-white text-sm font-medium">
      {text}
    </div>
  );
}

function Info({ icon, text }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[#ca202f]">{icon}</span>
      <span>{text}</span>
    </div>
  );
}