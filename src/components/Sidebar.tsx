"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";
import { Button } from "./ui/button";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
  IconChartBar,
  IconUsers,
  IconCalendarMonth,
  IconBuildingWarehouse,
  IconLogout2,
  IconTicket,
  IconRobot

} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import { useAuth } from "@/app/contexts/AuthContext";
import { auth } from "@/firebaseConfig";

export function SidebarDemo() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  
  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: (
        <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Profile",
      href: "/dashboard/profile",
      icon: (
        <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Assistant",
      href: "/dashboard/AiAssistant",
      icon: (
        <IconRobot className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Events",
      href: "/dashboard/events",
      icon: (
        <IconTicket className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Calendar",
      href: "/dashboard/calendar",
      icon: (
        <IconCalendarMonth className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Expenses",
      href: "/dashboard/expenses",
      icon: (
        <IconChartBar className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Inventory",
      href: "/dashboard/inventory",
      icon: (
        <IconBuildingWarehouse className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
    label: "Customers",  
    href: "/dashboard/customers",  
    icon: (
      <IconUsers className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    ),
  },
  {
    label: "Analytics",  
    href: "/dashboard/analytics",  
    icon: (
      <IconUsers className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    ),
  },
    {
      label: "Logout",
      href: "#",
      icon: (
        <IconLogout2 className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);
  
  return (
    <div>
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
          <Button className={`mt-4 ${!open? "hidden": ""}`} onClick={handleSignOut} >Sign Out</Button>
          </div>
        </SidebarBody>
      </Sidebar>
    </div>
  );
}
export const Logo = () => {

  const { user } = useAuth();


  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >

      {user?.email}

      </motion.span>
    </Link>
  );
};
export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};


