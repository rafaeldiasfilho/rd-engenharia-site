// Calendar file (.ics) with the upcoming expiries. A calendar app that cannot read the file, or an event on the
// wrong day, means a renewal reminder that never shows up.
import { describe, expect, it } from "vitest";
import {
  buildExpiryCalendar,
  buildExpiryEventTitle,
  escapeIcsText,
  foldIcsLine,
  selectCalendarExpiries,
} from "../../src/admin/expiryCalendar.js";

const TODAY = "2026-11-09";
const GENERATED_AT = new Date(Date.UTC(2026, 10, 9, 14, 30, 5));
const clients = [
  { id: "c1", nome: "Maria Souza" },
  { id: "c2", nome: "Souza, Lima; Cia" },
];
const openService = (id, vencimento, extra = {}) => ({ id, cliente_id: "c1", tipo: "AVCB", vencimento, encerrado: false, ...extra });
const octets = (text) => new TextEncoder().encode(text).length;

describe("escapeIcsText", () => {
  it("escapes commas, semicolons and backslashes, and turns line breaks into \\n (RFC 5545)", () => {
    expect(escapeIcsText("Souza, Lima; Cia")).toBe("Souza\\, Lima\\; Cia");
    expect(escapeIcsText("C:\\pasta")).toBe("C:\\\\pasta");
    expect(escapeIcsText("linha 1\nlinha 2\r\nlinha 3\rlinha 4")).toBe("linha 1\\nlinha 2\\nlinha 3\\nlinha 4");
  });

  it("writes an empty text for null and undefined", () => {
    expect(escapeIcsText(null)).toBe("");
    expect(escapeIcsText(undefined)).toBe("");
  });
});

describe("foldIcsLine", () => {
  it("keeps a short line as it is", () => {
    expect(foldIcsLine("SUMMARY:AVCB – Maria")).toBe("SUMMARY:AVCB – Maria");
  });

  it("folds long lines at 75 octets without splitting an accented character", () => {
    const line = `SUMMARY:${"Regularização de obra e habite-se – ".repeat(4)}Maria`;
    const folded = foldIcsLine(line);
    const physicalLines = folded.split("\r\n");
    expect(physicalLines.length).toBeGreaterThan(1);
    physicalLines.forEach((physicalLine) => expect(octets(physicalLine)).toBeLessThanOrEqual(75));
    physicalLines.slice(1).forEach((physicalLine) => expect(physicalLine.startsWith(" ")).toBe(true));
    expect(folded.replace(/\r\n /g, "")).toBe(line);
    expect(folded).not.toContain("\uFFFD");
  });
});

describe("selectCalendarExpiries", () => {
  it("keeps open services that expire from today to 12 months ahead, soonest first", () => {
    const services = [
      openService("later", "2027-11-09"),
      openService("today", "2026-11-09"),
      openService("soon", "2027-01-31"),
    ];
    expect(selectCalendarExpiries(services, TODAY).map((s) => s.id)).toEqual(["today", "soon", "later"]);
  });

  it("leaves out closed services, past expiries, expiries after 12 months and missing dates", () => {
    const services = [
      openService("closed", "2027-01-10", { encerrado: true }),
      openService("overdue", "2026-11-08"),
      openService("too-far", "2027-11-10"),
      openService("no-date", null),
      openService("bad-date", "2027-02-30"),
    ];
    expect(selectCalendarExpiries(services, TODAY)).toEqual([]);
  });
});

describe("buildExpiryEventTitle", () => {
  it("joins the service type and the client name", () => {
    expect(buildExpiryEventTitle({ tipo: "AVCB" }, { nome: "Maria Souza" })).toBe("AVCB – Maria Souza");
    expect(buildExpiryEventTitle({ tipo: "AVCB" }, undefined)).toBe("AVCB");
  });
});

describe("buildExpiryCalendar", () => {
  const services = [
    openService("s1", "2027-03-15"),
    openService("s2", "2027-01-31", { cliente_id: "c2", tipo: "PGR (gerenciamento de riscos)" }),
    openService("s3", "2026-10-01"),
  ];
  const calendar = buildExpiryCalendar({ services, clients, todayIso: TODAY, generatedAt: GENERATED_AT });

  it("uses CRLF line endings only and wraps the events in one VCALENDAR", () => {
    expect(calendar.endsWith("END:VCALENDAR\r\n")).toBe(true);
    expect(calendar.startsWith("BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:")).toBe(true);
    expect(calendar.replace(/\r\n/g, "")).not.toMatch(/[\r\n]/);
  });

  it("writes one all-day event per upcoming expiry, in date order", () => {
    expect(calendar.match(/BEGIN:VEVENT/g)).toHaveLength(2);
    expect(calendar).toContain("DTSTART;VALUE=DATE:20270131\r\nDTEND;VALUE=DATE:20270201\r\n");
    expect(calendar).toContain("DTSTART;VALUE=DATE:20270315\r\nDTEND;VALUE=DATE:20270316\r\n");
    expect(calendar.indexOf("20270131")).toBeLessThan(calendar.indexOf("20270315"));
    expect(calendar).not.toContain("20261001");
  });

  it("titles each event with the service type and the client name, escaped", () => {
    expect(calendar).toContain("SUMMARY:AVCB – Maria Souza\r\n");
    expect(calendar).toContain("SUMMARY:PGR (gerenciamento de riscos) – Souza\\, Lima\\; Cia\r\n");
  });

  it("gives each event a stable UID and the DTSTAMP that RFC 5545 requires", () => {
    expect(calendar).toContain("UID:s1@rdibiraengenharia.com.br\r\n");
    expect(calendar.match(/DTSTAMP:20261109T143005Z\r\n/g)).toHaveLength(2);
  });

  it("produces a valid calendar with no events when nothing expires in the next 12 months", () => {
    const empty = buildExpiryCalendar({ services: [], clients, todayIso: TODAY, generatedAt: GENERATED_AT });
    expect(empty).not.toContain("BEGIN:VEVENT");
    expect(empty.endsWith("END:VCALENDAR\r\n")).toBe(true);
  });
});
