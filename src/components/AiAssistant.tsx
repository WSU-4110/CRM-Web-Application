import { useState } from 'react';
import { Button } from "@/components/ui/button"; // Assuming ShadCN UI Button
import { Input } from "@/components/ui/input"; // Assuming ShadCN UI Input
import { Card, CardHeader, CardFooter } from "@/components/ui/card"; // Assuming ShadCN UI Card
import { useRouter } from 'next/navigation';

const ChatbotPage = () => {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [openChatbot, setOpenChatbot] = useState(false); // State to control visibility of chatbot iframe

  const sendMessage = async (e) => {
    e.preventDefault();

    const userMessage = message;
    setChat([...chat, { message: userMessage, sender: 'user' }]);
    setMessage(''); // Clear the input field

    try {
      // Call the API route
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await response.json();

      // Add the chatbot's response to the chat
      setChat((prevChat) => [...prevChat, { message: data.reply, sender: 'bot' }]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4">
      <Card className="shadow-lg rounded-lg">
        <CardHeader>
          <h1 className="text-2xl font-semibold text-center">AI Chatbot</h1>
        </CardHeader>
        <CardFooter className="flex items-center space-x-2">
          <Input
            className="flex-grow"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask me something..."
          />
          <Button onClick={sendMessage} className="ml-2">Send</Button>
        </CardFooter>
      </Card>

      {/* Button to toggle the chatbot iframe visibility */}
      <div className="mt-4 text-center">
        <Button onClick={() => setOpenChatbot(!openChatbot)} className="bg-blue-500 text-white hover:bg-blue-600">
          {openChatbot ? 'Close Chatbot' : 'Open Chatbot'}
        </Button>
      </div>

      {/* Conditionally render the chatbot iframe */}
      {openChatbot && (
        <div
          className="chatbot-container fixed top-0 left-0 w-full h-full z-50 bg-white"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.9)", // Optional: Add a semi-transparent background
          }}
        >
          <iframe
            src="https://chat.vercel.ai"
            className="w-full h-full border-none"
            title="Chatbot"
          ></iframe>
          <button
            onClick={() => setOpenChatbot(false)}
            className="absolute top-5 right-5 bg-red-600 text-white rounded-full p-2 text-lg hover:bg-red-700 focus:outline-none"
          >
            X
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatbotPage;
