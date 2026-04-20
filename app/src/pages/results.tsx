import { useEffect, useState } from "react";
import Link from "next/link";
import MatchCard from "@/components/MatchCard";
import PrivacyExplainer from "@/components/PrivacyExplainer";
import { loadResult } from "@/hooks/useDiscovery";
import { DiscoveryResult, ROUTES } from "@/lib/constants";

export default function ResultsPage() {
  const [result, setResult] = useState<DiscoveryResult | null>(null);
  const [ready,  setReady]  = useState(false);

  useEffect(() => { setResult(loadResult()); setReady(true); }, []);

  if (!ready) return <div className="page flex items-center justify-center min-h-[60vh]"><p className="text-dim font-mono text-sm animate-pulse-slow">Loading…</p></div>;

  if (!result) return (
    <div className="page max-w-lg mx-auto text-center flex flex-col items-center justify-center min-h-[60vh] space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-panel border border-border flex items-center justify-center text-2xl">◇</div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-bright">No results yet</h1>
        <p className="text-dim text-sm">Run a contact discovery first.</p>
      </div>
      <Link href={ROUTES.DISCOVER} className="btn-primary">Go to Discovery →</Link>
    </div>
  );

  const { matched, total, hiddenCount } = result;
  const rate = total > 0 ? Math.round((matched.length / total) * 100) : 0;

  if (matched.length === 0) return (
    <div className="page max-w-lg mx-auto space-y-8 stagger">
      <div><p className="label mb-1">Discovery complete</p><h1 className="text-3xl font-extrabold text-bright">No contacts found.</h1></div>
      <div className="grid grid-cols-3 gap-3">
        <Stat value={total} label="checked" />
        <Stat value={0} label="matched" accent="arc" />
        <Stat value={hiddenCount} label="protected" accent="dim" />
      </div>
      <div className="card space-y-2">
        <p className="text-sm font-semibold text-bright flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-arc" />Privacy preserved</p>
        <p className="text-sm text-dim leading-relaxed">None of your {total} contact{total !== 1 ? "s" : ""} are currently registered. The platform never learned who you searched for.</p>
      </div>
      <div className="flex gap-3">
        <Link href={ROUTES.DISCOVER} className="btn-primary flex-1 text-center">Try again</Link>
        <Link href={ROUTES.HOME} className="btn-ghost flex-1 text-center">Home</Link>
      </div>
    </div>
  );

  return (
    <div className="page">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
        <div className="space-y-7">
          <div className="stagger space-y-2">
            <p className="label">Discovery complete</p>
            <h1 className="text-3xl font-extrabold text-bright">
              {matched.length === 1 ? "1 contact found." : `${matched.length} contacts found.`}
            </h1>
            <p className="text-dim text-sm max-w-md">These contacts are registered on PrivateConnect. Non-matching contacts were never revealed to us.</p>
          </div>

          <div className="grid grid-cols-3 gap-3 animate-fade-up">
            <Stat value={total} label="checked" />
            <Stat value={matched.length} label="matched" accent="arc" />
            <Stat value={hiddenCount} label="protected" accent="dim" />
          </div>

          <div className="space-y-3">
            {matched.map((p, i) => <MatchCard key={p.id} profile={p} index={i} />)}
          </div>

          <div className="flex gap-3 p-4 rounded-xl border border-arc/20 bg-arc/5 animate-fade-up">
            <span className="text-arc shrink-0 mt-0.5">◆</span>
            <p className="text-xs text-dim leading-relaxed">
              <span className="text-arc font-semibold">Privacy guarantee: </span>
              {hiddenCount > 0
                ? `${hiddenCount} contact${hiddenCount !== 1 ? "s" : ""} did not match. Their identities were never exposed — the platform received only an encrypted bitmask.`
                : "The platform received only an encrypted bitmask — not your contact list."}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 animate-fade-up">
            <Link href={ROUTES.DISCOVER} className="btn-primary">Run another discovery</Link>
            <Link href={ROUTES.HOME} className="btn-ghost">Back home</Link>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="card space-y-4">
            <p className="label">Match rate</p>
            <div className="space-y-2">
              <div className="flex items-end justify-between">
                <span className="text-4xl font-extrabold text-bright">{rate}%</span>
                <span className="text-xs text-dim font-mono mb-1">{matched.length}/{total}</span>
              </div>
              <div className="h-1.5 rounded-full bg-surface overflow-hidden">
                <div className="h-full bg-arc rounded-full transition-all duration-700" style={{ width: `${rate}%` }} />
              </div>
              <p className="text-xs text-muted">{hiddenCount} contact{hiddenCount !== 1 ? "s" : ""} not on platform — identities remain private.</p>
            </div>
          </div>
          <PrivacyExplainer compact />
        </aside>
      </div>
    </div>
  );
}

function Stat({ value, label, accent }: { value: number; label: string; accent?: "arc"|"dim" }) {
  return (
    <div className="card text-center p-4 space-y-1">
      <p className={accent === "arc" ? "text-2xl font-extrabold text-arc" : accent === "dim" ? "text-2xl font-extrabold text-dim" : "text-2xl font-extrabold text-bright"}>{value}</p>
      <p className="text-xs text-muted font-mono">{label}</p>
    </div>
  );
}
