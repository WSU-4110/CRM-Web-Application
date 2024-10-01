
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {  doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';


const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  businessName: z.string().min(1, "Business name is required"),
  email: z.string().email("Invalid email address"),
  uid: z.string().min(1, "User ID is required"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

   
    const result = profileSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid request body', details: result.error.issues }, { status: 400 });
    }

    const { firstName, lastName, businessName, email, uid } = result.data;

    // Update the user's profile in Firestore
    const userDocRef = doc(db, 'users', uid);
    await updateDoc(userDocRef, {
      firstName,
      lastName,
      businessName,
      email
    });

    return NextResponse.json({ message: 'Profile updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}