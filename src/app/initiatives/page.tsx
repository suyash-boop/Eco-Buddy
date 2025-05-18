"use client";

import React, { useState, useEffect } from "react";
import { FaLeaf, FaSpinner, FaExclamationTriangle } from "react-icons/fa";

interface PreventiveMeasure {
  id: number;
  title: string;
  description: string;
  category: "individual" | "community" | "business" | "government";
  difficulty: "easy" | "medium" | "hard";
  impact: "low" | "medium" | "high";
}

export default function InitiativesPage() {
  const [measures, setMeasures] = useState<PreventiveMeasure[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    // Simply use the fallback data directly
    setMeasures(fallbackMeasures);
    setLoading(false);
  }, []);

  const filteredMeasures =
    selectedCategory === "all"
      ? measures
      : measures.filter((measure) => measure.category === selectedCategory);

  // Get difficulty and impact color classes
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "bg-blue-100 text-blue-800";
      case "medium":
        return "bg-purple-100 text-purple-800";
      case "low":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-green-700 mb-2">
          Preventive Measures for Environmental Sustainability
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Explore these initiatives to reduce your environmental impact and
          contribute to a sustainable future.
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-6 flex justify-center">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
              selectedCategory === "all"
                ? "bg-green-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory("individual")}
            className={`px-4 py-2 text-sm font-medium ${
              selectedCategory === "individual"
                ? "bg-green-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            }`}
          >
            Individual
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory("community")}
            className={`px-4 py-2 text-sm font-medium ${
              selectedCategory === "community"
                ? "bg-green-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            }`}
          >
            Community
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory("business")}
            className={`px-4 py-2 text-sm font-medium ${
              selectedCategory === "business"
                ? "bg-green-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            }`}
          >
            Business
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory("government")}
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
              selectedCategory === "government"
                ? "bg-green-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            }`}
          >
            Government
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <FaSpinner className="animate-spin text-green-600 text-4xl mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Loading preventive measures...
          </p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6 flex items-start">
          <FaExclamationTriangle className="text-red-600 mt-0.5 mr-3" />
          <div>
            <p className="font-semibold">Error loading preventive measures</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Measures Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMeasures.map((measure) => (
            <div
              key={measure.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-5">
                <div className="flex items-center mb-3">
                  <FaLeaf className="text-green-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {measure.title}
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {measure.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                    {measure.category.charAt(0).toUpperCase() +
                      measure.category.slice(1)}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(
                      measure.difficulty
                    )} dark:bg-opacity-20`}
                  >
                    {measure.difficulty.charAt(0).toUpperCase() +
                      measure.difficulty.slice(1)}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getImpactColor(
                      measure.impact
                    )} dark:bg-opacity-20`}
                  >
                    {measure.impact.charAt(0).toUpperCase() +
                      measure.impact.slice(1)}{" "}
                    Impact
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {!loading && filteredMeasures.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            No preventive measures found for the selected category.
          </p>
        </div>
      )}
    </div>
  );
}

