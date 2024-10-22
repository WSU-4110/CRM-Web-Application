import { NextResponse } from 'next/server';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const userDocRef = doc(db, 'customers', userId);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const customers = Array.isArray(data.customers) ? data.customers : [];
      return NextResponse.json({ customers });
    }

    return NextResponse.json({ customers: [] });

  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}
export async function POST(request) {
  const { userId, firstName,lastName, emailAddress, phoneNumber } = await request.json();
  if (!userId || !firstName ||!lastName || !emailAddress || !phoneNumber) {
    return NextResponse.json({ error: 'User ID, name, email, and phone are required' }, { status: 400 });}
  try {
    const userDocRef = doc(db, 'customers', userId);
    const docSnap = await getDoc(userDocRef);
    const newCustomer = { firstName,lastName, emailAddress, phoneNumber };

    if (docSnap.exists()) {
      await updateDoc(userDocRef, {
        customers: arrayUnion(newCustomer),
      });
    } else {
      await setDoc(userDocRef, {
        customers: [newCustomer],
      }); }
    return NextResponse.json({ message: 'Customer added successfully' });
  } catch (error) {
    console.error('Error adding customer:', error);
    return NextResponse.json({ error: 'Failed to add customer' }, { status: 500 });}}
