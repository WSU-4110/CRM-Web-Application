"use client"

import React, { useState } from 'react';

import "/Users/aibra11/Desktop/CRM-Web-Application/src/app/Profile.css"


export default function Profile() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [company, setCompany] = useState('');
    const [businessType, setBusinessType] = useState('');
    const [timezone, setTimezone] = useState('');
    const [position, setPosition] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const profileData = {
            firstName,
            lastName,
            company,
            businessType,
            timezone,
            position
        };
        console.log(profileData); // Output form data to console
    };

    // Get today's date
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <>
            {/* Welcome message outside the profile container */}
            <header className="welcome-header">
                <h1>Welcome, Business Owner</h1>
                <p>{formattedDate}</p>
            </header>

            {/* Profile form inside the box */}
            <div className="profile-container">
                {/* Colored rectangle bar */}
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
                        <button className="edit-button">Edit</button>
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

