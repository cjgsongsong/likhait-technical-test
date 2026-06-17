/** @README Let me assume for this technical test that I only need to test what I changed. */

import { describe, expect, it, vi } from "vitest";
import { createCategory } from "./api";

const MOCK_DATA = { name: "Category" };

const MOCK_CREATED_CATEGORY = {
  created_at: new Date("2019-07-01").toISOString(),
  id: 0,
  name: MOCK_DATA.name,
  updated_at: new Date("2019-07-01").toISOString(),
};
const MOCK_REQUEST = {
  body: JSON.stringify({ category: MOCK_DATA }),
  headers: { "Content-Type": "application/json" },
  method: "POST",
};

const mockErrorResponse = () => Response.json({}, { status: 500 });
const mockSuccessResponse = () =>
  Response.json(MOCK_CREATED_CATEGORY, { status: 201 });
const spyFetch = vi.spyOn(globalThis, "fetch");

describe("API", () => {
  // ...

  describe("`createCategory`", () => {
    it("should send request to endpoint", async () => {
      spyFetch.mockResolvedValue(mockSuccessResponse());

      await createCategory(MOCK_DATA);

      expect(spyFetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/categories"),
        MOCK_REQUEST,
      );
    });

    it("should return created category on success", async () => {
      spyFetch.mockResolvedValue(mockSuccessResponse());

      const createdCategory = await createCategory(MOCK_DATA);

      expect(createdCategory).toEqual(MOCK_CREATED_CATEGORY);
    });

    it("should throw error on fail", async () => {
      spyFetch.mockResolvedValue(mockErrorResponse());

      await expect(createCategory(MOCK_DATA)).rejects.toThrow(
        "Failed to create category",
      );
    });
  });

  // ...
});
