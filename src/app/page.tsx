"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaLeaf, FaCalculator, FaChartBar, FaLightbulb, FaArrowRight } from 'react-icons/fa';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="bg-green-600 p-4 rounded-full">
              <FaLeaf className="text-white text-4xl" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
            Track Your <span className="text-green-600">Carbon Footprint</span>
          </h1>
          <p className="text-xl text-white max-w-3xl mx-auto mb-10">
            EcoBuddy helps you understand your environmental impact and provides personalized recommendations to reduce your carbon footprint.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/calculator" className="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md font-semibold flex items-center justify-center gap-2">
              <FaCalculator />
              <span>Calculate Your Footprint</span>
            </Link>
            <Link href="/signin" className="px-8 py-4 bg-white text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors shadow-sm font-semibold">
              Sign In
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">How EcoBuddy Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
          >
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <FaCalculator className="text-green-600 text-xl" />
            </div>
            <h3 className="text-xl font-semibold text-green-600 mb-2">Calculate</h3>
            <p className="text-white">
              Answer simple questions about your lifestyle to calculate your carbon footprint across different categories.
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
          >
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <FaChartBar className="text-green-600 text-xl" />
            </div>
            <h3 className="text-xl font-semibold text-green-600 mb-2">Analyze</h3>
            <p className="text-white">
              Get detailed insights into your carbon emissions with interactive charts and comparisons.
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
          >
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <FaLightbulb className="text-green-600 text-xl" />
            </div>
            <h3 className="text-xl font-semibold text-green-600 mb-2">Improve</h3>
            <p className="text-white">
              Receive personalized recommendations and track your progress as you reduce your environmental impact.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-green-600 rounded-2xl p-8 sm:p-12 text-center text-white"
        >
          <h2 className="text-3xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of people who are taking action to reduce their carbon footprint and create a more sustainable future.
          </p>
          <Link href="/calculator" className="inline-flex items-center px-8 py-4 bg-white text-green-600 rounded-lg hover:bg-green-50 transition-colors shadow-md font-semibold">
            Get Started <FaArrowRight className="ml-2" />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 text-center text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
        <p>© {new Date().getFullYear()} EcoBuddy. All rights reserved.</p>
      </footer>
    </div>
  );
}
