import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Junta classes do Tailwind sem conflito (padrão do shadcn, usado pelos componentes de components/ui).
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
