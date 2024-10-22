import { NextResponse } from 'next/server';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });}
  try {
    const userDocRef = doc(db, 'customers', userId);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      return NextResponse.json({ customers: docSnap.data().customers || [] });} else {
      return NextResponse.json({ customers: [] }, { status: 200 }); // Return an empty array in an object
    }}
     catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 }); }}
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
