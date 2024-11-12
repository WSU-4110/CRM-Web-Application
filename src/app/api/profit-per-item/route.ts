// app/api/profits/route.ts
import { NextResponse } from 'next/server';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig'; // Import the Firestore instance

export async function POST(request: Request) {
  try {
    // Get data from the request body
    const data = await request.json();

    // Reference to the 'profits' collection
    const profitsCollection = collection(db, "profits");

    // Create a document with a new ID in the 'profits' collection
    const docRef = await addDoc(profitsCollection, {
      type: data.type,
      itemName: data.itemName,
      unitsSold: data.unitsSold,
      revenue: data.revenue,
      cost: data.cost,
      profit: data.profit,
      profitPerItem: data.profitPerItem,
    });

    return NextResponse.json({ message: 'Profit item added successfully', id: docRef.id });
  } catch (error) {
    return NextResponse.json({ message: 'Error adding profit item', error: error.message }, { status: 500 });
  }
}
