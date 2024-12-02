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

  return (
    <div className="flex flex-col items-center p-4">
      <Card className="w-full max-w-5xl shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-semibold">Customers</CardTitle>
            <Button
              className="text-sm py-1 px-3"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? "Close" : "Add"}
            </Button>
          </div>
          <CardDescription>Manage and view customer information.</CardDescription>
        </CardHeader>
        <CardContent>
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
                <div className="mb-4">
                  <h3 className="text-xl font-semibold mb-2">Add a New Customer</h3>
                  <div className="flex flex-wrap gap-4">
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
                    <Button onClick={handleAddCustomer}>Save</Button>
                  </div>
                </div>
              )}
              <div className="overflow-x-auto">
                <table className="table-auto w-full text-left border-collapse border border-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 border border-gray-200">First Name</th>
                      <th className="p-2 border border-gray-200">Last Name</th>
                      <th className="p-2 border border-gray-200">Email</th>
                      <th className="p-2 border border-gray-200">Phone</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((customer) => (
                      <tr key={customer.id} className="hover:bg-gray-50">
                        <td className="p-2 border border-gray-200">{customer.firstName}</td>
                        <td className="p-2 border border-gray-200">{customer.lastName}</td>
                        <td className="p-2 border border-gray-200">{customer.emailAddress}</td>
                        <td className="p-2 border border-gray-200">{customer.phoneNumber}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Customers;
