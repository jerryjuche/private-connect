import { useState, FormEvent } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import clsx from "clsx";
import { ROUTES, UserProfile } from "@/lib/constants";

export const PROFILE_KEY = "pc_profile";

export function saveProfile(profile: UserProfile) {
  if (typeof window !== "undefined") {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }
}

export function loadProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const COLORS = ["#63C7A2", "#6DA4FF", "#A78BFA", "#FB923C", "#34D399", "#F472B6"];

export default function OnboardPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [discoverable, setDiscoverable] = useState(true);
  const [color, setColor] = useState(COLORS[0]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const initials =
    username
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?";

  function validate() {
    const nextErrors: Record<string, string> = {};

    if (username.trim().length < 2) {
      nextErrors.username = "Username must be at least 2 characters.";
    } else if (username.trim().length > 32) {
      nextErrors.username = "Username must be 32 characters or fewer.";
    }

    if (!email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!validate()) return;

    saveProfile({
      username: username.trim(),
      email: email.trim().toLowerCase(),
      avatar: color,
      isDiscoverable: discoverable,
    });

    setDone(true);
    setTimeout(() => router.push(ROUTES.DISCOVER), 1000);
  }

  if (done) {
    return (
      <div className="page flex min-h-[60vh] items-center justify-center">
        <div className="card w-full max-w-lg p-8 text-center">
          <div
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl text-2xl font-bold text-void"
            style={{ backgroundColor: color }}
          >
            {initials}
          </div>

          <p className="label mt-6">Profile created</p>
          <h1 className="mt-2 text-2xl font-semibold text-bright">
            Your discovery profile is ready.
          </h1>
          <p className="mt-3 text-sm leading-7 text-dim">
            Redirecting you into the private discovery flow…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-8">
          <div className="stagger max-w-3xl space-y-3">
            <span className="eyebrow">
              <span className="h-1.5 w-1.5 rounded-full bg-arc animate-pulse-slow" />
              Profile setup
            </span>

            <h1 className="section-title">
              Create the identity that can participate in private discovery.
            </h1>

            <p className="section-copy">
              This profile controls how you appear when another user’s contact
              batch privately matches your discoverable identifier.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="card p-6 sm:p-7">
            <div className="space-y-7">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                <div
                  className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl text-2xl font-bold text-void"
                  style={{ backgroundColor: color }}
                >
                  {initials}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="label">Preview</p>
                  <p className="mt-2 text-xl font-semibold text-bright">
                    {username.trim() || "Your profile"}
                  </p>
                  <p className="mt-1 text-sm text-dim">
                    This identity is shown only when a verified match exists.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
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
                        aria-label={`Choose avatar color ${c}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid gap-5">
                <div className="space-y-2">
                  <label className="label" htmlFor="username">
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    maxLength={32}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. alice_nakamura"
                    className={clsx("input", errors.username && "border-danger")}
                  />
                  {errors.username ? (
                    <p className="text-xs font-mono text-danger">{errors.username}</p>
                  ) : (
                    <p className="text-xs text-dim">{username.length}/32 characters</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="label" htmlFor="email">
                    Discoverability email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={clsx("input", errors.email && "border-danger")}
                  />
                  {errors.email ? (
                    <p className="text-xs font-mono text-danger">{errors.email}</p>
                  ) : (
                    <p className="text-xs text-dim">
                      Normalized locally and used for private contact matching.
                    </p>
                  )}
                </div>

                <div className="card-muted p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-bright">
                        Allow private discoverability
                      </p>
                      <p className="mt-1 text-sm leading-7 text-dim">
                        When enabled, your identifier can participate in future
                        confidential overlap checks.
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
              </div>

              <div className="flex flex-wrap gap-3">
                <button type="submit" className="btn-primary">
                  Create profile
                </button>

                <Link href={ROUTES.DISCOVER} className="btn-secondary">
                  Skip to discovery
                </Link>
              </div>
            </div>
          </form>
        </div>

        <aside className="space-y-5">
          <div className="card-muted p-5">
            <p className="label">What this profile does</p>
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-sm font-medium text-bright">Identity surface</p>
                <p className="mt-1 text-sm leading-7 text-dim">
                  Defines the profile shown back to a user when a verified private
                  match occurs.
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-bright">Discoverability control</p>
                <p className="mt-1 text-sm leading-7 text-dim">
                  Lets you decide whether your identifier participates in the
                  discovery model at all.
                </p>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <p className="label">Why it matters</p>
            <p className="mt-3 text-sm leading-7 text-dim">
              A good discovery product reveals only meaningful overlap. Profile
              setup makes that overlap legible without broadening what the platform
              learns about the rest of the batch.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}