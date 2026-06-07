import { useEffect, useRef, useState } from "react";

// A small "?" affordance that explains a field in English + Spanish.
// Mobile-friendly: tap toggles it open and an outside tap/click closes it;
// on desktop it also opens on hover/focus.
export default function InfoTip({ en, es }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onDocPointer(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocPointer);
    document.addEventListener("touchstart", onDocPointer);
    return () => {
      document.removeEventListener("mousedown", onDocPointer);
      document.removeEventListener("touchstart", onDocPointer);
    };
  }, []);

  return (
    <span
      ref={ref}
      className="relative inline-block align-middle"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-label="More info"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full border border-stone-300 text-[10px] font-bold leading-none text-stone-500 hover:border-amber-400 hover:text-amber-700 focus:outline-none focus:ring-1 focus:ring-amber-500"
      >
        ?
      </button>
      {open && (
        <span className="absolute left-1/2 top-full z-30 mt-1 w-44 -translate-x-1/2 rounded-md border border-stone-200 bg-white p-2 text-left text-xs font-normal normal-case tracking-normal text-stone-600 shadow-lg">
          <span className="block text-stone-800">{en}</span>
          <span className="mt-1 block italic text-stone-500">{es}</span>
        </span>
      )}
    </span>
  );
}
