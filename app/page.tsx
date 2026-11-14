import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatLagos, wasEdited } from "@/lib/dates";
import { logOut } from "./actions";
import { NewNoteForm } from "./new-note-form";

type Search = Promise<Record<string, string | string[] | undefined>>;

export default function NotesPage({ searchParams }: { searchParams: Search }) {
  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-4 pb-16 pt-6 sm:pt-10">
      <header className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-serif text-[1.7rem] font-semibold leading-tight">
            My notes
          </h1>
          <Suspense
            fallback={<p className="mt-1.5 h-5 w-48 rounded bg-rule/70" aria-hidden />}
          >
            <LoggedInAs />
          </Suspense>
        </div>
        <form action={logOut}>
          <button className="h-10 shrink-0 rounded-lg border border-rule bg-sheet px-4 text-sm font-medium text-ink transition-colors hover:border-ink-soft">
            Log out
          </button>
        </form>
      </header>

      <NewNoteForm />

      <Suspense fallback={<ListSkeleton />}>
        <SearchAndNotes searchParams={searchParams} />
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
    <p className="mt-1 truncate text-sm text-ink-soft">
      Logged in as <span className="font-medium text-ink">{user.email}</span>
    </p>
  );
}

async function SearchAndNotes({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  const raw = typeof sp.q === "string" ? sp.q : "";
  // Strip filter syntax before the search reaches the database.
  const q = raw.replace(/[%_,*()\\<>]/g, " ").trim().slice(0, 80);

  const supabase = await createClient();
  // No user_id filter: row-level security only returns this user's notes.
  let query = supabase
    .from("notes")
    .select("id, title, body, created_at, updated_at")
    .order("created_at", { ascending: false });
  if (q) query = query.or(`title.ilike.*${q}*,body.ilike.*${q}*`);
  const { data: notes, error } = await query;

  return (
    <section className="mt-8">
      <form action="/" role="search">
        <label className="sr-only" htmlFor="q">
          Search your notes
        </label>
        <input
          id="q"
          name="q"
          type="search"
          defaultValue={q}
          placeholder="Search your notes"
          className="h-11 w-full rounded-lg border border-rule bg-sheet px-3.5 text-[15px] text-ink placeholder:text-ink-soft/70 focus:border-biro focus:outline-none"
        />
      </form>

      {error ? (
        <p className="mt-6 text-sm text-margin">
          Couldn&apos;t load your notes. Refresh to try again.
        </p>
      ) : (
        <NotesList notes={notes} q={q} />
      )}
    </section>
  );
}

function NotesList({
  notes,
  q,
}: {
  notes: {
    id: number;
    title: string;
    body: string;
    created_at: string;
    updated_at: string;
  }[];
  q: string;
}) {
  if (notes.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-ink-soft">
        {q ? (
          <>
            No notes match &ldquo;{q}&rdquo;.{" "}
            <Link href="/" className="text-biro underline underline-offset-2">
              Clear search
            </Link>
          </>
        ) : (
          "No notes yet. Write your first one above."
        )}
      </p>
    );
  }

  return (
    <>
      <p className="mt-5 text-sm text-ink-soft">
        {q
          ? `${notes.length} ${notes.length === 1 ? "note matches" : "notes match"} “${q}”`
          : `You have ${notes.length} ${notes.length === 1 ? "note" : "notes"}.`}
      </p>
      <ul className="mt-1 divide-y divide-rule border-t border-rule">
        {notes.map((note) => (
          <li key={note.id} className="py-4">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="min-w-0 break-words font-serif text-[1.05rem] font-semibold leading-snug">
                <Link
                  href={`/notes/${note.id}`}
                  className="hover:underline hover:underline-offset-2"
                >
                  {note.title}
                </Link>
              </h3>
              <Link
                href={`/notes/${note.id}`}
                className="shrink-0 text-sm font-medium text-biro hover:underline hover:underline-offset-2"
              >
                Edit
              </Link>
            </div>
            <p className="mt-0.5 flex flex-wrap gap-x-3 text-xs text-ink-soft">
              <time dateTime={note.created_at}>{formatLagos(note.created_at)}</time>
              {wasEdited(note.created_at, note.updated_at) && (
                <span className="italic">edited {formatLagos(note.updated_at)}</span>
              )}
            </p>
            {note.body && (
              <p className="mt-1.5 whitespace-pre-wrap break-words text-[15px] leading-7 text-ink/90">
                {note.body}
              </p>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}

function ListSkeleton() {
  return (
    <div className="mt-8" aria-hidden>
      <div className="h-11 rounded-lg border border-rule bg-sheet" />
      <div className="mt-6 space-y-5">
        <div className="h-4 w-2/5 rounded bg-rule/70" />
        <div className="h-4 w-3/5 rounded bg-rule/50" />
        <div className="h-4 w-1/2 rounded bg-rule/50" />
      </div>
    </div>
  );
}
