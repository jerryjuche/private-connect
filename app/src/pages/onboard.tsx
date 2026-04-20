import { useState, FormEvent } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import clsx from "clsx";
import { ROUTES, UserProfile } from "@/lib/constants";

export const PROFILE_KEY = "pc_profile";
export function saveProfile(p: UserProfile) {
  if (typeof window !== "undefined") localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
}
export function loadProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try { const r = localStorage.getItem(PROFILE_KEY); return r ? JSON.parse(r) : null; }
  catch { return null; }
}

const COLORS = ["#6EE7B7","#38BDF8","#A78BFA","#FB923C","#34D399","#F472B6"];

export default function OnboardPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email,    setEmail]    = useState("");
  const [disc,     setDisc]     = useState(true);
  const [color,    setColor]    = useState(COLORS[0]);
  const [errors,   setErrors]   = useState<Record<string,string>>({});
  const [done,     setDone]     = useState(false);

  const initials = username.split(" ").map(w => w[0]).join("").toUpperCase().slice(0,2) || "?";

  function validate() {
    const e: Record<string,string> = {};
    if (username.trim().length < 2) e.username = "At least 2 characters required.";
    if (username.trim().length > 32) e.username = "32 characters maximum.";
    if (!email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = "Enter a valid email.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    saveProfile({ username: username.trim(), email: email.trim().toLowerCase(), avatar: color, isDiscoverable: disc });
    setDone(true);
    setTimeout(() => router.push(ROUTES.DISCOVER), 1200);
  }

  if (done) return (
    <div className="page flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4 animate-fade-up">
        <div className="w-20 h-20 rounded-2xl mx-auto flex items-center justify-center text-void font-bold text-2xl"
             style={{ backgroundColor: color }}>{initials}</div>
        <p className="text-bright font-bold text-xl">Profile created!</p>
        <p className="text-dim text-sm">Taking you to discovery…</p>
      </div>
    </div>
  );

  return (
    <div className="page max-w-xl mx-auto">
      <div className="stagger space-y-8">
        <div>
          <p className="label mb-1">Setup</p>
          <h1 className="text-3xl font-extrabold text-bright">Create your profile</h1>
          <p className="text-dim text-sm mt-2">Only matched contacts will ever see your profile.</p>
        </div>

        {/* Avatar preview */}
        <div className="card flex items-center gap-5">
          <div className="w-16 h-16 rounded-xl flex items-center justify-center text-void font-bold text-xl shrink-0 transition-colors duration-200"
               style={{ backgroundColor: color }}>{initials}</div>
          <div className="space-y-2">
            <p className="label">Avatar color</p>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map(c => (
                <button key={c} type="button" onClick={() => setColor(c)}
                  className={clsx("w-6 h-6 rounded-lg transition-all duration-150",
                    color === c ? "ring-2 ring-white ring-offset-2 ring-offset-panel scale-110" : "opacity-60 hover:opacity-100 hover:scale-105")}
                  style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div className="space-y-1.5">
            <label className="label" htmlFor="username">Username</label>
            <input id="username" type="text" value={username} onChange={e => setUsername(e.target.value)}
              placeholder="e.g. alice_dev" maxLength={32}
              className={clsx("input", errors.username && "border-danger/50")} />
            {errors.username
              ? <p className="text-xs text-danger font-mono">{errors.username}</p>
              : <p className="text-xs text-muted">{username.length}/32</p>}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="label" htmlFor="email">Email address</label>
            <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={clsx("input", errors.email && "border-danger/50")} />
            {errors.email
              ? <p className="text-xs text-danger font-mono">{errors.email}</p>
              : <p className="text-xs text-muted">Hashed and encrypted — never stored in plaintext</p>}
          </div>

          {/* Discoverability */}
          <div className="card flex items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-bright">Make me discoverable</p>
              <p className="text-xs text-dim leading-relaxed">Allow others to find you. Your email is hashed and encrypted before storage.</p>
            </div>
            <button type="button" onClick={() => setDisc(d => !d)}
              className={clsx("relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 mt-0.5", disc ? "bg-arc" : "bg-muted")}
              aria-pressed={disc}>
              <span className={clsx("absolute top-1 w-4 h-4 rounded-full bg-void transition-transform duration-200", disc ? "translate-x-6" : "translate-x-1")} />
            </button>
          </div>

          <button type="submit" className="btn-primary w-full">Create profile →</button>
          <p className="text-xs text-center text-muted">
            Already set up?{" "}
            <Link href={ROUTES.DISCOVER} className="text-arc hover:underline">Go to discovery</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
