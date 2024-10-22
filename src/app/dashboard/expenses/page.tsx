"use client";

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MoreVertical, Plus, Filter, Layout } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const Expenses = () => {
  // const expenses = [
  //   {
  //     id: 1,
  //     date: '09/11/2022',
  //     type: 'Food Catering',
  //     icon: '🍽️',
  //     merchant: 'McFood',
  //     amount: '€250.00',
  //     status: 'Not Approved'
  //   },
  //   {
  //     id: 2,
  //     date: '10/11/2022',
  //     type: 'Office Supplies',
  //     icon: '✂️',
  //     merchant: 'Officio',
  //     amount: '€150.00',
  //     status: 'Not Approved'
  //   },
  //   {
  //     id: 3,
  //     date: '11/11/2022',
  //     type: 'Business Lunch',
  //     icon: '🍽️',
  //     merchant: 'Restaurant',
  //     amount: '€75.50',
  //     status: 'Not Approved'
  //   },
  //   {
  //     id: 4,
  //     date: '11/11/2022',
  //     type: 'Travel Expenses',
  //     icon: '🔒',
  //     merchant: 'Airlines',
  //     amount: '€450.25',
  //     status: 'Approved'
  //   },
  //   {
  //     id: 5,
  //     date: '12/11/2022',
  //     type: 'Client Dinner',
  //     icon: '🍽️',
  //     merchant: 'Bistro',
  //     amount: '€120.00',
  //     status: 'Not Approved'
  //   },
  //   {
  //     id: 6,
  //     date: '16/11/2022',
  //     type: 'Accommodation',
  //     icon: '🏨',
  //     merchant: 'Hotel ***',
  //     amount: '€275.75',
  //     status: 'Approved'
  //   },
  //   {
  //     id: 7,
  //     date: '20/11/2022',
  //     type: 'News Subscription',
  //     icon: '📰',
  //     merchant: 'NewsTimes',
  //     amount: '€30.00',
  //     status: 'Not Approved'
  //   }
  // ];
  
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

    const response = await fetch('/api/expenses', {
      method: currentExpense ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.uid, expense: { ...expenseData, id: currentExpense?.id } }),
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
    <div className="min-h-screen w-full">
      <div className="w-full p-6">
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

        <div className= "rounded-lg overflow-hidden">
          <div className="min-w-full">

              <div className="flex items-center py-3 px-6 font-medium uppercase border-2">
                <div className="flex-1">Details</div>
                <div className="flex-1">Merchant</div>
                <div className="flex-1">Amount</div>
                <div className="flex-1">Date</div>
                <div className="flex-1">Status</div>
                <div className="w-8"></div>
              </div>
            

            {/* output entries of expenses from the database to the frontend, if there are none then it will print a default message*/}
            <div className="divide-y divide-gray-800 border-x-2">
              {expenses.length === 0 ? (
                <div className="flex items-center justify-center px-6 py-3">
                  <p className="text-gray-500">No expenses found.</p>
                </div>
              ) : (
              expenses.map((expense) => (

                <div key={expense.id} className="flex items-center px-6 py-3">

                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="text-l">{expense.type}</div>
                    </div>
                  </div>

                  <div className="flex-1 text-l">{expense.merchant}</div>
                  <div className="flex-1 text-l">{expense.amount}</div>
                  <div className="flex-1 text-l">{expense.date}</div>

                  <div className="flex-1">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium
                      ${expense.status === 'Approved' ? 'bg-green-600 text-white' : 'bg-green-900/50 text-red-300'}`}>
                      {expense.status}
                    </span>
                  </div>

                  <div className="w-8">
                    <button className="text-gray-400 hover:text-gray-300">
                    <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                
                </div>
              ))
            )}
            </div>
          </div>
        </div>
      </div>

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
                <Label htmlFor="amount">Amount</Label>
                <Input id="amount" name="amount" type="number" step="0.01" defaultValue={currentExpense?.amount} required />
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input id="date" name="date" type="date" defaultValue={currentExpense?.date} required />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Input id="status" name="status" defaultValue={currentExpense?.status} required />
              </div>
              <div className="flex justify-end">
                <Button type="submit">{currentExpense ? 'Update' : 'Add'}</Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Expenses;