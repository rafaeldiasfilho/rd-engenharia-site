// Office hours check in São Paulo time (Monday to Friday, 7:00 to 17:00).

export const isWithinOfficeHours = () => {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Sao_Paulo",
      weekday: "short",
      hour: "numeric",
      hour12: false,
    }).formatToParts(new Date());
    const day = parts.find((p) => p.type === "weekday").value;
    const hour = Number(parts.find((p) => p.type === "hour").value) % 24;
    return !["Sat", "Sun"].includes(day) && hour >= 7 && hour < 17;
  } catch {
    return false;
  }
};

// Text of the office hours line. isOpenNow is null before the page runs in the browser (prerender):
// then only the hours are shown. Outside office hours the text invites the visitor to send the message
// now, because the team answers on the next working day.
export function officeHoursStatusText(isOpenNow) {
  if (isOpenNow === null) return "Atendimento de segunda a sexta, das 7h às 17h";
  if (isOpenNow) return "Atendendo agora. Seg. a sex., das 7h às 17h";
  return "Pode mandar a mensagem agora: respondemos no próximo dia útil, a partir das 7h.";
}
