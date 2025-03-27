'use client'

import React, { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

export default function ChatWindow() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ 
    role: string; 
    content: string; 
    id: string;
  }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const { sendChat } = require("@/lib/chat");

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { 
      role: "user", 
      content: input, 
      id: `user-${Date.now()}`
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const reply = await sendChat(input);
      setMessages((prev) => [...prev, { 
        role: "assistant", 
        content: reply, 
        id: `assistant-${Date.now()}`
      }]);
    } catch (error) {
      console.error("Failed to send message", error);
      setMessages((prev) => [...prev, { 
        role: "assistant", 
        content: "Sorry, something went wrong.", 
        id: `error-${Date.now()}`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Automatically scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle Enter key for sending messages
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[600px] max-w-3xl mx-auto border rounded-lg shadow-lg">
      {/* Chat Header */}
      <div className="bg-gray-100 p-4 border-b rounded-t-lg">
        <h2 className="text-lg font-semibold text-gray-800">Chat Assistant</h2>
      </div>

      {/* Scrollable Message Area */}
      <ScrollArea 
        ref={scrollAreaRef} 
        className="flex-1 p-4 overflow-y-auto bg-transparent"
      >
        <div className="space-y-4">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={cn(
                "flex w-full",
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div 
                className={cn(
                  "max-w-[80%] px-4 py-2 rounded-lg shadow-sm",
                  msg.role === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-800'
                )}
              >
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-200 px-4 py-2 rounded-lg flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin text-gray-500" />
                <span className="text-gray-600">Typing...</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Message Input Area */}
      <div className="p-4 border-t bg-white rounded-b-lg">
        <div className="flex space-x-2">
          <input 
            className="flex-1 border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <button 
            onClick={handleSend} 
            disabled={!input.trim() || isLoading}
            className={cn(
              "bg-blue-500 text-white p-2 rounded-md transition-colors",
              (!input.trim() || isLoading) 
                ? "opacity-50 cursor-not-allowed" 
                : "hover:bg-blue-600 active:bg-blue-700"
            )}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}