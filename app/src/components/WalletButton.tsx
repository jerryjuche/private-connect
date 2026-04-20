import { useState } from "react";
import clsx from "clsx";

export default function WalletButton({ className }: { className?: string }) {
  const [connected, setConnected] = useState(false);
  const MOCK = "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAs";
  return connected ? (
    <button onClick={() => setConnected(false)}
      className={clsx("flex items-center gap-2 px-3 py-1.5 rounded-lg border border-arc/30 bg-arc/5 text-arc text-xs font-mono hover:bg-arc/10 transition-colors", className)}>
      <span className="w-1.5 h-1.5 rounded-full bg-arc animate-pulse-slow" />
      {MOCK.slice(0,4)}…{MOCK.slice(-4)}
    </button>
  ) : (
    <button onClick={() => setConnected(true)}
      className={clsx("px-3 py-1.5 rounded-lg border border-border text-dim text-xs font-mono hover:border-arc/30 hover:text-arc transition-all", className)}>
      Connect Wallet
    </button>
  );
}
