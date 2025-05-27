import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Loader2, AlertTriangle, Users, ClipboardList, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, title, value, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-white/70 backdrop-blur-lg shadow-lg rounded-2xl p-6 flex flex-col items-center hover:shadow-xl transition-all"
  >
    <Icon size={36} className={`mb-3 ${color}`} />
    <h3 className="text-lg font-medium text-gray-700">{title}</h3>
    <p className={`text-3xl font-bold ${color}`}>{value}</p>
  </motion.div>
);

const ReportsPage = () => {
  const { user } = useAuth();
  const [reportsData, setReportsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/reports');
        setReportsData(response.data);
      } catch (err) {
        setError('Failed to load reports data.');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-[60vh] text-blue-600 text-xl">
        <Loader2 className="animate-spin mr-2" /> Loading reports...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-[60vh] text-red-500 text-lg">
        <AlertTriangle className="mr-2" /> {error}
      </div>
    );

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold mb-10 text-center text-gray-800">📊 Visitor Entry Reports</h1>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        <StatCard icon={Users} title="Visitor Entries" value={reportsData.visitorEntries} color="text-blue-600" />
        <StatCard icon={ClipboardList} title="Passes Generated" value={reportsData.passesGenerated} color="text-green-600" />
        <StatCard icon={Calendar} title="Events Count" value={reportsData.eventsCount} color="text-purple-600" />
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">🧾 Recent Visitors</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl overflow-hidden shadow-lg">
            <thead className="bg-gray-100 text-gray-700 text-center">
              <tr>
                <th className="py-3 px-6 text-center">Visitor Name</th>
                <th className="py-3 px-6 text-center">Visit Type</th>
                <th className="py-3 px-6 text-center">Valid From</th>
                <th className="py-3 px-6 text-center">Valid To</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {reportsData.recentVisitors.map((visitor, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                >
                  <td className="py-3 px-6 text-center">{visitor.visitor_name}</td>
                  <td className="py-3 px-6 capitalize text-center">
                    {visitor.visit_type.replace('_', ' ')}
                  </td>
                  <td className="py-3 px-6 text-center">
                    {new Date(visitor.valid_from).toLocaleString()}
                  </td>
                  <td className="py-3 px-6 text-center">
                    {new Date(visitor.valid_until).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
