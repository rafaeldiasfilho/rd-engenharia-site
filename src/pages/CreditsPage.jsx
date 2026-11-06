// Photo credits and licences (/creditos).

import { AREAS } from "../content/areas";
import { PageClosing } from "../layout/PageClosing";
import { photoPath, srcset } from "../photos";
import { PHOTOS_IN_USE } from "../content/photoCarousels";
import { GENERAL_LINKS, PageTop, areaLink } from "./pageParts.jsx";

export function CreditsPage() {
  const groups = [
    { title: "CC0 (Wikimedia Commons)", license: "CC0", text: "Domínio público: uso livre, sem exigência de crédito. Mantemos o autor e a origem por transparência." },
    { title: "Domínio público (Wikimedia Commons)", license: "Domínio público", text: "Fotos de um instituto público dos EUA (NIOSH), sem restrição de uso. Mantemos o autor e a origem por transparência." },
    { title: "Unsplash License", license: "Unsplash License", text: "Licença própria do Unsplash, que permite uso comercial sem pedir autorização. Não é CC0. Texto completo em", link: { href: "https://unsplash.com/license", label: "unsplash.com/license" } },
  ];
  return (
    <>
      <PageTop
        breadcrumb={[{ label: "Créditos das imagens" }]}
        eyebrow="Transparência"
        title="Créditos das imagens"
        text="A RD Engenharia ainda não tem fotos próprias no site. As fotos abaixo são ilustrativas, de terceiros, e não mostram trabalhos da empresa."
      />
      <section className="sec" aria-label="Lista de créditos">
        <div className="container">
          {groups.map((g) => {
            const photos = PHOTOS_IN_USE.filter((f) => f.license === g.license);
            if (!photos.length) return null;
            return (
              <div key={g.license} className="credits-group">
                <h2>{g.title}</h2>
                <p className="credits-note">
                  {g.text}
                  {g.link && (
                    <>
                      {" "}
                      <a href={g.link.href} target="_blank" rel="noopener noreferrer">
                        {g.link.label}
                      </a>
                      .
                    </>
                  )}
                </p>
                <ul className="credits">
                  {photos.map((f) => (
                    <li key={f.file} className="reveal">
                      <img src={photoPath(f)} srcSet={srcset(f)} sizes="160px" width={f.w} height={f.h} loading="lazy" alt={f.alt} />
                      <dl>
                        {f.fileName && (
                          <div>
                            <dt>Arquivo</dt>
                            <dd>{f.fileName}</dd>
                          </div>
                        )}
                        <div>
                          <dt>Autor</dt>
                          <dd>{f.author || "Consta na página da foto (não anotado aqui)"}</dd>
                        </div>
                        <div>
                          <dt>Licença</dt>
                          <dd>
                            {f.licenseUrl ? (
                              <a href={f.licenseUrl} target="_blank" rel="noopener noreferrer">
                                {f.license}
                              </a>
                            ) : (
                              f.license
                            )}
                          </dd>
                        </div>
                        <div>
                          <dt>Página de origem</dt>
                          <dd>
                            <a href={f.source} target="_blank" rel="noopener noreferrer">
                              {f.sourceName}
                            </a>
                          </dd>
                        </div>
                      </dl>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
          <div className="container-reading credits-others">
            <h2>Outros materiais</h2>
            <p>
              A marca (logotipo) é da RD Engenharia. Os desenhos de projeto da página de engenharia civil são trabalhos reais da RD, com os dados dos
              clientes retirados. As ilustrações interativas e o modelo de PGR são exemplos inventados, feitos para o
              site. Os ícones são da Phosphor Icons (licença MIT) e a fonte é a Manrope (licença SIL
              Open Font).
            </p>
          </div>
        </div>
      </section>
      <PageClosing
        title="Quer ver o trabalho real?"
        text="Os desenhos de projeto da página de engenharia civil são da RD. Para outros serviços, conte o seu caso pelo WhatsApp."
        whatsappText="Olá! Gostaria de conhecer melhor o trabalho da RD Engenharia."
        related={[areaLink(AREAS[2]), GENERAL_LINKS.guias, GENERAL_LINKS.quiz]}
      />
    </>
  );
}
