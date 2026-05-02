'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { createLocationHierarchy } from '@/app/actions/location-actions';

const INITIAL_STATE = {
  success: false,
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? 'Saving...' : 'Create Location Page'}
    </button>
  );
}

export default function LocationAdminPanel() {
  const [state, formAction] = useActionState(createLocationHierarchy, INITIAL_STATE);

  return (
    <section className="rounded-[30px] border border-black/5 bg-white/95 p-6 shadow-[0_16px_50px_rgba(15,23,42,0.08)] sm:p-8">
      <div className="mb-6 max-w-2xl">
        <p className="mb-2 inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-800">
          Single Form
        </p>
        <h2 className="text-3xl font-semibold text-slate-900">Ek hi form me country, state aur city add karo</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Bas teen fields bharo. Agar country ya state pehle se database me hoga to usi ko reuse karenge, warna naya create hoga. Submit ke baad aap seedha us city ke page par chale jaoge.
        </p>
      </div>

      <form action={formAction} className="grid gap-5 lg:grid-cols-3">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Country name</span>
          <input
            type="text"
            name="country"
            placeholder="e.g. India"
            required
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">State name</span>
          <input
            type="text"
            name="state"
            placeholder="e.g. Maharashtra"
            required
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">City name</span>
          <input
            type="text"
            name="city"
            placeholder="e.g. Mumbai"
            required
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white"
          />
        </label>

        <div className="flex flex-col gap-3 lg:col-span-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {state?.message ? (
              <p
                aria-live="polite"
                className={`text-sm ${state.success ? 'text-emerald-700' : 'text-rose-700'}`}
              >
                {state.message}
              </p>
            ) : (
              <p className="text-sm text-slate-500">
                Example: <span className="font-medium text-slate-700">India / Maharashtra / Mumbai</span>
              </p>
            )}
          </div>
          <SubmitButton />
        </div>
      </form>
    </section>
  );
}
