import { sanitizeText, MAX_TEXT_LENGTH } from "../lib/text.js";

// Small uppercase field label, matching the quiz styling.
export function Label({ children }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
      {children}
    </p>
  );
}

// Sanitized text input — the central text policy is applied on every keystroke
// so disallowed characters and emoji never make it into state.
export function CleanInput({ value, onChange, placeholder }) {
  return (
    <input
      type="text"
      value={value ?? ""}
      placeholder={placeholder}
      maxLength={MAX_TEXT_LENGTH}
      onChange={(e) => onChange(sanitizeText(e.target.value))}
      className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
    />
  );
}

// Checkbox group for array enum fields (glass, garnish). Any selected value that
// is no longer in the schema is shown as a red, removable chip.
export function MultiSelect({ options, selected, onChange }) {
  const stale = (selected ?? []).filter((v) => !options.includes(v));
  function toggle(v) {
    const has = (selected ?? []).includes(v);
    onChange(has ? selected.filter((x) => x !== v) : [...(selected ?? []), v]);
  }
  return (
    <div className="mt-2 flex flex-wrap gap-3">
      {options.map((o) => (
        <label
          key={o}
          className="flex cursor-pointer items-center gap-2 text-sm text-stone-700"
        >
          <input
            type="checkbox"
            checked={(selected ?? []).includes(o)}
            onChange={() => toggle(o)}
            className="accent-amber-600"
          />
          {o}
        </label>
      ))}
      {stale.map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => toggle(v)}
          title="Not in current schema — click to remove"
          className="flex items-center gap-1 rounded-full border border-red-300 bg-red-50 px-3 py-1 text-xs text-red-600"
        >
          {v} · not in schema ✕
        </button>
      ))}
    </div>
  );
}

// Dropdown for single-value enum fields (ice, method). A stale current value is
// kept selectable and clearly flagged so legacy data isn't lost on edit.
export function SingleSelect({ options, value, onChange }) {
  const stale = value && !options.includes(value);
  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      className="mt-2 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
    >
      <option value="">Select…</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
      {stale && (
        <option value={value}>{value} (not in schema)</option>
      )}
    </select>
  );
}
