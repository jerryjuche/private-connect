import Link from "next/link";
import PrivacyExplainer from "@/components/PrivacyExplainer";
import { ROUTES } from "@/lib/constants";

const METRICS = [
  { value: "10", label: "contacts per request" },
  { value: "3", label: "seeded secure matches" },
  { value: "0", label: "plaintext contacts stored" },
];

const PRINCIPLES = [
  {
    title: "Local preparation",
    body: "Contacts are normalized before the discovery flow begins, keeping the raw address book out of general application state.",
  },
  {
    title: "Confidential matching",
    body: "The product is shaped around encrypted matching rather than broad plaintext ingestion and server-side indexing.",
  },
  {
    title: "Selective reveal",
    body: "Only verified overlaps are returned to the requesting user. Non-matching contacts stay outside the visible result model.",
  },
];

export default function HomePage() {
  return (
    <div className="page">
      <section className="grid items-center gap-14 py-8 lg:grid-cols-[1.08fr_0.92fr] lg:py-14">
        <div className="stagger space-y-8">
          <div className="space-y-4">
            <span className="eyebrow">
              <span className="h-1.5 w-1.5 rounded-full bg-arc animate-pulse-slow" />
              Confidential contact discovery
            </span>

            <div className="max-w-3xl space-y-5">
              <h1 className="text-5xl font-extrabold leading-[0.96] tracking-tight text-bright sm:text-6xl lg:text-7xl">
                Discover who’s already here.
                <br />
                <span className="text-arc">Disclose only the overlap.</span>
              </h1>

              <p className="max-w-2xl text-base leading-8 text-dim sm:text-lg">
                PrivateConnect turns contact discovery into a narrow,
                privacy-preserving workflow. Instead of uploading a full address
                book and trusting a server, the product is designed to reveal only
                confirmed matches.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href={ROUTES.ONBOARD} className="btn-primary">
              Create profile
            </Link>
            <Link href={ROUTES.DISCOVER} className="btn-secondary">
              Run demo
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {METRICS.map((item) => (
              <div key={item.label} className="stat">
                <p className="stat-value">{item.value}</p>
                <p className="stat-label">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card-accent p-6 sm:p-7">
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="label">Private match preview</p>
                <h2 className="text-xl font-semibold text-bright">
                  Example discovery run
                </h2>
              </div>

              <span className="badge-accent">demo</span>
            </div>

            <div className="rounded-2xl border border-border bg-surface/80 p-4">
              <div className="flex items-center justify-between text-xs font-mono uppercase tracking-[0.14em] text-dim">
                <span>submitted batch</span>
                <span>10 contacts</span>
              </div>

              <div className="mt-4 space-y-3">
                {[
                  { label: "bob@example.com", tone: "match" },
                  { label: "carol@example.com", tone: "match" },
                  { label: "dave@example.com", tone: "match" },
                  { label: "7 protected non-matches", tone: "hidden" },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between rounded-xl border border-border bg-panel px-3 py-3"
                  >
                    <span className="truncate text-sm text-text">{row.label}</span>
                    {row.tone === "match" ? (
                      <span className="badge-accent">revealed</span>
                    ) : (
                      <span className="badge-muted">hidden</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-border bg-surface px-4 py-4">
                <p className="label">input</p>
                <p className="mt-2 text-sm font-medium text-bright">
                  normalized locally
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-surface px-4 py-4">
                <p className="label">compute</p>
                <p className="mt-2 text-sm font-medium text-bright">
                  confidential overlap
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-surface px-4 py-4">
                <p className="label">output</p>
                <p className="mt-2 text-sm font-medium text-bright">
                  verified matches only
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-3">
        {PRINCIPLES.map((item) => (
          <div key={item.title} className="card p-6">
            <p className="label">{item.title}</p>
            <h3 className="mt-2 text-lg font-semibold text-bright">{item.title}</h3>
            <p className="mt-3 text-sm leading-7 text-dim">{item.body}</p>
          </div>
        ))}
      </section>

      <section className="mt-20">
        <PrivacyExplainer />
      </section>

      <section className="mt-20">
        <div className="card-accent flex flex-col gap-6 p-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="label">Next step</p>
            <h2 className="section-title">
              Start with profile setup, then move straight into private discovery.
            </h2>
            <p className="section-copy">
              The current demo is designed to show the full product story end to end:
              controlled identity, bounded input, confidential matching, and a
              selective result view.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href={ROUTES.ONBOARD} className="btn-primary">
              Get started
            </Link>
            <Link href={ROUTES.DISCOVER} className="btn-secondary">
              Open discovery
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}