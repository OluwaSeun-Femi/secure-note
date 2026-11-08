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

export async function logOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function addNote(
  _prev: NoteState,
  formData: FormData,
): Promise<NoteState> {
  // Never trust input: check it before it goes to Supabase.
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").replace(/\r\n/g, "\n");

  if (!title) {
    return { ok: false, message: "Give the note a title before saving.", title, body };
  }
  if (title.length > 200) {
    return { ok: false, message: "Keep the title under 200 characters.", title, body };
  }

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
