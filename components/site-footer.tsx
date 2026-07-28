import { ExternalLink } from "@/components/external-link";
import { FaGithub, FaXTwitter } from "react-icons/fa6";

export function SiteFooter() {
  return (
    <footer className="border-t border-black/10 bg-panel font-sans">
      <div className="mx-auto w-full max-w-3xl px-6 py-8 text-xs text-zinc-500 sm:px-8">
        <p className="leading-5">
          Studies are run in{" "}
          <ExternalLink
            href="https://github.com/palamim/magent-lab"
            className="underline underline-offset-2 hover:text-black"
          >
            magent-lab
          </ExternalLink>
          , the evaluation harness. This site —{" "}
          <ExternalLink
            href="https://github.com/palamim/magent-lab-ui"
            className="underline underline-offset-2 hover:text-black"
          >
            magent-lab-ui
          </ExternalLink>{" "}
          — only holds the committed study JSON, the JSON Schema, and the UI
          that renders them; every number here is read from that export at
          build time.
        </p>

        <div className="mt-6 flex h-12 items-center justify-between gap-2 border-t border-black/10 pt-6">
          <p className="text-sm leading-6 text-zinc-700">
            <ExternalLink
              href="https://palamim.com/"
              className="underline underline-offset-2 hover:text-black"
            >
              Palamim
            </ExternalLink>
          </p>
          <div className="flex items-center gap-4">
            <ExternalLink
              href="https://x.com/leopalamim"
              aria-label="X (Twitter)"
              className="text-zinc-500 hover:text-black"
            >
              <FaXTwitter size={16} />
            </ExternalLink>
            <ExternalLink
              href="https://github.com/palamim"
              aria-label="GitHub"
              className="text-zinc-500 hover:text-black"
            >
              <FaGithub size={16} />
            </ExternalLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
