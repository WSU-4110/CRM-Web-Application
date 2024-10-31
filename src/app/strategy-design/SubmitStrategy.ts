export interface SubmitStrategy {
    submitExpense(data: any, userId: string): Promise<void>;
  }