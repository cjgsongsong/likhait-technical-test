import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    clearMocks: true,
    environment: "jsdom",
    globals: true,
    mockReset: true,
    restoreMocks: true,
    setupFiles: ["./vitest.setup.ts"],
  },
});
