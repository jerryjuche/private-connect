import clsx from "clsx";

const STEPS = [
  { n:"01", tag:"Local",      color:"arc",    title:"Contacts hashed locally",        body:"Each email is normalized and SHA-256 hashed before any network call. Your list never leaves your device in plaintext." },
  { n:"02", tag:"Arcium MPC", color:"signal", title:"Identifiers encrypted",          body:"Hashed identifiers are encrypted with Arcium's x25519 key. Only the MPC cluster can operate on this data — no server or API." },
  { n:"03", tag:"Arcium MPC", color:"signal", title:"Private set intersection",       body:"Arcium nodes jointly compute the overlap. No single node sees the full picture. Non-matches are mathematically invisible." },
  { n:"04", tag:"Local",      color:"arc",    title:"Only matches returned",          body:"An encrypted bitmask returns to your browser. You decrypt it locally. Only matched profiles are ever revealed." },
];

export default function PrivacyExplainer({ compact = false }: { compact?: boolean }) {
  if (compact) return (
    <div className="rounded-xl border border-border bg-panel/50 p-4 space-y-3">
      <p className="label">Privacy guarantee</p>
      <p className="text-xs text-dim leading-relaxed">
        Contacts hashed and encrypted before leaving your browser. Arcium MPC computes the match on encrypted data.
        Non-matching contacts are mathematically invisible to the platform.
      </p>
      <div className="flex flex-wrap gap-2 pt-1">
        {["Zero plaintext upload","Non-matches hidden","Client-side decrypt"].map(t => (
          <span key={t} className="px-2 py-0.5 rounded-full border border-arc/20 bg-arc/5 text-arc text-xs font-mono">
            {t}
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <section className="space-y-6">
      <div>
        <p className="label mb-1">How it works</p>
        <h2 className="text-2xl font-bold text-bright">Four steps. Zero exposure.</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {STEPS.map(s => (
          <div key={s.n} className="card space-y-3 hover:border-border/60 transition-colors">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-muted">{s.n}</span>
              <span className={clsx("font-mono text-xs px-2 py-0.5 rounded-full border",
                s.color === "arc"
                  ? "text-arc border-arc/30 bg-arc/5"
                  : "text-signal border-signal/30 bg-signal/5"
              )}>{s.tag}</span>
            </div>
            <p className="font-semibold text-text text-sm">{s.title}</p>
            <p className="text-xs text-dim leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
