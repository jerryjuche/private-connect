import Link from "next/link";
import clsx from "clsx";
import ContactImporter from "@/components/ContactImporter";
import DiscoveryProgress from "@/components/DiscoveryProgress";
import PrivacyExplainer from "@/components/PrivacyExplainer";
import { useDiscovery } from "@/hooks/useDiscovery";
import { loadProfile } from "./onboard";
import { ROUTES, MAX_CONTACTS } from "@/lib/constants";

export default function DiscoverPage() {
  const { state, discover, reset } = useDiscovery();
  const profile = typeof window !== "undefined" ? loadProfile() : null;
  const isIdle   = state.phase === "idle";
  const isActive = !isIdle && state.phase !== "complete" && state.phase !== "failed";

  return (
    <div className="page">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
        {/* Main */}
        <div className="space-y-7">
          <div className="stagger space-y-2">
            <p className="label">Contact discovery</p>
            <h1 className="text-3xl font-extrabold text-bright">Find who&apos;s already here.</h1>
            <p className="text-dim text-sm leading-relaxed max-w-lg">
              Import up to {MAX_CONTACTS} contacts. We find who&apos;s registered without ever seeing your full list.
              Non-matching contacts remain invisible to us — by design.
            </p>
          </div>

          {/* Profile strip */}
          {profile ? (
            <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-surface animate-fade-up">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-void font-bold text-xs shrink-0"
                   style={{ backgroundColor: profile.avatar ?? "#6EE7B7" }}>
                {profile.username.slice(0,2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-text text-sm font-medium">@{profile.username}</span>
                <span className={clsx("ml-2 text-xs font-mono", profile.isDiscoverable ? "text-arc" : "text-muted")}>
                  · {profile.isDiscoverable ? "discoverable" : "hidden"}
                </span>
              </div>
              <Link href={ROUTES.PROFILE} className="text-xs text-dim hover:text-text transition-colors">Edit →</Link>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 rounded-xl border border-warn/20 bg-warn/5 animate-fade-up">
              <span className="text-warn">⚠</span>
              <p className="text-dim text-sm flex-1">
                No profile yet.{" "}
                <Link href={ROUTES.ONBOARD} className="text-arc hover:underline">Create one</Link>{" "}
                to make yourself discoverable too.
              </p>
            </div>
          )}

          {/* Interaction card */}
          <div className="card space-y-6 animate-fade-up">
            {isIdle && <ContactImporter onSubmit={discover} disabled={false} />}

            {isActive && (
              <div className="space-y-6">
                <ContactImporter onSubmit={discover} disabled={true} />
                <div className="border-t border-border pt-6">
                  <DiscoveryProgress phase={state.phase} error={state.error} />
                </div>
              </div>
            )}

            {state.phase === "failed" && (
              <div className="space-y-5">
                <DiscoveryProgress phase={state.phase} error={state.error} />
                <button onClick={reset} className="btn-ghost w-full text-sm">Try again</button>
              </div>
            )}

            {state.phase === "complete" && (
              <div className="space-y-3">
                <DiscoveryProgress phase={state.phase} />
                <p className="text-xs text-center text-dim font-mono animate-fade-up">Navigating to results…</p>
              </div>
            )}
          </div>

          {/* Batch summary */}
          {state.validCount > 0 && isActive && (
            <div className="card text-xs font-mono space-y-2 animate-fade-up">
              <p className="label">Batch</p>
              <p className="text-arc">{state.validCount} contact{state.validCount !== 1 ? "s" : ""} queued for private matching</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-5">
          <PrivacyExplainer compact />
          <div className="card space-y-4">
            <p className="label">Quick guide</p>
            <ol className="space-y-3">
              {["Paste emails or upload a CSV (up to 10).","Contacts normalized and hashed locally.","Encrypted payload matched against registry.","Only matched profiles shown — nothing else."].map((s,i) => (
                <li key={i} className="flex gap-3 text-xs text-dim leading-relaxed">
                  <span className="font-mono text-arc shrink-0">0{i+1}</span>{s}
                </li>
              ))}
            </ol>
          </div>
          <div className="p-4 rounded-xl border border-border bg-surface/50 space-y-2">
            <p className="label">Demo contacts</p>
            {["bob@example.com","carol@example.com","dave@example.com"].map(e => (
              <p key={e} className="text-xs font-mono text-arc">{e}</p>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
