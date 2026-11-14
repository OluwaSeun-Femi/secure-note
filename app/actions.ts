"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type NoteState = {
  message: string;
  ok: boolean;
  title: string;
  body: string;
} | null;

const MISSING = "That note doesn't exist, or it isn't yours.";

export async function logOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

// Never trust input: check it before it goes to Supabase.
function readNote(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").replace(/\r\n/g, "\n");
  let problem: string | null = null;
  if (!title) problem = "Give the note a title before saving.";
  else if (title.length > 200) problem = "Keep the title under 200 characters.";
  return { title, body, problem };
}

function readId(formData: FormData) {
  const id = Number(formData.get("id"));
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function addNote(
  _prev: NoteState,
  formData: FormData,
): Promise<NoteState> {
  const { title, body, problem } = readNote(formData);
  if (problem) return { ok: false, message: problem, title, body };

  const supabase = await createClient();
  // No user_id: the database fills it in (default auth.uid()),
  // and row-level security checks it.
  const { error } = await supabase.from("notes").insert({ title, body });
  if (error) {
    return { ok: false, message: "Couldn't save the note. Try again.", title, body };
  }

  revalidatePath("/");
  return { ok: true, message: "Note saved.", title: "", body: "" };
}

export async function updateNote(
  _prev: NoteState,
  formData: FormData,
): Promise<NoteState> {
  const { title, body, problem } = readNote(formData);
  if (problem) return { ok: false, message: problem, title, body };

  const id = readId(formData);
  if (!id) return { ok: false, message: MISSING, title, body };

  const supabase = await createClient();
  // No user_id filter: row-level security only lets this user's rows change.
  // .select("id") returns the changed rows, so we can tell when nothing did.
  const { data, error } = await supabase
    .from("notes")
    .update({ title, body, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("id");

  if (error) {
    return { ok: false, message: "Couldn't save your changes. Try again.", title, body };
  }
  if (data.length === 0) return { ok: false, message: MISSING, title, body };

  revalidatePath("/");
  redirect("/");
}

export async function deleteNote(
  _prev: NoteState,
  formData: FormData,
): Promise<NoteState> {
  const id = readId(formData);
  if (!id) return { ok: false, message: MISSING, title: "", body: "" };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notes")
    .delete()
    .eq("id", id)
    .select("id");

  if (error) {
    return { ok: false, message: "Couldn't delete the note. Try again.", title: "", body: "" };
  }
  if (data.length === 0) return { ok: false, message: MISSING, title: "", body: "" };

  revalidatePath("/");
  redirect("/");
}
