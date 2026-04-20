import clsx from "clsx";
import { DiscoveryPhase, PHASE_META } from "@/lib/constants";

const ORDER: DiscoveryPhase[] = ["normalizing","encrypting","submitting","processing","complete"];

export default function DiscoveryProgress({ phase, error }: { phase: DiscoveryPhase; error?: string | null }) {
  if (phase === "idle") return null;

  if (phase === "failed") return (
    <div className="rounded-xl border border-danger/30 bg-danger/5 p-5 space-y-2 animate-fade-up">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-danger" />
        <span className="font-mono text-sm text-danger font-semibold">Discovery failed</span>
      </div>
      <p className="text-sm text-dim">{error ?? "An unexpected error occurred. No data was exposed."}</p>
      <p className="text-xs font-mono text-muted pt-1">Privacy guarantee preserved — nothing was transmitted.</p>
    </div>
  );

  const cur = ORDER.indexOf(phase);

  return (
    <div className="space-y-4 animate-fade-up">
      <div className="rounded-xl border border-arc/25 bg-arc/5 p-4 space-y-1">
        <div className="flex items-center gap-2">
          {phase === "complete"
            ? <span className="w-2 h-2 rounded-full bg-arc" />
            : <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-arc opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-arc" /></span>
          }
          <span className="font-mono text-sm text-arc font-semibold">{PHASE_META[phase].label}</span>
        </div>
        <p className="text-xs text-dim pl-4">{PHASE_META[phase].detail}</p>
      </div>

      <div className="space-y-1.5">
        {ORDER.map((p, i) => {
          const done   = i < cur || phase === "complete";
          const active = p === phase && phase !== "complete";
          return (
            <div key={p} className={clsx("flex items-center gap-3 px-3 py-2 rounded-lg transition-colors", active && "bg-panel")}>
              <div className="w-4 h-4 flex items-center justify-center shrink-0">
                {done
                  ? <svg className="w-4 h-4 text-arc" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/><path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  : active
                  ? <span className="relative flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-arc opacity-60"/><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-arc"/></span>
                  : <span className="w-1.5 h-1.5 rounded-full bg-muted" />
                }
              </div>
              <span className={clsx("text-xs transition-colors",
                done ? "text-arc" : active ? "text-bright font-medium" : "text-muted"
              )}>{PHASE_META[p].label}</span>
              {done && <span className="ml-auto text-xs font-mono text-arc/50">done</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
