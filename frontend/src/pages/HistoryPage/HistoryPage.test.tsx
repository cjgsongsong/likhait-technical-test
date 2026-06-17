/** @README Let me assume for this technical test that I only need to test what I changed. */

import { render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import HistoryPage from "./HistoryPage";

const MOCK_CATEGORIES = [
  {
    created_at: new Date("2019-07-01").toISOString(),
    id: 0,
    name: "Food",
    updated_at: new Date("2019-07-01").toISOString(),
  },
];
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

const mockResponse = ({
  input,
  isSuccess,
}: {
  input: RequestInfo | URL;
  isSuccess: boolean;
}) => {
  const url = input instanceof Request ? input?.url : input?.toString();

  return Promise.resolve(
    Response.json(
      url?.includes("categories") ? MOCK_CATEGORIES : MOCK_EXPENSES,
      { status: isSuccess ? 200 : 500 },
    ),
  );
};
const mockErrorResponse = (input: RequestInfo | URL) =>
  mockResponse({ input, isSuccess: false });
const mockSuccessResponse = (input: RequestInfo | URL) =>
  mockResponse({ input, isSuccess: true });
const spyConsoleError = vi.spyOn(console, "error");
const spyFetch = vi.spyOn(globalThis, "fetch");

describe("History Page", () => {
  // ...

  describe("add buttons", () => {
    beforeEach(() => spyFetch.mockImplementation(mockSuccessResponse));

    it("should render enabled category addition button", () => {
      const { getByText } = render(<HistoryPage />);

      const addCategoryButton = getByText("Add Category");

      expect(addCategoryButton).toBeEnabled();
      expect(addCategoryButton).toBeVisible();
    });

    it("should render enabled expense addition button", () => {
      const { getByText } = render(<HistoryPage />);

      const addExpenseButton = getByText("Add Expense");

      expect(addExpenseButton).toBeEnabled();
      expect(addExpenseButton).toBeVisible();
    });
  });

  describe("category additon", () => {
    describe("on success", () => {
      beforeEach(() => spyFetch.mockImplementation(mockSuccessResponse));

      it("should close category dialog on submit", async () => {
        const { getAllByText, getByText, getByPlaceholderText, queryByText } =
          render(<HistoryPage />);

        const addCategoryButton = getByText("Add Category");

        await userEvent.click(addCategoryButton);

        const nameField = getByPlaceholderText(
          "Enter name",
        ) as HTMLInputElement;

        await userEvent.type(nameField, "New Category");

        const submitButton = getAllByText("Add Category")[1];

        await userEvent.click(submitButton);

        const categoryDialog = queryByText("Add New Category");

        expect(categoryDialog).toBeNull();
      });

      it("should send requests on submit", async () => {
        const { getAllByText, getByText, getByPlaceholderText } = render(
          <HistoryPage />,
        );

        const addCategoryButton = getByText("Add Category");

        await userEvent.click(addCategoryButton);

        const nameField = getByPlaceholderText(
          "Enter name",
        ) as HTMLInputElement;

        await userEvent.type(nameField, "New Category");

        const submitButton = getAllByText("Add Category")[1];

        await userEvent.click(submitButton);

        expect(spyFetch.mock.calls).toContainEqual(
          expect.arrayContaining([
            expect.stringContaining("/api/categories"),
            expect.objectContaining({
              method: "POST",
            }),
          ]),
        );
        expect(spyFetch.mock.lastCall).toEqual([
          expect.stringContaining("/api/categories"),
        ]);
      });
    });
  });

  describe("category fetching", () => {
    it("should fetch available categories on render", async () => {
      spyFetch.mockImplementation(mockSuccessResponse);

      render(<HistoryPage />);

      await waitFor(() => {
        expect(spyFetch).toHaveBeenNthCalledWith(
          2,
          expect.stringContaining("/api/categories"),
        );
      });
    });

    it("should throw error on fail", async () => {
      spyFetch.mockImplementation(mockErrorResponse);

      render(<HistoryPage />);

      await waitFor(() => {
        expect(spyConsoleError.mock.calls).toContainEqual([
          "Error fetching categories:",
          expect.any(Error),
        ]);
      });
    });
  });

  describe("dialog", () => {
    beforeEach(() => spyFetch.mockImplementation(mockSuccessResponse));

    describe("for category addition", () => {
      it("should open category dialog on click", async () => {
        const { getByText, queryByText } = render(<HistoryPage />);

        let categoryDialog = queryByText("Add New Category");

        expect(categoryDialog).toBeNull();

        const addCategoryButton = getByText("Add Category");

        await userEvent.click(addCategoryButton);

        categoryDialog = getByText("Add New Category");

        expect(categoryDialog).toBeVisible();
      });

      it("should close category dialog on cancel", async () => {
        const { getByText, queryByText } = render(<HistoryPage />);

        const addCategoryButton = getByText("Add Category");

        await userEvent.click(addCategoryButton);

        let categoryDialog: HTMLElement | null = getByText("Add New Category");

        expect(categoryDialog).toBeVisible();

        const cancelButton = getByText("Cancel");

        await userEvent.click(cancelButton);

        categoryDialog = queryByText("Add New Category");

        expect(categoryDialog).toBeNull();
      });

      it("should close category dialog on close", async () => {
        const { getByText, queryByText } = render(<HistoryPage />);

        const addCategoryButton = getByText("Add Category");

        await userEvent.click(addCategoryButton);

        let categoryDialog: HTMLElement | null = getByText("Add New Category");

        expect(categoryDialog).toBeVisible();

        const closeButton = getByText("\u00d7");

        await userEvent.click(closeButton);

        categoryDialog = queryByText("Add New Category");

        expect(categoryDialog).toBeNull();
      });
    });

    describe("for expense addition", () => {
      it("should open expense dialog on click", async () => {
        const { getByText, queryByText } = render(<HistoryPage />);

        let expenseDialog = queryByText("Add New Expense");

        expect(expenseDialog).toBeNull();

        const addCategoryButton = getByText("Add Expense");

        await userEvent.click(addCategoryButton);

        expenseDialog = getByText("Add New Expense");

        expect(expenseDialog).toBeVisible();
      });

      it("should close expense dialog on cancel", async () => {
        const { getByText, queryByText } = render(<HistoryPage />);

        const addExpenseButton = getByText("Add Expense");

        await userEvent.click(addExpenseButton);

        let expenseDialog: HTMLElement | null = getByText("Add New Expense");

        expect(expenseDialog).toBeVisible();

        const cancelButton = getByText("Cancel");

        await userEvent.click(cancelButton);

        expenseDialog = queryByText("Add New Expense");

        expect(expenseDialog).toBeNull();
      });

      it("should close expense dialog on close", async () => {
        const { getByText, queryByText } = render(<HistoryPage />);

        const addExpenseButton = getByText("Add Expense");

        await userEvent.click(addExpenseButton);

        let expenseDialog: HTMLElement | null = getByText("Add New Expense");

        expect(expenseDialog).toBeVisible();

        const closeButton = getByText("\u00d7");

        await userEvent.click(closeButton);

        expenseDialog = queryByText("Add New Expense");

        expect(expenseDialog).toBeNull();
      });
    });
  });

  describe("loading", () => {
    it("should not render components on ongoing category fetch", () => {
      spyFetch.mockImplementationOnce(mockSuccessResponse);

      const { getByText } = render(<HistoryPage />);

      const loading = getByText("Loading...");

      expect(loading).toBeVisible();
    });
  });

  // ...
});
