"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { deleteNote, updateNote } from "@/app/actions";
import { LoaderIcon, TrashIcon } from "@/app/icons";

// The editor keeps the colour the note has on the list.
const TINTS = ["sand", "mint", "sky", "lilac", "rose"] as const;

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
        className="anim-pop mt-5 rounded-2xl border border-line/60 shadow-[var(--shadow-sm)]"
        style={{ background: `var(--note-${TINTS[id % TINTS.length]})` }}
      >
        <input type="hidden" name="id" value={id} />
        <div className="p-4 sm:p-5">
          <label className="sr-only" htmlFor="edit-title">
            Title
          </label>
          <input
            id="edit-title"
            name="title"
            maxLength={200}
            defaultValue={state ? state.title : title}
            className="w-full border-b border-ink/15 bg-transparent pb-2.5 font-serif text-lg font-semibold text-ink focus:border-accent focus:outline-none"
          />
          <label className="sr-only" htmlFor="edit-body">
            Note
          </label>
          <textarea
            id="edit-body"
            name="body"
            rows={7}
            defaultValue={state ? state.body : body}
            className="mt-3 w-full resize-y bg-transparent text-[15px] leading-7 text-ink focus:outline-none"
          />
          <div className="mt-1 flex items-center justify-between gap-3 border-t border-ink/15 pt-3">
            <p role="status" aria-live="polite" className="min-w-0 text-sm text-danger">
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
                className="flex h-11 items-center gap-2 rounded-xl bg-accent px-5 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
              >
                {pending && <LoaderIcon size={15} />}
                {pending ? "Saving…" : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      </form>

      <div className="mt-8 border-t border-line pt-5">
        {confirming ? (
          <form
            action={deleteAction}
            className="anim-pop flex flex-wrap items-center gap-4"
          >
            <input type="hidden" name="id" value={id} />
            <p className="text-sm font-medium">This can&apos;t be undone.</p>
            <button
              disabled={deleting}
              className="flex h-11 items-center gap-2 rounded-xl bg-danger px-5 text-sm font-medium text-white transition-colors hover:bg-danger-hover disabled:opacity-60"
            >
              {deleting && <LoaderIcon size={15} />}
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
            className="inline-flex items-center gap-2 text-sm font-medium text-danger hover:underline hover:underline-offset-2"
          >
            <TrashIcon size={16} />
            Delete this note
          </button>
        )}
        {deleteState?.message && (
          <p role="status" aria-live="polite" className="mt-2.5 text-sm text-danger">
            {deleteState.message}
          </p>
        )}
      </div>
    </>
  );
}
