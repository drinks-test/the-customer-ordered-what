// Central text-input policy for the whole app. Edit the two settings below to
// change what every free-text field (recipe name, notes, id, …) will accept.
//
//  • MAX_TEXT_LENGTH — hard cap on characters.
//  • ALLOWED_PATTERN — anything matching this is stripped out. The default keeps
//    letters a–z/A–Z, digits 0–9, a single space, and the punctuation . , - !
//    Everything else (symbols, emoji, accented letters, control chars) is removed
//    so nothing silly ends up in the data.

export const MAX_TEXT_LENGTH = 100;

// Note: `-` is kept last inside the class so it stays a literal, not a range.
export const ALLOWED_PATTERN = /[^A-Za-z0-9 .,!-]/g;

// Strip disallowed characters and cap the length. Safe on null/undefined.
export function sanitizeText(value) {
  if (value == null) return "";
  return String(value).replace(ALLOWED_PATTERN, "").slice(0, MAX_TEXT_LENGTH);
}

// True when `value` already satisfies the policy (nothing would be stripped).
export function isTextClean(value) {
  return String(value ?? "") === sanitizeText(value);
}
