"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the Message interface
export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Define the context type
interface ChatContextType {
  messages: Message[];
  addMessage: (message: Message) => void;
  clearMessages: () => void;
}

// Create the context with default values
const ChatContext = createContext<ChatContextType>({
  messages: [],
  addMessage: () => {},
  clearMessages: () => {},
});

// Create a provider component
export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);

  // Load messages from localStorage when the component mounts
  useEffect(() => {
    const storedMessages = localStorage.getItem('chatMessages');
    if (storedMessages) {
      try {
        setMessages(JSON.parse(storedMessages));
      } catch (error) {
        console.error('Failed to parse stored messages:', error);
      }
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  // Function to add a new message
  const addMessage = (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  // Function to clear all messages
  const clearMessages = () => {
    setMessages([]);
    localStorage.removeItem('chatMessages');
  };

  return (
    <ChatContext.Provider value={{ messages, addMessage, clearMessages }}>
      {children}
    </ChatContext.Provider>
  );
}

// Custom hook to use the chat context
export function useChat() {
  return useContext(ChatContext);
}