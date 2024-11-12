import React from 'react';

interface AiAssistantMessageProps {
  message: string;
  isUserMessage?: boolean;
}

const AiAssistantMessage: React.FC<AiAssistantMessageProps> = ({ message, isUserMessage }) => {
  return (
    <div className={`p-2 my-2 rounded-md ${isUserMessage ? 'bg-blue-100 text-blue-800 self-end' : 'bg-gray-100 text-gray-800 self-start'}`}>
      <p>{message}</p>
    </div>
  );
};

export default AiAssistantMessage;
