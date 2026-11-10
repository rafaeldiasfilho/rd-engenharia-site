// Calendar file (.ics, RFC 5545) with the upcoming expiries of open services: one all-day event per expiry,
// titled with the service type and the client name, to import into Google Agenda, Outlook or the phone calendar.

import { addDays, addMonths, isValidISODate } from "./dates.js";

export const EXPIRY_CALENDAR_MONTHS = 12;
const ICS_LINE_BREAK = "\r\n"; // RFC 5545 section 3.1: every line ends with CRLF
const ICS_MAX_LINE_OCTETS = 75;
const ICS_UID_DOMAIN = "rdibiraengenharia.com.br";

// RFC 5545 section 3.3.11 (TEXT): backslash, semicolon and comma are escaped with a backslash,
// and every line break becomes the two characters \n.
export function escapeIcsText(value) {
  return String(value ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r\n|\r|\n/g, "\\n");
}

const utf8OctetCount = (character) => {
  const codePoint = character.codePointAt(0);
  if (codePoint < 0x80) return 1;
  if (codePoint < 0x800) return 2;
  if (codePoint < 0x10000) return 3;
  return 4;
};

// RFC 5545 section 3.1: a line longer than 75 octets is folded (CRLF + one space), never inside a UTF-8 character.
// Continuation lines hold 74 octets after the leading space.
export function foldIcsLine(line) {
  const segments = [""];
  let segmentOctets = 0;
  for (const character of line) {
    const octets = utf8OctetCount(character);
    const segmentLimit = segments.length === 1 ? ICS_MAX_LINE_OCTETS : ICS_MAX_LINE_OCTETS - 1;
    if (segmentOctets + octets > segmentLimit) {
      segments.push("");
      segmentOctets = 0;
    }
    segments[segments.length - 1] += character;
    segmentOctets += octets;
  }
  return segments.join(`${ICS_LINE_BREAK} `);
}

// Open services (not encerrado) whose expiry falls between today and today + 12 months, soonest first.
export function selectCalendarExpiries(services, todayIso, months = EXPIRY_CALENDAR_MONTHS) {
  if (!isValidISODate(todayIso)) return [];
  const windowEnd = addMonths(todayIso, months);
  return services
    .filter((service) => !service.encerrado && isValidISODate(service.vencimento))
    .filter((service) => service.vencimento >= todayIso && service.vencimento <= windowEnd)
    .sort((a, b) => a.vencimento.localeCompare(b.vencimento));
}

export const buildExpiryEventTitle = (service, client) => [service.tipo, client?.nome].filter(Boolean).join(" – ");

const formatIcsDate = (iso) => iso.replace(/-/g, "");
// 2026-11-09T14:30:05.123Z -> 20261109T143005Z
const formatIcsTimestamp = (date) => date.toISOString().replace(/\.\d{3}Z$/, "Z").replace(/[-:]/g, "");

// generatedAt: a Date, written as DTSTAMP (required by RFC 5545). Returns the whole file as text.
export function buildExpiryCalendar({ services, clients, todayIso, generatedAt }) {
  const clientsById = new Map(clients.map((client) => [client.id, client]));
  const stamp = formatIcsTimestamp(generatedAt);
  const eventLines = selectCalendarExpiries(services, todayIso).flatMap((service) => [
    "BEGIN:VEVENT",
    `UID:${escapeIcsText(`${service.id}@${ICS_UID_DOMAIN}`)}`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${formatIcsDate(service.vencimento)}`,
    `DTEND;VALUE=DATE:${formatIcsDate(addDays(service.vencimento, 1))}`,
    `SUMMARY:${escapeIcsText(buildExpiryEventTitle(service, clientsById.get(service.cliente_id)))}`,
    "TRANSP:TRANSPARENT",
    "END:VEVENT",
  ]);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//RD Engenharia//Admin expiry calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    ...eventLines,
    "END:VCALENDAR",
  ];
  return lines.map(foldIcsLine).join(ICS_LINE_BREAK) + ICS_LINE_BREAK;
}
