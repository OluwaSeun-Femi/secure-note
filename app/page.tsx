import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logOut } from "./actions";
import { NewNoteForm } from "./new-note-form";

export default function NotesPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 space-y-6 px-4 py-6 sm:py-10">
      <header className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-zinc-900">My notes</h1>
          <Suspense fallback={<p className="text-sm text-zinc-500">Loading…</p>}>
            <LoggedInAs />
          </Suspense>
        </div>
        <form action={logOut}>
          <button className="shrink-0 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-100">
            Log out
          </button>
        </form>
      </header>

      <NewNoteForm />

      <Suspense fallback={<p className="text-sm text-zinc-500">Loading notes…</p>}>
        <NotesList />
      </Suspense>
    </main>
  );
}

async function LoggedInAs() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <p className="truncate text-sm text-zinc-600">
      Logged in as <span className="font-medium text-zinc-900">{user.email}</span>
    </p>
  );
}

async function NotesList() {
  const supabase = await createClient();
  // No .eq("user_id", ...): row-level security only returns this user's notes.
  const { data: notes, error } = await supabase
    .from("notes")
    .select("id, title, body, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return <p className="text-sm text-red-700">Couldn&apos;t load your notes. Refresh to try again.</p>;
  }

  if (!notes.length) {
    return (
      <p className="rounded-xl border border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-500">
        No notes yet. Write your first one above.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {notes.map((note) => (
        <li key={note.id} className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-zinc-200 sm:p-5">
          <h3 className="break-words font-semibold text-zinc-900">{note.title}</h3>
          <p className="mt-0.5 text-xs text-zinc-500">
            {new Date(note.created_at).toLocaleString("en-GB", {
              dateStyle: "medium",
              timeStyle: "short",
              timeZone: "Africa/Lagos",
            })}
          </p>
          {note.body && (
            <p className="mt-2 whitespace-pre-wrap break-words text-sm text-zinc-700">
              {note.body}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
