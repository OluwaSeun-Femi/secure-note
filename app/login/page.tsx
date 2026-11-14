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
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-4 py-12">
      <h1 className="font-serif text-3xl font-semibold leading-tight">
        Secure Notes
      </h1>
      <p className="mt-2 text-[15px] leading-7 text-ink-soft">
        Each tutor sees only their own notes. Log in, or sign up with your
        email.
      </p>

      <form className="mt-8 space-y-4 rounded-[10px] border border-rule bg-sheet p-5 sm:p-6">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Email</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            defaultValue={state?.email}
            className="h-11 w-full rounded-lg border border-rule bg-sheet px-3.5 text-base text-ink focus:border-biro focus:outline-none"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Password</span>
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            minLength={8}
            className="h-11 w-full rounded-lg border border-rule bg-sheet px-3.5 text-base text-ink focus:border-biro focus:outline-none"
          />
          <span className="mt-1.5 block text-xs text-ink-soft">
            At least 8 characters.
          </span>
        </label>

        <div className="flex gap-3 pt-1">
          <button
            formAction={(formData) => dispatch({ kind: "logIn", formData })}
            disabled={pending}
            className="h-11 flex-1 rounded-lg bg-biro text-sm font-medium text-white transition-colors hover:bg-biro-deep disabled:opacity-60"
          >
            Log in
          </button>
          <button
            formAction={(formData) => dispatch({ kind: "signUp", formData })}
            disabled={pending}
            className="h-11 flex-1 rounded-lg border border-rule text-sm font-medium text-ink transition-colors hover:border-ink-soft"
          >
            Sign up
          </button>
        </div>
      </form>

      <p role="status" aria-live="polite" className="mt-4 min-h-5 text-sm text-margin">
        {state?.message}
      </p>
    </main>
  );
}
