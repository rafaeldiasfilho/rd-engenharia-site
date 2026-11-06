import { FireSafety } from "./illustrations/FireSafety.jsx";
import { Survey } from "./illustrations/Survey.jsx";
import { RiskMap } from "./illustrations/RiskMap.jsx";
import { PgrTemplate } from "./illustrations/PgrTemplate.jsx";

export function Illustration({ slug }) {
  if (slug === "corpo-de-bombeiros") return <FireSafety />;
  if (slug === "meio-ambiente-topografia") return <Survey />;
  if (slug === "seguranca-do-trabalho")
    return (
      <div className="illustration-two">
        <RiskMap />
        <PgrTemplate />
      </div>
    );
  return null;
}
