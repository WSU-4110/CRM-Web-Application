'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Menu, Send, Plus, MessageSquare, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} 
from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
const ChatInterface = () => {
  const [chats, setChats] = useState([
    // changed to compliment cohere api
    {
      id: 1,
      name: 'Chat 1',
      messages: [{ role: 'assistant', content: 'Welcome! How can I assist you?' }],
    },
  ]);

  const [currentChatId, setCurrentChatId] = useState(1);

  const [inputValue, setInputValue] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const currentChat = chats.find((chat) => chat.id === currentChatId);

  const messagesEndRef = useRef(null);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
  
    const userMessage = { role: 'user', content: inputValue };

    const updatedChats = chats.map(chat =>

      chat.id === currentChatId
        ? { ...chat, messages: [...chat.messages, userMessage] }
        : chat
    );
    setChats(updatedChats);

    setInputValue('');

    setIsLoading(true);

    setError(null);

    try {
      // Send message to Cohere API
      const response = await fetch('https://api.cohere.ai/v1/generate', {
        method: 'POST',
        headers: {
          // API key
          'Authorization': `Bearer NTJyHPnHYWH3XuLyKoVhpCpCTeu2cfD79UcCxUQt`,
          // used for sending json
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({

          model: 'command-xlarge-nightly', // do not change model no matter what

          prompt: currentChat.messages.concat(userMessage).map(msg => msg.content).join('\n'),
          max_tokens: 100, 

          temperature: 0.7, // spotaneous regulation

          stop_sequences: ['\n'], // if new line feed detected then stop
        
        }
      ),
      }
    );
  
      if (!response.ok) {
        throw new Error('Error, could not generate response');
      }
  
      const data = await response.json();

      const assistantMessage = { role: 'assistant', content: data.generations[0].text };

      setChats(prev =>

        prev.map(chat =>

          chat.id === currentChatId

            ? { ...chat, messages: [...chat.messages, assistantMessage] }
            : chat
        )
      );
    } 
    catch (err) {
      setError('Error connecting to Cohere API: ' + err.message);

      console.error('Error:', err);
    } 
    finally {
      setIsLoading(false);
    }
  };  
  const createNewChat = () => {

    const newChatId = chats.length + 1;

    setChats([...chats, { id: newChatId, name: `Chat ${newChatId}`, messages: [] }]);

    setCurrentChatId(newChatId);
  };
  const clearChats = () => {

    setChats([]);

    setCurrentChatId(null);

  };
  const Message = ({ message }) => (

    <div
      className={`flex gap-3 ${
        message.role === 'assistant' ? 'items-start' : 'items-start justify-end'
      }
      `
    }
    >
      {message.role === 'assistant' && (
        <Avatar>
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
      )
      }
      <Card
        className={`p-4 max-w-[80%] ${
          message.role === 'user' ? 'bg-primary text-primary-foreground' : ''
        }
        `
      }
      >
        {message.content}
      </Card>
      {message.role === 'user' && (
        <Avatar>
          <AvatarFallback>ME</AvatarFallback>
        </Avatar>
      )
      }
    </div>
  );
  const Sidebar = () => (
    <div className="w-full h-full flex flex-col">
      <Button variant="ghost" className="flex items-center gap-2 w-full mb-4" onClick={createNewChat}>
        <Plus size={16} /> New Chat!
      </Button>
      <div className="flex-grow overflow-y-auto">
        <div className="space-y-2">
          {chats.map((chat) => (
            <Button
              key={chat.id}
              variant={chat.id === currentChatId ? 'solid' : 'ghost'} // error i cant figure out but works fine
              className="flex items-center gap-2 w-full text-left"
              onClick={() => setCurrentChatId(chat.id)}
            >
              <MessageSquare size={16} />
              <span className="truncate">{chat.name}</span>
            </Button>
          )
          )
          }
        </div>
      </div>
      <div className="pt-4 mt-auto border-t">
        <Button variant="ghost" className="flex items-center gap-2 w-full" onClick={clearChats}>
          <Trash2 size={16} /> Clear Chats!
        </Button>
      </div>
    </div>
  );
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' 
    }

    )
    ;
  }, [currentChat?.messages]);
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar for larger screens, can be modified if needed lmk */}
      <div className="hidden md:flex w-64 border-r p-4 flex-col">
        <Sidebar />
      </div>

      {/* Mobile menu if accessed through mobile device for mobile friendliness */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <div className="mt-4 h-full">
            <Sidebar />
          </div>
        </SheetContent>
      </Sheet>
      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Header area */}
        <div className="h-14 border-b flex items-center px-4">
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
          <h1 className="ml-4 font-semibold">{currentChat?.name || 'No Chat Selected'}</h1>
        </div>
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-3xl mx-auto space-y-6">
            {currentChat?.messages.map((message, i) => (
              <Message key={i} message={message} />
            )
            )
            }
            {isLoading && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                AI is developing response, please be patient...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
        {/* Error handling */}
        {error && (
          <Alert variant="destructive" className="mx-4 mb-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )
        }

        {/* Input area */}
        <div className="p-4 border-t">
          <div className="max-w-3xl mx-auto flex flex-col gap-4">
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }
            }
              placeholder="Type your message here..."
              className="min-h-[80px]"
              disabled={isLoading || !currentChat}
            />
            <div className="flex justify-end">
              <Button
                onClick={sendMessage}
                disabled={isLoading || !inputValue.trim() || !currentChat}
                className="w-24"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Send <Send className="ml-2 h-4 w-4" />
                  </>
                )
                }
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ChatInterface;
