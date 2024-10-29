"use client";

import React, { useState } from 'react';
import "@/app/Profile.css";
import { getAuth } from "firebase/auth";

export default function Profile() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [company, setCompany] = useState('');
    const [businessType, setBusinessType] = useState('');
    const [timezone, setTimezone] = useState('');
    const [position, setPosition] = useState('');

    const auth = getAuth();
    const userId = auth.currentUser ? auth.currentUser.uid : null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const profileData = {
            firstName,
            lastName,
            company,
            businessType,
            timezone,
            position,
        };

         // Basic validation to ensure all fields are non-empty and not null
        for (const [key, value] of Object.entries(profileData)) {
            if (!value) {
                console.error(`Validation failed: missing field(s)`);
                alert(`Please fill out the missing field(s).`);
                return; 
        }
    }

        if (!userId) { //If user is not authenticated
            console.error("User is not authenticated");
            return;
        }

        try {  //Fetches API, on the bottom logs to console whether submission went through or not
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

    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <>
            <header className="welcome-header">
                <h1>Welcome, Business Owner</h1>
                <p>{formattedDate}</p>
            </header>

            <div className="profile-container">
                <div className="profile-header-bar"></div>
                <div className="profile-container-content">
                    <div className="profile-header">
                        <img 
                            className="profile-picture" 
                            src="https://via.placeholder.com/150" 
                            alt="Profile"
                        />
                        <div className="profile-info">
                            <h2>Client Name</h2>
                            <p>client@gmail.com</p>
                        </div>

                    </div>

                    <form onSubmit={handleSubmit} className="profile-form">
                        <div className="form-grid">
                            <div className="input-group">
                                <label>First Name:</label>
                                <input type="text" value={firstName} placeholder="Your First Name" onChange={(e) => setFirstName(e.target.value)} />
                            </div>
                            <div className="input-group">
                                <label>Business Type:</label>
                                <input type="text" value={businessType} placeholder="Your Business Type" onChange={(e) => setBusinessType(e.target.value)} />
                            </div>
                            <div className="input-group">
                                <label>Last Name:</label>
                                <input type="text" value={lastName} placeholder="Your Last Name" onChange={(e) => setLastName(e.target.value)} />
                            </div>
                            <div className="input-group">
                                <label>Timezone:</label>
                                <select value={timezone} onChange={(e) => setTimezone(e.target.value)}>
                                    <option value="">Select Your Timezone</option>
                                    <option value="PST">Pacific Standard Time (PST)</option>
                                    <option value="EST">Eastern Standard Time (EST)</option>
                                    <option value="CST">Central Standard Time (CST)</option>
                                    <option value="MST">Mountain Standard Time (MST)</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Company/Organization:</label>
                                <input type="text" value={company} placeholder="Your Company/Org" onChange={(e) => setCompany(e.target.value)} />
                            </div>
                            <div className="input-group">
                                <label>Role/Position:</label>
                                <input type="text" value={position} placeholder="Your Role/Position" onChange={(e) => setPosition(e.target.value)} />
                            </div>
                        </div>
                        <button type="submit" className="submit-button">Submit</button>
                    </form>
                </div>
            </div>
        </>
    );
};
