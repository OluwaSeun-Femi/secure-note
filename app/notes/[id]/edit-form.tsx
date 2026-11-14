"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { deleteNote, updateNote } from "@/app/actions";

export function EditNoteForm({
  id,
  title,
  body,
}: {
  id: number;
  title: string;
  body: string;
}) {
  const [state, formAction, pending] = useActionState(updateNote, null);
  const [deleteState, deleteAction, deleting] = useActionState(deleteNote, null);
  const [confirming, setConfirming] = useState(false);

  return (
    <>
      <form
        action={formAction}
        aria-label="Edit note"
        onKeyDown={(e) => {
          if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
            e.currentTarget.requestSubmit();
          }
        }}
        className="relative mt-5 overflow-hidden rounded-[10px] border border-rule bg-sheet"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-6 w-px bg-margin/50"
        />
        <input type="hidden" name="id" value={id} />
        <div className="py-4 pl-10 pr-4 sm:pr-5">
          <label className="sr-only" htmlFor="edit-title">
            Title
          </label>
          <input
            id="edit-title"
            name="title"
            maxLength={200}
            defaultValue={state ? state.title : title}
            className="w-full border-b border-rule bg-transparent pb-2.5 font-serif text-lg font-semibold text-ink focus:border-biro focus:outline-none"
          />
          <label className="sr-only" htmlFor="edit-body">
            Note
          </label>
          <textarea
            id="edit-body"
            name="body"
            rows={6}
            defaultValue={state ? state.body : body}
            className="mt-3 w-full resize-y bg-transparent text-[15px] leading-7 text-ink focus:outline-none"
          />
          <div className="mt-1 flex items-center justify-between gap-3 border-t border-rule pt-3">
            <p role="status" aria-live="polite" className="text-sm text-margin">
              {state?.message}
            </p>
            <div className="flex shrink-0 items-center gap-4">
              <Link
                href="/"
                className="text-sm font-medium text-ink-soft transition-colors hover:text-ink"
              >
                Cancel
              </Link>
              <button
                disabled={pending}
                className="h-11 rounded-lg bg-biro px-5 text-sm font-medium text-white transition-colors hover:bg-biro-deep disabled:opacity-60"
              >
                {pending ? "Saving…" : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      </form>

      <div className="mt-8 border-t border-rule pt-4">
        {confirming ? (
          <form action={deleteAction} className="flex flex-wrap items-center gap-4">
            <input type="hidden" name="id" value={id} />
            <p className="text-sm text-ink">This can&apos;t be undone.</p>
            <button
              disabled={deleting}
              className="h-11 rounded-lg bg-margin px-5 text-sm font-medium text-white transition-colors hover:bg-margin/85 disabled:opacity-60"
            >
              {deleting ? "Deleting…" : "Delete for good"}
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="text-sm font-medium text-ink-soft transition-colors hover:text-ink"
            >
              Keep it
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="text-sm font-medium text-margin hover:underline hover:underline-offset-2"
          >
            Delete this note
          </button>
        )}
        {deleteState?.message && (
          <p role="status" aria-live="polite" className="mt-2 text-sm text-margin">
            {deleteState.message}
          </p>
        )}
      </div>
    </>
  );
}
