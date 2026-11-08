"use client";

import { useActionState } from "react";
import { addNote } from "./actions";

export function NewNoteForm() {
  const [state, formAction, pending] = useActionState(addNote, null);

  return (
    <form
      action={formAction}
      className="space-y-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-zinc-200 sm:p-5"
    >
      <h2 className="text-base font-semibold text-zinc-900">New note</h2>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-zinc-800">Title</span>
        <input
          name="title"
          maxLength={200}
          defaultValue={state?.title}
          placeholder="e.g. Tolu, maths"
          className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-base text-zinc-900 outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-zinc-800">Note</span>
        <textarea
          name="body"
          rows={4}
          defaultValue={state?.body}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-base text-zinc-900 outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
        />
      </label>

      <div className="flex items-center gap-3">
        <button
          disabled={pending}
          className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save note"}
        </button>
        <p
          role="status"
          aria-live="polite"
          className={`text-sm ${state?.ok ? "text-green-700" : "text-red-700"}`}
        >
          {state?.message}
        </p>
      </div>
    </form>
  );
}
