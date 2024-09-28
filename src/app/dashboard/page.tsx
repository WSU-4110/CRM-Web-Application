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
      router.replace('/auth');
    }
  }, [isClient, user, loading, router]);

  if (loading || !isClient) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      router.push('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div>
      <Button className="mt-4" onClick={handleSignOut}>Sign Out</Button>
      <DashboardDemo />
    </div>
  );
};

export default Dashboard;