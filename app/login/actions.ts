"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { message: string; email: string } | null;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Never trust input: check it before it goes to Supabase.
function readInput(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  let problem: string | null = null;
  if (!EMAIL.test(email)) problem = "Enter a real email address.";
  else if (password.length < 8)
    problem = "Password must be at least 8 characters.";
  return { email, password, problem };
}

export async function logIn(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const { email, password, problem } = readInput(formData);
  // A short password can't be anyone's password: same answer as a wrong one.
  if (problem) {
    return {
      email,
      message: EMAIL.test(email) ? "Wrong email or password." : problem,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  // Always the same message, so the form can't be used to find out
  // which emails have accounts.
  if (error) return { email, message: "Wrong email or password." };

  redirect("/");
}

export async function signUp(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const { email, password, problem } = readInput(formData);
  if (problem) return { email, message: problem };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    if (error.code === "user_already_exists") {
      return { email, message: "That email already has an account. Log in instead." };
    }
    return { email, message: `Couldn't sign up: ${error.message}` };
  }

  // No session means Confirm email is still on in Supabase.
  if (!data.session) {
    return {
      email,
      message:
        "Account created, but it needs email confirmation. Ask your captain to turn off Confirm email.",
    };
  }

  redirect("/");
}
