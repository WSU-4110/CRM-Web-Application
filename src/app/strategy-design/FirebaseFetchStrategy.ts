import { FetchStrategy } from "./FetchStrategy";
import { SubmitStrategy } from "./SubmitStrategy";


export class FirebaseFetchStrategy implements FetchStrategy {
  async fetchExpenses(userId: string): Promise<any[]> {
    const response = await fetch(`/api/expenses?userId=${userId}`);
    if (response.ok) {
      const data = await response.json();
      return data.expenses || [];
    }
    throw new Error("Failed to fetch expenses");
  }
}


export class FirebaseSubmitStrategy implements SubmitStrategy {
  async submitExpense(data: any, userId: string): Promise<void> {
    const response = await fetch(`/api/expenses`, {
      method: data.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, expense: { ...data } }),
    });
    if (!response.ok) {
      throw new Error("Failed to save expense");
    }
  }
}
