"use client";

import React, { useState, useRef, useEffect, FormEvent } from 'react';
import { FaPaperPlane, FaRobot, FaUser } from 'react-icons/fa';
import { useChat, Message } from '@/context/ChatContext';

export default function ChatbotPage() {
  const { messages, addMessage } = useChat();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e?: FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: trimmedInput,
    };

    addMessage(userMessage);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Call the API route
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: trimmedInput,
          history: messages,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get a response');
      }

      const data = await response.json();
      
      const botMessage: Message = {
        role: 'assistant',
        content: data.reply,
      };
      
      addMessage(botMessage);
    } catch (err: any) {
      console.error('Error sending message:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-4 border-b dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">EcoBuddy Assistant</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Ask me about sustainability!</p>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.role === 'assistant' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">
                <FaRobot />
              </div>
            )}
            <div
              className={`max-w-[75%] p-3 rounded-lg shadow ${
                msg.role === 'user'
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 rounded-bl-none'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
             {msg.role === 'user' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                <FaUser />
              </div>
            )}
          </div>
        ))}
        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-start gap-3">
             <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white animate-pulse">
                <FaRobot />
              </div>
            <div className="p-3 rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 rounded-bl-none animate-pulse">
              Thinking...
            </div>
          </div>
        )}
        {/* Error Message */}
        {error && (
           <div className="flex justify-start gap-3">
             <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white">
                <FaRobot />
              </div>
            <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-200 rounded-bl-none">
              {error}
            </div>
          </div>
        )}
        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-500 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:text-white"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-2 rounded-full bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-700"
          >
            <FaPaperPlane className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}