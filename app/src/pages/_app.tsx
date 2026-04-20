import type { AppProps } from "next/app";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import clsx from "clsx";
import WalletButton from "@/components/WalletButton";
import { APP_NAME, ROUTES } from "@/lib/constants";
import "@/styles/globals.css";

const NAV = [
  { href: ROUTES.DISCOVER, label: "Discover" },
  { href: ROUTES.PROFILE,  label: "Profile"  },
];

function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useRouter();
  return (
    <div className="min-h-screen bg-void text-text flex flex-col">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-void/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-5 py-3 flex items-center justify-between gap-4">
          <Link href={ROUTES.HOME} className="flex items-center gap-2.5 group">
            <span className="w-6 h-6 rounded bg-arc/15 border border-arc/30 flex items-center justify-center text-arc text-xs font-bold group-hover:bg-arc/25 transition-colors">⬡</span>
            <span className="font-bold text-sm tracking-wide text-bright">{APP_NAME}</span>
          </Link>
          <nav className="flex items-center gap-1">
            {NAV.map(({ href, label }) => (
              <Link key={href} href={href}
                className={clsx("px-3 py-1.5 rounded-lg text-xs font-mono transition-colors duration-150",
                  pathname === href ? "bg-panel text-bright border border-border" : "text-dim hover:text-text")}>
                {label}
              </Link>
            ))}
            <div className="ml-2"><WalletButton /></div>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border/40 py-6 mt-16">
        <div className="max-w-5xl mx-auto px-5 flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs font-mono text-muted">{APP_NAME} · Privacy-preserving contact discovery</p>
          <p className="text-xs font-mono text-muted">
            Powered by <span className="text-arc">Arcium MPC</span> · <span className="text-signal">Solana</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>{APP_NAME} — Find your people. Expose nothing.</title>
        <meta name="description" content="Privacy-preserving contact discovery powered by Arcium confidential compute on Solana." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </Head>
      <Layout><Component {...pageProps} /></Layout>
    </>
  );
}
