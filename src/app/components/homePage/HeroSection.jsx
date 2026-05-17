import Image from "next/image";
import { Search, ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#f7f7f7]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* LEFT CONTENT */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#ca202f]/10 text-[#ca202f] text-sm font-semibold mb-7">
              <span className="w-2 h-2 bg-[#ca202f] rounded-full"></span>
              India's #1 Digital Partner
            </div>

            {/* Heading */}
            <h1 className="text-[28px] sm:text-[34px] lg:text-[40px] font-bold leading-tight text-slate-900">
              Welcome To Hiya Digital, Complete Web Solutions for <br />
              <span className="text-[#ca202f] relative">
                Business Growth in <br />
                India.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-6 text-lg text-slate-600 leading-relaxed max-w-xl">
              Boost your web presence in India with our comprehensive web
              solutions.
              <br />
              <br />
              With our comprehensive solutions and personalized assistance, we
              help customers across India achieve stronger online growth and
              better digital presence.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <button className="group bg-[#ca202f] hover:bg-[#b51c2b] text-white px-8 py-4 rounded-full font-semibold flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all">
                Explore Services
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition"
                />
              </button>

              <button className="border border-gray-300 bg-white hover:bg-gray-50 px-8 py-4 rounded-full font-medium flex items-center justify-center gap-3 text-slate-700 shadow-sm">
                Search Location
                <Search size={18} />
              </button>
            </div>
          </div>

          {/* RIGHT IMAGE SECTION */}
          <div className="relative flex justify-center lg:justify-end min-h-[620px]">
            {/* Decorative PNG Background */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src="/images/profile-bg.png"
                alt="Decorative Background"
                width={760}
                height={760}
                priority
                className="w-[620px] lg:w-[760px] h-auto object-contain opacity-95"
              />
            </div>

            {/* Red glow */}
            <div className="absolute w-[320px] h-[320px] bg-[#ca202f]/10 blur-[120px] rounded-full"></div>

            {/* Main Hero Image */}
            <div className="relative z-10 flex items-center justify-center">
              <Image
                src="/images/home-hero-bg.png"
                alt="Digital Growth"
                width={850}
                height={850}
                priority
                className=" max-w-[300px] lg:max-w-[600px] h-auto object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}