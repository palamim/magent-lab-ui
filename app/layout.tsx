import type { Metadata } from "next";
import { Source_Serif_4, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "magent-lab — judge evaluation studies",
    template: "%s — magent-lab",
  },
  description:
    "Evaluation studies for LLM judges: versioned criteria, regression tests against labeled fixtures, and agreement measured against human labels.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sourceSerif.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white">
        <SiteHeader />
        <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16 sm:px-8">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
