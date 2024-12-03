'use client';
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAuth } from "firebase/auth";
import { useAuth } from '@/app/contexts/AuthContext';
import { toast } from "@/hooks/use-toast";

export default function Profile() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [businessName, setBusinessName] = useState("");
    const [email, setEmail] = useState("");
    const [displayName, setDisplayName] = useState("Placeholder Name");
    const [displayEmail, setDisplayEmail] = useState("Placeholder Email");
    

    const {user} = useAuth();
   

    useEffect(() => {
        const fetchProfile = async () => {
            
            try {
                const response = await fetch(`/api/profile-route?userId=${user.uid}`);
                if (!response.ok) throw new Error("Failed to fetch profile");

                const data = await response.json();
                console.log(data)
                setFirstName(data.firstName || "");
                setLastName(data.lastName || "");
                setBusinessName(data.businessName || "");
                setEmail(data.email || "");

                const name = `${data.firstName || ""} ${data.lastName || ""}`.trim();
                setDisplayName(name || "No Name Provided");
                setDisplayEmail(data.email || "No Email Provided");        
            }

            catch (error) {
                console.error("Error fetching profile:", error);
            }
    };

    fetchProfile(); }, [user.uid]);


    
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        

        if (!user.uid) {
            console.error("User is not authenticated");
            return;
        }

        const profileData = { firstName, lastName, businessName, email };

        try {
            const response = await fetch("/api/profile-route", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user, profileData }),
            });
            if (response.ok) {
                console.log("Profile updated successfully");
                toast({ title: "Success", description: "Profile updated successfully!" });


                const name = `${firstName} ${lastName}`.trim();
                setDisplayName(name || "No name provided");
                setDisplayEmail(email || "No email provided")
                
            } else {
                console.error("Failed to update profile");
                toast({ title: "Failed", description: "Profile did not update!" });
            }
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    return (
        <div className="container mx-auto flex justify-center items-center min-h-screen ">
            <Card className="w-full max-w-2xl p-20 bg-white text-black  rounded-lg">
                <CardHeader className="text-center mb-10">
                    {/* @ts-ignore */}
                    <Avatar src="https://placehold.co/600x400" alt="Profile" className="mx-auto mb-2 border-4 border-gray-300 rounded-full"/>
                    <CardTitle className="text-2xl font-semibold">{firstName + " " + lastName}</CardTitle>
                    <p className="text-gray-500">{email}</p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="grid gap-4">
                        <div>
                            <Label>First Name:</Label>
                            <Input type="text" value={firstName} placeholder="Your First Name" onChange={(e) => setFirstName(e.target.value)} />
                        </div>
                        <div>
                            <Label>Last Name:</Label>
                            <Input type="text" value={lastName} placeholder="Your Last Name" onChange={(e) => setLastName(e.target.value)} />
                        </div>
                        <div>
                            <Label>Business Name:</Label>
                            <Input type="text" value={businessName} placeholder="Your Business Name" onChange={(e) => setBusinessName(e.target.value)} />
                        </div>
                        <div>
                            <Label>Email:</Label>
                            <Input type="text" value={email} placeholder="Your Email" onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <Button type="submit" className="w-full mt-4 bg-black text-white hover:bg-gray-800">Save Changes</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
