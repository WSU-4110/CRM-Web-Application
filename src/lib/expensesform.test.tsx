import { ExpenseForm } from "./expensesform";

console.log('\n🧪 Starting Expenses Tests...\n');

describe("ExpenseForm", () => {
  let expenseForm: ExpenseForm;

  const mockUserId = "test-uid";
  const mockExpenseId = "test-expense-id";
  const mockCurrentExpense = { id: mockExpenseId, name: "Test Expense", amount: "100" };

  // Mock dependencies
  const mockFetchData = jest.fn();
  const mockSetIsDialogOpen = jest.fn();
  const mockSetCurrentExpense = jest.fn();
  const mockToast = jest.fn();

  // Mock the FormData constructor
  global.FormData = jest.fn().mockImplementation((form: any) => {
    return {
      entries: jest.fn().mockReturnValue([
        ["name", form.elements.name.value],
        ["amount", form.elements.amount.value],
        ["associatedEvent", form.elements.associatedEvent.value],
      ]),
    };
  });

  // Mock the form event
  const mockEvent = {
    preventDefault: jest.fn(),
    target: {
      elements: {
        name: { value: "Test Expense" },
        amount: { value: "100" },
        associatedEvent: { value: "test-event-id" },
      },
    },
  } as unknown as React.FormEvent<HTMLFormElement>; // Type-casting to FormEvent
  beforeEach(() => {
    expenseForm = new ExpenseForm();
    global.fetch = jest.fn();
    jest.clearAllMocks();
  });

  describe('📥 fetchExpense', () => {
    console.log('Testing expense fetching functionality...');

    it('✅ should fetch expense successfully', async () => {
      console.log('  → Testing successful expense fetch');

      const mockExpense = {
        id: mockExpenseId,
        name: 'Test Expense',
        amount: 1000
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockExpense
      });

      const result = await expenseForm.fetchExpenses(mockUserId);

      expect(global.fetch).toHaveBeenCalledWith(
        `/api/expenses?userId=${mockUserId}`
      );
      expect(result).toEqual(mockExpense);
      console.log('  ✓ Successfully fetched expense details');
    });

    it('❌ should handle fetch failure', async () => {
      console.log('  → Testing error handling for failed fetch');

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false
      });

      await expect(
        expenseForm.fetchExpenses(mockUserId)
      ).rejects.toThrow('Failed to fetch expense');
      console.log('  ✓ Successfully handled fetch error');
    });
  });

  describe("📝 handleSubmit", () => {
    it("✅ should successfully handle expense submission", async () => {
      console.log("  → Testing successful expense submission");

      (global.fetch as jest.Mock)
        // Mock the successful expense API response
        .mockResolvedValueOnce({ ok: true })
        // Mock the successful associate-event API response
        .mockResolvedValueOnce({ ok: true });

      await expenseForm.handleSubmit(mockEvent, 
        { uid: mockUserId }, 
        mockCurrentExpense, 
        mockFetchData, 
        mockSetIsDialogOpen, 
        mockSetCurrentExpense, 
        mockToast);

      // Verify preventDefault is called
      expect(mockEvent.preventDefault).toHaveBeenCalled();
      

      // Check that the other dependencies were called
      expect(mockFetchData).toHaveBeenCalled();
      expect(mockSetIsDialogOpen).toHaveBeenCalledWith(false);
      expect(mockSetCurrentExpense).toHaveBeenCalledWith(null);

      console.log("  ✓ Successfully tested expense submission");
    });

    it("❌ should handle failed expense save", async () => {
      console.log("  → Testing error handling for failed expense save");

      (global.fetch as jest.Mock)
        .mockResolvedValueOnce({ ok: false });

      await expenseForm.handleSubmit(mockEvent, 
        { uid: mockUserId }, 
        mockCurrentExpense, 
        mockFetchData, 
        mockSetIsDialogOpen, 
        mockSetCurrentExpense, 
        mockToast);

      // Check that toast was called with error message
      expect(mockToast).toHaveBeenCalledWith({
        title: "Error",
        description: "Failed to save expense",
        variant: "destructive",
      });

      console.log("  ✓ Successfully handled error during expense save");
    });

    it("❌ should handle failed event association", async () => {
      console.log("  → Testing error handling for failed event association");

      (global.fetch as jest.Mock)
        // Mock expense API response
        .mockResolvedValueOnce({ ok: true })
        // Mock failed event association API response
        .mockResolvedValueOnce({ ok: false });

      await expenseForm.handleSubmit(mockEvent, 
        { uid: mockUserId }, 
        mockCurrentExpense, 
        mockFetchData, 
        mockSetIsDialogOpen, 
        mockSetCurrentExpense, 
        mockToast);

      expect(mockToast).toHaveBeenCalledWith({
        title: "Error",
        description: "Failed to associate expense with event",
        variant: "destructive",
      });

      console.log("  ✓ Successfully handled error during event association");
    });
  });

  describe("🛠 handleEdit", () => {
    it("✅ should call setCurrentExpense and setIsDialogOpen with correct arguments", () => {
      const expense = { id: "expense-id", name: "Test Expense", amount: 100 };
  
      expenseForm.handleEdit(expense, mockSetCurrentExpense, mockSetIsDialogOpen);
  
      expect(mockSetCurrentExpense).toHaveBeenCalledWith(expense);
      expect(mockSetIsDialogOpen).toHaveBeenCalledWith(true);
    });
  
    it("❌ should handle errors during handleEdit", () => {
      jest.spyOn(console, "log").mockImplementation(() => {}); // Suppress console output
      const failingSetCurrentExpense = jest.fn(() => {
        throw new Error("Test error");
      });
  
      expenseForm.handleEdit(
        { id: "expense-id", name: "Test Expense", amount: 100 },
        failingSetCurrentExpense,
        mockSetIsDialogOpen
      );
  
      expect(console.log).toHaveBeenCalledWith("Error: ", expect.any(Error));
    });
  });
  

  describe("🔄 handleDialogChange", () => {
    it("✅ should open dialog and call setIsDialogOpen", () => {
      const open = true;
  
      expenseForm.handleDialogChange(open, mockSetIsDialogOpen, mockSetCurrentExpense);
  
      expect(mockSetIsDialogOpen).toHaveBeenCalledWith(open);
      expect(mockSetCurrentExpense).not.toHaveBeenCalled();
    });
  
    it("✅ should close dialog and reset current expense", () => {
      const open = false;
  
      expenseForm.handleDialogChange(open, mockSetIsDialogOpen, mockSetCurrentExpense);
  
      expect(mockSetCurrentExpense).toHaveBeenCalledWith(null);
    });
  
    it("❌ should handle errors during handleDialogChange", () => {
      jest.spyOn(console, "log").mockImplementation(() => {}); // Suppress console output
      const failingSetIsDialogOpen = jest.fn(() => {
        throw new Error("Test error");
      });
  
      expenseForm.handleDialogChange(
        true,
        failingSetIsDialogOpen,
        mockSetCurrentExpense
      );
  
      expect(console.log).toHaveBeenCalledWith("Error: ", expect.any(Error));
    });
  });
  


  afterAll(() => {
    console.log('\n✨ All ExpenseService tests completed!\n');
  });
});