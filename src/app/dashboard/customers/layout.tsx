import type { Metadata } from "next";
import React from 'react';
import { SidebarDemo } from "@/components/Sidebar";
export const metadata: Metadata = {
  title: "Customers page",
  description: "Here you can manage and view customer information.",
};
export default function CustomersLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="antialiased h-screen w-full">
      <div className="flex flex-col w-full h-full sm:flex-row">
        <SidebarDemo />
        <main className="flex-1 p-6 bg-gray-50">{children}</main>
      </div>
    </div>);}
