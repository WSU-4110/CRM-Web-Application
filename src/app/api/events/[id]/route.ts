import { NextResponse } from "next/server"
import { db } from "@/firebaseConfig"
import { doc, getDoc } from "firebase/firestore"
import { useAuth } from "@/app/contexts/AuthContext"
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

  const userDoc = await getDoc(doc(db, "events", userId))
  
  if (!userDoc.exists()) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 })
  }

  const event = userDoc.data().events.find(
    (event: any) => event.id === params.id
  )

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 })
  }

  return NextResponse.json(event)
}