import { Poppins } from "next/font/google";

/**
 * Configuración única de la tipografía de la app.
 *
 * Vive fuera de `layout.tsx` a propósito: el layout es un componente de
 * servidor y en fases posteriores usará `cookies()`/`headers()`. Storybook
 * necesita la misma fuente, y no debe importar el layout entero solo por un
 * efecto secundario; importa este módulo y aplica las clases con un decorador.
 */
export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});
