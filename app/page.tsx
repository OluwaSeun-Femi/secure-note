import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatLagos, wasEdited } from "@/lib/dates";
import { logOut } from "./actions";
import { LogoIcon, NotebookIcon, PencilIcon } from "./icons";
import { NewNoteForm } from "./new-note-form";
import { SearchBox } from "./search-box";
import { ThemeToggle } from "./theme";

type Search = Promise<Record<string, string | string[] | undefined>>;

// Each note keeps a colour of its own, derived from its id.
const TINTS = ["sand", "mint", "sky", "lilac", "rose"] as const;
const tint = (id: number) => `var(--note-${TINTS[id % TINTS.length]})`;

export default function NotesPage({ searchParams }: { searchParams: Search }) {
  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-4 pb-16 pt-6 sm:pt-8">
      <header className="flex items-center justify-between gap-3">
        <span className="flex min-w-0 items-center gap-2 font-serif text-lg font-semibold">
          <LogoIcon />
          Secure Notes
        </span>
        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          <form action={logOut}>
            <button className="h-10 rounded-xl border border-line bg-surface px-4 text-sm font-medium text-ink transition-colors hover:bg-sunken">
              Log out
            </button>
          </form>
        </div>
      </header>

      <div className="mt-8">
        <h1 className="font-serif text-[1.7rem] font-semibold leading-tight tracking-[-0.01em]">
          My notes
        </h1>
        <Suspense
          fallback={<p className="mt-1.5 h-5 w-48 rounded bg-sunken" aria-hidden />}
        >
          <LoggedInAs />
        </Suspense>
      </div>

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
      <SearchBox initial={q} />
      {error ? (
        <p className="mt-6 text-sm text-danger">
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
      <div className="py-12 text-center">
        <NotebookIcon size={34} className="mx-auto text-ink-faint" />
        <p className="mt-3 text-sm text-ink-soft">
          {q ? (
            <>
              No notes match &ldquo;{q}&rdquo;.{" "}
              <Link
                href="/"
                className="font-medium text-accent-ink underline underline-offset-2"
              >
                Clear search
              </Link>
            </>
          ) : (
            "No notes yet. Take your first one above."
          )}
        </p>
      </div>
    );
  }

  return (
    <>
      <p className="mt-5 text-sm text-ink-soft">
        {q
          ? `${notes.length} ${notes.length === 1 ? "note matches" : "notes match"} “${q}”`
          : `You have ${notes.length} ${notes.length === 1 ? "note" : "notes"}.`}
      </p>
      <ul className="mt-3 space-y-4">
        {notes.map((note) => (
          <li
            key={note.id}
            className="anim-pop group relative rounded-2xl border border-line/60 p-4 shadow-[var(--shadow-sm)] transition-shadow focus-within:border-line-strong hover:border-line-strong hover:shadow-[var(--shadow-lg)] sm:p-5"
            style={{ background: tint(note.id) }}
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="min-w-0 break-words pt-0.5 font-serif text-[1.08rem] font-semibold leading-snug">
                {/* The link covers the whole card, so a tap anywhere opens the note. */}
                <Link
                  href={`/notes/${note.id}`}
                  className="outline-none after:absolute after:inset-0 after:rounded-2xl after:content-[''] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-accent"
                >
                  {note.title}
                </Link>
              </h3>
              <span
                aria-hidden
                className="grid size-9 shrink-0 place-items-center rounded-lg text-ink-faint transition-colors group-hover:bg-ink/[0.06] group-hover:text-ink"
              >
                <PencilIcon size={16} />
              </span>
            </div>
            <p className="mt-0.5 flex flex-wrap gap-x-3 text-xs text-ink-faint">
              <time dateTime={note.created_at}>{formatLagos(note.created_at)}</time>
              {wasEdited(note.created_at, note.updated_at) && (
                <span className="italic">edited {formatLagos(note.updated_at)}</span>
              )}
            </p>
            {note.body && (
              <p className="mt-2 whitespace-pre-wrap break-words text-[15px] leading-7 text-ink/85">
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
      <div className="h-12 rounded-2xl border border-line bg-surface" />
      <div className="mt-5 space-y-4">
        <div className="h-24 rounded-2xl bg-sunken" />
        <div className="h-24 rounded-2xl bg-sunken/70" />
      </div>
    </div>
  );
}
