'use client';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardFooter } from "@/components/ui/card";
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";

const ChatbotPage = () => {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [openChatbot, setOpenChatbot] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    const userMessage = message;

    // Store the user's question in the chat
    setChat((prevChat) => [
      ...prevChat,
      { message: userMessage, sender: 'user', date: new Date().toLocaleString() }
    ]);
    setMessage('');
    setLoading(true);

    try {
      // Call the API route
      const response = await fetch('/api/AI-Assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await response.json();

      // Store the bot's response in the chat
      setChat((prevChat) => [
        ...prevChat,
        { message: data.reply, sender: 'bot', date: new Date().toLocaleString() }
      ]);
      setLoading(false);
    } catch (error) {
      console.error('Error sending message:', error);
      setError('An error occurred while fetching the chatbot response.');
      setLoading(false);
    }
  };

  const formattedDate = new Date().toLocaleDateString(); // Get current date for header

  return (
    <>
      <header className="welcome-header p-6 bg-white text-black text-center">
        <h1 className="text-3xl font-bold">Welcome to the AI Chatbot!</h1>
        <p className="text-lg">{formattedDate}</p>

        {/* Displaying the message history */}
        <div className="message-history mt-4">
          <Card className="cursor-pointer" onClick={() => setShowHistory(!showHistory)}>
            <div className="p-4">
              <h3 className="text-xl text-gray-600 font-semibold">History of Asked Questions:</h3>
              {showHistory && (
                <ul className="message-list list-disc pl-6 mt-4">
                  {chat.filter(msg => msg.sender === 'user').map((msg, index) => (
                    <li key={index} className="text-sm text-gray-500">
                      {msg.message} <span className="text-xs text-gray-400">({msg.date})</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Card>
        </div>
      </header>

      <div className="profile-container max-w-4xl mx-auto p-6 h-screen">
        <div className="profile-header-bar bg-black-800 h-2 mb-6"></div>

        <div className="profile-container-content bg-black shadow-md rounded-lg p-6 flex flex-col h-full">
          <div className="profile-header flex items-center mb-6">
            <img
              className="profile-picture rounded-full h-16 w-16 object-cover mr-6"
              src="https://via.placeholder.com/150"
              alt="Profile"
            />
            <div className="profile-info">
              <h2 className="text-2xl font-semibold text-white">Client Name</h2>
              <p className="text-lg text-gray-400">client@gmail.com</p>
            </div>
          </div>

          <form onSubmit={sendMessage} className="profile-form">
            <div className="form-grid grid grid-cols-1 gap-4 mb-6">
              <div className="input-group">
                <label className="text-white">Ask the AI:</label>
                <Input
                  type="text"
                  value={message}
                  placeholder="Type your question here..."
                  onChange={(e) => setMessage(e.target.value)}
                  className="p-2 border border-gray-600 rounded-md w-full bg-gray-800 text-white placeholder-gray-500"
                />
              </div>
              <div className="input-group flex justify-end">
                <Button type="submit" className="submit-button px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500">
                  Send
                </Button>
              </div>
            </div>
          </form>

          {loading ? (
            <div className="flex justify-center my-4">
              <Loader2 className="animate-spin text-gray-500" />
            </div>
          ) : error ? (
            <Alert>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <div className="chat-history mt-6 flex-1 overflow-y-auto">
              <div className="border-t pt-4 border-gray-700">
                {chat.map((msg, index) => (
                  <div key={index} className={msg.sender === 'user' ? 'text-right' : 'text-left'}>
                    <p className={`text-sm ${msg.sender === 'user' ? 'font-bold text-gray-400' : 'font-normal text-white'}`}>
                      {msg.message}
                    </p>
                    <span className="text-xs text-gray-400">{msg.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chatbot iframe toggle */}
          <CardFooter className="text-center mt-4">
            <Button
              onClick={() => setOpenChatbot(!openChatbot)}
              className="bg-gray-600 text-white hover:bg-gray-500 rounded-md"
            >
              {openChatbot ? 'Close Chatbot' : 'Full chatbot'}
            </Button>
          </CardFooter>
        </div>
      </div>

      {/* Conditional Chatbot iframe */}
      {openChatbot && (
        <div
          className="chatbot-container fixed top-0 left-0 w-full h-full z-50 bg-black bg-opacity-90"
        >
          <iframe
            src="https://chat.vercel.ai"
            className="w-full h-full border-none"
            title="Chatbot"
          ></iframe>
          <button
            onClick={() => setOpenChatbot(false)}
            className="absolute top-5 left-1/2 transform -translate-x-1/2 bg-red-600 text-white rounded-full p-2 text-lg hover:bg-red-700 focus:outline-none"
          >
            X
          </button>
        </div>
      )}
    </>
  );
};

export default ChatbotPage;
