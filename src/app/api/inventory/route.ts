import { NextResponse } from 'next/server';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/firebaseConfig';

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
  const formData = await request.formData();
  const userId = formData.get('userId');
  const imageFile = formData.get('image');
  const itemData = JSON.parse(formData.get('itemData'));

  if (!userId || !itemData) {
    return NextResponse.json({ error: 'User ID and item data are required' }, { status: 400 });
  }

  try {
    let imageUrl = null;
    if (imageFile) {
      const imageRef = ref(storage, `inventory/${userId}/${Date.now()}-${imageFile.name}`);
      await uploadBytes(imageRef, imageFile);
      imageUrl = await getDownloadURL(imageRef);
    }

    const docRef = doc(db, 'inventory', userId);
    const docSnap = await getDoc(docRef);

    const itemWithImage = {
      ...itemData,
      id: Date.now().toString(),
      image: imageUrl
    };

    if (docSnap.exists()) {
      await updateDoc(docRef, {
        inventory: arrayUnion(itemWithImage)
      });
    } else {
      await setDoc(docRef, {
        userId,
        inventory: [itemWithImage]
      });
    }

    return NextResponse.json({ message: 'Item added successfully' });
  } catch (error) {
    console.error('Error adding item:', error);
    return NextResponse.json({ error: 'Failed to add item' }, { status: 500 });
  }
}

export async function PUT(request) {
  const formData = await request.formData();
  const userId = formData.get('userId');
  const imageFile = formData.get('image');
  const itemData = JSON.parse(formData.get('itemData'));

  if (!userId || !itemData || !itemData.id) {
    return NextResponse.json({ error: 'User ID, item data, and item ID are required' }, { status: 400 });
  }

  try {
    let imageUrl = itemData.image; // Keep existing image if no new one is uploaded
    if (imageFile instanceof File) {
      const imageRef = ref(storage, `inventory/${userId}/${Date.now()}-${imageFile.name}`);
      await uploadBytes(imageRef, imageFile);
      imageUrl = await getDownloadURL(imageRef);
    }

    const docRef = doc(db, 'inventory', userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const inventory = docSnap.data().inventory;
      const updatedInventory = inventory.map(i => 
        i.id === itemData.id ? { ...itemData, image: imageUrl } : i
      );

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