'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../../firebaseConfig';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardDemo } from '@/components/DashboardDemo';

const Dashboard = () => {
  const router = useRouter();
  const { user, loading } = useAuth();
  
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !loading && !user) {
      router.replace('/login');
    }
  }, [isClient, user, loading, router]);

  if (loading || !isClient) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }


  return (
    <div className='flex flex-col items-center justify-center w-full h-full'>
      <DashboardDemo />
    </div>
  );
};

export default Dashboard;