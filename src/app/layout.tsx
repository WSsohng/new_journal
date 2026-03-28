import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TrustLayer Journal",
  description: "AI-native reviewed preprint and overlay journal platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="nature-shell min-h-full flex flex-col">
        <header className="border-b nature-divider bg-white">
          <div className="h-1 w-full bg-[var(--nature-blue)]" />
          <div className="mx-auto w-full max-w-[1200px] px-6 py-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Link href="/" className="text-3xl leading-none text-black no-underline">
                <span className="bg-[var(--nature-blue)] px-2 py-1 text-white">TrustLayer</span>{" "}
                Journal
              </Link>
              <p className="text-sm text-[var(--nature-muted)]">
                AI-native reviewed preprint and overlay platform
              </p>
            </div>
          </div>
          <div className="border-t nature-divider">
            <div className="mx-auto flex w-full max-w-[1200px] items-center gap-6 px-6 py-3 text-sm font-medium text-[#303030]">
              <Link className="no-underline hover:underline" href="/submissions">
                Explore content
              </Link>
              <Link className="no-underline hover:underline" href="/submissions/new">
                Publish with us
              </Link>
              <Link className="no-underline hover:underline" href="/">
                About the platform
              </Link>
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-[1200px] flex-1 px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
