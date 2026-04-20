import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import clsx from "clsx";
import { ROUTES, UserProfile } from "@/lib/constants";
import { loadProfile, saveProfile } from "./onboard";

const COLORS = ["#6EE7B7","#38BDF8","#A78BFA","#FB923C","#34D399","#F472B6"];

export default function ProfilePage() {
  const [profile,  setProfile]  = useState<UserProfile | null>(null);
  const [editing,  setEditing]  = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [username, setUsername] = useState("");
  const [color,    setColor]    = useState<string | null>(null);
  const [disc,     setDisc]     = useState(true);
  const [err,      setErr]      = useState("");

  useEffect(() => {
    const p = loadProfile();
    setProfile(p);
    if (p) { setUsername(p.username); setColor(p.avatar); setDisc(p.isDiscoverable); }
  }, []);

  const initials = username.split(" ").map(w => w[0]).join("").toUpperCase().slice(0,2) || "?";

  function handleSave(e: FormEvent) {
    e.preventDefault();
    if (username.trim().length < 2) { setErr("Username must be at least 2 characters."); return; }
    if (!profile) return;
    const updated = { ...profile, username: username.trim(), avatar: color, isDiscoverable: disc };
    saveProfile(updated); setProfile(updated); setEditing(false); setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (!profile) return (
    <div className="page max-w-lg mx-auto text-center flex flex-col items-center justify-center min-h-[60vh] space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-panel border border-border flex items-center justify-center text-2xl">◇</div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-bright">No profile yet</h1>
        <p className="text-dim text-sm">Create a profile to get started.</p>
      </div>
      <Link href={ROUTES.ONBOARD} className="btn-primary">Create profile →</Link>
    </div>
  );

  return (
    <div className="page max-w-2xl mx-auto space-y-8">
      {saved && (
        <div className="fixed top-20 right-5 z-50 px-4 py-2 rounded-xl border border-arc/30 bg-arc/10 text-arc text-sm font-mono shadow-lg animate-fade-up">
          ✓ Profile saved
        </div>
      )}

      <div className="stagger space-y-1">
        <p className="label">Your profile</p>
        <h1 className="text-3xl font-extrabold text-bright">@{profile.username}</h1>
      </div>

      {/* Identity card */}
      <div className="card flex items-start gap-6">
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-void font-bold text-2xl shrink-0 shadow-xl"
             style={{ backgroundColor: color ?? "#6EE7B7" }}>{initials}</div>
        <div className="flex-1 space-y-3">
          <div>
            <p className="text-bright font-semibold text-lg">{profile.username}</p>
            <p className="text-dim text-sm font-mono">{profile.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={clsx("w-2 h-2 rounded-full", profile.isDiscoverable ? "bg-arc animate-pulse-slow" : "bg-muted")} />
            <span className={clsx("text-xs font-mono", profile.isDiscoverable ? "text-arc" : "text-muted")}>
              {profile.isDiscoverable ? "Discoverable by contacts" : "Hidden from discovery"}
            </span>
          </div>
          {!editing && <button onClick={() => setEditing(true)} className="text-xs font-mono text-dim hover:text-arc transition-colors">Edit profile →</button>}
        </div>
      </div>

      {/* Edit form */}
      {editing && (
        <form onSubmit={handleSave} className="card space-y-5 animate-fade-up">
          <p className="text-sm font-semibold text-bright">Edit profile</p>

          <div className="space-y-2">
            <p className="label">Avatar color</p>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map(c => (
                <button key={c} type="button" onClick={() => setColor(c)}
                  className={clsx("w-7 h-7 rounded-lg transition-all", color === c ? "ring-2 ring-white ring-offset-2 ring-offset-panel scale-110" : "opacity-60 hover:opacity-100")}
                  style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="label" htmlFor="edit-user">Username</label>
            <input id="edit-user" type="text" value={username} onChange={e => setUsername(e.target.value)} maxLength={32} className="input" />
            {err && <p className="text-xs text-danger font-mono">{err}</p>}
          </div>

          <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-border bg-surface">
            <div>
              <p className="text-sm font-semibold text-bright">Discoverable</p>
              <p className="text-xs text-dim mt-0.5">Allow contacts to find you via private discovery.</p>
            </div>
            <button type="button" onClick={() => setDisc(d => !d)}
              className={clsx("relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 mt-0.5", disc ? "bg-arc" : "bg-muted")}>
              <span className={clsx("absolute top-1 w-4 h-4 rounded-full bg-void transition-transform duration-200", disc ? "translate-x-6" : "translate-x-1")} />
            </button>
          </div>

          <div className="flex gap-3">
            <button type="submit" className="btn-primary flex-1">Save changes</button>
            <button type="button" onClick={() => { setEditing(false); setErr(""); }} className="btn-ghost flex-1">Cancel</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { icon:"◆", color:"arc", title:"Identifier",   body:"Email normalized, SHA-256 hashed, and encrypted with Arcium MXE key before any network call." },
          { icon:"⬡", color:"sig", title:"Wallet",       body:"Solana wallet connection added in Phase 2 — links your profile to onchain state." },
          { icon:"◇", color:"arc", title:"Data stored",  body:"Profile stored in browser localStorage only. No backend receives your plaintext data." },
          { icon:"◈", color:"arc", title:"Discoverability", body:"When enabled, your encrypted identifier is included in the MPC registry for matching." },
        ].map(({ icon, color: c, title, body }) => (
          <div key={title} className={clsx("rounded-xl border p-4 space-y-2", c === "arc" ? "border-arc/15 bg-arc/3" : "border-signal/15 bg-signal/3")}>
            <div className="flex items-center gap-2">
              <span className={c === "arc" ? "text-arc text-sm" : "text-signal text-sm"}>{icon}</span>
              <p className={clsx("text-xs font-mono font-semibold uppercase tracking-widest", c === "arc" ? "text-arc" : "text-signal")}>{title}</p>
            </div>
            <p className="text-xs text-dim leading-relaxed">{body}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href={ROUTES.DISCOVER} className="btn-primary">Run discovery →</Link>
        <Link href={ROUTES.HOME} className="btn-ghost">Back home</Link>
      </div>
    </div>
  );
}
