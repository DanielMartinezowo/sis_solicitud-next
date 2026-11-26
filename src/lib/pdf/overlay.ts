/**
 * Geometría de las plantillas PDF, portada del legacy.
 *
 * Fuente: `app/controllers/PortalController.php` (métodos `pdf()` y `pdfcarta()`).
 * El legacy usa TCPDF con el origen de coordenadas ARRIBA-IZQUIERDA y unidades en mm.
 * pdf-lib usa el origen ABAJO-IZQUIERDA y unidades en puntos (72 pt = 1 in).
 *
 * Dos detalles que no son obvios y que hay que reproducir tal cual:
 *
 * 1. Las plantillas son tamaño Carta (612×792 pt), pero TCPDF crea una página A4
 *    (`addPage()`) y dibuja la plantilla con `useTemplate($tpl, 0, 0, 210, 297)`, es decir
 *    la ESTIRA a 210×297 mm. No es un error que debamos corregir: es el resultado que
 *    llevan años recibiendo los alumnos.
 *
 * 2. `SetXY()` coloca la esquina superior de una celda de 10 mm; TCPDF centra el texto en
 *    esa celda (`Cell(..., $valign = 'M')`) y después coloca la línea base de la fuente.
 *    Por eso la Y de pdf-lib no es `alto - y_tcpdf`, sino:
 *
 *      y_pdf = alto_pagina_pt - (y_mm × 72/25.4 + 10mm×72/25.4/2 + (Ascent + |Descent|)/1000 × tamaño_pt / 2)
 *
 *    Los valores de Ascent/Descent salen de las fuentes core de TCPDF
 *    (`libraries/tcpdf/fonts/helvetica.php` y `helveticab.php`).
 */

/** Milímetros a puntos PostScript (72 pt = 1 pulgada). */
export const MM_TO_PT = 72 / 25.4;

export const A4_WIDTH_MM = 210;
export const A4_HEIGHT_MM = 297;
export const A4_WIDTH_PT = A4_WIDTH_MM * MM_TO_PT;
export const A4_HEIGHT_PT = A4_HEIGHT_MM * MM_TO_PT;

/** Altura de celda usada por el legacy en todos los `Cell(0, 10, ...)`. */
export const TCPDF_CELL_HEIGHT_MM = 10;

export type PdfFontKey = "helvetica11" | "helveticaBold11" | "helveticaBold12";

interface FontMetrics {
  /** Tamaño en puntos, tal como se pasa a `SetFont()`. */
  sizePt: number;
  /** `desc.Ascent` de la fuente core de TCPDF (unidades /1000 em). */
  ascent: number;
  /** `|desc.Descent|` de la fuente core de TCPDF (unidades /1000 em). */
  descent: number;
}

export const PDF_FONTS: Record<PdfFontKey, FontMetrics> = {
  helvetica11: { sizePt: 11, ascent: 931, descent: 225 },
  helveticaBold11: { sizePt: 11, ascent: 962, descent: 228 },
  helveticaBold12: { sizePt: 12, ascent: 962, descent: 228 },
};

/**
 * Distancia desde el borde superior de la celda (el `y` de `SetXY`) hasta la línea base
 * del texto, en puntos. Es el valor que hay que restar a la altura de la página.
 */
export function tcpdfBaselineFromTopPt(yMm: number, fontKey: PdfFontKey): number {
  const font = PDF_FONTS[fontKey];
  const cellHalfPt = (TCPDF_CELL_HEIGHT_MM * MM_TO_PT) / 2;
  const fontHalfPt = ((font.ascent + font.descent) / 1000) * (font.sizePt / 2);
  return yMm * MM_TO_PT + cellHalfPt + fontHalfPt;
}

/** Y de pdf-lib (origen abajo) para la línea base del texto. */
export function tcpdfBaselinePdfY(
  yMm: number,
  fontKey: PdfFontKey,
  pageHeightPt: number = A4_HEIGHT_PT,
): number {
  return pageHeightPt - tcpdfBaselineFromTopPt(yMm, fontKey);
}

export interface FieldPosition {
  /** Coordenada X de `SetXY`, en mm desde el borde izquierdo. */
  xMm: number;
  /** Coordenada Y de `SetXY`, en mm desde el borde superior. */
  yMm: number;
  font: PdfFontKey;
}

/** Campos de `CARTA_PRESENTACION_PP.pdf` (PortalController::pdf, líneas 60-84). */
export const CARTA_LAYOUT = {
  encargadoEmpresa: { xMm: 22, yMm: 56, font: "helveticaBold12" },
  empresaServicio: { xMm: 22, yMm: 62, font: "helveticaBold12" },
  nombreAlumno: { xMm: 40, yMm: 114, font: "helveticaBold12" },
  especialidad: { xMm: 77, yMm: 126, font: "helveticaBold11" },
  matricula: { xMm: 36, yMm: 136, font: "helveticaBold11" },
  grupo: { xMm: 122, yMm: 136, font: "helveticaBold11" },
  fecha: { xMm: 116, yMm: 154, font: "helveticaBold11" },
} satisfies Record<string, FieldPosition>;

export type CartaField = keyof typeof CARTA_LAYOUT;

/** Campos de `PRESENTACION_SS_2024.pdf` (PortalController::pdfcarta, líneas 121-149). */
export const SS_LAYOUT = {
  fecha: { xMm: 142, yMm: 53.8, font: "helvetica11" },
  empresaServicio: { xMm: 21, yMm: 65, font: "helveticaBold12" },
  encargadoEmpresa: { xMm: 21, yMm: 71, font: "helveticaBold12" },
  cargoEncargado: { xMm: 21, yMm: 76.5, font: "helveticaBold12" },
  nombreAlumno: { xMm: 21, yMm: 120, font: "helveticaBold11" },
  matricula: { xMm: 143, yMm: 120, font: "helveticaBold11" },
  semestre: { xMm: 42, yMm: 128.5, font: "helveticaBold11" },
  especialidad: { xMm: 105, yMm: 128.5, font: "helveticaBold11" },
} satisfies Record<string, FieldPosition>;

export type SsField = keyof typeof SS_LAYOUT;
