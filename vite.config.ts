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
    alias: {
      "create-global-state": path.resolve(__dirname, "src"),
    },
  },
});
