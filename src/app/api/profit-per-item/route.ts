import { NextResponse } from "next/server";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/firebaseConfig";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const userDocRef = doc(db, "profits", userId);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      return NextResponse.json({ items: docSnap.data().items || [] });
    } else {
      return NextResponse.json({ items: [] }, { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching profits:", error);
    return NextResponse.json({ error: "Failed to fetch profits" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId, item } = await request.json(); // Update to match frontend

    // Validate userId
    if (!userId || typeof userId !== "string") {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Validate item fields
    if (
      !item ||
      typeof item.id !== "string" ||
      typeof item.type !== "string" ||
      typeof item.itemName !== "string" ||
      typeof item.unitsSold !== "number" ||
      typeof item.revenue !== "number" ||
      typeof item.cost !== "number"
    ) {
      return NextResponse.json({ error: "Invalid item data" }, { status: 400 });
    }

    const docRef = doc(db, "profits", userId);

    // Add item to the profits array
    await updateDoc(docRef, {
      items: arrayUnion(item),
    }).catch(async (error) => {
      if (error.code === "not-found") {
        // If the document does not exist, create it
        await setDoc(docRef, { userId, items: [item] });
      } else {
        throw error;
      }
    });

    return NextResponse.json({ message: "Item added successfully" });
  } catch (error) {
    console.error("Error updating profits:", error);
    return NextResponse.json({ error: "Failed to update profits" }, { status: 500 });
  }
}



export async function PUT(request: Request) {
  const { userId, item } = await request.json();

  if (!userId || !item || !item.id) {
    return NextResponse.json({ error: "User ID and complete item data are required" }, { status: 400 });
  }

  try {
    const docRef = doc(db, "profits", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const items = docSnap.data().items || [];
      const itemIndex = items.findIndex((i: any) => i.id === item.id);

      if (itemIndex === -1) {
        return NextResponse.json({ error: "Item not found" }, { status: 404 });
      }

      // Update the specific item in the array
      items[itemIndex] = { ...items[itemIndex], ...item };

      await updateDoc(docRef, {
        items,
      });

      return NextResponse.json({ message: "Item updated successfully" });
    } else {
      return NextResponse.json({ error: "No profits data found for this user" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error updating item:", error);
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}
