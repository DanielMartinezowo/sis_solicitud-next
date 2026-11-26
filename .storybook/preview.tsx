import type { Preview } from "@storybook/nextjs-vite";

import "../src/app/globals.css";
import "./preview.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // Se revisa a mano en cada historia; no bloquea el arranque de Storybook.
      test: "todo",
    },
  },
};

export default preview;
