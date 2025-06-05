import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 px-4">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <motion.h1 
            className="text-[180px] sm:text-[220px] font-bold text-gray-200 select-none"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            404
          </motion.h1>
          <motion.div 
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-center space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                Page Not Found
              </h2>
              <p className="text-gray-600 max-w-sm mx-auto text-sm sm:text-base">
                Oops! The page you're looking for seems to have vanished into thin air.
              </p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          className="mt-8 space-y-3 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-lg shadow-md hover:shadow-lg transition-all w-full sm:w-auto border border-gray-200 hover:border-gray-300"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all hover:bg-blue-700 w-full sm:w-auto"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        </motion.div>

        <motion.div
          className="mt-12 text-sm text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Lost? Contact support for assistance.
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;
