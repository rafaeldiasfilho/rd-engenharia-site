// Date helpers for expiry tracking. Dates are ISO strings (YYYY-MM-DD); todayISO is the local calendar date, the other calculations use UTC so a time zone never shifts a day.

export const todayISO = () => {
  const d = new Date();
  const pad2 = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
};

export function addMonths(iso, months) {
  if (!iso || !months) return "";
  const [y, m, d] = iso.split("-").map(Number);
  const target = new Date(Date.UTC(y, m - 1 + Number(months), 1));
  const lastDay = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
  target.setUTCDate(Math.min(d, lastDay));
  return target.toISOString().slice(0, 10);
}

// True only for a real calendar date written as YYYY-MM-DD (rejects 2026-02-30, 2026-13-01, 31/01/2026...).
export function isValidISODate(iso) {
  if (typeof iso !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
}

// "2026-12-31" + 1 day -> "2027-01-01". Returns "" for an invalid date.
export function addDays(iso, days) {
  if (!isValidISODate(iso)) return "";
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + Number(days))).toISOString().slice(0, 10);
}

// Expiry of the next service when a recurring service is renewed: current expiry + repeat interval in months,
// keeping the end of the month (Jan 31 + 1 month = Feb 28, or Feb 29 in a leap year).
// Returns "" when the expiry is not a valid date or the interval is not a whole number of months above zero.
export function computeRenewalExpiry(expiryIso, repeatMonths) {
  if (!isValidISODate(expiryIso)) return "";
  const months = Number(repeatMonths); // "", null and undefined become 0 or NaN and are rejected below
  if (!Number.isInteger(months) || months <= 0) return "";
  return addMonths(expiryIso, months);
}

export function daysUntil(iso) {
  if (!iso) return null;
  const [y, m, d] = iso.split("-").map(Number);
  const target = Date.UTC(y, m - 1, d);
  const [ty, tm, td] = todayISO().split("-").map(Number);
  return Math.round((target - Date.UTC(ty, tm - 1, td)) / 86400000);
}

export const formatDateBR = (iso) => (iso ? iso.split("-").reverse().join("/") : "—");

export const monthYear = (iso) => (iso ? iso.slice(0, 7).split("-").reverse().join("/") : "sem data");
