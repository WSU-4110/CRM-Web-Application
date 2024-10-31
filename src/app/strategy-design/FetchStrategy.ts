export interface FetchStrategy {
    fetchExpenses(userId: string): Promise<any[]>;
  }