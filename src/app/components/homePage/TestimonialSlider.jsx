"use client";

import Image from "next/image";
import { Quote } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const testimonials = [
  {
    name: "Rajesh Kumar",
    company: "TechSolutions, Bangalore",
    image: "/clients/client1.jpg",
    text: `Hiya Domains completely transformed our online presence.
Their understanding of the local market helped us double our leads in just 3 months.`,
  },
  {
    name: "Priya Sharma",
    company: "Aura Boutique, Mumbai",
    image: "/clients/client2.jpg",
    text: `The e-commerce site they built is flawless. Fast, secure, and perfectly tailored for our Indian customer base.`,
  },
  {
    name: "Amit Patel",
    company: "Logistics Hub, Pune",
    image: "/clients/client3.jpg",
    text: `Getting our domain and hosting setup was a breeze. The 24/7 premium support team is incredibly responsive.`,
  },
  {
    name: "Neha Gupta",
    company: "Spice Kitchen, Delhi",
    image: "/clients/client4.jpg",
    text: `Our local SEO skyrocketed after working with Hiya. We are now the top result for our category.`,
  },
];

export default function TestimonialSlider() {
  return (
    <section className="py-24 bg-[#f8fafc] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-5">
            Client Success Stories
          </h2>

          <p className="max-w-3xl mx-auto text-lg text-slate-500 leading-8">
            Hear from business leaders across India who have accelerated
            their growth with our digital solutions.
          </p>
        </div>

        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={30}
          loop={true}
          speed={900}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          breakpoints={{
            0: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1200: {
              slidesPerView: 3,
            },
          }}
          className="testimonialSwiper !pb-16"
        >
          {testimonials.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="bg-white rounded-[28px] border border-gray-200 p-8 shadow-sm hover:shadow-xl transition duration-500 h-full">
                <Quote
                  size={44}
                  className="text-red-100 mb-5 stroke-[1.5]"
                />

                <p className="text-slate-700 text-lg leading-10 min-h-[220px]">
                  "{item.text}"
                </p>

                <div className="border-t mt-6 pt-6 flex items-center gap-4">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={58}
                    height={58}
                    className="rounded-full object-cover border-2 border-red-100"
                  />

                  <div>
                    <h4 className="font-bold text-xl text-slate-900">
                      {item.name}
                    </h4>
                    <p className="text-slate-500">{item.company}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style jsx global>{`
        .swiper-button-next,
        .swiper-button-prev {
          color: #dc2626;
          width: 45px;
          height: 45px;
          background: white;
          border-radius: 999px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
        }

        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-size: 18px;
          font-weight: 700;
        }

        .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          background: #cbd5e1;
          opacity: 1;
        }

        .swiper-pagination-bullet-active {
          width: 28px;
          border-radius: 999px;
          background: #dc2626;
        }
      `}</style>
    </section>
  );
}