# AGENTS.md — instrucciones para el agente implementador

> Proyecto: **migración de `sis_solicitud` (PHP legacy) a Next.js + TypeScript + React + Tailwind + Prisma + PostgreSQL**.
> Este archivo es el contrato de trabajo. Debe copiarse a la raíz del proyecto nuevo (`Documents/sis_solicitud-next/AGENTS.md`) al empezar, donde los agentes lo leerán automáticamente.

---

## 📚 Documentos de referencia (leer antes de codificar)

| Archivo | Contenido | Cuándo |
|---|---|---|
| `~/.opencode/plan/PLAN-MIGRACION.md` | Decisiones cerradas, stack, estructura, modelo de datos, roadmap de 8 fases, historial de decisiones | Al empezar y ante cualquier duda de diseño |
| `~/.opencode/plan/SEGURIDAD.md` | Las 5 capas de seguridad, patrón de 4 pasos de toda acción, checklist DoD | Antes de escribir cualquier acción, formulario o ruta |
| `~/.opencode/plan/RESTRICCIONES-CODIGO.md` | Reglas de generación de código, prohibiciones, convenciones | **Siempre** |
| `~/.opencode/plan/SKILLS.md` | Recetas reutilizables por tipo de pieza | Antes de crear componentes, acciones, páginas o PDF |
| Legacy (solo lectura) | `/Users/daniel.martinez/Documents/sis_solicitud` | Para entender funcionalidad y coordenadas PDF. **No modificar nunca** |

---

## 🎯 Contexto del usuario

- Es **desarrollador front-end**. No tiene experiencia en backend y **está aprendiendo contigo**.
  → **Explica el *por qué* de cada decisión backend** en los resúmenes de fase. No asumas conocimiento de: sesiones, transacciones, rate limiting, migraciones, CSRF, RBAC.
- Trabaja en **español**. Código e identificadores en **inglés**, interfaz y comentarios en **español**.
- Tomó las decisiones de arquitectura de forma consciente; no reabrir lo cerrado salvo que aparezca un problema real (y en ese caso, exponer opciones antes de cambiar).

---

## ⚙️ Cómo se trabaja

**Ritmo: fase por fase con revisión del usuario.**

1. Ejecuta **una sola fase** completa.
2. Cierra con: `npm run lint && npm run typecheck && npm run test` en verde y `main` compilando.
3. Entrega un **resumen**: qué se hizo, decisiones tomadas (y por qué), qué probó, qué quedó pendiente, qué se aprendió (explicación backend para el usuario).
4. **Espera la revisión y aprobación** antes de empezar la siguiente fase.
5. Ante ambigüedad funcional: **preguntar**, no inventar. Ante ambigüedad de estilo/stack: seguir `RESTRICCIONES-CODIGO.md`.

**Orden de fases (de `PLAN-MIGRACION.md`):**
```
0 Cimientos + Storybook + tokens + PRUEBA DE COORDENADAS PDF
1 Prisma + migración + seed
2 🔒 Auth + guards + middleware + rate limit + cabeceras
3 Módulo Prácticas completo (piloto vertical)
4 Módulo Servicio social
5 Panel admin
6 Endurecimiento + tests + caché con tags
7 Piloto con usuarios reales
8 Producción
```

### Gate de cada fase
- [ ] Lint, typecheck y tests en verde
- [ ] Ninguna acción sin `requireRole()` + `Schema.parse()`
- [ ] Historias de Storybook de los componentes nuevos
- [ ] Textos de interfaz en español
- [ ] `PLAN-MIGRACION.md § 9` actualizado si hubo decisiones nuevas
- [ ] Resumen entregado y **aprobación recibida**

---

## 🚫 Reglas inquebrantables

1. **Nada se confía al navegador**: el cliente no envía `id`, `estado` ni `codigo` como autoridad.
2. **Patrón de 4 pasos en toda acción**: `requireRole` → `Schema.parse` → `prisma.$transaction` con reglas de negocio → `Auditoria`.
3. **Denegar por defecto**: sin `requireRole()`, no hay acceso. El menú oculto no es autorización.
4. **Ningún `GET` muta datos.**
5. **Soft delete**, nunca `DELETE` físico.
6. **Cero `any`**, cero `dangerouslySetInnerHTML`, cero SQL crudo.
7. **No tocar el legacy** (`Documents/sis_solicitud`).
8. **No publicar secretos** ni commitear `.env.local`.
9. **Dependencias nuevas: preguntar y registrar** en el plan antes de instalar.
10. **No saltarse la Fase 0**: la prueba de coordenadas PDF con `pdf-lib` sobre `CARTA_PRESENTACION_PP.pdf` es el **único riesgo técnico real**. Si las coordenadas no cuadran, se para y se comunica antes de seguir.
11. **Nada de funcionalidad fuera del alcance** (Fase 0-8): sin portal de seguimiento, sin correos, sin registro público, sin app móvil. Si surge una idea, se anota en el plan y se decide con el usuario.

---

## 🧩 Al empezar (Fase 0)

```bash
# Requisitos a verificar antes de tocar nada
node -v          # >= 20 LTS
psql --version   # Postgres nativo en macOS (si no está: brew install postgresql @ o Postgres.app)
git --version
```

1. Crear el repo en `/Users/daniel.martinez/Documents/sis_solicitud-next` e `git init`.
2. `npx create-next-app` con: TypeScript (strict), App Router, Tailwind, ESLint, App Router, `src/`, no `import alias` distinto de `@/*`.
3. Configurar Prettier + scripts: `dev`, `build`, `start`, `lint`, `typecheck`, `test`, `test:e2e`, `storybook`.
4. Storybook desde el principio con addons: `a11y`, `interactions`, `viewport`. Historias colocadas junto a cada componente (`Button.tsx` + `Button.stories.tsx` + `Button.test.tsx`).
5. `src/styles/tokens.css` con la paleta (sustituye los 156 MB de la plantilla Hyper).
6. **Prueba PDF:** script que cargue `assets/plantillas/CARTA_PRESENTACION_PP.pdf` con `pdf-lib`, escriba texto de prueba y verifique visualmente que cuadra con las coordenadas del PHP (TCPDF usa Y desde arriba; PDF desde abajo: `y_pdf = alto_pagina - y_tcpdf - altura_texto`). Con `PRESENTACION_SS_2024.pdf` igual. **Reportar resultado antes de continuar.**

---

## 🧠 Decisiones que aún están pendientes (decidir al llegar, registrar en el plan)

- Librería de toasts: `react-toastify` vs `sonner` (al Fase 3).
- Alcance exacto de *headless* en cada overlay (al construirlos).
- Estrategia de subida de avatar: disco local con ruta `/api/uploads` en Fase 5; S3/R2 al pasar a producción.
- Backend de rate limit en producción (Upstash) — la interfaz ya queda preparada en Fase 6.
- Hosting definitivo (al Fase 8).

---

## 💬 Cómo comunicar

- Resúmenes de fase: **breves y estructurados**, en español.
- Incluye siempre una sección **"Concepto backend aprendido"** (2-4 líneas explicando el concepto técnico de la fase: por qué existen las sesiones en BD, qué es una transacción, por qué `revalidateTag`, etc.).
- Si algo sale mal o hay que cambiar de rumbo, **decirlo de frente** con opciones y recomendación, no improvisar.
- Ante preguntas de seguridad, la respuesta por defecto es **la más restrictiva**.
