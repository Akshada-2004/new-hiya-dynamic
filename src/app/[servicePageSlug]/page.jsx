// import Link from 'next/link';
// import { notFound } from 'next/navigation';
// import { getServicePageBySlug } from '@/app/services/service-page-store';

// export async function generateMetadata({ params }) {
//   const { servicePageSlug } = await params;
//   const page = await getServicePageBySlug(servicePageSlug);

//   if (!page) {
//     return { title: 'Not Found' };
//   }

//   return {
//     title: `${page.serviceName} in ${page.cityName}, ${page.countryName} | ${page.cityName} Experts`,
//     description: `${page.serviceName} for businesses in ${page.cityName}, ${page.stateName}, ${page.countryName}. Talk to a team that can launch and support your project locally.`,
//   };
// }

// export default async function ServiceLocationLandingPage({ params }) {
//   const { servicePageSlug } = await params;
//   const page = await getServicePageBySlug(servicePageSlug);

//   if (!page) {
//     notFound();
//   }

//   const highlights = [
//     `Local delivery for businesses in ${page.cityName}`,
//     `Coverage across ${page.stateName}, ${page.countryName}`,
//     `Custom plans for ${page.serviceShortName.toLowerCase()} projects`,
//   ];

//   const benefits = [
//     {
//       title: `${page.serviceName} strategy`,
//       description: `We plan every ${page.serviceShortName.toLowerCase()} engagement around your market, competition, and business goals in ${page.cityName}.`,
//     },
//     {
//       title: 'Fast execution',
//       description: `From onboarding to launch, our workflow keeps your ${page.serviceShortName.toLowerCase()} project moving without unnecessary delays.`,
//     },
//     {
//       title: 'Ongoing support',
//       description: `Post-launch monitoring, updates, and support keep your ${page.serviceShortName.toLowerCase()} setup reliable long-term.`,
//     },
//   ];

//   return (
//     <main className="min-h-screen bg-[linear-gradient(180deg,_#f8fafc_0%,_#ffffff_45%,_#eef2ff_100%)] text-slate-900">
//       <section className="border-b border-slate-200 bg-white/90 px-6 py-16 backdrop-blur sm:px-10">
//         <div className="mx-auto max-w-6xl">
//           <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-[0.24em] text-slate-400">
//             <span>{page.countryName}</span>
//             <span>/</span>
//             <span>{page.stateName}</span>
//             <span>/</span>
//             <span>{page.cityName}</span>
//           </div>

//           <div className="mt-6 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
//             <div>
//               <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700">
//                 {page.serviceName}
//               </span>
//               <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
//                 {page.serviceName} in {page.cityName}
//               </h1>
//               <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
//                 {page.serviceBlurb} We help businesses in {page.cityName}, {page.stateName} with practical delivery, clear timelines, and ongoing support.
//               </p>

//               <div className="mt-6 flex flex-wrap gap-3">
//                 <Link
//                   href="/admin/dashboard"
//                   className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
//                 >
//                   Create More Pages
//                 </Link>
//                 <Link
//                   href="/admin/dashboard/pages"
//                   className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
//                 >
//                   View All Service Pages
//                 </Link>
//               </div>
//             </div>

//             <div className="rounded-3xl border border-indigo-100 bg-[linear-gradient(135deg,_#eef2ff,_#ffffff)] p-6 shadow-sm">
//               <p className="text-sm font-semibold text-slate-900">Page URL</p>
//               <p className="mt-2 break-all rounded-2xl bg-slate-950 px-4 py-3 font-mono text-sm text-indigo-100">
//                 /{page.slug}
//               </p>
//               <div className="mt-5 space-y-3">
//                 {highlights.map((item) => (
//                   <div key={item} className="flex items-start gap-3 text-sm text-slate-600">
//                     <span className="mt-1 h-2.5 w-2.5 rounded-full bg-indigo-500" />
//                     <span>{item}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       <section className="px-6 py-14 sm:px-10">
//         <div className="mx-auto max-w-6xl">
//           <div className="grid gap-5 md:grid-cols-3">
//             {benefits.map((benefit) => (
//               <article
//                 key={benefit.title}
//                 className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
//               >
//                 <h2 className="text-xl font-semibold text-slate-900">{benefit.title}</h2>
//                 <p className="mt-3 text-sm leading-6 text-slate-600">{benefit.description}</p>
//               </article>
//             ))}
//           </div>

