/**
 * Une clases condicionales.
 *
 * No usamos `tailwind-merge` a propósito: evita una dependencia extra y el contrato prohíbe
 * colores arbitrarios, así que los conflictos entre variantes se resuelven por orden (el
 * `className` del consumidor va al final). Si en el futuro hacen falta overrides reales de
 * utilidades, se propone `tailwind-merge` y se registra en el plan.
 */
export type ClassValue = string | false | null | undefined;

export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}
