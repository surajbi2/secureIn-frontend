import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const HeadDashboard = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: 'Visitor Entry Reports',
      description: 'Access logs of visitor entries and generate reports.',
      buttonText: 'View Reports',
      color: 'bg-yellow-500',
      hoverColor: 'hover:bg-yellow-600',
      path: '/reports',
    },
    {
      title: 'Events Overview',
      description: 'Manage upcoming university events and access past records.',
      buttonText: 'Manage Events',
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
      path: '/events',
    },
  
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Head Dashboard</h1>
          <p className="text-gray-600 text-md">
            Monitor visitor entries, manage events, and access reports — all in one place.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white p-6 rounded-xl shadow-md border border-gray-200"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{card.title}</h2>
              <div className='flex flex-col items-center justify-between h-[70%]'>

              <p className="text-gray-500 mb-4">{card.description}</p>
              <button
                onClick={() => navigate(card.path)}
                className={`${card.color} ${card.hoverColor} text-white px-4 py-2 rounded-md transition-colors w-full font-medium`}
                >
                {card.buttonText}
              </button>
                </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeadDashboard;
