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
