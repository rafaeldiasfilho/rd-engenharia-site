import { useState } from "react";
import { foto, caminho, aviso } from "./fotos";

// Foto com legenda honesta. Se o slot não tem foto (ou o arquivo falha), não mostra nada:
// quem usa o componente já tem a ilustração ou o desenho de projeto como alternativa.
export default function Foto({ slot, eager = false, sizes = "100vw", className = "", pos, legenda = true, aspecto }) {
  const f = foto(slot);
  const [falhou, setFalhou] = useState(false);
  if (!f || falhou) return null;
  return (
    <figure className={`foto ${f.forma === "retrato" ? "foto-retrato" : "foto-paisagem"} ${className}`}>
      <div className="foto-caixa" style={{ aspectRatio: aspecto || `${f.w} / ${f.h}` }}>
        <img
          src={caminho(f)}
          width={f.w}
          height={f.h}
          alt={f.alt}
          loading={eager ? "eager" : "lazy"}
          fetchpriority={eager ? "high" : undefined}
          decoding="async"
          style={pos ? { objectPosition: pos } : undefined}
          onError={() => setFalhou(true)}
        />
      </div>
      {legenda && (
        <figcaption>
          {aviso(f)} <a href="/creditos">Créditos</a>
        </figcaption>
      )}
    </figure>
  );
}
