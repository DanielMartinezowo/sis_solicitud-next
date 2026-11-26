import { describe, expect, it } from "vitest";

import {
  CARTA_LAYOUT,
  MM_TO_PT,
  PDF_FONTS,
  SS_LAYOUT,
  tcpdfBaselineFromTopPt,
  tcpdfBaselinePdfY,
} from "./overlay";

describe("geometría PDF (TCPDF → pdf-lib)", () => {
  it("convierte milímetros a puntos", () => {
    expect(MM_TO_PT).toBeCloseTo(2.834646, 5);
  });

  it("desplaza la celda de 10 mm y centra la fuente Helvetica 11", () => {
    // 10mm de celda = 14.173 pt; (931 + 225)/1000 × 11/2 = 6.358 pt
    expect(tcpdfBaselineFromTopPt(0, "helvetica11")).toBeCloseTo(20.531, 2);
  });

  it("usa las métricas de Helvetica-Bold", () => {
    // (962 + 228)/1000 × 11/2 = 6.545 pt
    expect(tcpdfBaselineFromTopPt(0, "helveticaBold11")).toBeCloseTo(20.718, 2);
    expect(tcpdfBaselineFromTopPt(0, "helveticaBold12")).toBeCloseTo(21.313, 2);
  });

  it("calcula la línea base de un campo real de la carta de prácticas", () => {
    // SetXY(22, 56) con Helvetica-Bold 12 → 56 × 2.834646 + 21.313 = 180.053 pt desde arriba
    expect(
      tcpdfBaselineFromTopPt(CARTA_LAYOUT.encargadoEmpresa.yMm, "helveticaBold12"),
    ).toBeCloseTo(180.053, 2);
    expect(tcpdfBaselinePdfY(56, "helveticaBold12")).toBeCloseTo(661.836, 2);
  });

  it("calcula la línea base de la fecha de servicio social", () => {
    // SetXY(142, 53.8) con Helvetica 11 → 53.8 × 2.834646 + 20.531 = 173.036 pt desde arriba
    expect(tcpdfBaselineFromTopPt(SS_LAYOUT.fecha.yMm, "helvetica11")).toBeCloseTo(173.036, 2);
  });

  it("mantiene los tamaños de fuente del legacy", () => {
    expect(PDF_FONTS.helvetica11.sizePt).toBe(11);
    expect(PDF_FONTS.helveticaBold11.sizePt).toBe(11);
    expect(PDF_FONTS.helveticaBold12.sizePt).toBe(12);
  });
});
