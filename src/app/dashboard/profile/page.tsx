'use client';
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAuth } from "firebase/auth";

export default function Profile() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [company, setCompany] = useState("");
    const [businessType, setBusinessType] = useState("");
    const [timezone, setTimezone] = useState("");
    const [position, setPosition] = useState("");

    const auth = getAuth();
    const userId = auth.currentUser ? auth.currentUser.uid : null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const profileData = { firstName, lastName, company, businessType, timezone, position };

        for (const [key, value] of Object.entries(profileData)) {
            if (!value) {
                alert(`Please fill out the missing field(s).`);
                return;
            }
        }

        if (!userId) {
            console.error("User is not authenticated");
            return;
        }

        try {
            const response = await fetch("/api/profile-route", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, profileData }),
            });
            if (response.ok) {
                console.log("Profile updated successfully");
            } else {
                console.error("Failed to update profile");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="container mx-auto flex justify-center items-center min-h-screen ">
            <Card className="w-full max-w-2xl p-20 bg-white text-black  rounded-lg">
                <CardHeader className="text-center mb-10">
                    <Avatar src="https://placehold.co/600x400" alt="Profile" className="mx-auto mb-2 border-4 border-gray-300 rounded-full"/>
                    <CardTitle className="text-2xl font-semibold">Placeholder Name</CardTitle>
                    <p className="text-gray-500">Placeholder Email</p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="grid gap-4">
                        <div>
                            <Label>First Name:</Label>
                            <Input type="text" value={firstName} placeholder="Your First Name" onChange={(e) => setFirstName(e.target.value)} />
                        </div>
                        <div>
                            <Label>Business Type:</Label>
                            <Input type="text" value={businessType} placeholder="Your Business Type" onChange={(e) => setBusinessType(e.target.value)} />
                        </div>
                        <div>
                            <Label>Last Name:</Label>
                            <Input type="text" value={lastName} placeholder="Your Last Name" onChange={(e) => setLastName(e.target.value)} />
                        </div>
                        <div>
                            <Label>Timezone:</Label>
                            <Select value={timezone} onValueChange={(value) => setTimezone(value)} className="w-full">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Your Timezone" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PST">Pacific Standard Time (PST)</SelectItem>
                                    <SelectItem value="EST">Eastern Standard Time (EST)</SelectItem>
                                    <SelectItem value="CST">Central Standard Time (CST)</SelectItem>
                                    <SelectItem value="MST">Mountain Standard Time (MST)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Company/Organization:</Label>
                            <Input type="text" value={company} placeholder="Your Company/Org" onChange={(e) => setCompany(e.target.value)} />
                        </div>
                        <div>
                            <Label>Role/Position:</Label>
                            <Input type="text" value={position} placeholder="Your Role/Position" onChange={(e) => setPosition(e.target.value)} />
                        </div>
                        <Button type="submit" className="w-full mt-4 bg-black text-white hover:bg-gray-800">Submit</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
