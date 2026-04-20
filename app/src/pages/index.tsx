import Link from "next/link";
import PrivacyExplainer from "@/components/PrivacyExplainer";
import { ROUTES } from "@/lib/constants";

const STATS = [
  { value: "0",    label: "bytes of plaintext uploaded to any server" },
  { value: "MPC",  label: "computation — no single party sees your list" },
  { value: "∞",    label: "non-matching contacts fully protected" },
];

export default function HomePage() {
  return (
    <div className="page">
      {/* Hero */}
      <section className="min-h-[55vh] flex flex-col justify-center stagger">
        <div className="mb-8">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-arc/30 bg-arc/5 text-arc text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-arc animate-pulse-slow" />
            Built on Arcium + Solana · Privacy-native
          </span>
        </div>
        <h1 className="text-5xl sm:text-7xl font-extrabold text-bright leading-[1.05] tracking-tight max-w-3xl">
          Find your people.<br />
          <span className="text-arc">Expose nothing.</span>
        </h1>
        <p className="mt-6 text-lg text-dim leading-relaxed max-w-xl">
          PrivateConnect discovers which of your contacts are already on the platform —
          without ever uploading your address book in plaintext. Powered by Arcium&apos;s
          confidential Multi-Party Computation.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href={ROUTES.ONBOARD} className="btn-primary">Get started →</Link>
          <Link href={ROUTES.DISCOVER} className="btn-ghost">Try the demo</Link>
        </div>
      </section>

      {/* Stats */}
      <section className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4 stagger">
        {STATS.map((s, i) => (
          <div key={i} className="card text-center space-y-1 hover:border-arc/20 transition-colors">
            <p className="text-3xl font-extrabold text-arc">{s.value}</p>
            <p className="text-xs text-dim leading-relaxed">{s.label}</p>
          </div>
        ))}
      </section>

      {/* How it works */}
      <section className="mt-20"><PrivacyExplainer /></section>

      {/* Bottom CTA */}
      <section className="mt-20 rounded-2xl border border-arc/20 bg-arc/5 p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-bright">Ready to discover privately?</h2>
          <p className="text-sm text-dim">Import up to 10 contacts. Results in seconds. Your list stays yours.</p>
        </div>
        <Link href={ROUTES.ONBOARD} className="btn-primary shrink-0">Get started →</Link>
      </section>
    </div>
  );
}
