import { MockProfile } from "@/lib/constants";
import { avatarColor, getInitials } from "@/lib/mockDiscovery";

export default function MatchCard({
  profile,
  index,
}: {
  profile: MockProfile;
  index: number;
}) {
  const bg = avatarColor(profile.id);
  const initials = getInitials(profile.name);

  return (
    <div
      className="card p-5 sm:p-6"
      style={{
        animation: "fadeUp 0.45s cubic-bezier(0.16,1,0.3,1) forwards",
        animationDelay: `${index * 70}ms`,
        opacity: 0,
      }}
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-sm font-bold text-void"
          style={{ backgroundColor: bg }}
        >
          {initials}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="truncate text-base font-semibold text-bright">
                  {profile.name}
                </h3>
                <span className="badge-accent">matched</span>
              </div>

              <p className="mt-1 text-sm text-dim">@{profile.username}</p>
            </div>

            <div className="rounded-xl border border-border bg-surface px-3 py-2">
              <p className="label">joined</p>
              <p className="mt-1 text-sm font-medium text-bright">{profile.joinedAt}</p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-surface px-4 py-3">
              <p className="label">contact</p>
              <p className="mt-1 truncate text-sm text-text">{profile.email}</p>
            </div>

            <div className="rounded-xl border border-border bg-surface px-4 py-3">
              <p className="label">wallet</p>
              <p className="mt-1 truncate text-sm text-text">
                {profile.wallet.slice(0, 6)}…{profile.wallet.slice(-4)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}