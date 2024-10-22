'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const { user } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (user) {
      fetchCustomers();} else {
      router.push('/login');}
  }, [user, router]);
  const fetchCustomers = async () => {
    const response = await fetch(`/api/customers?userId=${user.uid}`);
    if (response.ok) {
      const data = await response.json();
      console.log("Fetched customers:", data.customers); // Debugging log
      setCustomers(data.customers || []);} else {
      toast({
        title: "Error",
        description: "Failed to fetch customers",
        variant: "destructive", }); } };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const customerData = Object.fromEntries(formData.entries());
    const response = await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.uid, firstName: customerData.firstName, lastName: customerData.lastName, emailAddress: customerData.emailAddress, phoneNumber: customerData.phoneNumber }),});
    if (response.ok) {
      fetchCustomers();
      setIsDialogOpen(false);
      setCurrentCustomer(null);
      toast({
        title: "Success",
        description: `Customer ${currentCustomer ? 'updated' : 'added'} successfully`,
      }); } else {
      toast({
        title: "Error",
        description: `Failed to ${currentCustomer ? 'update' : 'add'} customer`,
        variant: "destructive",}); } };
  const handleEdit = (customer) => {
    setCurrentCustomer(customer);
    setIsDialogOpen(true);
  };
  const handleDialogChange = (open) => {
    setIsDialogOpen(open);
    if (!open) {
      setCurrentCustomer(null); }  };
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Customer Management</h1>
      <Button onClick={() => setIsDialogOpen(true)}>Add New Customer</Button>
      <table className="min-w-full mt-4 border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">First Name</th>
            <th className="border border-gray-300 p-2">Last Name</th>
            <th className="border border-gray-300 p-2">Phone Number</th>
            <th className="border border-gray-300 p-2">Email Address</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.length === 0 ? (
            <tr>
              <td colSpan={5} className="border border-gray-300 p-2 text-center">No customers found.</td>
            </tr>
          ) : (
            customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleEdit(customer)}>
                <td className="border border-gray-300 p-2">{customer.firstName}</td>
                <td className="border border-gray-300 p-2">{customer.lastName}</td>
                <td className="border border-gray-300 p-2">{customer.phoneNumber}</td>
                <td className="border border-gray-300 p-2">{customer.emailAddress}</td>
                <td className="border border-gray-300 p-2">
                  <Button onClick={(e) => { e.stopPropagation(); handleEdit(customer); }}>Edit</Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentCustomer ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" name="firstName" defaultValue={currentCustomer?.firstName} required />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" name="lastName" defaultValue={currentCustomer?.lastName} required />
              </div>
              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input id="phoneNumber" name="phoneNumber" defaultValue={currentCustomer?.phoneNumber} required />
              </div>
              <div>
                <Label htmlFor="emailAddress">Email Address</Label>
                <Input id="emailAddress" name="emailAddress" defaultValue={currentCustomer?.emailAddress} required />
              </div>
              <Button type="submit">{currentCustomer ? 'Update' : 'Add'} Customer</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default Customers;
