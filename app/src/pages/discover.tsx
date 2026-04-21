import { useEffect, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import ContactImporter from "@/components/ContactImporter";
import DiscoveryProgress from "@/components/DiscoveryProgress";
import PrivacyExplainer from "@/components/PrivacyExplainer";
import { useDiscovery } from "@/hooks/useDiscovery";
import { loadProfile } from "./onboard";
import { ROUTES, MAX_CONTACTS, UserProfile } from "@/lib/constants";

export default function DiscoverPage() {
  const { state, discover, reset } = useDiscovery();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setProfile(loadProfile());
    setHydrated(true);
  }, []);

  const isActive =
    state.phase !== "idle" &&
    state.phase !== "complete" &&
    state.phase !== "failed";

  return (
    <div className="page">
      <div className="mb-10 max-w-3xl stagger">
        <div className="space-y-3">
          <span className="eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse-slow" />
            Discovery flow
          </span>

          <h1 className="section-title">
            Run a private match against the platform registry.
          </h1>

          <p className="section-copy">
            Import up to {MAX_CONTACTS} contacts and compute verified overlaps
            without exposing the rest of your list. Only matched profiles are
            revealed back to you.
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          {!hydrated ? (
            <div className="card-muted p-4">
              <div className="flex items-center gap-4">
                <div className="h-11 w-11 animate-pulse rounded-2xl bg-panel" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-36 animate-pulse rounded bg-panel" />
                  <div className="h-3 w-52 animate-pulse rounded bg-panel" />
                </div>
              </div>
            </div>
          ) : profile ? (
            <div className="card-muted p-4">
              <div className="flex items-center gap-4">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-bold text-void"
                  style={{ backgroundColor: profile.avatar ?? "#63C7A2" }}
                >
                  {profile.username.slice(0, 2).toUpperCase()}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-bright">
                      @{profile.username}
                    </p>
                    <span
                      className={clsx(
                        profile.isDiscoverable ? "badge-accent" : "badge-muted"
                      )}
                    >
                      {profile.isDiscoverable ? "discoverable" : "hidden"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-dim">
                    The current discovery request runs against the active encrypted
                    registry state.
                  </p>
                </div>

                <Link href={ROUTES.PROFILE} className="btn-ghost shrink-0">
                  Edit profile
                </Link>
              </div>
            </div>
          ) : (
            <div className="card-accent p-4">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-warn">⚠</span>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-bright">
                    No profile found
                  </p>
                  <p className="text-sm text-dim">
                    You can still try the discovery flow, but creating a profile
                    lets others discover you through the same private matching model.
                  </p>
                  <Link href={ROUTES.ONBOARD} className="btn-ghost px-0">
                    Create profile →
                  </Link>
                </div>
              </div>
            </div>
          )}

          <section className="card p-6 sm:p-7">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="space-y-1">
                <p className="label">Private discovery request</p>
                <h2 className="text-2xl font-semibold tracking-tight text-bright">
                  Confidential contact import
                </h2>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="badge-muted">max {MAX_CONTACTS} contacts</span>
                <span className="badge-signal">local normalization</span>
              </div>
            </div>

            <ContactImporter onSubmit={discover} disabled={isActive} />

            {(isActive || state.phase === "failed" || state.phase === "complete") && (
              <>
                <div className="divider" />
                <div className="space-y-4">
                  <DiscoveryProgress phase={state.phase} error={state.error} />

                  {state.phase === "failed" && (
                    <div className="pt-1">
                      <button onClick={reset} className="btn-secondary">
                        Reset request
                      </button>
                    </div>
                  )}

                  {state.phase === "complete" && (
                    <p className="text-xs font-mono uppercase tracking-[0.14em] text-dim">
                      Redirecting to matched results…
                    </p>
                  )}
                </div>
              </>
            )}
          </section>

          {state.validCount > 0 && isActive && (
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="stat">
                <p className="stat-value">{state.validCount}</p>
                <p className="stat-label">validated inputs</p>
              </div>
              <div className="stat">
                <p className="stat-value text-signal">MPC</p>
                <p className="stat-label">execution model</p>
              </div>
              <div className="stat">
                <p className="stat-value text-arc">0</p>
                <p className="stat-label">plaintext uploads</p>
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-5">
          <div className="card p-5">
            <p className="label">What happens here</p>
            <div className="mt-4 space-y-4">
              {[
                "Contacts are normalized client-side before any network step.",
                "Hashed identifiers move through the confidential matching flow.",
                "Only verified overlaps are returned to your session.",
                "Non-matching contacts are never shown to the platform.",
              ].map((item, i) => (
                <div key={item} className="flex gap-3">
                  <span className="mt-0.5 text-xs font-mono text-arc">0{i + 1}</span>
                  <p className="text-sm leading-7 text-dim">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card-muted p-5">
            <p className="label">Demo registry</p>
            <div className="mt-4 space-y-2">
              {["bob@example.com", "carol@example.com", "dave@example.com"].map((email) => (
                <div
                  key={email}
                  className="rounded-xl border border-border bg-surface px-3 py-2.5 text-xs font-mono text-arc"
                >
                  {email}
                </div>
              ))}
            </div>
          </div>

          <PrivacyExplainer compact />
        </aside>
      </div>
    </div>
  );
}