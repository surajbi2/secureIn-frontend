import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import moment from 'moment-timezone';
import { API_PATH } from '../path/apiPath';
import { formatDateTimeIST } from '../utils/dateUtils';

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
    const printHTML = `
      <html><head><title>Entry Pass</title>
        <style>
          body { font-family: Arial, sans-serif; }
          .pass-container { max-width:500px; margin:auto; padding:20px; border:2px solid #000; }
          .qr-code, .pass-id, .pass-details { text-align:center; }
          .validity { color:red; font-weight:bold; }
          .info-container { display: flex; gap: 20px; padding: 0 20px; }
          .info-section { flex: 1; text-align: left; }
          .info-section h3 { border-bottom: 1px solid #ccc; padding-bottom: 5px; margin: 15px 0; }
        </style>
      </head><body>      
        <div class="pass-container">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="/cuk-full-logo.png" alt="CUK Logo" style="height: 80px; margin-bottom: 10px;"/>
            <h1 style="margin: 5px 0; font-size: 20px;">SecureIn</h1>
            <h3 style="margin: 2px 0; color: #444;">Visitor Entry Pass</h3>
          </div>
          <div class="pass-id">Pass ID: ${passToPrint.pass_id}</div>
          <div class="qr-code"><img src="${passToPrint.qr_code}" /></div>         
          <div class="pass-details">
            ${passToPrint.visit_type === 'parent_visit' ? `
              <div class="info-container">
                <div class="info-section">
                  <h3>Visitor Information</h3>
                  <p><strong>Visitor Name:</strong> ${passToPrint.visitor_name}</p>
                  <p><strong>Visit Type:</strong> ${passToPrint.visit_type.replace('_', ' ').toUpperCase()}</p>
                  <p><strong>Purpose:</strong> ${passToPrint.purpose}</p>
                </div>
                <div class="info-section">
                  <h3>Student Information</h3>
                  <p><strong>Student Name:</strong> ${passToPrint.student_name}</p>
                  <p><strong>Relation:</strong> ${passToPrint.relation_to_student}</p>
                  <p><strong>Department:</strong> ${passToPrint.department}</p>
                </div>
              </div>
            ` : `
              <div style="text-align: left; padding: 0 20px;">
                <h3 style="border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 15px;">Visitor Information</h3>
                <p><strong>Visitor Name:</strong> ${passToPrint.visitor_name}</p>
                <p><strong>Visit Type:</strong> ${passToPrint.visit_type.replace('_', ' ').toUpperCase()}</p>
                <p><strong>Purpose:</strong> ${passToPrint.purpose}</p>
                ${passToPrint.event_name ? `
                  <h3 style="border-bottom: 1px solid #ccc; padding-bottom: 5px; margin: 15px 0;">Event Details</h3>
                  <p><strong>Event:</strong> ${passToPrint.event_name}</p>
                ` : ''}
              </div>
            `}
            <div style="text-align: left; padding: 0 20px;">
              <h3 style="border-bottom: 1px solid #ccc; padding-bottom: 5px; margin: 15px 0;">Validity Period</h3>
              <p class="validity">
                <strong>Valid From:</strong> ${formatDateTimeIST(passToPrint.valid_from)}<br/>
                <strong>Valid Until:</strong> ${formatDateTimeIST(passToPrint.valid_until)}
              </p>
            </div>
          </div>
          <div style="margin-top: 30px; display: flex; justify-content: space-between; padding: 20px 40px;">
            <div style="text-align: center; flex: 1;">
              <div style="border-top: 1px solid black; margin-top: 50px; padding-top: 5px;">
                <p style="margin: 0;">Visitor's Signature</p>
              </div>
            </div>
            <div style="text-align: center; flex: 1;">
              <div style="border-top: 1px solid black; margin-top: 50px; padding-top: 5px;">
                <p style="margin: 0;">Security Officer's Signature</p>
              </div>
            </div>
          </div>
        </div>
        <script>window.onload = () => window.print();</script>
      </body></html>
    `;

    const w = window.open('', '_blank');
    w.document.write(printHTML);
    w.document.close();
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
              <p><strong>Valid From:</strong> {formatDateTimeIST(pass.valid_from)}</p>
              <p><strong>Valid Until:</strong> {formatDateTimeIST(pass.valid_until)}</p>
              <p><strong>Pass Status:</strong> {
                new Date() > new Date(pass.valid_until) ?
                  <span className="text-red-500 font-semibold">Expired</span> :
                  <span className="text-green-600 font-medium">{pass.status}</span>
              }</p>
              <p><strong>Entry Status:</strong> {
                pass.entry_status ?
                  <span className={`font-medium ${pass.entry_status === 'entered' ? 'text-blue-600' : 'text-purple-600'}`}>
                    {pass.entry_status === 'entered' ? 'Inside' : 'Exited'}
                  </span> :
                  <span className="text-gray-500">Not yet entered</span>
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
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Entry Time</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Exit Time</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Valid Until</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Entry Status</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">Pass Status</th>
                <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {passes.map((p, index) => (
                <motion.tr
                  key={p.pass_id}
                  className={`transition duration-200 ease-in-out hover:bg-gray-50 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                    }`}
                  whileHover={{ scale: 1.005 }}
                >
                  <td className="px-4 py-3 text-lg font-medium text-gray-900">{p.pass_id}</td>
                  <td className="px-4 py-3 text-lg text-gray-700">{p.visitor_name}</td>
                  <td className="px-4 py-3 text-lg text-gray-700">{p.visit_type}</td>
                  <td className="px-4 py-3 text-lg text-gray-700">{p.purpose}</td>
                  <td className="px-4 py-3 text-lg text-gray-700">{p.entry_time ? formatDateTimeIST(p.entry_time) : '-'}</td>
                  <td className="px-4 py-3 text-lg text-gray-700">{p.exit_time ? formatDateTimeIST(p.exit_time) : '-'}</td>
                  <td className="px-4 py-3 text-lg text-gray-700">{formatDateTimeIST(p.valid_until)}</td>
                  <td className="px-4 py-3 text-lg text-gray-700">
                    {p.entry_status ? (
                      <span className={`font-medium ${p.entry_status === 'entered' ? 'text-blue-600' : 'text-purple-600'}`}>
                        {p.entry_status === 'entered' ? 'Inside' : 'Exited'}
                      </span>
                    ) : (
                      <span className="text-gray-500">Not yet entered</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-lg text-gray-700">
                    {new Date() > new Date(p.valid_until) ? (
                      <span className="text-red-500 font-semibold">Expired</span>
                    ) : (
                      <span className={`font-medium ${p.status === 'active' ? 'text-green-600' :
                          p.status === 'cancelled' ? 'text-yellow-600' :
                            p.status === 'deleted' ? 'text-red-600' :
                              'text-gray-600'
                        }`}>
                        {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                      </span>
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
              </div>                <div className="space-y-2 text-lg">
                <div className="flex items-start">
                  <span className="font-medium text-gray-500 w-24">Type:</span>
                  <span className="text-gray-700">{p.visit_type}</span>
                </div>
                <div className="flex items-start">
                  <span className="font-medium text-gray-500 w-24">Purpose:</span>
                  <span className="text-gray-700">{p.purpose}</span>
                </div>
                <div className="flex items-start">
                  <span className="font-medium text-gray-500 w-24">Entry:</span>
                  <span className="text-gray-700">{p.entry_time ? formatDateTimeIST(p.entry_time) : 'Not yet entered'}</span>
                </div>
                <div className="flex items-start">
                  <span className="font-medium text-gray-500 w-24">Exit:</span>
                  <span className="text-gray-700">{p.exit_time ? formatDateTimeIST(p.exit_time) : 'Not yet exited'}</span>
                </div>
                <div className="flex items-start">
                  <span className="font-medium text-gray-500 w-24">Valid Until:</span>
                  <span className="text-gray-700">{formatDateTimeIST(p.valid_until)}</span>
                </div>
                <div className="flex items-start">
                  <span className="font-medium text-gray-500 w-24">Entry Status:</span>
                  <span>
                    {p.entry_status ? (
                      <span className={`font-medium ${p.entry_status === 'entered' ? 'text-blue-600' : 'text-purple-600'}`}>
                        {p.entry_status === 'entered' ? 'Inside' : 'Exited'}
                      </span>
                    ) : (
                      <span className="text-gray-500">Not yet entered</span>
                    )}
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="font-medium text-gray-500 w-24">Pass Status:</span>
                  <span>
                    {new Date() > new Date(p.valid_until) ? (
                      <span className="text-red-500 font-semibold">Expired</span>
                    ) : (
                      <span className={`font-medium ${p.status === 'active' ? 'text-green-600' :
                          p.status === 'cancelled' ? 'text-yellow-600' :
                            p.status === 'deleted' ? 'text-red-600' :
                              'text-gray-600'
                        }`}>
                        {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                      </span>
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