"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaLeaf, FaCalculator, FaChartBar, FaLightbulb, FaArrowRight } from 'react-icons/fa';

export default function HomePage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-green-900">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-7xl mx-auto">
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
              Track Your <span className="text-green-400">Carbon Footprint</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
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
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-12">How EcoBuddy Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-xl shadow-lg hover:bg-white/15 transition-all duration-300"
            >
              <div className="bg-green-500 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <FaCalculator className="text-white text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-green-400 mb-2">Calculate</h3>
              <p className="text-gray-300 leading-relaxed">
                Answer simple questions about your lifestyle to calculate your carbon footprint across different categories.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-xl shadow-lg hover:bg-white/15 transition-all duration-300"
            >
              <div className="bg-green-500 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <FaChartBar className="text-white text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-green-400 mb-2">Analyze</h3>
              <p className="text-gray-300 leading-relaxed">
                Get detailed insights into your carbon emissions with interactive charts and comparisons.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-white/10 backdrop-blur-sm border border-white/20 p-6 rounded-xl shadow-lg hover:bg-white/15 transition-all duration-300"
            >
              <div className="bg-green-500 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <FaLightbulb className="text-white text-xl" />
              </div>
              <h3 className="text-xl font-semibold text-green-400 mb-2">Improve</h3>
              <p className="text-gray-300 leading-relaxed">
                Receive personalized recommendations and track your progress as you reduce your environmental impact.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 sm:p-12 text-center text-white shadow-2xl"
          >
            <h2 className="text-3xl font-bold mb-6">Ready to Make a Difference?</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
              Join thousands of people who are taking action to reduce their carbon footprint and create a more sustainable future.
            </p>
            <Link href="/calculator" className="inline-flex items-center px-8 py-4 bg-white text-green-600 rounded-lg hover:bg-green-50 transition-all duration-300 shadow-md font-semibold hover:shadow-lg transform hover:scale-105">
              Get Started <FaArrowRight className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 text-center text-gray-400 border-t border-gray-700 w-full">
        <p>© {new Date().getFullYear()} EcoBuddy. All rights reserved.</p>
      </footer>
    </div>
  );
}
