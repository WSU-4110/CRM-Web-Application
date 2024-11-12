import { NextResponse } from "next/server"
import { db } from "@/firebaseConfig"
import { doc, getDoc, updateDoc } from "firebase/firestore"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  
  const userDoc = await getDoc(doc(db, "events", userId))
  if (!userDoc.exists()) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 })
  }

  const event = userDoc.data().events.find((e: any) => e.id === params.id)
  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 })
  }

  return NextResponse.json(event)
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const data = await request.json()
  const { userId, ...updateData } = data

  const userDoc = await getDoc(doc(db, "events", userId))
  if (!userDoc.exists()) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 })
  }

  const events = userDoc.data().events
  const eventIndex = events.findIndex((e: any) => e.id === params.id)
  
  if (eventIndex === -1) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 })
  }

  events[eventIndex] = { ...events[eventIndex], ...updateData }

  await updateDoc(doc(db, "events", userId), { events })

  return NextResponse.json(events[eventIndex])
}