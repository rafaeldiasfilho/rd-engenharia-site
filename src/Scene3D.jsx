import { useEffect, useRef, useState } from "react";

// Cenas 3D das páginas de área (three.js; ideia do prompt "Spline scene" da biblioteca, sem a Spline).
// Cada cena fica num arquivo próprio em src/cenas3d/ e só baixa quando o bloco está a ~600 px da tela.
// A base comum (src/cenas3d/base.js) pausa fora da tela, inclina com o mouse e, com "reduzir movimento",
// mostra uma imagem parada. Sem WebGL fica o desenho de curvas em CSS do fundo.
const CENAS = {
  terreno: () => import("./scenes3d/terrain"),
  casa: () => import("./scenes3d/house"),
  rota: () => import("./scenes3d/escapeRoute"),
  capacete: () => import("./scenes3d/hardHat"),
};

export default function Cena3D({ cena, className = "", rotulo }) {
  const caixa = useRef(null);
  const [sem3d, setSem3d] = useState(false);

  useEffect(() => {
    const el = caixa.current;
    const carregar = CENAS[cena];
    if (!el || !carregar) return undefined;
    let parar = () => {};
    let cancelado = false;

    const iniciar = async () => {
      const { montar } = await carregar();
      if (cancelado) return;
      const desmontar = montar(el);
      if (!desmontar) setSem3d(true);
      else parar = desmontar;
    };

    const perto = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        perto.disconnect();
        iniciar().catch(() => setSem3d(true));
      },
      { rootMargin: "600px" },
    );
    perto.observe(el);

    return () => {
      cancelado = true;
      perto.disconnect();
      parar();
    };
  }, [cena]);

  return <div ref={caixa} className={`scene3d ${sem3d ? "cena-sem3d" : ""} ${className}`} role="img" aria-label={rotulo} />;
}
