import { useState } from 'react';
import { Button } from "@/components/ui/button"; 
// loads vercel page as default if loading fails
const ChatbotPage = () => {
  return (
    <div className="w-full h-full">
      <iframe
        src="https://chat.vercel.ai"
        className="w-full h-screen border-none"
        title="Chatbot"
      ></iframe>
    </div>
  );
};

export default ChatbotPage;
