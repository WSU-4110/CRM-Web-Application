import { NextResponse } from 'next/server';
import { db } from '@/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Save the user's message to Firestore if chosen
    const messagesRef = collection(db, 'chatMessages');
    await addDoc(messagesRef, {
      message: message,
      timestamp: serverTimestamp(),
    }
  );
    // Call Vercel's Chatbot for AI-generated responses from SDK
    const chatbotResponse = await fetch('https://vercel-chatbot-api-url.com/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    }
  );

    if (!chatbotResponse.ok) {
      console.error('Chatbot API error:', await chatbotResponse.text());
      return NextResponse.json({ error: 'Failed to get response from Chatbot' }, { status: 500 });
    }

    const { reply } = await chatbotResponse.json();

    // Optionally, store the bot's response in Firestore, not currently being used
    await addDoc(messagesRef, {
      message: reply,
      timestamp: serverTimestamp(),
    }
  );

    // Return the bot's response to the page
    return NextResponse.json({ reply }, { status: 200 });
  } catch (error) {
    console.error('Error processing the chatbot message:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
