'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import {z} from 'zod';
import styles from './customers.module.css';
import CustomersLayout from './layout';
//WIP
const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState('');
  const router = useRouter();}
//return condition
 return (
      <div className={styles.customersContainer}>
        <Card className="w-full max-w-[800px] mx-auto">
          <CardHeader>
            <CardTitle>Customers page</CardTitle>
            <CardDescription>Manage and view customers information.</CardDescription>
          </CardHeader>
          <CardContent>
          </CardContent>
          <div className="p-4">
            <Button className={styles.refreshButton} onClick={fetchCustomers}>
              Refresh
            </Button>
          </div>
        </Card>
      </div>;};
export default Customers;
