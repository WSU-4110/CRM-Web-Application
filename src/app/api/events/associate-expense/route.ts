import { NextResponse } from "next/server"
import { db } from "@/firebaseConfig"
import { doc, getDoc, updateDoc } from "firebase/firestore"

export async function POST(request: Request) {
  const { userId, eventId, expense } = await request.json()

  try {
    const userEventsRef = doc(db, "events", userId)
    const userDoc = await getDoc(userEventsRef)

    if (!userDoc.exists()) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    const events = userDoc.data().events
    const eventIndex = events.findIndex((e) => e.id === eventId)

    if (eventIndex === -1) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    // Add expense to event's expenses array
    if (!events[eventIndex].expenses) {
      events[eventIndex].expenses = []
    }
    events[eventIndex].expenses.push(expense)

    await updateDoc(userEventsRef, { events })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error associating expense:", error)
    return NextResponse.json({ error: "Failed to associate expense" }, { status: 500 })
  }
} 