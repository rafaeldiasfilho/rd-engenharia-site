// Area page summary: who it is for, what the client receives and who signs.
import { TECHNICAL_LEAD_PHOTO } from "../../content/technicalLead";
import { CREA_NUMBER } from "../../company";

export function AreaSummary({ overview }) {
  return (
    <section className="summary-editorial" aria-label="Resumo">
      <div className="container summary-editorial-grid">
        <div className="reveal">
          <p className="label-mini">Para quem</p>
          <p>{overview.who}</p>
        </div>
        <div className="reveal">
          <p className="label-mini">Você recebe</p>
          <p>{overview.deliverable}</p>
        </div>
        <div className="signer reveal">
          <p className="label-mini">Quem assina</p>
          <div className="signer-line">
            {TECHNICAL_LEAD_PHOTO ? (
              <img src={TECHNICAL_LEAD_PHOTO} width="56" height="56" alt="Rafael Antonio Dias" />
            ) : (
              <span className="signer-initials" aria-hidden="true">
                RD
              </span>
            )}
            <p>
              <strong>Rafael Antonio Dias</strong>
              <span>Engenheiro civil e ambiental · {CREA_NUMBER}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
