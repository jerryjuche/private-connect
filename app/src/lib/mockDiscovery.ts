/**
 * Mock PSI engine — Phase 1.
 * Replace import in useDiscovery.ts with realDiscovery.ts for production.
 * Interface is identical — no other changes needed.
 */
import { MockProfile, MOCK_REGISTRY } from "./constants";

export interface DiscoveryInput  { contacts: string[]; }
export interface DiscoveryOutput { matched: MockProfile[]; hiddenCount: number; totalInput: number; }

export async function runDiscovery(input: DiscoveryInput): Promise<DiscoveryOutput> {
  const matched: MockProfile[] = [];
  let hiddenCount = 0;
  for (const email of input.contacts) {
    const profile = MOCK_REGISTRY[email];
    if (profile) matched.push(profile);
    else hiddenCount++;
  }
  return { matched, hiddenCount, totalInput: input.contacts.length };
}

export function avatarColor(id: string): string {
  const COLORS = ["#6EE7B7","#38BDF8","#A78BFA","#FB923C","#34D399","#F472B6"];
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return COLORS[h % COLORS.length];
}

export function getInitials(name: string): string {
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}
