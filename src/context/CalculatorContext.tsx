"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the Answer interface
export interface Answer {
  questionId: string;
  value: string | number;
  emissions: number;
}

// Define the context type
interface CalculatorContextType {
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (index: number) => void;
  answers: Answer[];
  setAnswers: (answers: Answer[]) => void;
  showResults: boolean;
  setShowResults: (show: boolean) => void;
  inputValue: string;
  setInputValue: (value: string) => void;
}

// Create the context with default values
const CalculatorContext = createContext<CalculatorContextType>({
  currentQuestionIndex: 0,
  setCurrentQuestionIndex: () => {},
  answers: [],
  setAnswers: () => {},
  showResults: false,
  setShowResults: () => {},
  inputValue: '',
  setInputValue: () => {},
});

// Create a provider component
export function CalculatorProvider({ children }: { children: ReactNode }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');

  // Load calculator state from localStorage when the component mounts
  useEffect(() => {
    const storedState = localStorage.getItem('calculatorState');
    if (storedState) {
      try {
        const { currentQuestionIndex, answers, showResults, inputValue } = JSON.parse(storedState);
        setCurrentQuestionIndex(currentQuestionIndex);
        setAnswers(answers);
        setShowResults(showResults);
        setInputValue(inputValue);
      } catch (error) {
        console.error('Failed to parse stored calculator state:', error);
      }
    }
  }, []);

  // Save calculator state to localStorage whenever it changes
  useEffect(() => {
    const state = {
      currentQuestionIndex,
      answers,
      showResults,
      inputValue,
    };
    localStorage.setItem('calculatorState', JSON.stringify(state));
  }, [currentQuestionIndex, answers, showResults, inputValue]);

  return (
    <CalculatorContext.Provider 
      value={{ 
        currentQuestionIndex, 
        setCurrentQuestionIndex, 
        answers, 
        setAnswers, 
        showResults, 
        setShowResults,
        inputValue,
        setInputValue
      }}
    >
      {children}
    </CalculatorContext.Provider>
  );
}

// Custom hook to use the calculator context
export function useCalculator() {
  return useContext(CalculatorContext);
}