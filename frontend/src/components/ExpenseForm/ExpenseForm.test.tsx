/** @README Let me assume for this technical test that I only need to test what I changed. */

import { render, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ExpenseForm } from "./ExpenseForm";

const MOCK_AVAILABLE_CATEGORIES = [{ name: "Food" }];

const mockOnSubmit = vi.fn();

describe("Expense Form", () => {
  // ...

  describe("category field", () => {
    it("should display categories given available categories", async () => {
      const { getByText } = render(
        <ExpenseForm
          availableCategories={MOCK_AVAILABLE_CATEGORIES}
          onSubmit={mockOnSubmit}
        />,
      );

      const selectBox = getByText("Category").nextElementSibling as HTMLElement;
      const selectOption = within(selectBox).getByText(
        MOCK_AVAILABLE_CATEGORIES[0].name,
      );

      expect(selectOption).toBeInTheDocument();
    });
  });

  // ...
});
