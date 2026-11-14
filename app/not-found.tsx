import Link from "next/link";
import { LogoIcon } from "./icons";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-start justify-center px-4 py-16">
      <LogoIcon size={34} />
      <h1 className="mt-5 font-serif text-[1.7rem] font-semibold leading-tight">
        Not found
      </h1>
      <p className="mt-2 text-[15px] leading-7 text-ink-soft">
        That page or note doesn&apos;t exist, or it isn&apos;t yours.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex h-11 items-center rounded-xl bg-accent px-5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
      >
        Back to my notes
      </Link>
    </main>
  );
}
