'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from 'next/navigation';
//Table setup
const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', phone: '' });
  const router = useRouter();
  const fetchCustomers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/customers');
      if (!response.ok) {
        throw new Error('Failed to fetch customers');}
      const data = await response.json();
      setCustomers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);}};
  useEffect(() => {
    fetchCustomers();
  }, []);
  const handleAddCustomer = async () => {
    if (!newCustomer.name || !newCustomer.email || !newCustomer.phone) {
      setError('All fields are required');
      return;}
    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCustomer),
      });
      if (!response.ok) {
        throw new Error('Failed to add customer');}
      fetchCustomers();
      setNewCustomer({ name: '', email: '', phone: '' }); 
    } catch (err) {
      setError(err.message);}};
  return (
    <div>
      <Card className="w-full max-w-[800px] mx-auto">
        <CardHeader>
          <CardTitle>Customers Page</CardTitle>
          <CardDescription>Manage and view the customers information.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : error ? (
            <Alert>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <>
              <table className="w-full text-left">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email Address </th>
                    <th>Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.id}>
                      <td>{customer.name}</td>
                      <td>{customer.email}</td>
                      <td>{customer.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4">
                <h3>Add a new customer</h3>
                <div className="flex gap-2">
                  <Input 
                    type="text" 
                    placeholder="Name" 
                    value={newCustomer.name} 
                    onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })} 
                  />
                  <Input 
                    type="email address" 
                    placeholder="Email Address" 
                    value={newCustomer.email} 
                    onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })} 
                  />
                  <Input 
                    type="text" 
                    placeholder="Phone Number" 
                    value={newCustomer.phone} 
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })} 
                  />
                  <Button onClick={handleAddCustomer}>Add</Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
export default Customers;
