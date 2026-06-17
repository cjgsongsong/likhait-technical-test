import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

console.error = vi.fn();
globalThis.fetch = vi.fn();
