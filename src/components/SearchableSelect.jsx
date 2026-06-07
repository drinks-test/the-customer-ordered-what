import { useEffect, useMemo, useRef, useState } from "react";

// A lightweight searchable dropdown (combobox) backed by a fixed option list.
export default function SearchableSelect({ options, value, onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.toLowerCase().includes(q));
  }, [options, query]);

  function pick(option) {
    onChange(option);
    setQuery("");
    setOpen(false);
  }

  return (
    <div className="relative" ref={ref}>
      <input
        type="text"
        className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
        placeholder={value || placeholder || "Search…"}
        value={open ? query : value}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => {
          setQuery("");
          setOpen(true);
        }}
      />
      {open && (
        <ul className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-md border border-stone-200 bg-white py-1 shadow-lg">
          {filtered.length === 0 && (
            <li className="px-3 py-2 text-sm text-stone-400">No matches</li>
          )}
          {filtered.map((o) => (
            <li key={o}>
              <button
                type="button"
                onMouseDown={() => pick(o)}
                className={`block w-full px-3 py-2 text-left text-sm hover:bg-amber-50 ${
                  o === value ? "bg-amber-100 font-medium" : "text-stone-700"
                }`}
              >
                {o}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
