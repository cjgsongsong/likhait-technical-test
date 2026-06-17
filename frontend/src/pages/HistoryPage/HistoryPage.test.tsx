/** @README Let me assume for this technical test that I only need to test what I changed. */

import { render, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
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

  // ...
});
