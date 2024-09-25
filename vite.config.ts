import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  root: "examples",
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: /^create-global-state$/,
        replacement: path.resolve(__dirname, "src"),
      },
      {
        find: /^create-global-state\/lib\/(.+)$/,
        replacement: path.resolve(__dirname, "src/$1"),
      },
    ],
  },
});
