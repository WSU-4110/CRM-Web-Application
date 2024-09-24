import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore'; // necessary libraries
import { getAuth, signInWithCustomToken } from 'firebase/auth'; // necessary authentication library for signin
import { NextApiRequest, NextApiResponse } from 'next'; // type annotations
const database = getFirestore(); // Initialize Firestore
const authentication = getAuth(); // Initialize Firebase Authentication
export default async function authhandler(req: NextApiRequest, res: NextApiResponse) { // function declaration with type annotations
  if (req.method === 'POST') { // checks HTTP method
    const { usertoken, userdoc } = req.body; // token and document to be used
    try { // Sign in with the custom token to authenticate the user
      await signInWithCustomToken(authentication, usertoken); // authenticate user with the token
      // Check if the user is signed in successfully
      const user = authentication.currentUser;
      if (!user) {
        return res.status(401).json({ message: 'User authentication failed. No user is currently signed in.' }); }
      const userid = user.uid; // Get user ID from the authenticated user
      const docRef = await addDoc(collection(database, 'users'), { // adds a document to the users collection
        id: userid, // user id
        ...userdoc, // document to be used
        creationdate: serverTimestamp(), // creates a creation date field and stores the time
      });
      const createdUserDoc = { id: docRef.id, ...userdoc }; // Prepare the created document data with ID
      return res.status(201).json({ 
        message: 'Congratulations! A user document has been successfully created', 
        document: createdUserDoc // success message through JSON
      });
    } catch (error) { // error portion of try block
      return res.status(401).json({ message: 'Unverified call has been made', error: error.message }); // if verification fails
    }
  } else { // if HTTP check fails
    res.setHeader('Allow', ['POST']); // designates that only POST requests are allowed
    return res.status(405).end(`The designated method ${req.method} cannot be used.`); // message that showcases that the method is not allowed 
  }}
