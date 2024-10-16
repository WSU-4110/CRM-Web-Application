import { NextResponse } from 'next/server';

import {doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '@/firebaseConfig';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const docRef = doc(db, 'inventory', userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return NextResponse.json(docSnap.data());
    } else {
      return NextResponse.json({ inventory: [] });
    }
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 });
  }
}

export async function POST(request) {
  const { userId, item } = await request.json();

  if (!userId || !item) {
    return NextResponse.json({ error: 'User ID and item data are required' }, { status: 400 });
  }

  try {
    const docRef = doc(db, 'inventory', userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await updateDoc(docRef, {
        inventory: arrayUnion({ ...item, id: Date.now().toString() })
      });
    } else {
      await setDoc(docRef, {
        userId,
        inventory: [{ ...item, id: Date.now().toString() }]
      });
    }

    return NextResponse.json({ message: 'Item added successfully' });
  } catch (error) {
    console.error('Error adding item:', error);
    return NextResponse.json({ error: 'Failed to add item' }, { status: 500 });
  }
}

export async function PUT(request) {
  const { userId, item } = await request.json();

  if (!userId || !item || !item.id) {
    return NextResponse.json({ error: 'User ID, item data, and item ID are required' }, { status: 400 });
  }

  try {
    const docRef = doc(db, 'inventory', userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const inventory = docSnap.data().inventory;
      const updatedInventory = inventory.map(i => i.id === item.id ? item : i);

      await updateDoc(docRef, { inventory: updatedInventory });
      return NextResponse.json({ message: 'Item updated successfully' });
    } else {
      return NextResponse.json({ error: 'User inventory not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error updating item:', error);
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}