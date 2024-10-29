import { NextResponse } from "next/server"
import { db } from "@/firebaseConfig"
import { 
  collection, 
  doc, 
  getDoc, 
  updateDoc, 
  arrayUnion, 
  setDoc
} from "firebase/firestore"
import { useAuth } from "@/app/contexts/AuthContext"

export async function GET(request) {
  
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
  const userDoc = await getDoc(doc(db, "events", userId))
  
  if (!userDoc.exists()) {
    return NextResponse.json({ events: [] })
  }

  return NextResponse.json({ events: userDoc.data().events || [] })
}

export async function POST(request: Request) {
  
  const data = await request.json()
  const eventId = crypto.randomUUID()
  
  const eventData = {
    id: eventId,
    ...data,
    userId: data.userId,
    createdAt: new Date().toISOString()
  }

  const userEventsRef = doc(db, "events",data.userId)
  const userDoc = await getDoc(userEventsRef)

  if (!userDoc.exists()) {
    await setDoc(userEventsRef, {
      userId: data.userId,
      events: [eventData],
      eventId
    })
  } else {
    await updateDoc(userEventsRef, {
      events: arrayUnion(eventData),
      eventId
    })
  }

  return NextResponse.json({ success: true, eventId })
}
