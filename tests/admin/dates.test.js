// Expiry dates of clients' documents: a wrong day here means a reminder sent late or never.
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  addDays,
  addMonths,
  computeRenewalExpiry,
  daysUntil,
  formatDateBR,
  isValidISODate,
  monthYear,
  todayISO,
} from "../../src/admin/dates.js";

describe("isValidISODate", () => {
  it("accepts real calendar dates written as YYYY-MM-DD", () => {
    expect(isValidISODate("2026-11-09")).toBe(true);
    expect(isValidISODate("2028-02-29")).toBe(true);
  });

  it("rejects impossible dates, other formats and empty values", () => {
    expect(isValidISODate("2026-02-29")).toBe(false);
    expect(isValidISODate("2026-02-30")).toBe(false);
    expect(isValidISODate("2026-13-01")).toBe(false);
    expect(isValidISODate("31/01/2026")).toBe(false);
    expect(isValidISODate("2026-1-5")).toBe(false);
    expect(isValidISODate("")).toBe(false);
    expect(isValidISODate(null)).toBe(false);
  });
});

describe("addDays", () => {
  it("moves across the end of a month, a year and a leap February", () => {
    expect(addDays("2026-11-09", 1)).toBe("2026-11-10");
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
    expect(addDays("2028-02-28", 1)).toBe("2028-02-29");
    expect(addDays("2027-02-28", 1)).toBe("2027-03-01");
  });

  it("returns an empty string for an invalid date", () => {
    expect(addDays("2026-02-30", 1)).toBe("");
    expect(addDays("", 1)).toBe("");
  });
});

describe("computeRenewalExpiry (next expiry when a service is renewed)", () => {
  it("adds the repeat interval to the current expiry", () => {
    expect(computeRenewalExpiry("2026-03-15", 12)).toBe("2027-03-15");
    expect(computeRenewalExpiry("2026-11-09", 36)).toBe("2029-11-09");
  });

  it("keeps the end of the month: Jan 31 + 1 month is the last day of February", () => {
    expect(computeRenewalExpiry("2026-01-31", 1)).toBe("2026-02-28");
    expect(computeRenewalExpiry("2028-01-31", 1)).toBe("2028-02-29");
    expect(computeRenewalExpiry("2026-03-31", 1)).toBe("2026-04-30");
    expect(computeRenewalExpiry("2026-12-31", 2)).toBe("2027-02-28");
    expect(computeRenewalExpiry("2028-02-29", 12)).toBe("2029-02-28");
  });

  it("accepts the interval as a string (it comes from a form field in demo mode)", () => {
    expect(computeRenewalExpiry("2026-05-10", "6")).toBe("2026-11-10");
  });

  it("returns an empty string without a valid expiry", () => {
    expect(computeRenewalExpiry("", 12)).toBe("");
    expect(computeRenewalExpiry(null, 12)).toBe("");
    expect(computeRenewalExpiry("2026-02-30", 12)).toBe("");
  });

  it("returns an empty string without a whole number of months above zero", () => {
    expect(computeRenewalExpiry("2026-05-10", "")).toBe("");
    expect(computeRenewalExpiry("2026-05-10", null)).toBe("");
    expect(computeRenewalExpiry("2026-05-10", 0)).toBe("");
    expect(computeRenewalExpiry("2026-05-10", -12)).toBe("");
    expect(computeRenewalExpiry("2026-05-10", 1.5)).toBe("");
    expect(computeRenewalExpiry("2026-05-10", "doze")).toBe("");
  });
});

describe("addMonths", () => {
  it("adds whole months", () => {
    expect(addMonths("2026-03-15", 12)).toBe("2027-03-15");
    expect(addMonths("2026-11-06", 3)).toBe("2027-02-06");
  });

  it("keeps the end of the month when the target month is shorter", () => {
    expect(addMonths("2026-01-31", 1)).toBe("2026-02-28");
    expect(addMonths("2028-01-31", 1)).toBe("2028-02-29");
    expect(addMonths("2026-08-31", 1)).toBe("2026-09-30");
  });

  it("accepts the repeat interval as a string (it comes from a form field)", () => {
    expect(addMonths("2026-05-10", "6")).toBe("2026-11-10");
  });

  it("returns an empty string when the date or the interval is missing", () => {
    expect(addMonths("", 12)).toBe("");
    expect(addMonths("2026-05-10", 0)).toBe("");
    expect(addMonths("2026-05-10", "")).toBe("");
  });
});

describe("todayISO and daysUntil", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 10, 6, 23, 30)); // 6 Nov 2026, 23:30 local time
  });
  afterEach(() => vi.useRealTimers());

  it("uses the local calendar day, even late at night", () => {
    expect(todayISO()).toBe("2026-11-06");
  });

  it("counts days to the expiry: 0 today, positive ahead, negative overdue", () => {
    expect(daysUntil("2026-11-06")).toBe(0);
    expect(daysUntil("2026-11-07")).toBe(1);
    expect(daysUntil("2027-02-04")).toBe(90);
    expect(daysUntil("2026-11-01")).toBe(-5);
  });

  it("returns null for a service with no expiry", () => {
    expect(daysUntil("")).toBeNull();
    expect(daysUntil(null)).toBeNull();
  });
});

describe("formatDateBR and monthYear", () => {
  it("shows dates in the Brazilian format", () => {
    expect(formatDateBR("2026-11-06")).toBe("06/11/2026");
    expect(monthYear("2027-03-31")).toBe("03/2027");
  });

  it("shows a placeholder when there is no date", () => {
    expect(formatDateBR("")).toBe("—");
    expect(monthYear(null)).toBe("sem data");
  });
});
