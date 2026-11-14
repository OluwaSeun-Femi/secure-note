import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatLagos, wasEdited } from "@/lib/dates";
import { EditNoteForm } from "./edit-form";

export default function EditNotePage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-4 pb-16 pt-6 sm:pt-10">
      <p>
        <Link
          href="/"
          className="text-sm font-medium text-ink-soft transition-colors hover:text-ink"
        >
          Back to my notes
        </Link>
      </p>
      <h1 className="mt-3 font-serif text-[1.7rem] font-semibold leading-tight">
        Edit note
      </h1>
      <Suspense fallback={<EditSkeleton />}>
        <NoteLoader params={params} />
      </Suspense>
    </main>
  );
}

async function NoteLoader({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();

  const supabase = await createClient();
  // No user_id filter: row-level security means someone else's note
  // simply comes back empty, and we show "Not found".
  const { data: note, error } = await supabase
    .from("notes")
    .select("id, title, body, created_at, updated_at")
    .eq("id", Number(id))
    .maybeSingle();

  if (error) {
    return (
      <p className="mt-6 text-sm text-margin">
        Couldn&apos;t load this note. Refresh to try again.
      </p>
    );
  }
  if (!note) notFound();

  return (
    <>
      <p className="mt-1.5 flex flex-wrap gap-x-3 text-xs text-ink-soft">
        <time dateTime={note.created_at}>Written {formatLagos(note.created_at)}</time>
        {wasEdited(note.created_at, note.updated_at) && (
          <span className="italic">edited {formatLagos(note.updated_at)}</span>
        )}
      </p>
      <EditNoteForm id={note.id} title={note.title} body={note.body} />
    </>
  );
}

function EditSkeleton() {
  return (
    <div className="mt-6 h-64 rounded-[10px] border border-rule bg-sheet" aria-hidden />
  );
}
