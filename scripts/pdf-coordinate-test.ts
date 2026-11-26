/**
 * Prueba de coordenadas PDF — Fase 0.
 *
 * Reproduce con pdf-lib lo que hace el legacy con TCPDF/FPDI:
 *   - página A4 (210×297 mm),
 *   - plantilla tamaño Carta estirada a A4 (como `useTemplate(..., 210, 297)`),
 *   - texto en las coordenadas exactas de `PortalController.php`.
 *
 * Genera una versión normal y una de depuración (texto rojo + cruces en la línea base)
 * para revisar visualmente que cada dato cae donde debe.
 *
 * Uso: `node scripts/pdf-coordinate-test.ts`
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { PDFFont } from "pdf-lib";

import {
  A4_HEIGHT_PT,
  A4_WIDTH_PT,
  CARTA_LAYOUT,
  MM_TO_PT,
  PDF_FONTS,
  SS_LAYOUT,
  tcpdfBaselineFromTopPt,
  tcpdfBaselinePdfY,
} from "../src/lib/pdf/overlay.ts";
import type { FieldPosition, PdfFontKey } from "../src/lib/pdf/overlay.ts";

const ROOT = process.cwd();
const TEMPLATES_DIR = path.join(ROOT, "assets", "plantillas");
const OUT_DIR = path.join(ROOT, "tmp", "pdf");

const BLACK = rgb(0, 0, 0);
const DEBUG_RED = rgb(0.86, 0.15, 0.15);

const CARTA_VALUES: Record<string, string> = {
  encargadoEmpresa: "Ing. María Fernanda López",
  empresaServicio: "Grupo Industrial del Bajío, S.A. de C.V.",
  nombreAlumno: "Juan Pablo Hernández Ramírez",
  especialidad: "Programación",
  matricula: "145-2026-0187",
  grupo: "6° A",
  fecha: "26 de noviembre de 2026",
};

const SS_VALUES: Record<string, string> = {
  fecha: "26 de noviembre de 2026",
  empresaServicio: "Fundación Comunitaria de León, A.C.",
  encargadoEmpresa: "Lic. Ana Sofía Martínez",
  cargoEncargado: "Coordinadora de Vinculación",
  nombreAlumno: "María José Torres Salinas",
  matricula: "145-2026-0203",
  semestre: "5°",
  especialidad: "Contabilidad",
};

interface RenderOptions {
  templateFile: string;
  layout: Record<string, FieldPosition>;
  values: Record<string, string>;
  outputFile: string;
  debug: boolean;
}

async function renderTemplate(options: RenderOptions): Promise<void> {
  const { templateFile, layout, values, outputFile, debug } = options;

  const templatePath = path.join(TEMPLATES_DIR, templateFile);
  const templateDoc = await PDFDocument.load(await readFile(templatePath));
  const templatePage = templateDoc.getPage(0);
  const templateSize = templatePage.getSize();
  const rotation = templatePage.getRotation().angle;

  const doc = await PDFDocument.create();
  const embeddedTemplate = await doc.embedPage(templatePage);
  const page = doc.addPage([A4_WIDTH_PT, A4_HEIGHT_PT]);

  // Equivale a `useTemplate($tpl, 0, 0, 210, 297)`: estira Carta a A4.
  page.drawPage(embeddedTemplate, {
    x: 0,
    y: 0,
    width: A4_WIDTH_PT,
    height: A4_HEIGHT_PT,
  });

  const helvetica = await doc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontFor = (key: PdfFontKey): PDFFont => (key === "helvetica11" ? helvetica : helveticaBold);

  const color = debug ? DEBUG_RED : BLACK;
  const rows: Array<Record<string, string>> = [];

  for (const [field, position] of Object.entries(layout)) {
    const value = values[field];
    if (!value) {
      continue;
    }

    const font = PDF_FONTS[position.font];
    const xPt = position.xMm * MM_TO_PT;
    const baselineFromTopPt = tcpdfBaselineFromTopPt(position.yMm, position.font);
    const yPt = tcpdfBaselinePdfY(position.yMm, position.font);

    page.drawText(value, {
      x: xPt,
      y: yPt,
      size: font.sizePt,
      font: fontFor(position.font),
      color,
    });

    if (debug) {
      page.drawLine({
        start: { x: xPt - 4, y: yPt },
        end: { x: xPt + 4, y: yPt },
        thickness: 0.4,
        color,
      });
      page.drawLine({
        start: { x: xPt, y: yPt - 4 },
        end: { x: xPt, y: yPt + 4 },
        thickness: 0.4,
        color,
      });
    }

    rows.push({
      campo: field,
      "SetXY (mm)": `${position.xMm}, ${position.yMm}`,
      fuente: position.font,
      "línea base (pt desde arriba)": baselineFromTopPt.toFixed(2),
      "y pdf-lib (pt)": yPt.toFixed(2),
    });
  }

  doc.setTitle(`Prueba de coordenadas — ${templateFile}`);
  doc.setProducer("sis_solicitud-next · Fase 0");

  const outputPath = path.join(OUT_DIR, outputFile);
  await writeFile(outputPath, await doc.save());

  console.log(`\nPlantilla: ${templateFile}`);
  console.log(
    `  MediaBox: ${templateSize.width} × ${templateSize.height} pt · rotación ${rotation}°`,
  );
  console.log(
    `  Salida: A4 ${A4_WIDTH_PT.toFixed(2)} × ${A4_HEIGHT_PT.toFixed(2)} pt (plantilla estirada)`,
  );
  console.log(`  Archivo: ${path.relative(ROOT, outputPath)}`);
  console.table(rows);
}

async function main(): Promise<void> {
  await mkdir(OUT_DIR, { recursive: true });

  const targets: RenderOptions[] = [
    {
      templateFile: "CARTA_PRESENTACION_PP.pdf",
      layout: CARTA_LAYOUT,
      values: CARTA_VALUES,
      outputFile: "carta-test.pdf",
      debug: false,
    },
    {
      templateFile: "CARTA_PRESENTACION_PP.pdf",
      layout: CARTA_LAYOUT,
      values: CARTA_VALUES,
      outputFile: "carta-debug.pdf",
      debug: true,
    },
    {
      templateFile: "PRESENTACION_SS_2024.pdf",
      layout: SS_LAYOUT,
      values: SS_VALUES,
      outputFile: "ss-test.pdf",
      debug: false,
    },
    {
      templateFile: "PRESENTACION_SS_2024.pdf",
      layout: SS_LAYOUT,
      values: SS_VALUES,
      outputFile: "ss-debug.pdf",
      debug: true,
    },
  ];

  console.log("Offset TCPDF (celda de 10 mm + centrado de fuente):");
  console.log(`  Helvetica 11      → ${tcpdfBaselineFromTopPt(0, "helvetica11").toFixed(3)} pt`);
  console.log(
    `  Helvetica-Bold 11 → ${tcpdfBaselineFromTopPt(0, "helveticaBold11").toFixed(3)} pt`,
  );
  console.log(
    `  Helvetica-Bold 12 → ${tcpdfBaselineFromTopPt(0, "helveticaBold12").toFixed(3)} pt`,
  );
  console.log("\nDatos de prueba ficticios. Comparar contra las líneas de cada plantilla.");

  for (const target of targets) {
    await renderTemplate(target);
  }

  console.log("\nListo. Convierte a PNG con:");
  console.log("  qlmanage -t -s 1600 -o tmp/pdf tmp/pdf/carta-test.pdf tmp/pdf/ss-test.pdf");
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
