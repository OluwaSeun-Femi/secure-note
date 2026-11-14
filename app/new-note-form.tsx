"use client";

import { useActionState } from "react";
import { addNote } from "./actions";

export function NewNoteForm() {
  const [state, formAction, pending] = useActionState(addNote, null);

  return (
    <form
      action={formAction}
      aria-label="New note"
      onKeyDown={(e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
          e.currentTarget.requestSubmit();
        }
      }}
      className="relative mt-6 overflow-hidden rounded-[10px] border border-rule bg-sheet"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-6 w-px bg-margin/50"
      />
      <div className="py-4 pl-10 pr-4 sm:pr-5">
        <label className="sr-only" htmlFor="new-title">
          Title
        </label>
        <input
          id="new-title"
          name="title"
          maxLength={200}
          defaultValue={state?.title}
          placeholder="Tolu, maths"
          className="w-full border-b border-rule bg-transparent pb-2.5 font-serif text-lg font-semibold text-ink placeholder:font-sans placeholder:text-base placeholder:font-normal placeholder:text-ink-soft/70 focus:border-biro focus:outline-none"
        />
        <label className="sr-only" htmlFor="new-body">
          Note
        </label>
        <textarea
          id="new-body"
          name="body"
          rows={4}
          defaultValue={state?.body}
          placeholder="What happened in the lesson?"
          className="mt-3 w-full resize-y bg-transparent text-[15px] leading-7 text-ink placeholder:text-ink-soft/70 focus:outline-none"
        />
        <div className="mt-1 flex items-center justify-between gap-3 border-t border-rule pt-3">
          <p
            role="status"
            aria-live="polite"
            className={`text-sm ${state?.ok ? "text-biro" : "text-margin"}`}
          >
            {state?.message}
          </p>
          <button
            disabled={pending}
            className="h-11 shrink-0 rounded-lg bg-biro px-5 text-sm font-medium text-white transition-colors hover:bg-biro-deep disabled:opacity-60"
          >
            {pending ? "Saving…" : "Save note"}
          </button>
        </div>
      </div>
    </form>
  );
}
