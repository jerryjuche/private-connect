import type { AppProps } from "next/app";
import type { ReactNode } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import clsx from "clsx";
import WalletButton from "@/components/WalletButton";
import { APP_NAME, ROUTES } from "@/lib/constants";
import "../styles/globals.css";

const NAV = [
  { href: ROUTES.DISCOVER, label: "Discover" },
  { href: ROUTES.RESULTS, label: "Results" },
  { href: ROUTES.PROFILE, label: "Profile" },
];

function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useRouter();

  return (
    <div className="min-h-screen bg-void text-text flex flex-col">
      <header className="sticky top-0 z-50 border-b border-border/70 bg-void/85 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-6 lg:px-8">
          <Link href={ROUTES.HOME} className="group flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-arc/25 bg-arc/10 text-xs font-bold text-arc transition-colors duration-200 group-hover:bg-arc/15">
              ⬡
            </span>

            <div className="min-w-0">
              <p className="text-sm font-semibold tracking-[0.01em] text-bright">
                {APP_NAME}
              </p>
              <p className="text-[11px] font-mono uppercase tracking-[0.14em] text-dim">
                Private contact discovery
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <nav className="hidden items-center gap-1 rounded-2xl border border-border bg-surface/70 p-1.5 md:flex">
              {NAV.map(({ href, label }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={clsx(
                      "rounded-xl px-3.5 py-2 text-xs font-mono uppercase tracking-[0.14em] transition-all duration-200",
                      active
                        ? "border border-border bg-panel text-bright"
                        : "text-dim hover:text-text"
                    )}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>

            <WalletButton />
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mt-20 border-t border-border/60">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-5 py-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="space-y-1">
            <p className="text-sm font-medium text-bright">{APP_NAME}</p>
            <p className="max-w-md text-sm leading-6 text-dim">
              A privacy-preserving interface for discovering which contacts are already
              on the platform without exposing the full address book.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono uppercase tracking-[0.14em] text-dim">
            <span className="badge-accent">selective reveal</span>
            <span className="badge-signal">confidential matching</span>
            <Link href={ROUTES.DISCOVER} className="hover:text-bright">
              run demo
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>{`${APP_NAME} — Discover who’s already here without disclosing your address book.`}</title>
        <meta
          name="description"
          content="PrivateConnect is a privacy-preserving contact discovery experience built around confidential matching and selective reveal."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}