"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MoreVertical, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';


const ProfitsPerItemPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    type: '',
    itemName: '',
    unitsSold: '',
    revenue: '',
    cost: '',
  });

  const revenue = parseFloat(formData.revenue) || 0;
  const cost = parseFloat(formData.cost) || 0;
  const unitsSold = parseFloat(formData.unitsSold) || 0;

  const profit = revenue - cost;
  const profitPerItem = unitsSold > 0 ? profit / unitsSold : 0;

  const handleDialogChange = (open) => {
    setIsDialogOpen(open);
    if (!open) {
      setFormData({ type: '', itemName: '', unitsSold: '', revenue: '', cost: '' });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const newItem = {
      type: formData.type,
      itemName: formData.itemName,
      unitsSold: unitsSold.toString(),
      revenue: revenue.toFixed(2),
      cost: cost.toFixed(2),
      profit: profit.toFixed(2),
      profitPerItem: profitPerItem.toFixed(2),
    };

    
  
    // Send data to Firebase via the API route
    try {
      const response = await fetch('/api/profit-per-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log('Item added to Firebase with ID:', result.id);

        toast({
          title: "Success",
          description: "Item added successfully!",
        });

      } else {
        console.error('Error adding item to Firebase:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding item to Firebase:', error);
    }
  
    // Update local state to display item on the page
    const updatedItems = [
      ...items,
      newItem,
    ];
  
    updatedItems.sort((a, b) => parseFloat(b.profitPerItem) - parseFloat(a.profitPerItem));
    setItems(updatedItems);
    setIsDialogOpen(false);
  };
  

  return (
    <div className="min-h-screen w-full p-6">
      <div className="flex justify-between items-center my-6">
        <h1 className="text-4xl font-bold">Profits Per Item/Service</h1>
        <Button 
          onClick={() => setIsDialogOpen(true)}
          className="bg-black hover:bg-emerald-700 text-white flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New item
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="text-xl">
            <TableHead>Item/Service Name</TableHead>
            <TableHead>Units Sold</TableHead>
            <TableHead>Revenue</TableHead>
            <TableHead>Cost</TableHead>
            <TableHead>Profit</TableHead>
            <TableHead>Profit per Item/Service</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-gray-500">No items found.</TableCell>
            </TableRow>
          ) : (
            items.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="text-l">{item.itemName} ({item.type})</TableCell>
                <TableCell className="text-l">{item.unitsSold}</TableCell>
                <TableCell className="text-l">${item.revenue}</TableCell>
                <TableCell className="text-l">${item.cost}</TableCell>
                <TableCell className="text-l">${item.profit}</TableCell>
                <TableCell className="text-l">${item.profitPerItem}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Item</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <Label htmlFor="type">Type</Label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2">
                <option value="Item">Item</option>
                <option value="Service">Service</option>
              </select>
            </div>

            <div>
              <Label htmlFor="itemName">Item Name</Label>
              <Input id="itemName" name="itemName" value={formData.itemName} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="unitsSold">Units Sold</Label>
              <Input id="unitsSold" name="unitsSold" type="number" value={formData.unitsSold} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="revenue">Revenue ($)</Label>
              <Input id="revenue" name="revenue" type="number" step="10.0" value={formData.revenue} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="cost">Cost ($)</Label>
              <Input id="cost" name="cost" type="number" step="10.0" value={formData.cost} onChange={handleChange} required />
            </div>
            <Button type="submit" className="bg-black text-white">Add Item</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfitsPerItemPage;
