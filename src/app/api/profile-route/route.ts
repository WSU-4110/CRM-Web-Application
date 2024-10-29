import { db } from "@/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId, profileData } = await req.json();
    const docRef = doc(db, "profiles", userId);
    await setDoc(docRef, profileData); // This creates the document if it doesn't exist in Firebase
    return NextResponse.json({ message: "Profile created or updated successfully" });
  } 
  catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
