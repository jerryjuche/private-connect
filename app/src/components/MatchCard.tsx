import { MockProfile } from "@/lib/constants";
import { avatarColor, getInitials } from "@/lib/mockDiscovery";

export default function MatchCard({ profile, index }: { profile: MockProfile; index: number }) {
  const bg  = avatarColor(profile.id);
  const ini = getInitials(profile.name);
  return (
    <div className="group relative rounded-2xl border border-border bg-panel p-5
                    flex items-start gap-4 hover:border-arc/30 transition-all duration-300
                    hover:shadow-lg hover:shadow-arc/5 animate-fade-up"
         style={{ animationDelay: `${index * 80}ms`, animationFillMode: "forwards", opacity: 0 }}>
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500
                      bg-gradient-to-br from-arc/3 via-transparent to-transparent pointer-events-none" />
      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-void font-bold text-sm shrink-0"
           style={{ backgroundColor: bg }}>{ini}</div>
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-semibold text-bright text-sm">{profile.name}</h3>
          <span className="px-1.5 py-0.5 rounded-full border border-arc/20 bg-arc/5 text-arc text-xs font-mono flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-arc" />matched
          </span>
        </div>
        <p className="text-xs text-dim font-mono">@{profile.username}</p>
        <p className="text-xs text-muted">{profile.email}</p>
        <p className="text-xs font-mono text-muted/60 pt-0.5">
          {profile.wallet.slice(0,6)}…{profile.wallet.slice(-4)}
        </p>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-xs text-muted">joined</p>
        <p className="text-xs font-mono text-dim">{profile.joinedAt}</p>
      </div>
    </div>
  );
}
