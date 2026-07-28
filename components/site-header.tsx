import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-black/10 font-sans">
      <div className="mx-auto flex w-full max-w-3xl items-baseline justify-between px-6 py-6 sm:px-8">
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-black"
        >
          magent-lab
        </Link>
        <span className="text-xs text-zinc-500">
          judge evaluation studies
        </span>
      </div>
    </header>
  );
}
