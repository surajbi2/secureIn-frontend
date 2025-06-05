import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import moment from 'moment-timezone';
import { API_PATH } from '../path/apiPath'; // Adjust the import based on your project structure
// Helper function to format dates in IST with consistent format
const formatDateIST = (date) => {
  if (!date) return '';
  // Always parse as UTC, then convert to IST for display
  const m = moment.utc(date).tz('Asia/Kolkata');
  return m.format('MMM D, YYYY, hh:mm A');
};

const VerifyPassPage = () => {
  const [passId, setPassId] = useState('');
  const [pass, setPass] = useState(null);
  const [passes, setPasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllPasses = async () => {
    try {
      const response = await axios.get(`${API_PATH}/api/passes/active`);
      setPasses(response.data);
    } catch (err) {
      toast.error('Failed to load passes');
    }
  };

  useEffect(() => {
    fetchAllPasses();
  }, []);

  const handlePrint = (passToPrint) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Entry Pass</title>
          <style>
            body { font-family: Arial, sans-serif; }
            .pass-container { max-width: 500px; margin: auto; padding: 20px; border: 2px solid #000; }
            .qr-code { text-align: center; margin: 20px 0; }
            .pass-details { margin-bottom: 20px; }
            .pass-id { font-size: 24px; font-weight: bold; text-align: center; }
            .validity { color: red; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="pass-container">
            <h1 style="text-align: center;">Central University of Karnataka</h1>
            <h2 style="text-align: center;">Visitor Entry Pass</h2>
            <div class="pass-id">Pass ID: ${passToPrint.pass_id}</div>
            <div class="qr-code"><img src="${passToPrint.qr_code}" alt="QR Code" /></div>
            <div class="pass-details">
              <p><strong>Visitor Name:</strong> ${passToPrint.visitor_name}</p>
              <p><strong>Visit Type:</strong> ${passToPrint.visit_type}</p>
              <p><strong>Purpose:</strong> ${passToPrint.purpose}</p>
              <p class="validity">
                <strong>Valid From:</strong> ${formatDateIST(passToPrint.valid_from)} (IST)<br/>
                <strong>Valid Until:</strong> ${formatDateIST(passToPrint.valid_until)} (IST)
              </p>
              ${passToPrint.event_id ? `<p><strong>Event:</strong> ${passToPrint.event_name}</p>` : ''}
              ${passToPrint.student_name ? `
                <p><strong>Student Name:</strong> ${passToPrint.student_name}</p>
                <p><strong>Relation:</strong> ${passToPrint.relation_to_student}</p>
                <p><strong>Department:</strong> ${passToPrint.department}</p>` : ''}
            </div>
            <div style="text-align: center; font-size: 12px;">
              <p>This pass must be shown at the security gate.</p>
              <p>Valid only with a photo ID.</p>
            </div>
          </div>
          <script>window.onload = () => window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleVerify = async () => {
    if (!passId) {
      toast.error('Please enter a pass ID');
      return;
    }
    try {
      setLoading(true);
      const response = await axios.get(`${API_PATH}/api/passes/verify/${passId}`);
      const verifiedPass = {
        ...response.data.pass,
        valid_from_display: formatDateIST(response.data.pass.valid_from),
        valid_until_display: formatDateIST(response.data.pass.valid_until)
      };
      setPass(verifiedPass);
      setError(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to verify pass';
      setError(errorMessage);
      toast.error(errorMessage);
      setPass(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this pass?')) return;
    try {
      await axios.delete(`${API_PATH}/api/passes/${id}`);
      toast.success('Pass deleted successfully');
      fetchAllPasses();
      if (pass && pass.pass_id === id) {
        setPass(null);
        setPassId('');
      }
    } catch (err) {
      toast.error('Failed to delete pass');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-8xl">
      <motion.h1 
        className="text-2xl sm:text-4xl font-bold mb-6 sm:mb-8 text-center text-gray-800"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Entry Pass Verification & Management
      </motion.h1>

      <motion.div 
        className="mb-8 sm:mb-10 max-w-md mx-auto bg-white p-4 sm:p-6 rounded-xl shadow-xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <input
          type="text"
          placeholder="Enter Pass ID"
          value={passId}
          onChange={(e) => setPassId(e.target.value.toUpperCase())}
          className="border border-gray-300 p-2.5 sm:p-3 rounded-lg w-full text-center text-lg sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleVerify}
          disabled={loading}
          className="mt-3 sm:mt-4 w-full bg-green-600 text-white px-4 py-2 sm:py-2.5 rounded-lg hover:bg-green-700 transition disabled:opacity-50 text-lg sm:text-base"
        >
          {loading ? 'Verifying...' : 'Verify Pass'}
        </button>
        {error && <p className="text-red-600 font-semibold mt-3 sm:mt-4 text-center text-lg sm:text-base">{error}</p>}

        {pass && (
          <motion.div
            className="mt-5 sm:mt-6 border p-3 sm:p-4 rounded-lg shadow-md bg-blue-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="space-y-2 text-lg sm:text-base">
              <p><strong>Pass ID:</strong> {pass.pass_id}</p>
              <p><strong>Visitor Name:</strong> {pass.visitor_name}</p>
              <p><strong>Visit Type:</strong> {pass.visit_type}</p>
              <p><strong>Purpose:</strong> {pass.purpose}</p>
              <p><strong>Valid From:</strong> {formatDateIST(pass.valid_from)}</p>
              <p><strong>Valid Until:</strong> {formatDateIST(pass.valid_until)}</p>
              <p><strong>Status:</strong> {
                new Date() > new Date(pass.valid_until) ? 
                  <span className="text-red-500 font-semibold">Expired</span> : 
                  <span className="text-green-600 font-medium">{pass.status}</span>
              }</p>
            </div>
            <button
              onClick={() => handlePrint(pass)}
              className="mt-4 w-full bg-green-600 text-white px-4 py-2 sm:py-2.5 rounded-lg hover:bg-green-700 transition text-lg sm:text-base"
            >
              Print Pass
            </button>
          </motion.div>
        )}
      </motion.div>      <motion.h2
        className="text-xl sm:text-2xl font-semibold mb-4 text-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        All Generated Passes
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200"
      >
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Pass ID</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Visitor</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Purpose</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Valid From</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Valid Until</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {passes.map((p, index) => (
                <motion.tr
                  key={p.pass_id}
                  className={`transition duration-200 ease-in-out hover:bg-gray-50 ${
                    index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  }`}
                  whileHover={{ scale: 1.005 }}
                >
                  <td className="px-4 py-3 text-lg font-medium text-gray-900">{p.pass_id}</td>
                  <td className="px-4 py-3 text-lg text-gray-700">{p.visitor_name}</td>
                  <td className="px-4 py-3 text-lg text-gray-700">{p.visit_type}</td>
                  <td className="px-4 py-3 text-lg text-gray-700">{p.purpose}</td>
                  <td className="px-4 py-3 text-lg text-gray-700">{formatDateIST(p.valid_from)}</td>
                  <td className="px-4 py-3 text-lg text-gray-700">{formatDateIST(p.valid_until)}</td>
                  <td className="px-4 py-3 text-lg text-gray-700">
                    {new Date() > new Date(p.valid_until) ? (
                      <span className="text-red-500 font-semibold">Expired</span>
                    ) : (
                      <span className="text-green-600 font-medium">{p.status}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handlePrint(p)}
                        className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-3 py-1.5 rounded-md shadow-sm transition duration-150"
                      >
                        Print
                      </button>
                      <button
                        onClick={() => handleDelete(p.pass_id)}
                        className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-3 py-1.5 rounded-md shadow-sm transition duration-150"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-gray-200">
          {passes.map((p) => (
            <div key={p.pass_id} className="p-4 hover:bg-gray-50 transition">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Pass ID: {p.pass_id}</h3>
                  <p className="text-lg text-gray-600 mt-1">{p.visitor_name}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePrint(p)}
                    className="bg-green-500 hover:bg-green-600 text-white text-xs font-semibold px-3 py-1.5 rounded-md shadow-sm transition duration-150"
                  >
                    Print
                  </button>
                  <button
                    onClick={() => handleDelete(p.pass_id)}
                    className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-3 py-1.5 rounded-md shadow-sm transition duration-150"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <div className="space-y-2 text-lg">
                <div className="flex items-start">
                  <span className="font-medium text-gray-500 w-24">Type:</span>
                  <span className="text-gray-700">{p.visit_type}</span>
                </div>
                <div className="flex items-start">
                  <span className="font-medium text-gray-500 w-24">Purpose:</span>
                  <span className="text-gray-700">{p.purpose}</span>
                </div>
                <div className="flex items-start">
                  <span className="font-medium text-gray-500 w-24">Valid From:</span>
                  <span className="text-gray-700">{formatDateIST(p.valid_from)}</span>
                </div>
                <div className="flex items-start">
                  <span className="font-medium text-gray-500 w-24">Valid Until:</span>
                  <span className="text-gray-700">{formatDateIST(p.valid_until)}</span>
                </div>
                <div className="flex items-start">
                  <span className="font-medium text-gray-500 w-24">Status:</span>
                  <span>
                    {new Date() > new Date(p.valid_until) ? (
                      <span className="text-red-500 font-semibold">Expired</span>
                    ) : (
                      <span className="text-green-600 font-medium">{p.status}</span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {passes.length === 0 && (
            <div className="text-center text-gray-500 py-6">
              No passes found.
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyPassPage;