import { useMemo, useState } from "react";
import { getEnums, buildSchema } from "../lib/schema.js";

// The enum categories shown in the editor, in display order.
const CATEGORIES = [
  { key: "glass", label: "Glass" },
  { key: "ice", label: "Ice" },
  { key: "method", label: "Method" },
  { key: "ingredients", label: "Ingredients" },
  { key: "units", label: "Units" },
  { key: "garnish", label: "Garnish" },
];

// One editable enum list: rename inline, remove, or add a new value.
function EnumCategory({ label, values, onChange }) {
  const [draft, setDraft] = useState("");

  function rename(i, next) {
    onChange(values.map((v, idx) => (idx === i ? next : v)));
  }
  function remove(i) {
    onChange(values.filter((_, idx) => idx !== i));
  }
  function add() {
    const v = draft.trim();
    if (!v || values.includes(v)) return;
    onChange([...values, v]);
    setDraft("");
  }

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-lg font-bold text-stone-900">{label}</h3>
        <span className="text-xs uppercase tracking-wide text-stone-400">
          {values.length} values
        </span>
      </div>

      <div className="mt-3 space-y-2">
        {values.length === 0 && (
          <p className="text-sm italic text-stone-400">No values yet.</p>
        )}
        {values.map((v, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="text"
              value={v}
              onChange={(e) => rename(i, e.target.value)}
              className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            <button
              type="button"
              onClick={() => remove(i)}
              aria-label={`Remove ${v}`}
              className="rounded-md border border-stone-200 px-3 py-2 text-sm text-stone-500 hover:border-red-300 hover:text-red-600"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <input
          type="text"
          value={draft}
          placeholder={`Add a ${label.toLowerCase()} value…`}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
        />
        <button
          type="button"
          onClick={add}
          className="rounded-lg border border-dashed border-stone-300 px-4 py-2 text-sm font-medium text-stone-600 hover:border-amber-400 hover:text-amber-700"
        >
          + Add
        </button>
      </div>
    </div>
  );
}

// Hidden page (#schema-editor): edit the data contract enums and copy the
// resulting schema.json. Not linked from anywhere in the quiz UI.
export default function SchemaEditor({ schema }) {
  const [enums, setEnums] = useState(() => getEnums(schema));
  const [copied, setCopied] = useState(false);

  const json = useMemo(
    () => JSON.stringify(buildSchema(schema, enums), null, 2),
    [schema, enums]
  );

  function setCategory(key, values) {
    setEnums({ ...enums, [key]: values });
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(json);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <p className="text-sm font-semibold uppercase tracking-widest text-amber-600">
          Hidden · Data Contract Editor
        </p>
        <h1 className="mt-2 font-serif text-4xl font-bold text-stone-900">
          Edit schema.json enums
        </h1>
        <p className="mt-3 text-stone-600">
          Add, rename or remove the allowed enum values. The schema.json below
          updates live — copy and paste it over the file.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {CATEGORIES.map((c) => (
            <EnumCategory
              key={c.key}
              label={c.label}
              values={enums[c.key]}
              onChange={(values) => setCategory(c.key, values)}
            />
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-stone-200 pb-4">
            <h2 className="font-serif text-xl font-bold text-stone-900">
              Live schema.json
            </h2>
            <button
              type="button"
              onClick={copy}
              className="rounded-xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <pre className="mt-4 max-h-[28rem] overflow-auto rounded-xl bg-stone-900 p-4 font-mono text-xs leading-relaxed text-amber-100">
{json}
          </pre>
        </div>
      </div>
    </div>
  );
}
