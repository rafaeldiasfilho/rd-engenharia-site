// Office hours line under the quote buttons (home and area pages). The live status appears only after
// the page runs in the browser, so the prerendered HTML never shows a stale "atendendo agora".
import { useEffect, useState } from "react";
import Icon from "./Icon";
import { isWithinOfficeHours, officeHoursStatusText } from "./officeHours.js";

export function OfficeHoursStatus({ className = "" }) {
  const [isOpenNow, setIsOpenNow] = useState(null);

  useEffect(() => {
    setIsOpenNow(isWithinOfficeHours());
    const id = setInterval(() => setIsOpenNow(isWithinOfficeHours()), 60000);
    return () => clearInterval(id);
  }, []);

  return (
    <p className={`status status-bg ${isOpenNow ? "on" : ""} ${className}`}>
      <Icon name="fa-solid fa-circle" /> {officeHoursStatusText(isOpenNow)}
    </p>
  );
}
