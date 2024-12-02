export class ExpenseForm {
  async fetchInitalData(userId: string) {
    const [expenseData, eventData] = await Promise.all([
      this.fetchExpenses(userId),
      this.fetchEvents(userId),
    ]);
    return [expenseData, eventData];
  }

  async fetchExpenses(userId: string) {
    const response = await fetch(`/api/expenses?userId=${userId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch expenses");
    }
    return response.json();
  }

  async fetchEvents(userId: string) {
    const response = await fetch(`/api/events?userId=${userId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch events");
    }
    return response.json();
  }

  async handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
    user: { uid: string },
    currentExpense: any,
    fetchData: () => void,
    setIsDialogOpen: (value: boolean) => void,
    setCurrentExpense: (expense: any) => void,
    toast: (options: { title: string; description: string; variant?: "default" | "destructive" }) => void
  ) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const expenseData = Object.fromEntries(formData.entries());

    try {
      // First, create/update the expense in the expenses collection
      const expenseResponse = await fetch(`/api/expenses`, {
        method: currentExpense ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.uid,
          expense: {
            ...expenseData,
            id: currentExpense?.id || Date.now().toString(),
          },
        }),
      });

      if (!expenseResponse.ok) {
        throw new Error("Failed to save expense");
      }

      // If there's an associated event, update it as well
      if (expenseData.associatedEvent) {
        const eventResponse = await fetch(`/api/events/associate-expense`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.uid,
            eventId: expenseData.associatedEvent,
            expense: expenseData,
          }),
        });

        if (!eventResponse.ok) {
          throw new Error("Failed to associate expense with event");
        }
      }

      // Refresh data and close dialog
      fetchData();
      setIsDialogOpen(false);
      setCurrentExpense(null);
      toast({
        title: "Success",
        description: `Expense ${currentExpense ? "updated" : "added"} successfully`,
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  }

  handleEdit(expense: any, setCurrentExpense: (expense: any) => void, setIsDialogOpen: (value: boolean) => void) {
    try{
      if(expense){
        setCurrentExpense(expense);
        setIsDialogOpen(true);
      }
    }
    catch(err){
      console.log("Error: ", err);
    }
  }

  handleDialogChange(open: boolean, setIsDialogOpen: (value: boolean) => void, setCurrentExpense: (expense: any) => void) {
    try{
        if(open){
        setIsDialogOpen(open);
        }

        if (!open) {
          setCurrentExpense(null);
        }
    }catch(err){
      console.log("Error: ", err);
    }
  }
}
