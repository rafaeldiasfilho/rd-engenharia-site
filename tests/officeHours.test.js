// "Atendendo agora" badge on the home page: Monday to Friday, 7:00 to 17:00 in São Paulo.
import { afterEach, describe, expect, it, vi } from "vitest";
import { isWithinOfficeHours, officeHoursStatusText } from "../src/officeHours.js";

// São Paulo is UTC-3 all year (no daylight saving time since 2019).
const atSaoPaulo = (isoLocal) => vi.setSystemTime(new Date(`${isoLocal}-03:00`));

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("isWithinOfficeHours", () => {
  it("is open on a weekday during office hours", () => {
    vi.useFakeTimers();
    atSaoPaulo("2026-11-09T07:00:00"); // Monday
    expect(isWithinOfficeHours()).toBe(true);
    atSaoPaulo("2026-11-13T16:59:00"); // Friday
    expect(isWithinOfficeHours()).toBe(true);
  });

  it("is closed before 7:00 and from 17:00", () => {
    vi.useFakeTimers();
    atSaoPaulo("2026-11-09T06:59:00");
    expect(isWithinOfficeHours()).toBe(false);
    atSaoPaulo("2026-11-09T17:00:00");
    expect(isWithinOfficeHours()).toBe(false);
  });

  it("is closed on Saturday and Sunday", () => {
    vi.useFakeTimers();
    atSaoPaulo("2026-11-07T10:00:00");
    expect(isWithinOfficeHours()).toBe(false);
    atSaoPaulo("2026-11-08T10:00:00");
    expect(isWithinOfficeHours()).toBe(false);
  });

  it("uses São Paulo time, not the visitor's clock", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-09T10:30:00Z")); // 7:30 in São Paulo, 10:30 in UTC
    expect(isWithinOfficeHours()).toBe(true);
    vi.setSystemTime(new Date("2026-11-09T20:30:00Z")); // 17:30 in São Paulo
    expect(isWithinOfficeHours()).toBe(false);
  });

  it("reports closed when the browser cannot handle the time zone", () => {
    vi.stubGlobal("Intl", { DateTimeFormat: () => { throw new RangeError("Invalid time zone"); } });
    expect(isWithinOfficeHours()).toBe(false);
  });
});

describe("officeHoursStatusText", () => {
  it("shows only the hours before the page runs in the browser", () => {
    expect(officeHoursStatusText(null)).toBe("Atendimento de segunda a sexta, das 7h às 17h");
  });

  it("says the team is answering during office hours", () => {
    expect(officeHoursStatusText(true)).toBe("Atendendo agora. Seg. a sex., das 7h às 17h");
  });

  it("invites the visitor to send the message now outside office hours", () => {
    expect(officeHoursStatusText(false)).toBe("Pode mandar a mensagem agora: respondemos no próximo dia útil, a partir das 7h.");
  });
});
