import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  BadgePlus,
  ScanLine,
  CalendarClock,
  FileBarChart2,
  Settings2,
} from 'lucide-react';
import { motion } from 'framer-motion';

const dashboardItems = [
  {
    title: 'Generate Entry Pass',
    description: 'Create new entry passes for events, seminars, and parent visits.',
    icon: BadgePlus,
    color: 'bg-blue-500 hover:bg-blue-600',
    path: '/entry-pass',
  },
  {
    title: 'Verify Entry Pass',
    description: 'Verify and manage visitor entry passes.',
    icon: ScanLine,
    color: 'bg-green-500 hover:bg-green-600',
    path: '/verify-pass',
  },
  {
    title: 'Events Management',
    description: 'Manage university events and seminars.',
    icon: CalendarClock,
    color: 'bg-purple-500 hover:bg-purple-600',
    path: '/events',
  },
  {
    title: 'Reports',
    description: 'Generate and view visitor entry reports.',
    icon: FileBarChart2,
    color: 'bg-yellow-500 hover:bg-yellow-600',
    path: '/reports',
  },
];

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="md:text-4xl text-2xl font-bold mb-10 flex justify-center items-center text-gray-800"><span className='p-2'><img src="admin-panel.png" alt="" width={42} height={42} /></span>Admin Dashboard</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {dashboardItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/70 backdrop-blur-md shadow-md hover:shadow-xl transition-all rounded-2xl p-6 flex flex-col justify-between"
          >
            <div>
              <item.icon size={36} className="text-gray-700 mb-4" />
              <h2 className="text-xl font-semibold mb-2 text-gray-800">{item.title}</h2>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </div>
            <button
              onClick={() => navigate(item.path)}
              className={`${item.color} text-white mt-6 px-4 py-2 rounded-md transition-colors w-full`}
            >
              Go
            </button>
          </motion.div>
        ))}

        
      </div>
    </div>
  );
};

export default DashboardPage;
