import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, BadgePlus, ScanLine, QrCode, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import moment from 'moment';
import toast from 'react-hot-toast';
import QRScannerComponent from '../components/QrScanner';
import { API_PATH } from '../path/apiPath';
const securityItems = [
  {
    title: 'Record Guest Entry',
    description: 'Enter guest details for seminars, events, and parent visits.',
    icon: LogIn,
    color: 'from-blue-500 to-blue-700',
    path: '/visitor-entry',
  },
  {
    title: 'Generate Entry Pass',
    description: 'Create new entry passes for visitors.',
    icon: BadgePlus,
    color: 'from-green-500 to-green-700',
    path: '/entry-pass',
  },
  {
    title: 'Verify Entry Pass',
    description: 'Verify and manage visitor entry passes.',
    icon: ScanLine,
    color: 'from-purple-500 to-purple-700',
    path: '/verify-pass',
  },
];

const SecurityDashboard = () => {
  const navigate = useNavigate();
  const [showScanner, setShowScanner] = useState(false);  const [expiredPasses, setExpiredPasses] = useState([]);
  
  const handleDelete = async (passId) => {
    if (!window.confirm('Are you sure you want to delete this pass?')) return;
    
    try {
      await axios.patch(`${API_PATH}/api/passes/${passId}/soft-delete`);
      setExpiredPasses(current => current.filter(pass => pass.pass_id !== passId));
      toast.success('Pass deleted successfully');
    } catch (error) {
      console.error('Failed to delete pass:', error);
      toast.error('Failed to delete pass');
    }
  };

  useEffect(() => {
    const fetchPasses = async () => {
      try {
        const response = await axios.get(`${API_PATH}/api/passes/active`);
        const today = new Date().toISOString().split('T')[0];
        const expired = response.data.filter(pass =>
          pass.status === 'expired' &&
          new Date(pass.valid_until).toISOString().split('T')[0] === today
        );
        setExpiredPasses(expired);
      } catch (error) {
        console.error('Failed to fetch passes:', error);
      }
    };

    fetchPasses();
    const interval = setInterval(fetchPasses, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="md:text-4xl text-2xl font-extrabold mb-10 flex justify-center items-center text-gray-900 tracking-tight">
        <span className='p-2'><img src="policemen.png" alt="" width={42} height={42} /></span>Security Dashboard
      </h1>

      {expiredPasses.length > 0 && (
        <div className="mb-8">
          <div className="bg-gradient-to-br from-red-100 to-red-200 border-l-4 border-red-500 p-5 rounded-xl shadow-md">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-red-600 text-lg font-bold">⚠️ Expired Passes Today</span>
            </div>
            <div className="space-y-2">
              {expiredPasses.map(pass => (
                <div key={pass.pass_id} className="flex flex-col md:flex-row justify-between gap-4 bg-white p-4 rounded-lg shadow-sm">
                  <div>
                    <p className="font-semibold text-gray-800">Name: {pass.visitor_name}</p>
                    <p className="text-gray-600">Pass ID: {pass.pass_id}</p>
                  </div>                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-gray-600">Mobile: {pass.visitor_phone}</p>
                      <p className="text-red-500 font-medium">
                        Expired at {moment(pass.valid_until).format('hh:mm A')}
                      </p>
                    </div>
                    <button 
                      onClick={() => handleDelete(pass.pass_id)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition-colors"
                      title="Delete pass"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="text-center mb-12">
        <button
          onClick={() => setShowScanner(true)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white bg-gradient-to-r from-indigo-500 to-indigo-700 hover:to-indigo-800 shadow-lg hover:shadow-xl transition-all"
        >
          <QrCode size={22} />
          <span className="font-medium">Scan QR Code</span>
        </button>
      </div>

      {showScanner && <QRScannerComponent onClose={() => setShowScanner(false)} />}

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {securityItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/50 backdrop-blur-md rounded-3xl p-6 shadow-md hover:shadow-2xl transform hover:scale-[1.02] transition-all"
          >
            <div className="flex flex-col justify-between h-full">
              <div>
                <div className="mb-4 text-gray-700">
                  <item.icon size={40} className="text-gray-700 hover:text-black transition" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h2>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
              <button
                onClick={() => navigate(item.path)}
                className={`mt-6 py-2 px-4 w-full bg-gradient-to-r ${item.color} text-white rounded-md font-semibold transition-all hover:shadow-lg`}
              >
                Go
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SecurityDashboard;
