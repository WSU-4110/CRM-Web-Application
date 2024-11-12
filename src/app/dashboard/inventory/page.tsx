'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext'; 
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

export default function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      fetchInventory();
    } else {
      router.push('/login');
    }
  }, [user, router]);

  const fetchInventory = async () => {
    const response = await fetch(`/api/inventory?userId=${user.uid}`);
    if (response.ok) {
      const data = await response.json();
      setInventory(data.inventory || []);
    } else {
      toast({
        title: "Error",
        description: "Failed to fetch inventory",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const imageFile = formData.get('image');
    
    const itemData = Object.fromEntries(
      Array.from(formData.entries()).filter(([key]) => key !== 'image')
    );

    const requestFormData = new FormData();
    requestFormData.append('userId', user.uid);
    requestFormData.append('itemData', JSON.stringify(itemData));
    if (imageFile instanceof File && imageFile.size > 0) {
      requestFormData.append('image', imageFile);
    }

    const response = await fetch('/api/inventory', {
      method: currentItem ? 'PUT' : 'POST',
      body: requestFormData,
    });

    if (response.ok) {
      fetchInventory();
      setIsDialogOpen(false);
      setCurrentItem(null);
      toast({
        title: "Success",
        description: `Item ${currentItem ? 'updated' : 'added'} successfully`,
      });
    } else {
      toast({
        title: "Error",
        description: `Failed to ${currentItem ? 'update' : 'add'} item`,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (item) => {
    setCurrentItem(item);
    setIsDialogOpen(true);
  };

  const handleDialogChange = (open) => {
    setIsDialogOpen(open);
    if (!open) {
      setCurrentItem(null);
    }
  };

  return (

    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Inventory Management</h1>
      <Button onClick={() => setIsDialogOpen(true)}>Add New Item</Button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {inventory.map((item) => (
          <Card key={item.id} className="cursor-pointer" onClick={() => handleEdit(item)}>
            <CardHeader>
              <CardTitle>{item.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-40 bg-gray-200 mb-2">
                {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
              </div>
              <p>Price: ${item.price}</p>
              <p>Inventory: {item.count}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" defaultValue={currentItem?.name} required />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" defaultValue={currentItem?.description} />
              </div>
              <div>
                <Label htmlFor="price">Price</Label>
                <Input id="price" name="price" type="number" step="0.01" defaultValue={currentItem?.price} required />
              </div>
              <div>
                <Label htmlFor="count">Inventory Count</Label>
                <Input id="count" name="count" type="number" defaultValue={currentItem?.count} required />
              </div>
              <div>
                <Label htmlFor="image">Image</Label>
                <Input 
                  id="image" 
                  name="image" 
                  type="file" 
                  accept="image/*"
                  className="cursor-pointer"
                />
                {currentItem?.image && (
                  <div className="mt-2">
                    <img 
                      src={currentItem.image} 
                      alt="Current image" 
                      className="w-20 h-20 object-cover"
                    />
                  </div>
                )}
              </div>
              <Button type="submit">{currentItem ? 'Update' : 'Add'} Item</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>


    </div>
  );
}