// Fallback data in case the API call fails
const fallbackMeasures: PreventiveMeasure[] = [
  {
    id: 1,
    title: "Reduce Single-Use Plastics",
    description:
      "Replace disposable items with reusable alternatives such as water bottles, shopping bags, and food containers. This reduces plastic pollution in oceans and landfills.",
    category: "individual",
    difficulty: "easy",
    impact: "medium",
  },
  {
    id: 2,
    title: "Transition to Renewable Energy",
    description:
      "Install solar panels or switch to a renewable energy provider for your electricity needs. This reduces carbon emissions and dependence on fossil fuels.",
    category: "individual",
    difficulty: "medium",
    impact: "high",
  },
  {
    id: 3,
    title: "Implement Water Conservation Practices",
    description:
      "Install water-efficient fixtures, fix leaks promptly, and collect rainwater for gardening. This preserves freshwater resources and reduces energy used for water treatment.",
    category: "individual",
    difficulty: "easy",
    impact: "medium",
  },
  {
    id: 4,
    title: "Adopt Plant-Based Diet",
    description:
      "Reduce meat consumption by incorporating more plant-based meals into your diet. This decreases greenhouse gas emissions, land use, and water consumption associated with animal agriculture.",
    category: "individual",
    difficulty: "medium",
    impact: "high",
  },
  {
    id: 5,
    title: "Practice Sustainable Transportation",
    description:
      "Walk, cycle, use public transport, or carpool whenever possible. If driving is necessary, consider an electric or hybrid vehicle to reduce carbon emissions.",
    category: "individual",
    difficulty: "medium",
    impact: "high",
  },
  {
    id: 6,
    title: "Community Garden Initiative",
    description:
      "Establish community gardens to grow local produce, reduce food miles, and create green spaces that support biodiversity and community engagement.",
    category: "community",
    difficulty: "medium",
    impact: "medium",
  },
  {
    id: 7,
    title: "Implement Circular Economy Practices",
    description:
      "Design products for durability, reusability, and recyclability. Establish take-back programs and use recycled materials in manufacturing to minimize waste and resource extraction.",
    category: "business",
    difficulty: "hard",
    impact: "high",
  },
  {
    id: 8,
    title: "Develop Green Building Standards",
    description:
      "Establish and enforce building codes that require energy efficiency, water conservation, sustainable materials, and renewable energy integration in new constructions and renovations.",
    category: "government",
    difficulty: "hard",
    impact: "high",
  },
  {
    id: 9,
    title: "Compost Organic Waste",
    description:
      "Set up a composting system for food scraps and yard waste to reduce methane emissions from landfills and create nutrient-rich soil for gardening.",
    category: "individual",
    difficulty: "easy",
    impact: "medium",
  },
  {
    id: 10,
    title: "Implement Energy Efficiency Measures",
    description:
      "Upgrade to LED lighting, improve insulation, use energy-efficient appliances, and adopt smart home technology to reduce energy consumption and associated emissions.",
    category: "individual",
    difficulty: "medium",
    impact: "medium",
  },
  {
    id: 11,
    title: "Organize Community Clean-up Events",
    description:
      "Regularly organize volunteers to clean up local parks, beaches, and waterways to reduce pollution and raise environmental awareness in the community.",
    category: "community",
    difficulty: "easy",
    impact: "medium",
  },
  {
    id: 12,
    title: "Invest in Sustainable Supply Chains",
    description:
      "Audit suppliers for environmental practices, reduce transportation emissions, and source materials locally when possible to minimize the environmental footprint of products.",
    category: "business",
    difficulty: "hard",
    impact: "high",
  },
  {
    id: 13,
    title: "Implement Carbon Pricing",
    description:
      "Establish carbon taxes or cap-and-trade systems to internalize the environmental costs of greenhouse gas emissions and incentivize cleaner technologies and practices.",
    category: "government",
    difficulty: "hard",
    impact: "high",
  },
  {
    id: 14,
    title: "Practice Sustainable Fashion",
    description:
      "Buy fewer, higher-quality clothes, shop second-hand, repair items, and choose sustainable brands to reduce the environmental impact of the fashion industry.",
    category: "individual",
    difficulty: "easy",
    impact: "medium",
  },
  {
    id: 15,
    title: "Protect and Restore Natural Habitats",
    description:
      "Establish protected areas, restore degraded ecosystems, and implement sustainable land management practices to preserve biodiversity and enhance carbon sequestration.",
    category: "government",
    difficulty: "hard",
    impact: "high",
  },
  {
    id: 16,
    title: "Establish Environmental Education Programs",
    description:
      "Create workshops, courses, and awareness campaigns to educate the public about environmental issues and sustainable practices, fostering a culture of environmental stewardship.",
    category: "community",
    difficulty: "medium",
    impact: "high",
  },
  {
    id: 17,
    title: "Implement Green Procurement Policies",
    description:
      "Develop and enforce policies that prioritize environmentally friendly products and services in government and institutional purchasing decisions.",
    category: "government",
    difficulty: "medium",
    impact: "high",
  },
  {
    id: 18,
    title: "Create Wildlife Corridors",
    description:
      "Establish protected pathways connecting fragmented habitats to allow wildlife movement, genetic exchange, and adaptation to climate change.",
    category: "government",
    difficulty: "hard",
    impact: "high",
  },
  {
    id: 19,
    title: "Practice Zero-Waste Living",
    description:
      "Minimize waste generation through refusing unnecessary items, reducing consumption, reusing products, recycling materials, and composting organic waste.",
    category: "individual",
    difficulty: "medium",
    impact: "medium",
  },
  {
    id: 20,
    title: "Implement Green Roof Technology",
    description:
      "Install vegetation on rooftops to improve insulation, reduce urban heat island effect, manage stormwater, and create habitat for pollinators.",
    category: "business",
    difficulty: "medium",
    impact: "medium",
  },
  {
    id: 21,
    title: "Develop Sustainable Tourism Practices",
    description:
      "Create tourism experiences that minimize environmental impact, respect local cultures, and contribute to conservation efforts and local economies.",
    category: "business",
    difficulty: "medium",
    impact: "medium",
  },
  {
    id: 22,
    title: "Establish Bike-Friendly Infrastructure",
    description:
      "Develop dedicated bike lanes, secure parking, and bike-sharing programs to encourage cycling as a sustainable transportation alternative.",
    category: "government",
    difficulty: "medium",
    impact: "medium",
  },
  {
    id: 23,
    title: "Create Seed Libraries",
    description:
      "Establish community repositories where people can exchange heirloom and native plant seeds to preserve biodiversity and promote local food production.",
    category: "community",
    difficulty: "easy",
    impact: "medium",
  },
  {
    id: 24,
    title: "Implement Water Recycling Systems",
    description:
      "Install greywater systems and rainwater harvesting to reuse water for irrigation and non-potable purposes, reducing freshwater consumption.",
    category: "business",
    difficulty: "medium",
    impact: "high",
  },
  {
    id: 25,
    title: "Practice Digital Minimalism",
    description:
      "Reduce digital carbon footprint by extending device lifespans, using energy-efficient settings, and being mindful of data storage and streaming habits.",
    category: "individual",
    difficulty: "easy",
    impact: "low",
  },
  {
    id: 26,
    title: "Develop Urban Forests",
    description:
      "Plant and maintain diverse tree species in urban areas to improve air quality, provide shade, reduce urban heat, and create wildlife habitat.",
    category: "community",
    difficulty: "medium",
    impact: "medium",
  },
  {
    id: 27,
    title: "Implement Sustainable Packaging",
    description:
      "Replace conventional packaging with biodegradable, compostable, or recyclable alternatives to reduce waste and environmental pollution.",
    category: "business",
    difficulty: "medium",
    impact: "high",
  },
  {
    id: 28,
    title: "Create Environmental Impact Bonds",
    description:
      "Develop financial instruments that fund environmental projects with returns based on the achievement of measurable ecological outcomes.",
    category: "government",
    difficulty: "hard",
    impact: "high",
  },
  {
    id: 29,
    title: "Practice Mindful Consumption",
    description:
      "Make thoughtful purchasing decisions by considering product lifecycle, environmental impact, and necessity before buying new items.",
    category: "individual",
    difficulty: "easy",
    impact: "medium",
  },
  {
    id: 30,
    title: "Establish Repair Cafés",
    description:
      "Create community spaces where people can bring broken items to be fixed by volunteers, extending product lifespans and reducing waste.",
    category: "community",
    difficulty: "medium",
    impact: "medium",
  },
];
