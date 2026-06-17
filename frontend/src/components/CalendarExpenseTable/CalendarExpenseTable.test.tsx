/** @README Let me assume for this technical test that I only need to test what I changed. */

import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CalendarExpenseTable } from "./CalendarExpenseTable";
import userEvent from "@testing-library/user-event";

const MOCK_AVAILABLE_CATEGORIES = [{ name: "Food" }];
const MOCK_EXPENSES = [
  {
    amount: 0,
    category: "Food",
    created_at: new Date("2019-07-01").toISOString(),
    date: "2019-07-01",
    description: "Description",
    id: 0,
    updated_at: new Date("2019-07-01").toISOString(),
  },
];

const mockOnExpenseUpdated = vi.fn();

describe("Calendar Expense Table", () => {
  // ...

  describe("expense", () => {
    it("should render Expense Form on edit", async () => {
      const { getByText, queryByText } = render(
        <CalendarExpenseTable
          availableCategories={MOCK_AVAILABLE_CATEGORIES}
          expenses={MOCK_EXPENSES}
          onExpenseUpdated={mockOnExpenseUpdated}
        />,
      );

      let expenseForm = queryByText("Edit Expense");

      expect(expenseForm).toBeNull();

      const editButton = getByText("Edit");

      await userEvent.click(editButton);

      expenseForm = getByText("Edit Expense");

      expect(expenseForm).toBeVisible();
    });
  });

  // ...
});
