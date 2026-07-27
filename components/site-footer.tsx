export function SiteFooter() {
  return (
    <footer className="border-t border-black/10">
      <div className="mx-auto w-full max-w-3xl px-6 py-8 text-xs text-zinc-500 sm:px-8">
        <p>
          Every number on this site is read from a committed study export at
          build time — see the data and schema in{" "}
          <a
            href="https://github.com/palamim/magent-lab-ui"
            className="underline underline-offset-2 hover:text-black"
          >
            the repository
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