//           <div className="mt-8 rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
//             <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
//               Why This Page Works
//             </p>
//             <h2 className="mt-3 text-3xl font-semibold text-slate-950">
//               SEO-ready service + location landing page
//             </h2>
//             <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
//               This page combines the selected keyword, country, and city into one clean slug:
//               <span className="font-semibold text-slate-900"> {page.slug}</span>. Aap isi format me alag-alag services ke liye pages generate kar sakte ho.
//             </p>
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }
// import Link from "next/link";
// import { notFound } from "next/navigation";
// import { getServicePageBySlug } from "@/app/services/service-page-store";
// import Image from "next/image";


// function getLocationCopy(page) {
//   const level = page.locationLevel ?? "city";
//   const locationName =
//     page.locationName ??
//     (level === "country"
//       ? page.countryName
//       : level === "state"
//         ? `${page.stateName}, ${page.countryName}`
//         : `${page.cityName}, ${page.countryName}`);

//   return {
//     level,
//     locationName,
//     scope:
//       level === "country"
//         ? page.countryName
//         : level === "state"
//           ? `${page.stateName}, ${page.countryName}`
//           : page.cityName,
//     footerLocation:
//       level === "country"
//         ? page.countryName
//         : level === "state"
//           ? `${page.stateName}, ${page.countryName}`
//           : `${page.cityName}, ${page.countryName}`,
//   };
// }

// export default async function ServiceLocationLandingPage({ params }) {
//   const { servicePageSlug } = await params;
//   const page = await getServicePageBySlug(servicePageSlug);

//   if (!page) notFound();
//   const location = getLocationCopy(page);

//   return (
//     <main className="bg-white text-[#0f172a]">

//       {/* ================= HERO ================= */}
//       <section className="px-6 py-20 lg:px-16 bg-gradient-to-b from-white to-[#f1f5f9]">
//         <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
          
//           <div>
//             <span className="inline-block bg-red-100 text-[#cb2034] px-4 py-1 rounded-full text-sm font-semibold">
//               Premium Agency in {location.footerLocation}
//             </span>

//             <h1 className="mt-6 text-5xl font-bold leading-tight">
//               {page.serviceName} <br />
//               Services in{" "}
//               <span className="text-[#003985]">{location.locationName}</span>
//             </h1>

//             <p className="mt-6 text-lg text-gray-600 max-w-xl">
//               We build scalable, modern and high-performance websites for businesses in {location.scope}. Transform your digital presence today.
//             </p>

//             <div className="mt-8 flex gap-4">
//               <button className="bg-[#cb2034] text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90">
//                 Get Free Consultation
//               </button>
//               <button className="border px-6 py-3 rounded-xl font-semibold">
//                 View Our Work
//               </button>
//             </div>
//           </div>

//           <div>
//  <div className="relative w-full h-[450px]">
//   <Image
//     src="/images/hero-img.png"
//     alt="Hero Image"
//     fill
//     priority
//     className="object-contain object-center"
//   />
// </div>
// </div>
//         </div>
//       </section>

//       {/* ================= SERVICES ================= */}
//       <section className="px-6 py-20 lg:px-16">
//         <div className="max-w-7xl mx-auto text-center">
//           <h2 className="text-4xl font-bold">Comprehensive Web Solutions</h2>
//           <p className="mt-4 text-gray-600">
//             End-to-end digital services tailored for {location.footerLocation}.
//           </p>

