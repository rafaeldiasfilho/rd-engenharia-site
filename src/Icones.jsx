// Ícones de linha das quatro áreas (grade de 24 px, traço 1,75, pontas arredondadas, cor = currentColor).
// São decorativos (aria-hidden): o nome da área sempre aparece em texto ao lado.
const TRACOS = {
  "seguranca-do-trabalho": (
    <>
      <path d="M3.5 17.5h17" />
      <path d="M5.5 17.5a6.5 6.5 0 0 1 13 0" />
      <path d="M10 11.2V6.6h4v4.6" />
      <path d="M3.5 20.5h17" />
    </>
  ),
  "corpo-de-bombeiros": (
    <>
      <path d="M12 3.2s5.3 4.3 5.3 9.4a5.3 5.3 0 0 1-10.6 0c0-2.1 1-3.6 2.1-4.9.4 1.8 1.2 2.7 2.1 2.7.2-2.6.3-4.6 1.1-7.2z" />
      <path d="M12 20.4a2.4 2.4 0 0 1-2.4-2.4c0-1.5 1.2-2.2 2.4-3.6 1.2 1.4 2.4 2.1 2.4 3.6a2.4 2.4 0 0 1-2.4 2.4z" />
    </>
  ),
  "engenharia-civil": (
    <>
      <path d="M3 21h18" />
      <path d="M5.5 21V9.2L12 4.5l6.5 4.7V21" />
      <path d="M10 21v-4.8h4V21" />
      <path d="M9 11.8h1.2M13.8 11.8H15" />
    </>
  ),
  "meio-ambiente-topografia": (
    <>
      <path d="M3.5 17c0-6.4 4-10.4 11.5-11.2-.2 7.4-4.4 11.4-10.6 11.2" />
      <path d="M3.5 17.2l6.2-6" />
      <path d="M17.6 11.2l-2.3 9.3M17.6 11.2l2.3 9.3M17.6 11.2v9.3" />
      <path d="M16.2 9.3h2.8v1.9h-2.8z" />
    </>
  ),
};

export default function IconeArea({ slug, tamanho = 24, className = "" }) {
  const t = TRACOS[slug];
  if (!t) return null;
  return (
    <svg
      className={`icone-area ${className}`}
      width={tamanho}
      height={tamanho}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {t}
    </svg>
  );
}
