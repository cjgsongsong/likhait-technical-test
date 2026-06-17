import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useCategoryForm } from "./useCategoryForm";

const MOCK_INITIAL_DATA = { name: "Category" };

const mockOnSubmit = vi.fn();
const mockPreventDefault = vi.fn();

const MOCK_FORM_EVENT = {
  preventDefault: mockPreventDefault,
} as unknown as React.FormEvent;

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

  describe("`errors`", () => {
    it("should initialize as empty object", () => {
      const { result } = renderHook(() =>
        useCategoryForm({
          availableCategories: [],
          initialData: {},
          onSubmit: mockOnSubmit,
        }),
      );

      expect(result.current.errors).toEqual({});
    });
  });

  describe("`isSubmitting`", () => {
    it("should initialize as false", () => {
      const { result } = renderHook(() =>
        useCategoryForm({
          availableCategories: [],
          initialData: {},
          onSubmit: mockOnSubmit,
        }),
      );

      expect(result.current.isSubmitting).toBe(false);
    });
  });

  describe("`handleChange`", () => {
    it("should change name on trigger", () => {
      const { result } = renderHook(() =>
        useCategoryForm({
          availableCategories: [],
          initialData: {},
          onSubmit: mockOnSubmit,
        }),
      );

      act(() => result.current.handleChange("name", MOCK_INITIAL_DATA.name));

      expect(result.current.formData).toEqual(MOCK_INITIAL_DATA);
    });

    it("should clear error on trigger", async () => {
      const { result } = renderHook(() =>
        useCategoryForm({
          availableCategories: [],
          initialData: {},
          onSubmit: mockOnSubmit,
        }),
      );

      await waitFor(() => result.current.handleSubmit(MOCK_FORM_EVENT));

      expect(result.current.errors).not.toEqual({});

      act(() => result.current.handleChange("name", ""));

      expect(result.current.errors).toEqual({});
    });
  });

  describe("`handleSubmit`", () => {
    it("should prevent default event behavior on trigger", async () => {
      const { result } = renderHook(() =>
        useCategoryForm({
          availableCategories: [],
          initialData: {},
          onSubmit: mockOnSubmit,
        }),
      );

      await waitFor(() => result.current.handleSubmit(MOCK_FORM_EVENT));

      expect(mockPreventDefault).toHaveBeenCalledOnce();
    });
  });

  describe("`resetForm`", () => {
    it("should reset form data on trigger", () => {
      const { result } = renderHook(() =>
        useCategoryForm({
          availableCategories: [],
          initialData: {},
          onSubmit: mockOnSubmit,
        }),
      );

      act(() => result.current.handleChange("name", MOCK_INITIAL_DATA.name));

      expect(result.current.formData).toEqual(MOCK_INITIAL_DATA);

      act(() => result.current.resetForm());

      expect(result.current.formData).toEqual({ name: "" });
    });

    it("should reset errors on trigger", async () => {
      const { result } = renderHook(() =>
        useCategoryForm({
          availableCategories: [],
          initialData: {},
          onSubmit: mockOnSubmit,
        }),
      );

      await waitFor(() => result.current.handleSubmit(MOCK_FORM_EVENT));

      expect(result.current.errors).not.toEqual({});

      act(() => result.current.resetForm());

      expect(result.current.errors).toEqual({});
    });
  });
});
