import { useEffect, useState, FormEvent } from "react";
import Link from "next/link";
import clsx from "clsx";
import { ROUTES, UserProfile } from "@/lib/constants";
import { loadProfile, saveProfile } from "./onboard";

const COLORS = ["#63C7A2", "#6DA4FF", "#A78BFA", "#FB923C", "#34D399", "#F472B6"];

function InfoTile({
  title,
  body,
  tone = "default",
}: {
  title: string;
  body: string;
  tone?: "default" | "accent" | "signal";
}) {
  return (
    <div
      className={clsx(
        "rounded-2xl border p-4",
        tone === "accent"
          ? "border-arc/15 bg-arc/5"
          : tone === "signal"
          ? "border-signal/15 bg-signal/5"
          : "border-border bg-surface"
      )}
    >
      <p
        className={clsx(
          "text-xs font-mono uppercase tracking-[0.14em]",
          tone === "accent"
            ? "text-arc"
            : tone === "signal"
            ? "text-signal"
            : "text-dim"
        )}
      >
        {title}
      </p>
      <p className="mt-2 text-sm leading-7 text-dim">{body}</p>
    </div>
  );
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [username, setUsername] = useState("");
  const [color, setColor] = useState<string | null>(null);
  const [discoverable, setDiscoverable] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loaded = loadProfile();
    setProfile(loaded);

    if (loaded) {
      setUsername(loaded.username);
      setColor(loaded.avatar);
      setDiscoverable(loaded.isDiscoverable);
    }
  }, []);

  const initials =
    username
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?";

  function handleSave(e: FormEvent) {
    e.preventDefault();

    if (username.trim().length < 2) {
      setError("Username must be at least 2 characters.");
      return;
    }

    if (!profile) return;

    const updated: UserProfile = {
      ...profile,
      username: username.trim(),
      avatar: color,
      isDiscoverable: discoverable,
    };

    saveProfile(updated);
    setProfile(updated);
    setEditing(false);
    setSaved(true);
    setError("");

    setTimeout(() => setSaved(false), 2200);
  }

  if (!profile) {
    return (
      <div className="page flex min-h-[60vh] items-center justify-center">
        <div className="card w-full max-w-xl p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-surface text-xl text-dim">
            ◇
          </div>

          <p className="label mt-6">Profile required</p>
          <h1 className="mt-2 text-2xl font-semibold text-bright">
            No profile found.
          </h1>
          <p className="mt-3 text-sm leading-7 text-dim">
            Create a profile to control discoverability and participate in
            private contact matching.
          </p>

          <div className="mt-6 flex justify-center">
            <Link href={ROUTES.ONBOARD} className="btn-primary">
              Create profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      {saved && (
        <div className="fixed right-5 top-20 z-50 rounded-2xl border border-arc/20 bg-arc/10 px-4 py-3 shadow-lg">
          <p className="text-xs font-mono uppercase tracking-[0.14em] text-arc">
            Profile updated
          </p>
        </div>
      )}

      <div className="mb-10 max-w-3xl stagger">
        <div className="space-y-3">
          <span className="eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-arc animate-pulse-slow" />
            Profile & visibility
          </span>

          <h1 className="section-title">Control how you appear in discovery.</h1>
          <p className="section-copy">
            Your profile defines what can be revealed if another user’s private
            contact batch matches your discoverable identifier.
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <div className="card p-6 sm:p-7">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              <div
                className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl text-2xl font-bold text-void"
                style={{ backgroundColor: color ?? "#63C7A2" }}
              >
                {initials}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-2xl font-semibold tracking-tight text-bright">
                      {profile.username}
                    </p>
                    <p className="mt-1 text-sm text-dim">{profile.email}</p>
                  </div>

                  {!editing && (
                    <button
                      type="button"
                      onClick={() => setEditing(true)}
                      className="btn-secondary"
                    >
                      Edit profile
                    </button>
                  )}
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <span className={discoverable ? "badge-accent" : "badge-muted"}>
                    {discoverable ? "discoverable" : "hidden"}
                  </span>
                  <p className="text-sm text-dim">
                    {discoverable
                      ? "Your encrypted identifier can participate in discovery."
                      : "Your profile is excluded from future discovery runs."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {editing && (
            <form onSubmit={handleSave} className="card p-6 sm:p-7">
              <div className="space-y-6">
                <div>
                  <p className="label">Edit profile</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-bright">
                    Update identity and visibility
                  </h2>
                </div>

                <div className="space-y-2">
                  <label className="label" htmlFor="edit-username">
                    Username
                  </label>
                  <input
                    id="edit-username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    maxLength={32}
                    className="input"
                  />
                  {error && <p className="text-xs font-mono text-danger">{error}</p>}
                </div>

                <div className="space-y-3">
                  <p className="label">Avatar color</p>
                  <div className="flex flex-wrap gap-2">
                    {COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setColor(c)}
                        className={clsx(
                          "h-8 w-8 rounded-xl transition-all duration-200",
                          color === c
                            ? "scale-110 ring-2 ring-white ring-offset-2 ring-offset-panel"
                            : "opacity-70 hover:opacity-100"
                        )}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                <div className="card-muted p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-bright">
                        Discoverability
                      </p>
                      <p className="mt-1 text-sm leading-7 text-dim">
                        Allow other users to find your profile only when their
                        private batch contains a matching identifier.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setDiscoverable((v) => !v)}
                      className={clsx(
                        "toggle-track mt-0.5 shrink-0",
                        discoverable ? "bg-arc" : "bg-muted"
                      )}
                      aria-pressed={discoverable}
                    >
                      <span
                        className="toggle-thumb"
                        style={{
                          transform: discoverable ? "translateX(20px)" : "translateX(0px)",
                        }}
                      />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button type="submit" className="btn-primary">
                    Save changes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      setError("");
                      setUsername(profile.username);
                      setColor(profile.avatar);
                      setDiscoverable(profile.isDiscoverable);
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <InfoTile
              title="identifier handling"
              body="Your email is normalized client-side and used as the basis for the discoverability workflow."
              tone="accent"
            />
            <InfoTile
              title="registry participation"
              body="When discoverable is enabled, your encrypted identifier is eligible for overlap checks."
              tone="signal"
            />
            <InfoTile
              title="result scope"
              body="Only confirmed overlaps should surface to the requesting session. Non-matching identities remain outside the result model."
            />
            <InfoTile
              title="current phase"
              body="This frontend uses local mock state now, with a clean migration path to confidential compute later."
            />
          </div>
        </div>

        <aside className="space-y-5">
          <div className="card-muted p-5">
            <p className="label">Profile status</p>
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-sm font-medium text-bright">Visibility</p>
                <p className="mt-1 text-sm leading-7 text-dim">
                  {discoverable
                    ? "Included in the discoverability model."
                    : "Excluded from future discovery runs."}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-bright">Storage</p>
                <p className="mt-1 text-sm leading-7 text-dim">
                  The current mock-mode profile state is stored locally in the
                  browser for this prototype.
                </p>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <p className="label">Next action</p>
            <p className="mt-3 text-sm leading-7 text-dim">
              Run another discovery request to see how your current profile and
              visibility settings fit into the end-to-end flow.
            </p>

            <div className="mt-5">
              <Link href={ROUTES.DISCOVER} className="btn-primary w-full">
                Open discovery
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}