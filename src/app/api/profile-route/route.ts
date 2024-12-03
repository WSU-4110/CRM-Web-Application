import { db } from "@/firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    console.log(userId)

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" });
    }
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if(!docSnap.exists()) {
      return NextResponse.json({ error: "User not found" });
    }

    return NextResponse.json(docSnap.data(), { status: 200 });
    } 
    
    catch (error) {
        console.error("Error fetching user profile:", error);
        return NextResponse.json({ error: "Failed to fetch user profile" }, { status: 500 });
    }
}



export async function POST(req: Request) {
  try {
    const { user, profileData } = await req.json();
    let userId = user.uid
    console.log(userId)
    if ( !userId || !profileData ) {
      return NextResponse.json({ error:"Missing userId or profileData"});
    }
    const docRef = doc(db, "users", userId);
    await setDoc(docRef, profileData, { merge: true }); 
    return NextResponse.json({ message: "Profile updated successfully" });
  } 
  
  catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}

