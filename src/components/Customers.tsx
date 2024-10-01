'use client'
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import {z} from 'zod';
//WIP
const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState('');
  const router = usRouter();}
