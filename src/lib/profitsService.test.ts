import { ProfitsService } from "./profitsService";

console.log("Beginning testing of ProfitsService...");

describe("ProfitsService", () => {
  let profitsService: ProfitsService;
  const userId = "test-user";
  const mockItems = [
    { id: "1", itemName: "Item A", profitPerItem: "5.00" },
    { id: "2", itemName: "Item B", profitPerItem: "3.00" },
  ];
  const formData = {
    itemName: "Test Item",
    type: "Item",
    unitsSold: "10",
    revenue: "100",
    cost: "50",
  };

  beforeEach(() => {
    profitsService = new ProfitsService();
    global.fetch = jest.fn();
  });

  describe("fetchItems", () => {
    console.log("Testing item fetching functionality...");

    it("should fetch items successfully", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ items: mockItems }),
      });

      const result = await profitsService.fetchItems(userId);
      expect(global.fetch).toHaveBeenCalledWith(`/api/profit-per-item?userId=${userId}`);
      expect(result).toEqual(mockItems);
      console.log("Successfully fetched items");
    });

    it("should handle fetch failure", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false });

      await expect(profitsService.fetchItems(userId)).rejects.toThrow("Failed to fetch items");
      console.log("Successfully handled fetch error");
    });
  });

  describe("validateFormData", () => {
    console.log("Testing form data validation...");

    it("should validate correct form data", () => {
      expect(profitsService.validateFormData(formData)).toBe(true);
      console.log("Successfully validated form data");
    });

    it("should throw an error for invalid form data", () => {
      expect(() => profitsService.validateFormData({})).toThrow("All fields are required");
      console.log("Successfully handled invalid form data");
    });
  });

  describe("calculateProfit", () => {
    console.log("Testing profit calculation...");

    it("should calculate profit and profit per item", () => {
      const result = profitsService.calculateProfit(formData);
      expect(result).toEqual({ profit: "50.00", profitPerItem: "5.00" });
      console.log("Successfully calculated profit");
    });
  });

  describe("handleSubmit", () => {
    console.log("Testing form submission...");

    it("should submit a new item successfully", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

      const result = await profitsService.handleSubmit(userId, formData, null);
      expect(result).toEqual(
        expect.objectContaining({ itemName: "Test Item", profit: "50.00", profitPerItem: "5.00" })
      );
      console.log("Successfully submitted item");
    });

    it("should handle save failure", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false });

      await expect(profitsService.handleSubmit(userId, formData, null)).rejects.toThrow("Failed to save item");
      console.log("Successfully handled save failure");
    });
  });

  describe("handleDelete", () => {
    console.log("Testing item deletion...");

    it("should delete an item successfully", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

      const result = await profitsService.handleDelete(userId, "1");
      expect(result).toBe(true);
      console.log("Successfully deleted item");
    });

    it("should handle delete failure", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false });

      await expect(profitsService.handleDelete(userId, "1")).rejects.toThrow("Failed to delete item");
      console.log("Successfully handled delete failure");
    });
  });

  describe("sortItemsByProfit", () => {
    console.log("Testing item sorting...");

    it("should sort items by profit per item", () => {
      const result = profitsService.sortItemsByProfit(mockItems);
      expect(result[0].profitPerItem).toBe("5.00");
      expect(result[1].profitPerItem).toBe("3.00");
      console.log("Successfully sorted items by highest to lowest profit");
    });
  });

  afterAll(() => {
    console.log("All tests completed.");
  });
});
