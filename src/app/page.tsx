'use client'
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ArrowRight, Users, Calendar, BarChart } from "lucide-react";
import { useRouter } from 'next/navigation';

const LandingPage = () => {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-100 w-full">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">CRM</h1>
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
          <p className="text-xl text-center mb-12">CRM Pro helps you manage contacts, track interactions, and boost sales efficiency.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2" /> Contact Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Organize and manage your customer database with ease.</CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2" /> Task Scheduling
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Plan and track all your customer-related activities in one place.</CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart className="mr-2" /> Sales Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Gain insights into your sales performance with powerful reporting tools.</CardDescription>
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