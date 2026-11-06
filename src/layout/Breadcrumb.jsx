// Breadcrumb trail of the inner pages.

// Trail "Início › Serviços › Segurança do trabalho". The last item is the current page.
export function Breadcrumb({ items }) {
  return (
    <nav className="breadcrumb" aria-label="Você está aqui">
      <ol>
        <li>
          <a href="/">Início</a>
        </li>
        {items.map((it, n) => (
          <li key={it.label}>
            {it.href && n < items.length - 1 ? (
              <a href={it.href}>{it.label}</a>
            ) : (
              <span aria-current="page">{it.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
