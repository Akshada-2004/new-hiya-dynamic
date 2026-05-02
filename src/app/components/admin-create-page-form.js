// 'use client';

// import Link from 'next/link';
// import { useActionState } from 'react';
// import { useFormStatus } from 'react-dom';
// import { createAdminLocationPage } from '@/app/actions/location-actions';

// const INITIAL_STATE = {
//   success: false,
//   message: '',
// };

// function SubmitButton() {
//   const { pending } = useFormStatus();

//   return (
//     <button
//       type="submit"
//       disabled={pending}
//       className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
//     >
//       {pending ? 'Creating...' : 'Create Page'}
//     </button>
//   );
// }

// export default function AdminCreatePageForm() {
//   const [state, formAction] = useActionState(createAdminLocationPage, INITIAL_STATE);
//   const publicPath = state?.success ? state.message.match(/\/services\/[^\s]+/)?.[0] : null;

//   return (
//     <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
//       <div className="mb-6">
//         <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
//           Create Page
//         </p>
//         <h2 className="mt-2 text-3xl font-semibold text-slate-900">
//           Build a new location page
//         </h2>
//         <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
//           Enter country, state, and city once. The admin panel will create missing records, reuse existing ones, and make the page available in the public routes.
//         </p>
//       </div>

//       <form action={formAction} className="grid gap-5 lg:grid-cols-3">
//         <label className="block space-y-2">
//           <span className="text-sm font-medium text-slate-700">Country</span>
//           <input
//             type="text"
//             name="country"
//             placeholder="India"
//             required
//             className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:bg-white"
//           />
//         </label>

//         <label className="block space-y-2">
//           <span className="text-sm font-medium text-slate-700">State</span>
//           <input
//             type="text"
//             name="state"
//             placeholder="Maharashtra"
//             required
//             className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:bg-white"
//           />
//         </label>

//         <label className="block space-y-2">
//           <span className="text-sm font-medium text-slate-700">City</span>
//           <input
//             type="text"
//             name="city"
//             placeholder="Mumbai"
//             required
//             className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-900 focus:bg-white"
//           />
//         </label>

//         <div className="flex flex-col gap-3 lg:col-span-3 lg:flex-row lg:items-center lg:justify-between">
//           <div className="min-h-6 text-sm">
//             {state?.message ? (
//               <p className={state.success ? 'text-emerald-700' : 'text-rose-700'}>{state.message}</p>
//             ) : (
//               <p className="text-slate-500">
//                 Example path: <span className="font-medium text-slate-700">/services/india/maharashtra/mumbai</span>
//               </p>
//             )}
//             {publicPath ? (
//               <Link href={publicPath} className="mt-2 inline-block font-medium text-sky-700 hover:text-sky-900">
//                 Open public page
//               </Link>
//             ) : null}
//           </div>
//           <SubmitButton />
//         </div>
//       </form>
//     </section>
//   );
// }

'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import {
  createAdminLocationPage,
  createAdminLocationPagesFromCsv,
} from '@/app/actions/location-actions';
import { SERVICE_OPTIONS } from '@/app/services/service-catalog';

const INITIAL_STATE = {
  success: false,
  message: '',
};

const PAGE_LEVEL_OPTIONS = [
  {
    id: 'country',
    label: 'Country page',
    example: '{keyword}-in-{country}',
  },
  {
    id: 'state',
    label: 'State page',
    example: '{country}-{keyword}-in-{state}',
  },
  {
    id: 'city',
    label: 'City page',
    example: '{country}-{keyword}-in-{city}',
  },
];

function SubmitButton({ idleLabel = 'Create Page', pendingLabel = 'Creating...' }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:shadow-indigo-500/40 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:scale-100"
    >
      <span className="absolute inset-0 bg-gradient-to-br from-violet-500 to-indigo-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      {pending ? (
        <>
          <svg className="relative h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="relative">{pendingLabel}</span>
        </>
      ) : (
        <>
          <svg className="relative h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span className="relative">{idleLabel}</span>
        </>
      )}
    </button>
  );
}

