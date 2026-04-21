import clsx from "clsx";

const STEPS = [
  {
    id: "01",
    tag: "Local",
    tone: "accent",
    title: "Contacts are prepared on-device",
    body: "Emails are normalized client-side before they enter the discovery workflow, keeping the raw address book outside general application state.",
  },
  {
    id: "02",
    tag: "Encrypted",
    tone: "signal",
    title: "Identifiers move through a confidential flow",
    body: "The matching path is designed around encrypted identifiers rather than broad plaintext ingestion.",
  },
  {
    id: "03",
    tag: "Compute",
    tone: "signal",
    title: "Overlap is resolved without broad disclosure",
    body: "The system determines whether a verified overlap exists for a given entry instead of revealing the full queried set.",
  },
  {
    id: "04",
    tag: "Reveal",
    tone: "accent",
    title: "Only confirmed matches are surfaced",
    body: "The requesting session receives the overlap view, while non-matching contacts remain outside the visible result model.",
  },
];

export default function PrivacyExplainer({
  compact = false,
}: {
  compact?: boolean;
}) {
  if (compact) {
    return (
      <div className="card p-5">
        <div className="space-y-4">
          <div>
            <p className="label">Privacy model</p>
            <h3 className="mt-1 text-lg font-semibold text-bright">
              Selective reveal by design
            </h3>
          </div>

          <p className="text-sm leading-7 text-dim">
            PrivateConnect is designed so discovery reveals only confirmed overlaps.
            Contacts that do not match do not become visible application identities.
          </p>

          <div className="flex flex-wrap gap-2">
            <span className="badge-accent">local preparation</span>
            <span className="badge-signal">confidential matching</span>
            <span className="badge-muted">result integrity</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="max-w-2xl">
        <p className="label">How it works</p>
        <h2 className="section-title mt-2">A privacy-preserving discovery model.</h2>
        <p className="mt-4 text-base leading-8 text-dim">
          The product is structured so discovery remains useful to the user while
          staying intentionally narrow in what it reveals to the system.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {STEPS.map((step) => (
          <div key={step.id} className="card p-6">
            <div className="flex items-start justify-between gap-4">
              <span className="text-xs font-mono uppercase tracking-[0.14em] text-dim">
                {step.id}
              </span>

              <span
                className={clsx(
                  step.tone === "accent" ? "badge-accent" : "badge-signal"
                )}
              >
                {step.tag}
              </span>
            </div>

            <div className="mt-5 space-y-3">
              <h3 className="text-lg font-semibold text-bright">{step.title}</h3>
              <p className="text-sm leading-7 text-dim">{step.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}