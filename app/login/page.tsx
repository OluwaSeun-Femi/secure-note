"use client";

import { useActionState } from "react";
import { logIn, signUp, type AuthState } from "./actions";

type Submit = { kind: "logIn" | "signUp"; formData: FormData };

export default function LoginPage() {
  // One state for both buttons, so only the latest message shows.
  const [state, dispatch, pending] = useActionState(
    (prev: AuthState, { kind, formData }: Submit) =>
      kind === "logIn" ? logIn(prev, formData) : signUp(prev, formData),
    null,
  );

  return (
    <main className="flex flex-1 items-center justify-center bg-zinc-50 px-4 py-12">
      <div className="w-full max-w-sm">
        <h1 className="mb-1 text-2xl font-semibold text-zinc-900">Secure Notes</h1>
        <p className="mb-6 text-sm text-zinc-600">
          Log in, or sign up with your email.
        </p>

        <form className="space-y-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-zinc-800">Email</span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              defaultValue={state?.email}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-base text-zinc-900 outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-zinc-800">Password</span>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              minLength={8}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-base text-zinc-900 outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
            />
            <span className="mt-1 block text-xs text-zinc-500">At least 8 characters.</span>
          </label>

          <div className="flex gap-3 pt-1">
            <button
              formAction={(formData) => dispatch({ kind: "logIn", formData })}
              disabled={pending}
              className="flex-1 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-60"
            >
              Log in
            </button>
            <button
              formAction={(formData) => dispatch({ kind: "signUp", formData })}
              disabled={pending}
              className="flex-1 rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-900 hover:bg-zinc-100 disabled:opacity-60"
            >
              Sign up
            </button>
          </div>
        </form>

        <p role="status" aria-live="polite" className="mt-4 min-h-5 text-sm text-red-700">
          {state?.message}
        </p>
      </div>
    </main>
  );
}
