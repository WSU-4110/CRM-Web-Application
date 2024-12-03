'use client'
import Link from "next/link"
import { useEffect, useState } from "react"
import { useAuth } from "@/app/contexts/AuthContext"
import {
  Activity,
  ArrowUpRight,
  CircleUser,
  CreditCard,
  DollarSign,
  Menu,
  Package2,
  Search,
  Users,
  Wallet
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const description =
  "An application shell with a header and main content area. The header has a navbar, a search input and and a user nav dropdown. The user nav is toggled by a button with an avatar image."

export function DashboardDemo() {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [customers, setCustomers] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState({
    revenue: true,
    expenses: true,
    profit: true,
    customers: true,
    events: true
  });

  const [totalProfit, setTotalProfit] = useState(0);
  const { user } = useAuth()
  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const response = await fetch(`/api/events?userId=${user.uid}`);
        const data = await response.json();
        console.log(data.events);
        // Calculate total revenue from events
        const total = data.events.reduce((sum, event) => sum + event.price, 0);
        setTotalRevenue(total);
        setEvents(data.events);
        setLoading(prev => ({ ...prev, events: false }));
        setLoading(prev => ({ ...prev, revenue: false }));
      } catch (error) {
        console.error('Error fetching revenue data:', error);
      } finally {
        setLoading(prev => ({ ...prev, revenue: false }));
      }
    };

    const fetchExpenses = async () => {
      try {
        const response = await fetch(`/api/expenses?userId=${user.uid}`);
        const data = await response.json();
        const total = data.expenses.reduce((sum, expense) => sum + parseInt(expense.amount, 10),  0);
        setTotalExpenses(total);
      } catch (error) {
        console.error('Error fetching expenses data:', error);
      } finally {
        setLoading(prev => ({ ...prev, expenses: false }));
      }
    };

    const fetchCustomers = async () => {
      try {
        const response = await fetch(`/api/customers?userId=${user.uid}`);
        const data = await response.json();
        setCustomers(data.customers);
      } catch (error) {
        console.error('Error fetching customer data:', error);
      } finally {
        setLoading(prev => ({ ...prev, customers: false }));
      }
    };

    fetchExpenses();
    fetchCustomers();
    fetchRevenue();
  }, []);

  useEffect(() => {
    if (!loading.revenue && !loading.expenses) {
      const profit = totalRevenue - totalExpenses;
      setTotalProfit(profit);
      setLoading(prev => ({ ...prev, profit: false }));
    }
  }, [totalRevenue, totalExpenses, loading.revenue, loading.expenses]);


  const formatPhoneNumber = (phoneNumber) => {
   
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }
    
    return phoneNumber; 
  };
  return (
    <div className="flex min-h-screen w-full flex-col">
     
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <h1 className="text-4xl font-bold mt-6">Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card x-chunk="dashboard-01-chunk-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading.revenue ? (
                <div className="text-2xl font-bold">Loading...</div>
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    ${totalRevenue.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Based on event costs
                  </p>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Expenses
              </CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading.expenses ? (
                <div className="text-2xl font-bold">Loading...</div>
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    ${totalExpenses.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Total business expenses
                  </p>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading.profit ? (
                <div className="text-2xl font-bold">Loading...</div>
              ) : (
                <>
                  <div className={`text-2xl font-bold ${totalProfit < 0 ? 'text-red-500' : 'text-green-600'}`}>
                    ${totalProfit.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Revenue minus expenses
                  </p>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading.customers ? (
                <div className="text-2xl font-bold">Loading...</div>
              ) : (
                <>
                  <div className="text-2xl font-bold">{customers.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Total registered customers
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle>Recent and Upcoming Events/Jobs</CardTitle>
                <CardDescription>
                  Your scheduled events and jobs
                </CardDescription>
              </div>
              <Button asChild size="sm" className="ml-auto gap-1">
                <Link href="/dashboard/events">
                  View All
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event Name</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading.events ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center">
                        Loading events...
                      </TableCell>
                    </TableRow>
                  ) : (
                    events
                      
                      .slice(0, 5)
                      .map((event, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {event.name}
                          </TableCell>
                          <TableCell>
                            {event.customerId}
                          </TableCell>
                          <TableCell>
                            {event.date}
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-01-chunk-5">
            <CardHeader>
              <CardTitle>Recent Customers</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-8">
              {loading.customers ? (
                <div>Loading customers...</div>
              ) : (
             
                [...customers].reverse().slice(0, 5).map((customer, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <Avatar className="hidden h-9 w-9 sm:flex">
                      <AvatarFallback>
                        {customer.firstName[0]}{customer.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <p className="text-sm font-medium leading-none">
                        {customer.firstName} {customer.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {customer.emailAddress}
                      </p>
                    </div>
                    <div className="ml-auto font-medium">
                      {formatPhoneNumber(customer.phoneNumber)}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}