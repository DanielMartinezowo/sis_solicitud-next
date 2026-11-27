# sis_solicitud-next

Migración de `sis_solicitud` (PHP 8.2 + MariaDB) a **Next.js 16 + TypeScript + Tailwind 4 + Prisma + PostgreSQL**.

Sistema de trámites del CETIS 145: prácticas profesionales y servicio social, con formularios
públicos, panel administrativo por rol y generación de PDF sobre las plantillas oficiales.

## Requisitos

- Node.js **>= 22.12** (en desarrollo se usa Node 26 LTS)
- PostgreSQL **19** (Homebrew, servicio `postgresql@19`)
- npm 11

## Puesta en marcha

```bash
# 1. Dependencias
npm install

# 2. Base de datos (solo la primera vez)
psql -d postgres -c "CREATE ROLE sis_app LOGIN PASSWORD 'TU_PASSWORD_LOCAL';"
createdb -O sis_app sis_solicitud

# 3. Variables de entorno
cp .env.example .env.local
# edita .env.local con la contraseña real de sis_app

# 4. Desarrollo
npm run dev
```

La app queda en <http://localhost:3000>.

> `.env.local` está en `.gitignore`. Nunca se commitea.

## Scripts

| Script | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` / `start` | Build de producción y arranque |
| `npm run lint` | ESLint (incluye reglas del contrato: sin `any`, sin `dangerouslySetInnerHTML`) |
| `npm run typecheck` | Genera los tipos de rutas de Next (`next typegen`) y valida con `tsc --noEmit` |
| `npm run test` | Vitest + Testing Library |
| `npm run test:watch` | Vitest en modo watch |
| `npm run test:e2e` | Playwright (se instala en la Fase 6) |
| `npm run storybook` | Storybook en <http://localhost:6006> |
| `npm run build-storybook` | Build estático de Storybook |
| `npm run format` / `format:check` | Prettier + orden de clases Tailwind |

## Prueba de coordenadas PDF

Es la verificación del único riesgo técnico real: convertir las coordenadas de TCPDF (origen
arriba, mm) a pdf-lib (origen abajo, pt) y reproducir el estiramiento Carta → A4 del legacy.

```bash
node scripts/pdf-coordinate-test.ts
qlmanage -t -s 1600 -o tmp/pdf tmp/pdf/carta-test.pdf tmp/pdf/ss-test.pdf
```

Genera `tmp/pdf/carta-test.pdf`, `ss-test.pdf` y variantes `-debug` con cruces en la línea base.
La geometría y las constantes viven en `src/lib/pdf/overlay.ts`; los valores están cubiertos por
`src/lib/pdf/overlay.test.ts`.

## Estructura

```
assets/plantillas/     PDFs oficiales (fuera de public/)
scripts/               ETL y pruebas de herramientas
src/app/               Rutas (App Router)
src/actions/           Server Actions (Fase 3+)
src/components/ui/     Librería propia (Button + historia + test)
src/components/domain/ Componentes de dominio (Fase 3+)
src/lib/               auth, db, services, validation, pdf
src/styles/tokens.css  Paleta y tokens de diseño
```

## Documentos de referencia

El contrato de trabajo está en `AGENTS.md`. Los documentos maestros
(`PLAN-MIGRACION.md`, `SEGURIDAD.md`, `RESTRICCIONES-CODIGO.md`, `SKILLS.md`) viven en
`~/.opencode/plan/`. El proyecto PHP original en `../sis_solicitud` es **solo lectura**.

## Estado

- **Fase 0 cerrada:** cimientos, tokens, Storybook, Vitest, PostgreSQL y prueba de coordenadas PDF.
- **Siguiente:** Fase 1 — esquema Prisma, migraciones y seed.
