import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Solicitudes — CETIS 145",
  description: "Sistema de solicitudes de prácticas profesionales y servicio social.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={poppins.variable}>
      <body className="bg-canvas font-sans text-content antialiased">{children}</body>
    </html>
  );
}
