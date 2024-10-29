"use client";

import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MoreVertical, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const Expenses = () => {
  
  const [expenses, setExpenses] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetchExpenses();
    } else {
      router.push('/login');
    }
  }, [user, router]);


  const fetchExpenses = async () => {
    const response = await fetch(`/api/expenses?userId=${user.uid}`);
    if (response.ok) {
      const data = await response.json();
      setExpenses(data.expenses || []);
    } else {
      toast({
        title: "Error",
        description: "Failed to fetch expenses",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const expenseData = Object.fromEntries(formData.entries());

    console.log(expenseData);
    console.log(currentExpense ? 'PUT' : 'POST');

    const response = await fetch(`/api/expenses`, {
      method: currentExpense ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        userId: user.uid, 
        expense: { ...expenseData, id: currentExpense?.id } 
      }),
    });

    if (response.ok) {
      fetchExpenses();
      setIsDialogOpen(false);
      setCurrentExpense(null);
      toast({
        title: "Success",
        description: `Expense ${currentExpense ? 'updated' : 'added'} successfully`,
      });
    } else {
      toast({
        title: "Error",
        description: `Failed to ${currentExpense ? 'update' : 'add'} expense`,
        variant: "destructive",
      });
    }
  };


  const handleEdit = (expense) => {
    setCurrentExpense(expense);
    setIsDialogOpen(true);
  };

  const handleDialogChange = (open) => {
    setIsDialogOpen(open);
    if (!open) {
      setCurrentExpense(null);
    }
  };

  return (
    <div className="min-h-screen w-full p-6">
      <div className="flex justify-between items-center my-6">
        <h1 className="text-4xl font-bold">Expenses</h1>
        <div className="flex gap-2">
          <Button 
            onClick={() => {
              setIsDialogOpen(true);            
            }} 
            className="bg-black hover:bg-emerald-700 text-white flex items-center gap-2">
            <Plus className="h-4 w-4" />
              New expense
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className='text-xl'>
            <TableHead>Details</TableHead>
            <TableHead>Merchant</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>

          {/* output entries of expenses from the database to the frontend, if there are none then it will print a default message*/}
        
          {expenses.length === 0 ? ( <p className="text-gray-500">No expenses found.</p> ) : 
            (expenses.map((expense) => (
                <TableRow key={expense.id} className="flex-1 items-center px-6 py-3 cursor-auto" onClick={() => handleEdit(expense)}>

                  <TableCell className="text-l">{expense.type}</TableCell>
                  <TableCell className="text-l">{expense.merchant}</TableCell>
                  <TableCell className="text-l">${expense.amount}</TableCell>
                  <TableCell className="text-l">{expense.date}</TableCell>

                  <TableCell>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium
                      ${expense.status === 'Approved' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                      {expense.status}
                    </span>
                  </TableCell>

                  <TableCell>
                      <MoreVertical className="text-gray-400 hover:text-gray-300" />
                  </TableCell>

                </TableRow>))
              )}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentExpense ? 'Edit Expense' : 'Add New Expense'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="type">Type</Label>
                <Input id="type" name="type" defaultValue={currentExpense?.type} required />
              </div>
              <div>
                <Label htmlFor="merchant">Merchant</Label>
                <Input id="merchant" name="merchant" defaultValue={currentExpense?.merchant} required />
              </div>
              <div>
                <Label htmlFor="amount">Amount($)</Label>
                <Input id="amount" name="amount" type="number" step="0.01" defaultValue={currentExpense?.amount} required />
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input id="date" name="date" type="date" defaultValue={currentExpense?.date} required />
              </div>
              <div>
                <Label htmlFor="status" >Status</Label>
                <select id="status" name="status" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" defaultValue={currentExpense?.status} required>
                  <option value="Approved">Approved</option>
                  <option value="Not Approved">Not Approved</option>
                </select>
              </div>
              <Button type="submit">{currentExpense ? 'Update' : 'Add'} Expense</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Expenses;