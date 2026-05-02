'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { deleteAdminServicePage } from '@/app/actions/location-actions';

const INITIAL_STATE = {
  success: false,
  message: '',
};

function DeleteButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? 'Deleting...' : 'Delete'}
    </button>
  );
}

export default function AdminPageRowActions({ href, slug }) {
  const [state, formAction] = useActionState(deleteAdminServicePage, INITIAL_STATE);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link
        href={href}
        className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
      >
        View
      </Link>

      <form
        action={formAction}
        onSubmit={(event) => {
          if (!window.confirm(`Delete page ${href}?`)) {
            event.preventDefault();
          }
        }}
      >
        <input type="hidden" name="slug" value={slug} />
        <DeleteButton />
      </form>

      {state?.message ? (
        <p className={`text-xs ${state.success ? 'text-emerald-600' : 'text-rose-600'}`}>
          {state.message}
        </p>
      ) : null}
    </div>
  );
}
