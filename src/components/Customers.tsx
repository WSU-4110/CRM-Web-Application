"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { CustomerService } from "@/lib/CustomerService";
import React from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { Label } from "@radix-ui/react-label";
import { DialogHeader } from "./ui/dialog";

const Customers = () => {
  const auth = useAuth();
  const [customers, setCustomers] = useState([]);
  const [newCustomer, setNewCustomer] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "",
    phoneNumber: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false); // State for toggling the form
  const customersService = new CustomerService();

  const fetchCustomers = async () => {
    setLoading(true);
    setError("");
    try {
      const fetchedCustomers = await customersService.fetchCustomers(auth.user.uid);
      setCustomers(fetchedCustomers);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error, could not fetch customers"
      );
      console.error("Error, could not fetch customers:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCustomer = async () => {
    if (
      !newCustomer.firstName ||
      !newCustomer.lastName ||
      !newCustomer.emailAddress ||
      !newCustomer.phoneNumber
    ) {
      setError("Error, please fill in all required fields.");
      return;
    }
    try {
      const customerToAdd = {
        firstName: newCustomer.firstName,
        lastName: newCustomer.lastName,
        emailAddress: newCustomer.emailAddress,
        phoneNumber: newCustomer.phoneNumber,
      };
      await customersService.addCustomer(customerToAdd, auth.user.uid);
      fetchCustomers();
      setNewCustomer({
        firstName: "",
        lastName: "",
        emailAddress: "",
        phoneNumber: "",
      });
      setShowForm(false); // Hide the form after adding a customer
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error, could not add customer"
      );
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [auth.user.uid]);


  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [messageCustomer, setMessageCustomer] = useState(null);
  const [subject, setSubject] = useState('');
  const [message, setmessage] = useState('');
  const handleMessage = (customer) => {
    setMessageCustomer(customer);
    setIsMessageDialogOpen(true);
  };


  const handleSendEmail = async (event) => {
    event.preventDefault();
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: auth.user.email,
        to: messageCustomer.emailAddress,
        subject,
        message,
      }),
    });
    if (response.ok) {
      toast({
        title: "Success",
        description: "Email sent successfully",
      });
      setIsMessageDialogOpen(false);
      setMessageCustomer(null);
      setSubject('');
      setmessage('');
    } else {
      toast({
        title: "Error",
        description: "Failed to send email",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen w-full p-6">
      <div className="flex justify-between items-center my-6">
        <h1 className="text-4xl font-bold">Customers</h1>
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowForm(!showForm)} 
            className="bg-black text-white flex items-center gap-2">
            {showForm ? "Close Form" : "Add Customer"}
          </Button>
        </div>
      </div>  

      {loading ? (
        <div className="flex justify-center my-4">
          <Loader2 className="animate-spin" size={24} />
        </div>
      ) : error ? (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <>
          {showForm && (
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4">Add New Customer</h2>
              <form className="space-y-4" onSubmit={handleAddCustomer}>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="text"
                    placeholder="First Name"
                    value={newCustomer.firstName}
                    onChange={(e) =>
                      setNewCustomer({ ...newCustomer, firstName: e.target.value })
                    }
                  />
                  <Input
                    type="text"
                    placeholder="Last Name"
                    value={newCustomer.lastName}
                    onChange={(e) =>
                      setNewCustomer({ ...newCustomer, lastName: e.target.value })
                    }
                  />
                  <Input
                    type="email"
                    placeholder="Email Address"
                    value={newCustomer.emailAddress}
                    onChange={(e) =>
                      setNewCustomer({ ...newCustomer, emailAddress: e.target.value })
                    }
                  />
                  <Input
                    type="text"
                    placeholder="Phone Number"
                    value={newCustomer.phoneNumber}
                    onChange={(e) =>
                      setNewCustomer({ ...newCustomer, phoneNumber: e.target.value })
                    }
                  />
                </div>
                <Button type="submit" className="mt-4 bg-emerald-700 text-white">
                  Save Customer
                </Button>
              </form>
            </div>
          )}

          <Table>
            <TableHeader>
              <TableRow className="text-xl">
                <TableHead>First Name</TableHead>
                <TableHead>Last Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead> </TableHead>
                
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500">
                    No customers found.
                  </TableCell>
                </TableRow>
              ) : (
                customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>{customer.firstName}</TableCell>
                    <TableCell>{customer.lastName}</TableCell>
                    <TableCell>{customer.emailAddress}</TableCell>
                    <TableCell>{customer.phoneNumber}</TableCell>
                    <TableCell className="p-2">
                      <Button onClick={(e) => { e.stopPropagation(); handleMessage(customer); }}>Message</Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </>
      )}



      <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Email to {messageCustomer?.firstName} {messageCustomer?.lastName}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSendEmail} className="space-y-4">
            <div className="flex flex-col space-y-1">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" name="subject" value={subject} onChange={(e) => setSubject(e.target.value)} required />
            </div>
            <div className="flex flex-col space-y-1">
              <Label htmlFor="message">Email Content</Label>
              <textarea id="message" name="message" value={message} onChange={(e) => setmessage(e.target.value)} required className="p-2 border rounded-md" />
            </div>
            <Button type="submit" className="mt-4">Send Email</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};


export default Customers;