import { NextApiRequest, NextApiResponse } from 'next'; // necessary libraries
import admin from '../../lib/firebaseAdmin'; // admin config
export default async function authhandler(req: NextApiRequest, res: NextApiResponse) { // function declaration with type annotations
  if (req.method === 'POST') { // checks HTTP method
    const { usertoken, userdoc } = req.body; // token and document to be used
    try {
      const realtoken = await admin.auth().verifyIdToken(usertoken); // decrypted token declaration
      const userid = realtoken.uid; // Get user ID from the decoded token using unique identifier
      const docRef = await admin.firestore().collection('users').add({ // creates document in users collection
        id: userid, // user id
        ...userdoc, // document to be used
        creationdate: admin.firestore.FieldValue.serverTimestamp(), // creates a creation date field and stores the time
      });
      const createdUserDoc = await docRef.get(); // gets actual data
      return res.status(201).json({ message: 'Congratulations! A user document has been successfully created', document: createdUserDoc.data() }); // success message through JSON
    } catch (error) { // error portion of try block
      return res.status(401).json({ message: 'Unverified call has been made', error: error.message });} // if verification fails
  } else { // if HTTP check fails
    res.setHeader('Allow', ['POST']); // designates that only POST requests are allowed
    return res.status(405).end(`The designated method ${req.method} cannot be used.`);}} // message that showcases that the method is not allowed
