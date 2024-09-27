import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore'; // Firestore libraries
import { getAuth, signInWithCustomToken } from 'firebase/auth'; // Firebase Authentication library
import { NextResponse } from 'next/server'; // NextResponse for Next.js API routes
const database = getFirestore(); // Initialize Firestore
const authentication = getAuth(); // Initialize Firebase Authentication
export async function POST(req: Request) { // Handler function for POST request
  try {
    const { usertoken, userdoc } = await req.json(); // Parse JSON body from request
    // Authenticate user with the custom token
    await signInWithCustomToken(authentication, usertoken); 
    const user = authentication.currentUser; // Retrieve authenticated user
    if (!user) { // Check if the user is authenticated
      return NextResponse.json({ message: 'User authentication failed. No user is currently signed in.' }, { status: 401 });}
    const userid = user.uid; // Get user ID from the authenticated user
    // Add a document to the 'users' collection
    const docRef = await addDoc(collection(database, 'users'), {
      id: userid,
      ...userdoc, // Spread the userdoc object into the document
      creationdate: serverTimestamp(), // Timestamp for document creation
    });
    const createdUserDoc = { id: docRef.id, ...userdoc }; // Prepare created document data
    return NextResponse.json({ 
      message: 'Congratulations! A user document has been successfully created', 
      document: createdUserDoc },
      { status: 201 }); // Return success response with status 201
  } catch (error) {
    return NextResponse.json({ 
      message: 'Unverified call has been made', 
      error: error.message },
      { status: 401 });}} // Error response with status 401
// Export GET handler as an empty response to maintain similarity to route.ts structure
export async function GET() {
  return NextResponse.json({ message: 'GET method is not supported for this route.' }, { status: 405 });}