//           <div className="grid md:grid-cols-3 gap-6 mt-12">
//             {[
//               "Website Development",
//               "E-commerce Development",
//               "Custom Web Applications",
//               "WordPress Development",
//               "UI/UX Design",
//               "Website Maintenance",
//             ].map((item, i) => (
//               <div key={i} className="p-6 border rounded-2xl hover:shadow-lg transition">
//                 <h3 className="text-xl font-semibold">{item}</h3>
//                 <p className="mt-2 text-gray-600 text-sm">
//                   High-quality {item.toLowerCase()} services in {location.locationName}.
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ================= WHY US ================= */}
//       <section className="px-6 py-20 bg-[#f8fafc] lg:px-16">
//         <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10">
          
//           <div>
//             <h2 className="text-4xl font-bold">Why Partner With Us?</h2>
//             <p className="mt-6 text-gray-600">
//               We build high-performance websites that generate revenue and growth.
//             </p>
//           </div>

//           <div className="grid grid-cols-2 gap-6">
//             {[
//               "Experienced Developers",
//               "SEO-Friendly Code",
//               "Fast Performance",
//               "Mobile Responsive",
//               "Affordable Pricing",
//               "Dedicated Support",
//             ].map((item, i) => (
//               <div key={i} className="p-5 bg-white border rounded-2xl">
//                 <h4 className="font-semibold">{item}</h4>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

    


//       {/* ================= TESTIMONIALS ================= */}
//       <section className="px-6 py-20 lg:px-16">
//         <div className="max-w-7xl mx-auto text-center">
//           <h2 className="text-4xl font-bold">Client Success Stories</h2>

//           <div className="grid md:grid-cols-3 gap-6 mt-10">
//             {[1,2,3].map((i) => (
//               <div key={i} className="p-6 border rounded-2xl">
//                 <p className="text-gray-600">
//                   "Amazing service! Highly recommended."
//                 </p>
//                 <p className="mt-4 font-semibold">Client {i}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ================= CTA ================= */}
//       <section className="bg-[#cb2034] text-white py-20 text-center">
//         <h2 className="text-4xl font-bold">
//           Ready to Build Your Website?
//         </h2>

//         <button className="mt-6 bg-white text-[#cb2034] px-6 py-3 rounded-xl font-semibold">
//           Contact Us
//         </button>
//       </section>

//       {/* ================= FOOTER ================= */}
//       <footer className="bg-[#003985] text-white px-6 py-12">
//         <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10">

//           <div>
//             <h3 className="text-xl font-bold">AgencyX</h3>
//             <p className="mt-4 text-sm text-gray-300">
//               Premium web development services in {location.locationName}.
//             </p>
//           </div>

//           <div>
//             <h4 className="font-semibold">Services</h4>
//             <ul className="mt-3 space-y-2 text-sm text-gray-300">
//               <li>Website Development</li>
//               <li>E-commerce</li>
//               <li>UI/UX</li>
//             </ul>
//           </div>

//           <div>
//             <h4 className="font-semibold">Quick Links</h4>
//             <ul className="mt-3 space-y-2 text-sm text-gray-300">
//               <li>About</li>
//               <li>Portfolio</li>
//               <li>Contact</li>
//             </ul>
//           </div>

//           <div>
//             <h4 className="font-semibold">Contact</h4>
//             <p className="mt-3 text-sm text-gray-300">
//               {location.footerLocation}
//             </p>
//           </div>
//         </div>

//         <p className="text-center text-sm mt-10 text-gray-400">
//           © 2026 AgencyX. All rights reserved.
//         </p>
//       </footer>
//     </main>
//   );
// }
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServicePageBySlug } from "@/app/services/service-page-store";
import Image from "next/image";
import { Code, ShoppingCart, Layout, Palette, Wrench, CheckCircle, Zap, Smartphone, IndianRupee, Headphones } from "lucide-react";

