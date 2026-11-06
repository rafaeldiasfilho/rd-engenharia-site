// Expiry dates of clients' documents: a wrong day here means a reminder sent late or never.
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { addMonths, daysUntil, formatDateBR, monthYear, todayISO } from "../../src/admin/dates.js";

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
