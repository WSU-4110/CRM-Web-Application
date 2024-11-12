// pages/api/chatbot.ts
import { NextResponse } from 'next/server';
import { db } from '@/firebaseConfig'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Save the user's message to Firestore
    const messagesRef = collection(db, 'chatMessages');
    await addDoc(messagesRef, {
      message: message,
      timestamp: serverTimestamp(),
    });

    // Simulate a chatbot response
    const botResponse = 'This is a mock response from the chatbot';

    // Optionally, store the bot's response as well
    await addDoc(messagesRef, {
      message: botResponse,
      timestamp: serverTimestamp(),
    });

    // Return the bot's response as the API response
    return NextResponse.json({ reply: botResponse }, { status: 200 });
  } catch (error) {
    console.error('Error processing the chatbot message:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
