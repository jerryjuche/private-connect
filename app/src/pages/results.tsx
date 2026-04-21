import { useEffect, useState } from "react";
import Link from "next/link";
import MatchCard from "@/components/MatchCard";
import PrivacyExplainer from "@/components/PrivacyExplainer";
import { loadResult } from "@/hooks/useDiscovery";
import { DiscoveryResult, ROUTES } from "@/lib/constants";

function Stat({
  value,
  label,
  tone = "default",
}: {
  value: string | number;
  label: string;
  tone?: "default" | "arc" | "signal";
}) {
  return (
    <div className="stat">
      <p
        className={`stat-value ${
          tone === "arc" ? "text-arc" : tone === "signal" ? "text-signal" : ""
        }`}
      >
        {value}
      </p>
      <p className="stat-label">{label}</p>
    </div>
  );
}

export default function ResultsPage() {
  const [result, setResult] = useState<DiscoveryResult | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setResult(loadResult());
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div className="page flex min-h-[60vh] items-center justify-center">
        <div className="card-muted w-full max-w-md p-8 text-center">
          <p className="label">Loading</p>
          <p className="mt-3 text-lg font-medium text-bright">
            Preparing results view…
          </p>
          <p className="mt-2 text-sm text-dim">
            Restoring the current session result.
          </p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="page flex min-h-[60vh] items-center justify-center">
        <div className="card w-full max-w-xl p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-surface text-xl text-dim">
            ◇
          </div>

          <p className="label mt-6">No result available</p>
          <h1 className="mt-2 text-2xl font-semibold text-bright">
            No discovery result found.
          </h1>
          <p className="mt-3 text-sm leading-7 text-dim">
            Run a private discovery request first to generate a result view.
          </p>

          <div className="mt-6 flex justify-center">
            <Link href={ROUTES.DISCOVER} className="btn-primary">
              Go to discovery
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { matched, total, hiddenCount } = result;
  const matchRate = total > 0 ? Math.round((matched.length / total) * 100) : 0;

  return (
    <div className="page">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-8">
          <div className="stagger space-y-3">
            <span className="eyebrow">
              <span className="h-1.5 w-1.5 rounded-full bg-arc animate-pulse-slow" />
              Result view
            </span>

            <div className="space-y-3">
              <h1 className="section-title">
                {matched.length === 0
                  ? "No secure matches found."
                  : matched.length === 1
                  ? "1 secure match found."
                  : `${matched.length} secure matches found.`}
              </h1>

              <p className="section-copy">
                This view contains only confirmed overlaps from the submitted batch.
                Contacts that did not match remain outside the result set.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Stat value={total} label="contacts checked" />
            <Stat value={matched.length} label="confirmed matches" tone="arc" />
            <Stat value={hiddenCount} label="protected non-matches" tone="signal" />
          </div>

          <div className="card-accent p-6 sm:p-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="space-y-1">
                <p className="label">Result summary</p>
                <h2 className="text-2xl font-semibold tracking-tight text-bright">
                  Overlap rate: {matchRate}%
                </h2>
                <p className="text-sm leading-7 text-dim">
                  {matched.length} of {total} submitted contacts resolved to
                  registered profiles.
                </p>
              </div>

              <div className="w-full max-w-xs">
                <div className="mb-2 flex items-center justify-between text-xs font-mono uppercase tracking-[0.14em] text-dim">
                  <span>overlap</span>
                  <span>{matched.length}/{total}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface">
                  <div
                    className="h-full rounded-full bg-arc transition-all duration-700"
                    style={{ width: `${matchRate}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {matched.length === 0 ? (
            <div className="card p-7">
              <p className="text-lg font-semibold text-bright">
                This batch did not resolve to any registered profiles.
              </p>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-dim">
                The request still completed successfully. It simply means no
                verified overlaps were found for this set of contacts.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link href={ROUTES.DISCOVER} className="btn-primary">
                  Run another request
                </Link>
                <Link href={ROUTES.HOME} className="btn-secondary">
                  Back home
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="label">Matched profiles</p>
                  <h2 className="mt-1 text-xl font-semibold text-bright">
                    Confirmed overlap set
                  </h2>
                </div>
                <span className="badge-accent">{matched.length} revealed</span>
              </div>

              <div className="space-y-3">
                {matched.map((profile, index) => (
                  <MatchCard key={profile.id} profile={profile} index={index} />
                ))}
              </div>
            </div>
          )}

          <div className="card p-6">
            <div className="flex items-start gap-3">
              <span className="mt-1 text-arc">◆</span>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-bright">
                  Visibility guarantee
                </p>
                <p className="text-sm leading-7 text-dim">
                  Only the overlap set is surfaced here. The {hiddenCount} non-matching
                  contact{hiddenCount !== 1 ? "s remain" : " remains"} outside the
                  visible product result.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href={ROUTES.DISCOVER} className="btn-primary">
              Run another request
            </Link>
            <Link href={ROUTES.HOME} className="btn-secondary">
              Back home
            </Link>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="card-muted p-5">
            <p className="label">Result integrity</p>
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-sm font-medium text-bright">Output scope</p>
                <p className="mt-1 text-sm leading-7 text-dim">
                  The result view is intentionally narrow: overlap count,
                  protected non-match count, and matched profiles only.
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-bright">Session visibility</p>
                <p className="mt-1 text-sm leading-7 text-dim">
                  This output is shown back to the requesting session only. It is
                  not a broad contact-upload reveal surface.
                </p>
              </div>
            </div>
          </div>

          <PrivacyExplainer compact />
        </aside>
      </div>
    </div>
  );
}