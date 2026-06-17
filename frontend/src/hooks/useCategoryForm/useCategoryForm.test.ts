import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useCategoryForm } from "./useCategoryForm";

const MOCK_INITIAL_DATA = { name: "Category" };

const mockOnSubmit = vi.fn();
const mockPreventDefault = vi.fn();

let mockResolve: (value: unknown) => void = () => {};
const mockStalledOnSubmit = mockOnSubmit.mockImplementation(() => {
  return new Promise((resolve) => {
    mockResolve = resolve;
  });
});

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

    describe("`validateForm`", () => {
      it("should indicate error on submit of empty name", async () => {
        const { result } = renderHook(() =>
          useCategoryForm({
            availableCategories: [],
            initialData: {},
            onSubmit: mockOnSubmit,
          }),
        );

        await waitFor(() => result.current.handleSubmit(MOCK_FORM_EVENT));

        expect(result.current.errors).toEqual({ name: "Name is required" });
      });

      it("should indicate error on submit of name with invalid format", async () => {
        const { result } = renderHook(() =>
          useCategoryForm({
            availableCategories: [],
            initialData: { name: " Category" },
            onSubmit: mockOnSubmit,
          }),
        );

        await waitFor(() => result.current.handleSubmit(MOCK_FORM_EVENT));

        expect(result.current.errors).toEqual({
          name: "Name must start with an uppercase letter followed by zero to many alphanumeric characters and spaces",
        });
      });

      it("should indicate error on submit of existing name", async () => {
        const { result } = renderHook(() =>
          useCategoryForm({
            availableCategories: [MOCK_INITIAL_DATA],
            initialData: MOCK_INITIAL_DATA,
            onSubmit: mockOnSubmit,
          }),
        );

        await waitFor(() => result.current.handleSubmit(MOCK_FORM_EVENT));

        expect(result.current.errors).toEqual({
          name: "Category already exists",
        });
      });

      it("should not indicate error on submit of valid name", async () => {
        const { result } = renderHook(() =>
          useCategoryForm({
            availableCategories: [],
            initialData: MOCK_INITIAL_DATA,
            onSubmit: mockOnSubmit,
          }),
        );

        await waitFor(() => result.current.handleSubmit(MOCK_FORM_EVENT));

        expect(result.current.errors).toEqual({});
      });
    });

    describe("`isSubmitting`", () => {
      it("should indicate ongoing submit on validate", () => {
        const { result } = renderHook(() =>
          useCategoryForm({
            availableCategories: [],
            initialData: MOCK_INITIAL_DATA,
            onSubmit: mockStalledOnSubmit,
          }),
        );

        expect(result.current.isSubmitting).toBe(false);

        /**
         * @README
         * Do not refactor this as a one-liner
         * as we want the callback to return `void` and not `handleSubmit`'s type.
         */
        act(() => {
          result.current.handleSubmit(MOCK_FORM_EVENT);
        });

        expect(result.current.isSubmitting).toBe(true);
      });

      it("should indicate finished submit on resolve", async () => {
        const { result } = renderHook(() =>
          useCategoryForm({
            availableCategories: [],
            initialData: MOCK_INITIAL_DATA,
            onSubmit: mockStalledOnSubmit,
          }),
        );

        /**
         * @README
         * Do not refactor this as a one-liner
         * as we want the callback to return `void` and not `handleSubmit`'s type.
         */
        act(() => {
          result.current.handleSubmit(MOCK_FORM_EVENT);
        });

        expect(result.current.isSubmitting).toBe(true);

        await waitFor(() => mockResolve(null));

        expect(result.current.isSubmitting).toBe(false);
      });
    });

    it("should submit on validate", async () => {
      const { result } = renderHook(() =>
        useCategoryForm({
          availableCategories: [],
          initialData: MOCK_INITIAL_DATA,
          onSubmit: mockOnSubmit,
        }),
      );

      await waitFor(() => result.current.handleSubmit(MOCK_FORM_EVENT));

      expect(mockOnSubmit).toHaveBeenCalledWith(MOCK_INITIAL_DATA);
    });

    it("should reset form data and errors on submit", async () => {
      const { result } = renderHook(() =>
        useCategoryForm({
          availableCategories: [],
          initialData: MOCK_INITIAL_DATA,
          onSubmit: mockOnSubmit,
        }),
      );

      await waitFor(() => result.current.handleSubmit(MOCK_FORM_EVENT));

      expect(result.current.formData).toEqual({ name: "" });
      expect(result.current.errors).toEqual({});
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
