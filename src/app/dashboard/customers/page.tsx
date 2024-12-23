'use client'; // assignment 5 version
import React from 'react';
import Customers from '@/components/Customers'; 
const Page = () => {
  return (
    <main className="p-4">
      <Customers />
    </main>
  );
};
export default Page;

/*
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetchCustomers();
    } else {
      router.push('/login');
    }
  }, [user, router]);

  const fetchCustomers = async () => {
    const response = await fetch(`/api/customers?userId=${user.uid}`);
    if (response.ok) {
      const data = await response.json();
      setCustomers(data.customers || []);
    } else {
      toast({
        title: "Error",
        description: "Failed to fetch customers",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const customerData = Object.fromEntries(formData.entries());
    const response = await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.uid,
        firstName: customerData.firstName,
        lastName: customerData.lastName,
        emailAddress: customerData.emailAddress,
        phoneNumber: customerData.phoneNumber
      }),
    });
    if (response.ok) {
      fetchCustomers();
      setIsDialogOpen(false);
      setCurrentCustomer(null);
      toast({
        title: "Success",
        description: `Customer ${currentCustomer ? 'updated' : 'added'} successfully`,
      });
    } else {
      toast({
        title: "Error",
        description: `Failed to ${currentCustomer ? 'update' : 'add'} customer`,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (customer) => {
    setCurrentCustomer(customer);
    setIsDialogOpen(true);
  };

  const handleDialogChange = (open) => {
    setIsDialogOpen(open);
    if (!open) {
      setCurrentCustomer(null);
    }
  };

  return (
    <div className="container mx-auto p-4">
    <h1 className="text-2xl font-bold mb-4">Manage Your Customers</h1>
    <Button onClick={() => setIsDialogOpen(true)}>Add A New Customer</Button>
    
    <Card className="mt-4 overflow-x-auto">
  <Table className="w-full table-fixed">
      <TableRow className="bg-gray-100 border-b">
        <TableCell className="">First Name</TableCell>
        <TableCell className="">Last Name</TableCell>
        <TableCell className="">Phone Number</TableCell>
        <TableCell className="">Email Address</TableCell>
        <TableCell className="">Actions</TableCell>
      </TableRow>
    <TableBody>
      {customers.length === 0 ? (
        <TableRow>
          <TableCell colSpan={5} className="text-center">No customers found.</TableCell>
        </TableRow>
      ) : (
        customers.map((customer) => (
          <TableRow key={customer.id} className="border-b">
            <TableCell className="p-2">{customer.firstName}</TableCell>
            <TableCell className="p-2">{customer.lastName}</TableCell>
            <TableCell className="p-2">{customer.phoneNumber}</TableCell>
            <TableCell className="p-2">{customer.emailAddress}</TableCell>
            <TableCell className="p-2">
              <Button onClick={(e) => { e.stopPropagation(); handleEdit(customer); }}>Edit</Button>
            </TableCell>
          </TableRow>
        ))
      )}
    </TableBody>
  </Table>
</Card>

      <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentCustomer ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col space-y-1">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" name="firstName" defaultValue={currentCustomer?.firstName} required />
            </div>
            <div className="flex flex-col space-y-1">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" name="lastName" defaultValue={currentCustomer?.lastName} required />
            </div>
            <div className="flex flex-col space-y-1">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input id="phoneNumber" name="phoneNumber" defaultValue={currentCustomer?.phoneNumber} required />
            </div>
            <div className="flex flex-col space-y-1">
              <Label htmlFor="emailAddress">Email Address</Label>
              <Input id="emailAddress" name="emailAddress" defaultValue={currentCustomer?.emailAddress} required />
            </div>
            <Button type="submit" className="mt-4">{currentCustomer ? 'Update' : 'Add'} Customer</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Customers;
*/