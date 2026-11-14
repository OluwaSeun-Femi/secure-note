"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { addNote } from "./actions";
import { PlusIcon, LoaderIcon } from "./icons";

export function NewNoteForm() {
  const [state, formAction, pending] = useActionState(addNote, null);
  const [open, setOpen] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const lastState = useRef(state);

  // A successful save folds the composer away again.
  useEffect(() => {
    if (state !== lastState.current) {
      lastState.current = state;
      if (state?.ok) setOpen(false);
    }
  }, [state]);

  useEffect(() => {
    if (open) titleRef.current?.focus();
  }, [open]);

  if (!open) {
    return (
      <div className="mt-6">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-13 w-full items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3.5 text-[15px] text-ink-faint shadow-[var(--shadow-sm)] transition-colors hover:border-line-strong hover:text-ink-soft"
        >
          <PlusIcon className="text-accent-ink" />
          Take a note for a student…
        </button>
        <p role="status" aria-live="polite" className="mt-2 min-h-5 text-sm text-accent-ink">
          {state?.ok ? state.message : null}
        </p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      aria-label="New note"
      onKeyDown={(e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
          e.currentTarget.requestSubmit();
        }
      }}
      className="anim-pop mt-6 rounded-2xl border border-line bg-surface shadow-[var(--shadow-lg)]"
    >
      <div className="p-4 sm:p-5">
        <label className="sr-only" htmlFor="new-title">
          Title
        </label>
        <input
          id="new-title"
          ref={titleRef}
          name="title"
          maxLength={200}
          defaultValue={state?.title}
          placeholder="Tolu, maths"
          className="w-full border-b border-line bg-transparent pb-2.5 font-serif text-lg font-semibold text-ink placeholder:font-sans placeholder:text-base placeholder:font-normal placeholder:text-ink-faint/70 focus:border-accent focus:outline-none"
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
          className="mt-3 w-full resize-y bg-transparent text-[15px] leading-7 text-ink placeholder:text-ink-faint/70 focus:outline-none"
        />
        <div className="mt-1 flex items-center justify-between gap-3 border-t border-line pt-3">
          <p
            role="status"
            aria-live="polite"
            className={`min-w-0 text-sm ${state?.ok ? "text-accent-ink" : "text-danger"}`}
          >
            {state && !state.ok ? state.message : null}
          </p>
          <div className="flex shrink-0 items-center gap-4">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-ink-soft transition-colors hover:text-ink"
            >
              Close
            </button>
            <button
              disabled={pending}
              className="flex h-11 items-center gap-2 rounded-xl bg-accent px-5 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
            >
              {pending && <LoaderIcon size={15} />}
              {pending ? "Saving…" : "Save note"}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
