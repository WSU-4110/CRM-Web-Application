export class ProfitsService {
  
  async fetchItems(userId: string): Promise<any> {
    if (!userId) throw new Error("User ID is required");

    const response = await fetch(`/api/profit-per-item?userId=${userId}`);
    if (!response.ok) throw new Error("Failed to fetch items");

    const data = await response.json();
    return data.items || [];
  }

  validateFormData(formData: any): boolean {
    if (!formData.itemName || !formData.revenue || !formData.cost) {
      throw new Error("All fields are required");
    }
    return true;
  }

  calculateProfit(formData: any): { profit: string; profitPerItem: string } {
    const revenue = parseFloat(formData.revenue) || 0;
    const cost = parseFloat(formData.cost) || 0;
    const unitsSold = parseFloat(formData.unitsSold) || 0;

    const profit = (revenue - cost).toFixed(2);
    const profitPerItem = unitsSold > 0 ? (revenue - cost) / unitsSold : 0;

    return {
      profit,
      profitPerItem: profitPerItem.toFixed(2),
    };
  }

  async handleSubmit(userId: string, formData: any, currentItem: any): Promise<any> {
    if (!userId) throw new Error("User ID is required");
    this.validateFormData(formData);

    const { profit, profitPerItem } = this.calculateProfit(formData);
    const updatedItem = {
      id: currentItem?.id || Date.now().toString(),
      type: formData.type,
      itemName: formData.itemName,
      unitsSold: parseFloat(formData.unitsSold),
      revenue: parseFloat(formData.revenue),
      cost: parseFloat(formData.cost),
      profit,
      profitPerItem,
    };

    const method = currentItem ? "PUT" : "POST";
    const response = await fetch("/api/profit-per-item", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, item: updatedItem }),
    });

    if (!response.ok) throw new Error("Failed to save item");

    return updatedItem;
  }

  async handleDelete(userId: string, itemId: string): Promise<boolean> {
    if (!userId || !itemId) throw new Error("User ID and Item ID are required");

    const response = await fetch(`/api/profit-per-item`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, itemId }),
    });

    if (!response.ok) throw new Error("Failed to delete item");

    return true;
  }

  sortItemsByProfit(items: any[]): any[] {
    return items.sort((a, b) => parseFloat(b.profitPerItem) - parseFloat(a.profitPerItem));
  }
}
