'use client'
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ArrowRight, Users, Calendar, BarChart } from "lucide-react";
import { useRouter } from 'next/navigation';
import { IconChartBar, IconRobot, IconTicket } from '@tabler/icons-react';
const LandingPage = () => {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-100 w-full">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">CRM Pro</h1>
          <div>
            <Button variant="outline" className="mr-2" onClick={() => router.push('/login')}>
              Login
            </Button>
            <Button onClick={() => router.push('/signup')}>
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-4xl font-extrabold text-center mb-8">Streamline Your Customer Relationships</h2>
          <p className="text-xl text-center mb-12">CRM Pro helps you manage customer data, track interactions, and optimize sales strategies for better business outcomes.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2" /> Customer Database
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Efficiently store, manage, and organize your customer contacts and communication history.</CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2" /> Task & Appointment Scheduling
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Schedule meetings, follow-ups, and set reminders to stay on top of customer interactions.</CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart className="mr-2" /> Sales Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Track sales metrics, customer acquisition, and revenue with interactive reports and charts.</CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <IconRobot className="mr-2" /> AI Sales Assistant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Leverage an AI-powered assistant to help with customer queries, business insights, and automated suggestions.</CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <IconTicket className="mr-2" /> Event & Job Planning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Plan and track client events, appointments, and other activities within your CRM system.</CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <IconChartBar className="mr-2" /> Personal Backlog & Inventory
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Manage tasks, expenses, and product inventory to streamline your business operations.</CardDescription>
              </CardContent>
            </Card>
          </div>
          <div className="mt-12 text-center">
            <Button size="lg" onClick={() => router.push('/signup')}>
              Get Started <ArrowRight className="ml-2" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
