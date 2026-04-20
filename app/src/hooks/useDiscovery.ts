import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/router";
import { DiscoveryPhase, DiscoveryResult, ROUTES, MAX_CONTACTS } from "@/lib/constants";
import { normalizeContacts, parsePaste } from "@/lib/normalize";
import { runDiscovery } from "@/lib/mockDiscovery";

export interface DiscoveryState {
  phase: DiscoveryPhase;
  result: DiscoveryResult | null;
  error: string | null;
  validCount: number;
}

const INIT: DiscoveryState = { phase: "idle", result: null, error: null, validCount: 0 };
const RESULT_KEY = "pc_result";
const DELAY = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

export function useDiscovery() {
  const router = useRouter();
  const [state, setState] = useState<DiscoveryState>(INIT);
  const cancelled = useRef(false);

  const set = (phase: DiscoveryPhase, extra: Partial<DiscoveryState> = {}) => {
    if (!cancelled.current) setState(s => ({ ...s, phase, ...extra }));
  };

  const discover = useCallback(async (rawContacts: string[]) => {
    cancelled.current = false;

    // Phase: normalizing
    set("normalizing");
    await DELAY(700);
    const { valid, invalid, truncated } = normalizeContacts(rawContacts, MAX_CONTACTS);

    if (valid.length === 0) {
      set("failed", { error: "No valid email addresses found. Check your input and try again." });
      return;
    }

    set("normalizing", { validCount: valid.length });
    await DELAY(500);

    // Phase: encrypting (mock — UI tells the privacy story)
    set("encrypting");
    await DELAY(900);

    // Phase: submitting
    set("submitting");
    await DELAY(700);

    // Phase: processing (Arcium MPC simulation)
    set("processing");
    await DELAY(1400);

    // Run mock engine
    const output = await runDiscovery({ contacts: valid });

    const result: DiscoveryResult = {
      matched:     output.matched,
      total:       output.totalInput,
      hiddenCount: output.hiddenCount,
    };

    if (typeof window !== "undefined") {
      sessionStorage.setItem(RESULT_KEY, JSON.stringify(result));
    }

    set("complete", { result });
    await DELAY(600);
    router.push(ROUTES.RESULTS);
  }, [router]);

  const reset = useCallback(() => {
    cancelled.current = true;
    setState(INIT);
  }, []);

  return { state, discover, reset };
}

export function loadResult(): DiscoveryResult | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem("pc_result");
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
