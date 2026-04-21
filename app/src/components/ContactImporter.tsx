import { useState, useRef, useCallback, ChangeEvent, DragEvent } from "react";
import clsx from "clsx";
import { MAX_CONTACTS } from "@/lib/constants";
import { parsePaste, parseCSVFile, normalizeContacts } from "@/lib/normalize";

interface Props {
  onSubmit: (contacts: string[]) => void;
  disabled: boolean;
}

type Mode = "paste" | "csv";

export default function ContactImporter({ onSubmit, disabled }: Props) {
  const [mode, setMode] = useState<Mode>("paste");
  const [text, setText] = useState("");
  const [drag, setDrag] = useState(false);
  const [file, setFile] = useState<string | null>(null);
  const [parsed, setParsed] = useState<string[]>([]);
  const [fileErr, setFileErr] = useState<string | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);

  const preview =
    mode === "paste"
      ? normalizeContacts(parsePaste(text), MAX_CONTACTS)
      : normalizeContacts(parsed, MAX_CONTACTS);

  const handleFile = useCallback(async (f: File) => {
    setFileErr(null);

    if (!f.name.match(/\.(csv|txt)$/i)) {
      setFileErr("Upload a .csv or .txt file.");
      return;
    }

    try {
      const rows = await parseCSVFile(f);
      setParsed(rows);
      setFile(f.name);
    } catch {
      setFileErr("The file could not be read.");
    }
  }, []);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const submit = () => {
    const contacts = mode === "paste" ? parsePaste(text) : parsed;
    if (contacts.length) onSubmit(contacts);
  };

  const canSubmit =
    !disabled && (mode === "paste" ? text.trim().length > 0 : parsed.length > 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="rounded-2xl border border-border bg-surface/70 p-1">
          <div className="flex gap-1">
            {(["paste", "csv"] as Mode[]).map((m) => {
              const active = mode === m;
              return (
                <button
                  key={m}
                  type="button"
                  disabled={disabled}
                  onClick={() => setMode(m)}
                  className={clsx(
                    "rounded-xl px-4 py-2 text-xs font-mono uppercase tracking-[0.14em] transition-all duration-200",
                    active
                      ? "border border-border bg-panel text-bright"
                      : "text-dim hover:text-text"
                  )}
                >
                  {m === "paste" ? "Paste contacts" : "Upload file"}
                </button>
              );
            })}
          </div>
        </div>

        <span className="badge-muted">{MAX_CONTACTS} max / request</span>
      </div>

      {mode === "paste" && (
        <div className="space-y-3">
          <label className="label">Contact input</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={disabled}
            rows={8}
            placeholder={`Paste up to ${MAX_CONTACTS} emails, one per line or comma-separated.\n\nbob@example.com\ncarol@example.com\ndave@example.com`}
            className={clsx(
              "input min-h-[200px] resize-none font-mono leading-7",
              disabled && "cursor-not-allowed opacity-50"
            )}
          />
          <p className="text-xs text-dim">
            One contact per line works best. Comma-separated input is also supported.
          </p>
        </div>
      )}

      {mode === "csv" && (
        <div className="space-y-3">
          <label className="label">Import file</label>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDrag(true);
            }}
            onDragLeave={() => setDrag(false)}
            onDrop={handleDrop}
            onClick={() => !disabled && fileRef.current?.click()}
            className={clsx(
              "rounded-2xl border bg-surface/60 p-8 text-center transition-all duration-200",
              drag
                ? "border-arc bg-arc/5"
                : disabled
                ? "cursor-not-allowed border-border opacity-50"
                : "cursor-pointer border-border hover:border-arc/20 hover:bg-panel/80"
            )}
          >
            <input
              ref={fileRef}
              type="file"
              accept=".csv,.txt"
              className="hidden"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />

            <div className="space-y-3">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-panel text-lg text-arc">
                {file ? "✓" : "↑"}
              </div>

              {file ? (
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-bright">{file}</p>
                  <p className="text-xs text-dim">
                    Click or drop another file to replace it
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-bright">
                    Drop a CSV or TXT file
                  </p>
                  <p className="text-xs text-dim">
                    First column or one email per line
                  </p>
                </div>
              )}
            </div>
          </div>

          {fileErr && <p className="text-xs font-mono text-danger">{fileErr}</p>}
        </div>
      )}

      {(text.trim() || file) && (
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="card-muted p-4">
            <p className="label">Valid</p>
            <p className="mt-2 text-2xl font-bold text-arc">{preview.valid.length}</p>
            <p className="mt-1 text-xs text-dim">ready for matching</p>
          </div>

          <div className="card-muted p-4">
            <p className="label">Duplicates</p>
            <p className="mt-2 text-2xl font-bold text-bright">{preview.duplicates}</p>
            <p className="mt-1 text-xs text-dim">removed before submission</p>
          </div>

          <div className="card-muted p-4">
            <p className="label">Invalid</p>
            <p className="mt-2 text-2xl font-bold text-warn">{preview.invalid.length}</p>
            <p className="mt-1 text-xs text-dim">excluded from this request</p>
          </div>
        </div>
      )}

      {preview.truncated && (
        <div className="rounded-xl border border-warn/20 bg-warn/5 px-4 py-3">
          <p className="text-xs font-mono uppercase tracking-[0.14em] text-warn">
            Batch trimmed to {MAX_CONTACTS} contacts
          </p>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button onClick={submit} disabled={!canSubmit} className="btn-primary">
          {disabled ? "Discovery in progress…" : "Run private discovery"}
        </button>

        {!disabled && (
          <button
            type="button"
            onClick={() => {
              setMode("paste");
              setText(
                "bob@example.com\ncarol@example.com\ndave@example.com\neve@example.com\nstranger@test.com"
              );
            }}
            className="btn-ghost"
          >
            Load sample batch
          </button>
        )}
      </div>
    </div>
  );
}