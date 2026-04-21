import { useState } from "react";
import clsx from "clsx";

export default function WalletButton({ className }: { className?: string }) {
  const [connected, setConnected] = useState(false);
  const MOCK = "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAs";

  return connected ? (
    <button
      type="button"
      onClick={() => setConnected(false)}
      className={clsx(
        "inline-flex items-center gap-2 rounded-xl border border-arc/20 bg-arc/10 px-3.5 py-2 text-xs font-mono uppercase tracking-[0.14em] text-arc transition-all duration-200 hover:bg-arc/15",
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-arc animate-pulse-slow" />
      {MOCK.slice(0, 4)}…{MOCK.slice(-4)}
    </button>
  ) : (
    <button
      type="button"
      onClick={() => setConnected(true)}
      className={clsx(
        "inline-flex items-center gap-2 rounded-xl border border-border bg-surface/70 px-3.5 py-2 text-xs font-mono uppercase tracking-[0.14em] text-dim transition-all duration-200 hover:border-arc/20 hover:text-bright",
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-dim" />
      Connect wallet
    </button>
  );
}