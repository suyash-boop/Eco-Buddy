"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useCalculator } from "@/context/CalculatorContext";
import type { Answer } from "@/context/CalculatorContext";

type QuestionType = "singleChoice" | "number" | "slider";

interface Option {
  label: string;
  value: string | number;
  icon?: string;
}

interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: Option[];
  min?: number;
  max?: number;
  unit?: string;
  emissionFactor?: number;
  category: "transportation" | "home" | "food" | "consumption";
}

const questions: Question[] = [
  // Transportation
  {
    id: "car_usage",
    text: "How many kilometers do you drive weekly?",
    type: "number",
    unit: "km",
    emissionFactor: 0.2, // kg CO2 per km (average)
    category: "transportation",
  },
  {
    id: "car_type",
    text: "What type of car do you drive?",
    type: "singleChoice",
    options: [
      { label: "Electric Vehicle", value: "ev", icon: "⚡" },
      { label: "Hybrid", value: "hybrid", icon: "🔋" },
      { label: "Petrol/Gasoline", value: "petrol", icon: "⛽" },
      { label: "Diesel", value: "diesel", icon: "🛢️" },
      { label: "I don't drive", value: "none", icon: "🚶" },
    ],
    category: "transportation",
  },
  {
    id: "flights",
    text: "How many flights do you take per year?",
    type: "number",
    emissionFactor: 200, // kg CO2 per flight (average)
    category: "transportation",
  },

  // Home
  {
    id: "electricity",
    text: "What is your monthly electricity consumption?",
    type: "number",
    unit: "kWh",
    emissionFactor: 0.5, // kg CO2 per kWh (varies by region)
    category: "home",
  },
  {
    id: "renewable_energy",
    text: "Do you use renewable energy at home?",
    type: "singleChoice",
    options: [
      { label: "Yes, 100% renewable", value: "full", icon: "🌱" },
      { label: "Partially", value: "partial", icon: "🌿" },
      { label: "No", value: "none", icon: "🏭" },
    ],
    category: "home",
  },

  // Food
  {
    id: "diet",
    text: "What best describes your diet?",
    type: "singleChoice",
    options: [
      { label: "Vegan", value: "vegan", icon: "🥦" },
      { label: "Vegetarian", value: "vegetarian", icon: "🥗" },
      { label: "Pescatarian", value: "pescatarian", icon: "🐟" },
      { label: "Omnivore (low meat)", value: "low_meat", icon: "🥩" },
      { label: "Omnivore (high meat)", value: "high_meat", icon: "🍖" },
    ],
    category: "food",
  },
  {
    id: "food_waste",
    text: "How much food do you throw away weekly?",
    type: "singleChoice",
    options: [
      { label: "Almost none", value: "none", icon: "✅" },
      { label: "A little", value: "little", icon: "🥫" },
      { label: "Moderate amount", value: "moderate", icon: "🗑️" },
      { label: "Significant amount", value: "high", icon: "❌" },
    ],
    category: "food",
  },

  // Consumption
  {
    id: "shopping",
    text: "How often do you buy new clothes or electronics?",
    type: "singleChoice",
    options: [
      { label: "Rarely", value: "rarely", icon: "🧵" },
      { label: "Occasionally", value: "occasionally", icon: "👕" },
      { label: "Regularly", value: "regularly", icon: "🛍️" },
      { label: "Frequently", value: "frequently", icon: "💻" },
    ],
    category: "consumption",
  },
];

import { useRouter } from 'next/navigation';

