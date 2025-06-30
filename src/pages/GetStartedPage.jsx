import React from 'react';
import { motion } from 'framer-motion';
import GetStartedComponent from '../components/quest/GetStartedComponent';

const GetStartedPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Get Started</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Complete these steps to get the most out of ProjectFlow.
          </p>
        </div>
      </div>

      {/* GetStarted Component */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <GetStartedComponent />
      </div>
    </motion.div>
  );
};

export default GetStartedPage;