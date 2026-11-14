"use client";

import { useActionState, useState } from "react";
import { logIn, signUp, type AuthState } from "./actions";
import {
  EyeIcon,
  EyeOffIcon,
  LoaderIcon,
  LockIcon,
  LogoIcon,
  MailIcon,
  ShieldIcon,
} from "../icons";
import { ThemeToggle } from "../theme";

type Kind = "logIn" | "signUp";
type Submit = { kind: Kind; formData: FormData };

export default function LoginPage() {
  // One state for both buttons, so only the latest message shows.
  const [state, dispatch, pending] = useActionState(
    (prev: AuthState, { kind, formData }: Submit) =>
      kind === "logIn" ? logIn(prev, formData) : signUp(prev, formData),
    null,
  );
  const [kind, setKind] = useState<Kind>("logIn");
  const [showPassword, setShowPassword] = useState(false);

  const submit = (k: Kind) => (formData: FormData) => {
    setKind(k);
    dispatch({ kind: k, formData });
  };

  return (
    <main className="relative grid flex-1 place-items-center overflow-hidden px-4 py-10">
      {/* Soft colour washes behind the card. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-24 size-[340px] rounded-full bg-accent-soft blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-28 -right-20 size-[380px] rounded-full blur-3xl"
        style={{ background: "var(--note-mint)" }}
      />

      <div className="anim-sheet relative w-full max-w-[400px]">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 font-serif text-lg font-semibold">
            <LogoIcon />
            Asiri
          </span>
          <ThemeToggle />
        </div>

        <h1 className="mt-8 font-serif text-[2rem] font-semibold leading-tight tracking-[-0.015em]">
          Your notes, yours alone.
        </h1>
        <p className="mt-2 text-[15px] leading-7 text-ink-soft">
          Log in, or create your account. Each tutor sees only their own
          notes.
        </p>

        <form className="mt-6 space-y-4 rounded-2xl border border-line bg-surface p-5 shadow-[var(--shadow-lg)] sm:p-6">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Email</span>
            <div className="relative">
              <MailIcon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
              <input
                name="email"
                type="email"
                autoComplete="email"
                autoFocus
                required
                defaultValue={state?.email}
                placeholder="you@example.com"
                className="h-12 w-full rounded-xl border border-line bg-bg pl-11 pr-3.5 text-base text-ink placeholder:text-ink-faint/70 transition-colors focus:border-accent focus:outline-none"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Password</span>
            <div className="relative">
              <LockIcon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint" />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                minLength={8}
                placeholder="At least 8 characters"
                className="h-12 w-full rounded-xl border border-line bg-bg pl-11 pr-12 text-base text-ink placeholder:text-ink-faint/70 transition-colors focus:border-accent focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-1.5 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-ink-faint transition-colors hover:bg-sunken hover:text-ink"
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </label>

          {state?.message && (
            <p
              key={state.message + kind}
              role="status"
              aria-live="polite"
              className="anim-shake rounded-xl bg-danger-soft px-3.5 py-2.5 text-sm font-medium text-danger"
            >
              {state.message}
            </p>
          )}

          <div className="space-y-2.5 pt-1">
            <button
              formAction={submit("logIn")}
              disabled={pending}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent text-[15px] font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
            >
              {pending && kind === "logIn" && <LoaderIcon size={16} />}
              {pending && kind === "logIn" ? "Logging in…" : "Log in"}
            </button>
            <button
              formAction={submit("signUp")}
              disabled={pending}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-line bg-transparent text-[15px] font-medium text-ink transition-colors hover:bg-sunken disabled:opacity-60"
            >
              {pending && kind === "signUp" && <LoaderIcon size={16} />}
              {pending && kind === "signUp" ? "Creating account…" : "Sign up"}
            </button>
          </div>
        </form>

        <p className="mt-6 flex items-start gap-2 text-[13px] leading-5 text-ink-faint">
          <ShieldIcon size={15} className="mt-0.5 shrink-0" />
          Your privacy is enforced by the database itself: it only ever hands
          back the notes you wrote.
        </p>
      </div>
    </main>
  );
}
