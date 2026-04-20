import { useState, useRef, useCallback, ChangeEvent, DragEvent } from "react";
import clsx from "clsx";
import { MAX_CONTACTS } from "@/lib/constants";
import { parsePaste, parseCSVFile, normalizeContacts } from "@/lib/normalize";

interface Props { onSubmit: (contacts: string[]) => void; disabled: boolean; }
type Mode = "paste" | "csv";

export default function ContactImporter({ onSubmit, disabled }: Props) {
  const [mode, setMode]       = useState<Mode>("paste");
  const [text, setText]       = useState("");
  const [drag, setDrag]       = useState(false);
  const [file, setFile]       = useState<string | null>(null);
  const [parsed, setParsed]   = useState<string[]>([]);
  const [fileErr, setFileErr] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const preview = mode === "paste"
    ? normalizeContacts(parsePaste(text), MAX_CONTACTS)
    : normalizeContacts(parsed, MAX_CONTACTS);

  const handleFile = useCallback(async (f: File) => {
    setFileErr(null);
    if (!f.name.match(/\.(csv|txt)$/i)) { setFileErr("Upload a .csv or .txt file."); return; }
    try {
      const rows = await parseCSVFile(f);
      setParsed(rows); setFile(f.name);
    } catch { setFileErr("Could not read file."); }
  }, []);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault(); setDrag(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const submit = () => {
    const contacts = mode === "paste" ? parsePaste(text) : parsed;
    if (contacts.length) onSubmit(contacts);
  };

  const canSubmit = !disabled && (
    mode === "paste" ? text.trim().length > 0 : parsed.length > 0
  );

  return (
    <div className="space-y-5">
      {/* Mode toggle */}
      <div className="flex gap-1 p-1 bg-surface rounded-lg border border-border w-fit">
        {(["paste","csv"] as Mode[]).map(m => (
          <button key={m} onClick={() => setMode(m)} disabled={disabled}
            className={clsx("px-4 py-1.5 rounded-md text-sm font-mono transition-all",
              mode === m ? "bg-panel text-bright shadow-sm" : "text-dim hover:text-text")}>
            {m === "paste" ? "Paste emails" : "Upload CSV"}
          </button>
        ))}
      </div>

      {/* Paste */}
      {mode === "paste" && (
        <textarea value={text} onChange={e => setText(e.target.value)}
          disabled={disabled} rows={7}
          placeholder={`Paste up to ${MAX_CONTACTS} emails, one per line or comma-separated.\n\nbob@example.com\ncarol@example.com`}
          className={clsx("input resize-none font-mono", disabled && "opacity-40 cursor-not-allowed")} />
      )}

      {/* CSV drop zone */}
      {mode === "csv" && (
        <div onDragOver={e => { e.preventDefault(); setDrag(true); }}
             onDragLeave={() => setDrag(false)} onDrop={handleDrop}
             onClick={() => !disabled && fileRef.current?.click()}
             className={clsx("border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all",
               drag ? "border-arc bg-arc/5" : disabled ? "border-border opacity-40 cursor-not-allowed"
                    : "border-border hover:border-muted")}>
          <input ref={fileRef} type="file" accept=".csv,.txt" className="hidden"
                 onChange={(e: ChangeEvent<HTMLInputElement>) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          <p className="text-2xl mb-2">{file ? "✓" : "↑"}</p>
          {file
            ? <><p className="text-sm font-mono text-arc">{file}</p><p className="text-xs text-dim">Click to replace</p></>
            : <><p className="text-sm text-text">Drop CSV here or click to browse</p><p className="text-xs text-dim mt-1">.csv or .txt</p></>
          }
        </div>
      )}
      {fileErr && <p className="text-xs text-danger font-mono">{fileErr}</p>}

      {/* Validation summary */}
      {(text.trim() || file) && (
        <div className="space-y-1 text-xs font-mono">
          {preview.valid.length > 0 && <p className="text-arc">✓ {preview.valid.length} valid contact{preview.valid.length !== 1 ? "s" : ""}{preview.truncated ? ` (capped at ${MAX_CONTACTS})` : ""}</p>}
          {preview.duplicates > 0   && <p className="text-dim">− {preview.duplicates} duplicate{preview.duplicates !== 1 ? "s" : ""} removed</p>}
          {preview.invalid.length > 0 && <p className="text-warn">⚠ {preview.invalid.length} invalid skipped</p>}
        </div>
      )}

      {/* Submit */}
      <button onClick={submit} disabled={!canSubmit} className="btn-primary w-full">
        {disabled ? "Running discovery…" : "Find My Contacts"}
      </button>

      {/* Demo hint */}
      {!disabled && (
        <p className="text-xs text-muted text-center">
          Try{" "}
          <button onClick={() => { setMode("paste"); setText("bob@example.com\ncarol@example.com\ndave@example.com\neve@example.com\nstranger@test.com"); }}
            className="text-arc hover:underline">the sample contacts</button>{" "}
          to see a live demo.
        </p>
      )}
    </div>
  );
}