export default function CarbonCalculator() {
  const router = useRouter();
  const {
    currentQuestionIndex,
    setCurrentQuestionIndex,
    answers,
    setAnswers,
    showResults,
    setShowResults,
    inputValue,
    setInputValue,
  } = useCalculator();

  // Add this safety check to ensure currentQuestionIndex is valid
  useEffect(() => {
    if (currentQuestionIndex < 0 || currentQuestionIndex >= questions.length) {
      setCurrentQuestionIndex(0);
    }
  }, [currentQuestionIndex, setCurrentQuestionIndex]);

  // Get the current question safely
  const currentQuestion = questions[currentQuestionIndex] || questions[0];

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setInputValue("");
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      const prevIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(prevIndex);
      const prevAnswer = answers.find(
        (a) => a.questionId === questions[prevIndex].id
      );
      setInputValue(prevAnswer ? String(prevAnswer.value) : "");
    }
  };

  const handleAnswer = (value: string | number) => {
    const question = questions[currentQuestionIndex];
    let emissions = 0;

    if (question.emissionFactor) {
      if (question.id === "car_type") {
        const carUsageAnswer = answers.find(
          (a) => a.questionId === "car_usage"
        );
        if (carUsageAnswer) {
          const carEmissionFactors: Record<string, number> = {
            ev: 0.05,
            hybrid: 0.08,
            petrol: 0.12,
            diesel: 0.14,
            none: 0,
          };
          emissions =
            Number(carUsageAnswer.value) *
            (carEmissionFactors[value as string] || 0);
        }
      } else if (question.id === "renewable_energy") {
        const electricityAnswer = answers.find(
          (a) => a.questionId === "electricity"
        );
        if (electricityAnswer) {
          const renewableFactors: Record<string, number> = {
            full: 0.1,
            partial: 0.3,
            none: 1.0,
          };
          const factor = renewableFactors[value as string] || 1.0;
          const updatedAnswers = answers.map((a) =>
            a.questionId === "electricity"
              ? {
                  ...a,
                  emissions:
                    Number(a.value) * question.emissionFactor! * factor,
                }
              : a
          );
          setAnswers(updatedAnswers);
        }
      } else {
        const factorMaps: Record<string, Record<string, number>> = {
          diet: {
            vegan: 300,
            vegetarian: 500,
            pescatarian: 600,
            low_meat: 1000,
            high_meat: 1500,
          },
          food_waste: {
            none: 0,
            little: 50,
            moderate: 150,
            high: 300,
          },
          shopping: {
            rarely: 100,
            occasionally: 300,
            regularly: 600,
            frequently: 1000,
          },
        };

        if (factorMaps[question.id]) {
          emissions = factorMaps[question.id][value as string] || 0;
        } else {
          emissions = Number(value) * question.emissionFactor;
        }
      }
    }

    const updatedAnswers = [...answers];
    const index = updatedAnswers.findIndex((a) => a.questionId === question.id);
    if (index !== -1) {
      updatedAnswers[index] = { questionId: question.id, value, emissions };
    } else {
      updatedAnswers.push({ questionId: question.id, value, emissions });
    }

    setAnswers(updatedAnswers);
    setTimeout(handleNext, 500);
  };

  const calculateTotalEmissions = () =>
    answers.reduce((sum, a) => sum + a.emissions, 0);

  const getCategoryEmissions = (category: string) =>
    answers
      .filter(
        (a) =>
          questions.find((q) => q.id === a.questionId)?.category === category
      )
      .reduce((sum, a) => sum + a.emissions, 0);

  const getEmissionLevel = (value: number) => {
    if (value < 1000) return { level: "Low", color: "text-green-500" };
    if (value < 3000) return { level: "Moderate", color: "text-yellow-500" };
    if (value < 6000) return { level: "High", color: "text-orange-500" };
    return { level: "Very High", color: "text-red-500" };
  };

  const renderQuestion = () => {
    const question = questions[currentQuestionIndex];

    if (question.type === "singleChoice") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {question.options?.map((option) => (
            <button
              key={option.value}
              onClick={() => handleAnswer(option.value)}
              className="flex items-center p-4 bg-white dark:bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition-all border-2 border-transparent hover:border-green-500"
            >
              <span className="text-2xl mr-3">{option.icon}</span>
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      );
    }

    if (question.type === "number") {
      return (
        <div className="mt-6">
          <div className="flex items-center">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full p-3 bg-white dark:bg-gray-700 rounded-lg shadow-md border-2 border-transparent focus:border-green-500 focus:outline-none"
              placeholder={`Enter value in ${question.unit || "units"}`}
            />
            {question.unit && (
              <span className="ml-2 text-gray-500 dark:text-gray-300">
                {question.unit}
              </span>
            )}
          </div>
          <button
            onClick={() => handleAnswer(Number(inputValue))}
            disabled={!inputValue}
            className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50 hover:bg-green-700 transition-colors"
          >
            Submit
          </button>
        </div>
      );
    }

    if (question.type === "slider") {
      return (
        <div className="mt-6">
          <input
            type="range"
            min={question.min || 0}
            max={question.max || 100}
            value={inputValue || 0}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between mt-2">
            <span>{question.min || 0}</span>
            <span className="font-bold">{inputValue || 0}</span>
            <span>{question.max || 100}</span>
          </div>
          <button
            onClick={() => handleAnswer(Number(inputValue))}
            disabled={!inputValue}
            className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50 hover:bg-green-700 transition-colors"
          >
            Submit
          </button>
        </div>
      );
    }

    return null;
  };

  // Add this function outside of the renderResults function
  const handleRestartQuiz = () => {
    // Reset all state values
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setShowResults(false);
    setInputValue("");
  };

  const renderResults = () => {
    const total = calculateTotalEmissions();
    const categories = [
      "transportation",
      "home",
      "food",
      "consumption",
    ] as const;
    const { level, color } = getEmissionLevel(total);

    // Prepare data for analytics
    const analyticsData = {
      total,
      level,
      categoryData: categories.map(cat => ({
        name: cat,
        value: getCategoryEmissions(cat),
        percentage: total > 0 ? Math.round((getCategoryEmissions(cat) / total) * 100) : 0
      }))
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 max-w-3xl mx-auto"
      >
        <h2 className="text-2xl font-bold text-center mb-6">
          Your Carbon Footprint Results
        </h2>

        <div className="text-center mb-8">
          <p className="text-lg">Your estimated annual carbon footprint is:</p>
          <p className={`text-4xl font-bold ${color}`}>
            {Math.round(total)} kg CO₂e
          </p>
          <p className={`text-xl ${color}`}>{level} Impact</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {categories.map((cat) => {
            const emissions = getCategoryEmissions(cat);
            return (
              <div
                key={cat}
                className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg"
              >
                <h3 className="font-semibold mb-2 capitalize">{cat}</h3>
                <p className="text-2xl font-bold">
                  {Math.round(emissions)} kg CO₂e
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {total > 0 ? Math.round((emissions / total) * 100) : 0}% of
                  your footprint
                </p>
              </div>
            );
          })}
        </div>

        {/* View Detailed Analytics button */}
        <div className="mt-8 text-center flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => {
              // Encode the data as URL parameters
              const params = new URLSearchParams();
              params.set('data', JSON.stringify(analyticsData));
              router.push(`/analytics?${params.toString()}`);
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            View Detailed Analytics
          </button>
          
          <button
            onClick={handleRestartQuiz}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md"
          >
            Start Quiz Again
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {!showResults ? (
        <>
          {currentQuestion ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6">
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </span>
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 rounded-full text-xs font-medium capitalize">
                    {currentQuestion.category}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-center mb-2">
                  {currentQuestion.text}
                </h2>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-green-600 h-2.5 rounded-full"
                    style={{
                      width: `${
                        ((currentQuestionIndex + 1) / questions.length) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              {renderQuestion()}

              <div className="mt-6 flex justify-between">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50 hover:bg-gray-400 transition-colors"
                >
                  Previous
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-xl">
              <p>Loading questions...</p>
            </div>
          )}
        </>
      ) : (
        renderResults()
      )}
    </div>
  );
}
