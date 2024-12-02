"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreVertical, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/app/contexts/AuthContext";
import { ProfitsService } from "@/lib/profitsService";

const ProfitsPerItemPage = () => {
  const profitsService = new ProfitsService();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({
    type: "",
    itemName: "",
    unitsSold: "",
    revenue: "",
    cost: "",
  });
  const { user } = useAuth();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        if (!user?.uid) throw new Error("User ID is missing");
        const fetchedItems = await profitsService.fetchItems(user.uid);
        setItems(fetchedItems);
      } catch (error) {
        console.error(error);
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
    };

    if (user?.uid) fetchItems();
  }, [user]);

  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setCurrentItem(null);
      setFormData({ type: "", itemName: "", unitsSold: "", revenue: "", cost: "" });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = (item: any) => {
    setCurrentItem(item);
    setFormData({
      type: item.type,
      itemName: item.itemName,
      unitsSold: item.unitsSold,
      revenue: item.revenue,
      cost: item.cost,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (item: any) => {
    try {
      await profitsService.handleDelete(user?.uid, item.id);
      setItems(items.filter((i) => i.id !== item.id));
      toast({ title: "Success", description: "Item deleted successfully!" });
      
      setIsDialogOpen(false);
      setCurrentItem(null);
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const updatedItem = await profitsService.handleSubmit(user?.uid, formData, currentItem);
      const updatedItems = currentItem ? items.map((item) => (item.id === currentItem.id ? updatedItem : item)): [...items, updatedItem];
      setItems(profitsService.sortItemsByProfit(updatedItems));
      toast({ title: "Success", description: `Item ${currentItem ? "updated" : "added"} successfully!` });


      setIsDialogOpen(false);
      setCurrentItem(null);
      setFormData({ type: "", itemName: "", unitsSold: "", revenue: "", cost: "" });
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen w-full p-6">
      <div className="flex justify-between items-center my-6">
        <h1 className="text-4xl font-bold">Profits Per Item/Service</h1>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="bg-black hover:bg-emerald-700 text-white flex items-center gap-2">
            <Plus className="h-4 w-4" />New item</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item/Service Name</TableHead>
            <TableHead>Units Sold</TableHead>
            <TableHead>Revenue</TableHead>
            <TableHead>Cost</TableHead>
            <TableHead>Profit</TableHead>
            <TableHead>Profit per Item/Service</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-gray-500">
                No items found.
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  {item.itemName} {item.type ? `(${item.type})` : ""}
                </TableCell>
                <TableCell>{item.unitsSold}</TableCell>
                <TableCell>${item.revenue}</TableCell>
                <TableCell>${item.cost}</TableCell>
                <TableCell>${item.profit}</TableCell>
                <TableCell>${item.profitPerItem}</TableCell>
                <TableCell>
                  <button onClick={() => handleEdit(item)}>
                    <MoreVertical className="text-gray-400 hover:text-gray-300" />
                  </button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentItem ? "Edit/Delete Item" : "Add New Item"}</DialogTitle>
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
              <Label htmlFor="itemName">Item/Service Name</Label>
              <Input id="itemName" name="itemName" value={formData.itemName} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="unitsSold">Units Sold</Label>
              <Input id="unitsSold" name="unitsSold" type="number" value={formData.unitsSold} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="revenue">Revenue ($)</Label>
              <Input id="revenue" name="revenue" type="number" value={formData.revenue} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="cost">Cost ($)</Label>
              <Input id="cost" name="cost" type="number" value={formData.cost} onChange={handleChange} required />
            </div>
            <div className="flex justify-between">
              <Button type="submit" className="bg-black text-white">
                {currentItem ? "Update Item" : "Add Item"}
              </Button>
              {currentItem && (
                <Button
                  type="button"
                  onClick={() => handleDelete(currentItem)}
                  className="bg-red-600 text-white">Delete</Button>
              )}
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfitsPerItemPage;