function getLocationCopy(page) {
  const level = page.locationLevel ?? "city";
  const locationName =
    page.locationName ??
    (level === "country"
      ? page.countryName
      : level === "state"
        ? `${page.stateName}, ${page.countryName}`
        : `${page.cityName}, ${page.countryName}`);

  return {
    level,
    locationName,
    scope:
      level === "country"
        ? page.countryName
        : level === "state"
          ? `${page.stateName}, ${page.countryName}`
          : page.cityName,
    footerLocation:
      level === "country"
        ? page.countryName
        : level === "state"
          ? `${page.stateName}, ${page.countryName}`
          : `${page.cityName}, ${page.countryName}`,
  };
}

export default async function ServiceLocationLandingPage({ params }) {
  const { servicePageSlug } = await params;
  const page = await getServicePageBySlug(servicePageSlug);

  if (!page) notFound();
  const location = getLocationCopy(page);

  return (
    <main className="bg-white text-[#0f172a]">


      {/* ================= HERO ================= */}

     <section className="px-6 py-20 lg:px-16 bg-gradient-to-b from-white to-[#f1f5f9]">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
          
         <div>
           <span className="inline-block bg-red-100 text-[#cb2034] px-4 py-1 rounded-full text-sm font-semibold">
             Premium Agency in {location.footerLocation}
           </span>

           <h1 className="mt-6 text-5xl font-bold leading-tight">
             {page.serviceName} <br />
             Services in{" "}
             <span className="text-[#003985]">{location.locationName}</span>
           </h1>

           <p className="mt-6 text-lg text-gray-600 max-w-xl">
             We build scalable, modern and high-performance websites for businesses in {location.scope}. Transform your digital presence today.
           </p>

           <div className="mt-8 flex gap-4">
             <button className="bg-[#cb2034] text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90">
               Get Free Consultation
             </button>
             <button className="border px-6 py-3 rounded-xl font-semibold">
               View Our Work
             </button>
           </div>
         </div>

         <div>
<div className="relative w-full h-[450px]">
 <Image
   src="/images/hero-img.png"
   alt="Hero Image"
   fill
   priority
   className="object-contain object-center"
 />
</div>
</div>
       </div>
     </section>


      {/* ================= SERVICES ================= */}
      <section className="px-6 py-20 lg:px-16 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold">Comprehensive Web Solutions</h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            End-to-end digital services tailored for the Indian market. From conceptualization to deployment, we handle it all.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mt-14">

            {[
              { title: "Website Development", icon: <Layout />, desc: "Custom-coded responsive websites using modern frameworks." },
              { title: "E-commerce Development", icon: <ShoppingCart />, desc: "Secure and scalable online stores with seamless checkout." },
              { title: "Custom Web Applications", icon: <Code />, desc: "CRM, ERP and business apps tailored to your needs." },
              { title: "WordPress Development", icon: <Layout />, desc: "SEO-friendly WordPress websites with custom themes." },
              { title: "UI/UX Design", icon: <Palette />, desc: "User-focused design that improves conversions." },
              { title: "Website Maintenance", icon: <Wrench />, desc: "Ongoing support, updates and performance optimization." },
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl  hover:shadow-xl transition">
                
                <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-blue-100 text-[#003985] mb-6 mx-auto">
                  {item.icon}
                </div>

                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-gray-600 text-sm">{item.desc}</p>

              </div>
            ))}

          </div>
        </div>
      </section>

      {/* ================= WHY US ================= */}
      <section className="px-6 py-20 lg:px-16">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT */}
          <div>
            <h2 className="text-4xl font-bold">Why Partner With Us?</h2>

            <div className="w-16 h-1 bg-red-500 mt-4 rounded"></div>

            <p className="mt-6 text-gray-600">
              In a crowded market of freelancers and generic templates, we offer enterprise-grade engineering tailored for your business needs.
            </p>

            <p className="mt-4 text-gray-600">
              We don't just write code; we build digital assets that generate revenue and elevate your brand.
            </p>

            <button className="mt-6 text-[#003985] font-semibold flex items-center gap-2">
              Discuss Your Project →
            </button>
          </div>

          {/* RIGHT */}
          <div className="grid sm:grid-cols-2 gap-6">

            {[
              { title: "Experienced Developers", icon: <CheckCircle /> },
              { title: "SEO-Friendly Code", icon: <CheckCircle /> },
              { title: "Fast Performance", icon: <Zap /> },
              { title: "Mobile Responsive", icon: <Smartphone /> },
              { title: "Affordable Pricing", icon: <IndianRupee /> },
              { title: "Dedicated Support", icon: <Headphones /> },
            ].map((item, i) => (
              <div key={i} className="bg-white  p-6 rounded-2xl shadow-sm hover:shadow-md transition">

                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-blue-100 text-[#003985] mb-4">
                  {item.icon}
                </div>

                <h4 className="font-semibold">{item.title}</h4>

              </div>
            ))}

          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="px-6 py-20 lg:px-16 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto text-center">

          <h2 className="text-4xl font-bold">Client Success Stories</h2>
          <p className="mt-4 text-gray-600">
            Don't just take our word for it. Here's what our clients say.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mt-14">

            {[
              {
                name: "Rahul Sharma",
                role: "Founder, TechGrow India",
                text: "Agency completely transformed our online presence. Speed and conversion improved massively."
              },
              {
                name: "Priya Desai",
                role: "Marketing Director",
                text: "They built our e-commerce platform from scratch seamlessly. Highly scalable and reliable."
              },
              {
                name: "Amit Patel",
                role: "CEO, Nexa Logistics",
                text: "Clean code, great UI, and excellent support. Highly recommended team."
              }
            ].map((item, i) => (
              <div key={i} className="bg-white  p-8 rounded-2xl text-left shadow-sm hover:shadow-md transition">

                <div className="flex gap-1 text-yellow-400 mb-4">
                  {Array(5).fill(0).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>

                <p className="text-gray-600 italic">"{item.text}"</p>

                <div className="mt-6">
                  <h4 className="font-semibold">{item.name}</h4>
                  <p className="text-sm text-gray-500">{item.role}</p>
                </div>

              </div>
            ))}

          </div>
        </div>
      </section>

 {/* ================= CTA ================= */}
     <section className="bg-[#cb2034] text-white py-20 text-center">
       <h2 className="text-4xl font-bold">
         Ready to Build Your Website?
       </h2>

       <button className="mt-6 bg-white text-[#cb2034] px-6 py-3 rounded-xl font-semibold">
         Contact Us
       </button>
     </section>

     {/* ================= FOOTER ================= */}
     <footer className="bg-[#003985] text-white px-6 py-12">
       <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10">

         <div>
           <h3 className="text-xl font-bold">AgencyX</h3>
           <p className="mt-4 text-sm text-gray-300">
             Premium web development services in {location.locationName}.
           </p>
         </div>

         <div>
           <h4 className="font-semibold">Services</h4>
           <ul className="mt-3 space-y-2 text-sm text-gray-300">
             <li>Website Development</li>
             <li>E-commerce</li>
             <li>UI/UX</li>
           </ul>
         </div>

         <div>
           <h4 className="font-semibold">Quick Links</h4>
           <ul className="mt-3 space-y-2 text-sm text-gray-300">
             <li>About</li>
             <li>Portfolio</li>
             <li>Contact</li>
           </ul>
         </div>

         <div>
           <h4 className="font-semibold">Contact</h4>
           <p className="mt-3 text-sm text-gray-300">
             {location.footerLocation}
           </p>
         </div>
       </div>

       <p className="text-center text-sm mt-10 text-gray-400">
         © 2026 AgencyX. All rights reserved.
       </p>
     </footer>
   </main>


  
  );
}