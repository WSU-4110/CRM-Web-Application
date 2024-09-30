import { NextResponse } from 'next/server';
import { db } from '@/firebaseConfig'; 
import { doc, setDoc } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const { userId, email } = await request.json();

    if (!userId || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      userId,
      email,
      firstName: '',
      lastName: '',
      businessName: '',
    });

    return NextResponse.json({ message: 'User document created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error creating user document:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}