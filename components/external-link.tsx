import type { AnchorHTMLAttributes, ReactNode } from "react";

export function ExternalLink({
  href,
  children,
  ...props
}: { href: string; children: ReactNode } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  );
}
