import type { Metadata } from "next";

import { poppins } from "@/lib/fonts";

import "./globals.css";

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
