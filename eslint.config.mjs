// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Artefactos propios del proyecto
    "storybook-static/**",
    "coverage/**",
    "tmp/**",
    "assets/**",
  ]),
  {
    rules: {
      // Reglas del contrato (RESTRICCIONES-CODIGO.md § 2 y § 4)
      "@typescript-eslint/no-explicit-any": "error",
      "react/no-danger": "error",
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
  {
    // Scripts y herramientas de desarrollo sí pueden imprimir por consola.
    files: [
      "scripts/**/*.{ts,mts,mjs}",
      ".storybook/**/*.{ts,tsx}",
      "**/*.test.{ts,tsx}",
      "vitest.config.mts",
    ],
    rules: { "no-console": "off" },
  },
  ...storybook.configs["flat/recommended"],
]);

export default eslintConfig;
