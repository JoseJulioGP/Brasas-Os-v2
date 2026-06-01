import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Redirige @heroui/react al shim que incluye HeroUIProvider
      // Esto previene el crash cuando el linter inserta el import automaticamente
      "@heroui/react": path.resolve(__dirname, "src/lib/heroui-shim.js"),
    },
  },
});