export default function AdminCreatePageForm() {
  const [state, formAction] = useActionState(createAdminLocationPage, INITIAL_STATE);
  const [bulkState, bulkFormAction] = useActionState(
    createAdminLocationPagesFromCsv,
    INITIAL_STATE
  );
  const publicPath = state?.success ? state.message.match(/\/[a-z0-9-]+/)?.[0] : null;

  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-xl shadow-slate-200/60">
      {/* Decorative gradient top strip */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-500 via-indigo-500 to-sky-500" />

      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #6366f1 1px, transparent 0)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative p-8">
        {/* Header */}
        <div className="mb-8 flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 shadow-inner">
            <svg className="h-5 w-5 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 20.75l6-16.5M4.25 8.5l-2.5 3 2.5 3M19.75 8.5l2.5 3-2.5 3" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-indigo-500">
              Admin Panel
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
              Create Location Page
            </h2>
            <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-slate-500">
              Country, state aur city ke saath services select karo. Page level choose karoge to us format me SEO-friendly URLs create honge.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="mb-7 h-px bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100" />

        {/* Form */}
        <form action={formAction} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {/* Country */}
            <div className="group space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-slate-500">
                <span className="h-1 w-1 rounded-full bg-violet-400" />
                Country
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="country"
                  placeholder="India"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none ring-0 transition-all duration-200 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>
            </div>

            {/* State */}
            <div className="group space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-slate-500">
                <span className="h-1 w-1 rounded-full bg-indigo-400" />
                State
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="state"
                  placeholder="Maharashtra"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none ring-0 transition-all duration-200 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>
            </div>

            {/* City */}
            <div className="group space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-slate-500">
                <span className="h-1 w-1 rounded-full bg-sky-400" />
                City
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="city"
                  placeholder="Mumbai"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none ring-0 transition-all duration-200 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Page levels
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Country, state aur city me se jo pages chahiye woh select karo.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {PAGE_LEVEL_OPTIONS.map((option) => (
                <label
                  key={option.id}
                  className="flex cursor-pointer gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-indigo-200 hover:shadow-sm"
                >
                  <input
                    type="checkbox"
                    name="pageLevels"
                    value={option.id}
                    defaultChecked={option.id === 'city'}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="block min-w-0">
                    <span className="block text-sm font-semibold text-slate-800">
                      {option.label}
                    </span>
                    <code className="mt-1 block break-all rounded-lg bg-slate-50 px-2 py-1 font-mono text-[11px] text-slate-500">
                      {option.example}
                    </code>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Services
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Jitni services select karoge, utne public pages banenge.
                </p>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-indigo-600 shadow-sm">
                {SERVICE_OPTIONS.length} options
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {SERVICE_OPTIONS.map((service) => (
                <label
                  key={service.id}
                  className="flex cursor-pointer gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-indigo-200 hover:shadow-sm"
                >
                  <input
                    type="checkbox"
                    name="services"
                    value={service.id}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="block">
                    <span className="block text-sm font-semibold text-slate-800">
                      {service.name}
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-slate-500">
                      {service.blurb}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Footer row */}
          <div className="flex flex-col gap-3 rounded-2xl bg-slate-50/80 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm">
              {state?.message ? (
                <div
                  className={`flex items-start gap-2 ${
                    state.success ? 'text-emerald-700' : 'text-rose-600'
                  }`}
                >
                  {state.success ? (
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                  )}
                  <span>{state.message}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-slate-500">
                  <svg className="h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                  </svg>
                  <span>
                    Preview:{' '}
                    <span className="font-medium text-slate-700">
                      /web-development-services-in-india
                    </span>
                  </span>
                </div>
              )}

              {publicPath && (
                <Link
                  href={publicPath}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                  </svg>
                  Open public page
                </Link>
              )}
            </div>

            <SubmitButton />
          </div>
        </form>

        <div className="my-8 h-px bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100" />

        <form action={bulkFormAction} encType="multipart/form-data" className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky-50 shadow-inner">
              <svg className="h-5 w-5 text-sky-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0l-4 4m4-4l4 4M4 20h16" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-sky-500">
                Bulk Upload
              </p>
              <h3 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
                Create pages from CSV
              </h3>
              <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-slate-500">
                CSV header exactly <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs">country,state,city</code> rakho. Har row ke liye selected services aur page levels generate honge.
              </p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
            <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
              <label className="block space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  CSV file
                </span>
                <input
                  type="file"
                  name="csvFile"
                  accept=".csv,text/csv"
                  required
                  className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-slate-700"
                />
              </label>
              <div className="rounded-xl bg-white p-3">
                <p className="text-xs font-semibold text-slate-600">Example</p>
                <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-950 p-3 font-mono text-[11px] leading-5 text-slate-100">{`country,state,city
India,Gujarat,Ahmedabad
India,Maharashtra,Mumbai`}</pre>
              </div>
            </div>

            <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Page levels
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Bulk rows ke liye jo level chahiye woh select karo.
                </p>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                {PAGE_LEVEL_OPTIONS.map((option) => (
                  <label
                    key={`bulk-${option.id}`}
                    className="flex cursor-pointer gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-sky-200 hover:shadow-sm"
                  >
                    <input
                      type="checkbox"
                      name="pageLevels"
                      value={option.id}
                      defaultChecked={option.id === 'city'}
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                    />
                    <span className="block min-w-0">
                      <span className="block text-sm font-semibold text-slate-800">
                        {option.label}
                      </span>
                      <code className="mt-1 block break-all rounded-lg bg-slate-50 px-2 py-1 font-mono text-[11px] text-slate-500">
                        {option.example}
                      </code>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Services
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  CSV ki har location ke liye selected services generate hongi.
                </p>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-sky-600 shadow-sm">
                {SERVICE_OPTIONS.length} options
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {SERVICE_OPTIONS.map((service) => (
                <label
                  key={`bulk-service-${service.id}`}
                  className="flex cursor-pointer gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-sky-200 hover:shadow-sm"
                >
                  <input
                    type="checkbox"
                    name="services"
                    value={service.id}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  <span className="block">
                    <span className="block text-sm font-semibold text-slate-800">
                      {service.name}
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-slate-500">
                      {service.blurb}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-2xl bg-slate-50/80 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm">
              {bulkState?.message ? (
                <div
                  className={`flex items-start gap-2 ${
                    bulkState.success ? 'text-emerald-700' : 'text-rose-600'
                  }`}
                >
                  <span>{bulkState.message}</span>
                </div>
              ) : (
                <p className="text-slate-500">
                  CSV upload se manual entry ke same rules follow honge.
                </p>
              )}
            </div>

            <SubmitButton idleLabel="Upload CSV" pendingLabel="Uploading..." />
          </div>
        </form>
      </div>
    </section>
  );
}
