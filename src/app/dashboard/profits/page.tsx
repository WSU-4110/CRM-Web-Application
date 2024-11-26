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

const ProfitsPerItemPage = () => {
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

  // Fetch items when the page loads
  useEffect(() => {
    const fetchItems = async () => {
      if (!user?.uid) {
        console.error("User ID is missing");
        toast({ title: "Error", description: "User ID is required to fetch items.", variant: "destructive" });
        return;
      }

      try {
        const response = await fetch(`/api/profit-per-item?userId=${user.uid}`);
        if (response.ok) {
          const data = await response.json();
          setItems(data.items || []);
        } else {
          console.error("Failed to fetch items:", response.statusText);
          toast({ title: "Error", description: "Failed to fetch items", variant: "destructive" });
        }
      } catch (error) {
        console.error("Error fetching items:", error);
        toast({ title: "Error", description: "Failed to fetch items", variant: "destructive" });
      }
    };

    fetchItems();
  }, [user]);

  const handleDialogChange = (open) => {
    setIsDialogOpen(open);
    if (!open) {
      setCurrentItem(null);
      setFormData({ type: "", itemName: "", unitsSold: "", revenue: "", cost: "" });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = (item) => {
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

  const handleDelete = async (item) => {
    

    try {
      const response = await fetch(`/api/profit-per-item`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.uid, itemId: item.id }),
      });

      if (response.ok) {
        const updatedItems = items.filter((i) => i.id !== item.id);
        setItems(updatedItems);
        toast({ title: "Success", description: "Item deleted." });
        setIsDialogOpen(false);
      } else {
        throw new Error("Failed to delete item");
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to delete item", variant: "destructive" });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const updatedItem = {
      id: currentItem?.id || Date.now().toString(), // Generate a unique ID
      ...formData,
      unitsSold: parseFloat(formData.unitsSold) || 0,
      revenue: parseFloat(formData.revenue) || 0,
      cost: parseFloat(formData.cost) || 0,
      profit: ((parseFloat(formData.revenue) || 0) - (parseFloat(formData.cost) || 0)).toFixed(2),
      profitPerItem:
        parseFloat(formData.unitsSold) > 0
          ? (((parseFloat(formData.revenue) || 0) - (parseFloat(formData.cost) || 0)) / parseFloat(formData.unitsSold)).toFixed(2)
          : "0.00",
    };

    try {
      const response = await fetch("/api/profit-per-item", {
        method: currentItem ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.uid, item: updatedItem }),
      });

      if (response.ok) {
        const result = await response.json();
        const updatedItems = currentItem
          ? items.map((item) => (item.id === currentItem.id ? updatedItem : item))
          : [...items, updatedItem];
        updatedItems.sort((a, b) => parseFloat(b.profitPerItem) - parseFloat(a.profitPerItem)); // Sort by profit per item
        setItems(updatedItems);
        toast({ title: "Success", description: `Item ${currentItem ? "updated" : "added"} successfully!` });
        setIsDialogOpen(false);
        setCurrentItem(null);
      } else {
        throw new Error("Failed to save item");
      }
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to save item", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen w-full p-6">
      <div className="flex justify-between items-center my-6">
        <h1 className="text-4xl font-bold">Profits Per Item/Service</h1>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="bg-black hover:bg-emerald-700 text-white flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New item
        </Button>
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
                className="w-full border rounded px-3 py-2"
              >
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
                  className="bg-red-600 text-white hover:bg-red-500">
                  Delete
                </Button>
              )}
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfitsPerItemPage;
