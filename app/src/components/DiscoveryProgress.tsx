import clsx from "clsx";
import { DiscoveryPhase, PHASE_META } from "@/lib/constants";

const ORDER: DiscoveryPhase[] = [
  "normalizing",
  "encrypting",
  "submitting",
  "processing",
  "complete",
];

export default function DiscoveryProgress({
  phase,
  error,
}: {
  phase: DiscoveryPhase;
  error?: string | null;
}) {
  if (phase === "idle") return null;

  if (phase === "failed") {
    return (
      <div className="card-accent p-5">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-danger" />
            <p className="text-sm font-semibold text-bright">
              Discovery request failed
            </p>
          </div>

          <p className="text-sm leading-7 text-dim">
            {error ?? "The request could not be completed. No contact identities were revealed."}
          </p>

          <div className="rounded-xl border border-border bg-surface/80 px-4 py-3">
            <p className="label">Current status</p>
            <p className="mt-2 text-sm text-text">
              The request ended before producing a result view.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentIndex = ORDER.indexOf(phase);

  return (
    <div className="space-y-5">
      <div className="card-accent p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <p className="label">Execution status</p>
            <p className="text-lg font-semibold text-bright">
              {PHASE_META[phase].label}
            </p>
            <p className="max-w-xl text-sm leading-7 text-dim">
              {PHASE_META[phase].detail}
            </p>
          </div>

          <span className={phase === "complete" ? "badge-accent" : "badge-signal"}>
            {phase === "complete" ? "finalized" : "active"}
          </span>
        </div>
      </div>

      <div className="card-muted p-5">
        <div className="space-y-4">
          {ORDER.map((step, index) => {
            const done = index < currentIndex || phase === "complete";
            const active = step === phase && phase !== "complete";

            return (
              <div key={step} className="flex gap-4">
                <div className="relative flex flex-col items-center">
                  <span
                    className={clsx(
                      "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border text-xs font-mono",
                      done
                        ? "border-arc/30 bg-arc/10 text-arc"
                        : active
                        ? "border-signal/30 bg-signal/10 text-signal"
                        : "border-border bg-surface text-dim"
                    )}
                  >
                    {done ? "✓" : `0${index + 1}`}
                  </span>

                  {index < ORDER.length - 1 && (
                    <span
                      className={clsx("mt-2 h-10 w-px", done ? "bg-arc/30" : "bg-border")}
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1 pb-2">
                  <div className="flex items-center gap-2">
                    <p className={clsx("text-sm font-medium", done || active ? "text-bright" : "text-dim")}>
                      {PHASE_META[step].label}
                    </p>

                    {done && <span className="badge-accent">done</span>}
                    {active && <span className="badge-signal">current</span>}
                  </div>

                  <p className="mt-1 text-sm leading-7 text-dim">
                    {PHASE_META[step].detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}