import { db } from "@/firebaseConfig";
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    
    if (!userId) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    
    try {
        const userDocRef = doc(db, "calendar", userId);
        const docSnap = await getDoc(userDocRef);
    
        if (docSnap.exists()) {
            return NextResponse.json( { events: docSnap.data().calendar || [] });
        } else {
            return NextResponse.json({ error: "No Event found" }, { status: 404 });
        }
    } catch (error) {
        console.error("Error getting events:", error);
        return NextResponse.json({ error: "Failed to get events" }, { status: 500 });
    }
}

export async function POST(request) {
    const { userId, calendar } = await request.json();

    if (!userId || !calendar) {
        return NextResponse.json({ error: "User ID and Event data are required" }, { status: 400 });
    }

    try {
        const docRef = doc(db, "calendar", userId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            await setDoc(docRef, {
                userId,
                calendar: [calendar],
            });
        } else {
        await updateDoc(docRef, {
            calendar: arrayUnion(calendar),
        });
        }

        return NextResponse.json({ message: "Event added successfully" });
    } catch (error) {
        console.error("Error adding Event:", error);
        return NextResponse.json({ error: "Failed to add Event" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    const { userId, calendar } = await request.json();

    if (!userId || !calendar) {
        return NextResponse.json({ error: "User ID and Event data are required" }, { status: 400 });
    }

    try {
        const docRef = doc(db, "calendar", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const events = docSnap.data().calendar;
            const eventIndex = events.findIndex((event) => event.id === calendar.id);
            events[eventIndex] = { ...calendar };

            await updateDoc(docRef, {
                calendar,
            });
        } else {
            return NextResponse.json({ error: "Event not found" }, { status: 404 });

        };

        return NextResponse.json({ message: "Event updated successfully" });
    } catch (error) {
        console.error("Error updating Event:", error);
        return NextResponse.json({ error: "Failed to update Event" }, { status: 500 });
    }
}
