import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useCategoryForm } from "./useCategoryForm";

const MOCK_INITIAL_DATA = { name: "Category" };

const mockOnSubmit = vi.fn();

describe("`useCategoryForm`", () => {
  describe("`formData`", () => {
    it("should initialize with initial data", () => {
      const { result } = renderHook(() =>
        useCategoryForm({
          availableCategories: [],
          initialData: MOCK_INITIAL_DATA,
          onSubmit: mockOnSubmit,
        }),
      );

      expect(result.current.formData).toEqual(MOCK_INITIAL_DATA);
    });

    it("should initialize with empty name given no initial data", () => {
      const { result } = renderHook(() =>
        useCategoryForm({
          availableCategories: [],
          initialData: {},
          onSubmit: mockOnSubmit,
        }),
      );

      expect(result.current.formData).toEqual({ name: "" });
    });
  });
});
