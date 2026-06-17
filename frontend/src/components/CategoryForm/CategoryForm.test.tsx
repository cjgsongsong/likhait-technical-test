import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CategoryForm } from "../CategoryForm";

const MOCK_AVAILABLE_CATEGORIES = [{ name: "Food" }];

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
});
