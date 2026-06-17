import { fireEvent, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CategoryForm } from "../CategoryForm";

const MOCK_AVAILABLE_CATEGORIES = [{ name: "Food" }];

const mockOnCancel = vi.fn();
const mockOnSubmit = vi.fn();

describe("Category Form", () => {
  describe("name field", () => {
    it("should render its label and placeholder text", () => {
      const { getByPlaceholderText, getByText } = render(
        <CategoryForm
          availableCategories={MOCK_AVAILABLE_CATEGORIES}
          onSubmit={mockOnSubmit}
        />,
      );

      const label = getByText("Name");
      const placeholderText = getByPlaceholderText("Enter name");

      expect(label).toBeVisible();
      expect(placeholderText).toBeVisible();
    });

    it("should render its field's value on change", async () => {
      const { getByPlaceholderText } = render(
        <CategoryForm
          availableCategories={MOCK_AVAILABLE_CATEGORIES}
          onSubmit={mockOnSubmit}
        />,
      );

      const field = getByPlaceholderText("Enter name") as HTMLInputElement;

      await userEvent.type(field, "Category");

      expect(field.value).toBe("Category");
    });
  });

  describe("submit button", () => {
    it("should render enabled button", () => {
      const { getByText } = render(
        <CategoryForm
          availableCategories={MOCK_AVAILABLE_CATEGORIES}
          onSubmit={mockOnSubmit}
        />,
      );

      const submitButton = getByText("Add Category");

      expect(submitButton).toBeEnabled();
      expect(submitButton).toBeVisible();
    });

    it("should disable button on ongoing submit", async () => {
      const { getByPlaceholderText, getByText } = render(
        <CategoryForm
          availableCategories={MOCK_AVAILABLE_CATEGORIES}
          onSubmit={mockOnSubmit}
        />,
      );

      const field = getByPlaceholderText("Enter name") as HTMLInputElement;

      await userEvent.type(field, "Category");

      const submitButton = getByText("Add Category");

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(submitButton).toHaveTextContent("Submitting...");
        expect(submitButton).toBeDisabled();
      });
    });

    it("should submit on click", async () => {
      const { getByPlaceholderText, getByText } = render(
        <CategoryForm
          availableCategories={MOCK_AVAILABLE_CATEGORIES}
          onSubmit={mockOnSubmit}
        />,
      );

      const field = getByPlaceholderText("Enter name") as HTMLInputElement;

      await userEvent.type(field, "Category");

      const submitButton = getByText("Add Category");

      await userEvent.click(submitButton);

      expect(mockOnSubmit).toHaveBeenCalledOnce();
    });
  });

  describe("cancel button", () => {
    it("should not render button", () => {
      const { queryByText } = render(
        <CategoryForm
          availableCategories={MOCK_AVAILABLE_CATEGORIES}
          onSubmit={mockOnSubmit}
        />,
      );

      const cancelButton = queryByText("Cancel");

      expect(cancelButton).toBeNull();
    });

    it("should render button given `onCancel`", () => {
      const { getByText } = render(
        <CategoryForm
          availableCategories={MOCK_AVAILABLE_CATEGORIES}
          onCancel={mockOnCancel}
          onSubmit={mockOnSubmit}
        />,
      );

      const cancelButton = getByText("Cancel");

      expect(cancelButton).toBeEnabled();
      expect(cancelButton).toBeVisible();
    });

    it("should cancel on click", async () => {
      const { getByText } = render(
        <CategoryForm
          availableCategories={MOCK_AVAILABLE_CATEGORIES}
          onCancel={mockOnCancel}
          onSubmit={mockOnSubmit}
        />,
      );

      const cancelButton = getByText("Cancel");

      await userEvent.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalledOnce();
    });
  });
});
