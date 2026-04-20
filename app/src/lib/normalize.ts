import Papa from "papaparse";

export interface NormalizeResult {
  valid: string[]; invalid: string[];
  duplicates: number; truncated: boolean;
}

export function normalizeEmail(raw: string): string | null {
  const v = raw.trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && v.length <= 256 ? v : null;
}

export function normalizeContacts(raw: string[], max = 10): NormalizeResult {
  const seen = new Set<string>();
  const valid: string[] = [];
  const invalid: string[] = [];
  let duplicates = 0;
  for (const entry of raw) {
    const n = normalizeEmail(entry);
    if (!n) { if (entry.trim()) invalid.push(entry.trim()); continue; }
    if (seen.has(n)) { duplicates++; continue; }
    seen.add(n);
    valid.push(n);
  }
  const truncated = valid.length > max;
  return { valid: valid.slice(0, max), invalid, duplicates, truncated };
}

export function parsePaste(text: string): string[] {
  return text.split(/[\n,]+/).map(v => v.trim()).filter(Boolean);
}

export async function parseCSVFile(file: File): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      const text = e.target?.result as string;
      const result = Papa.parse<string[]>(text, { skipEmptyLines: true });
      resolve(result.data.map(row => (Array.isArray(row) ? row[0] : row)).filter(Boolean));
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
}
