import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import moment from 'moment-timezone';

const QrVerifyPassPage = () => {
  const { passId } = useParams();
  const [pass, setPass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPass = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/passes/verify/${passId}`);
        setPass(response.data.pass);
        setError(null);
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to verify pass';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchPass();
  }, [passId]);

  if (loading) {
    return <div className="text-center mt-10">Loading pass verification...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-600 font-bold">{error}</div>;
  }
  const getStatusDisplay = () => {
    if (!pass) return null;

    switch (pass.status) {
      case 'active':
        return {
          message: '✅ This pass is valid and active.',
          color: 'text-green-600'
        };
      case 'pending':
        return {
          message: '⚠️ This pass is not yet valid.',
          color: 'text-yellow-600'
        };
      case 'used':
        return {
          message: '❌ This pass has already been used.',
          color: 'text-red-600'
        };
      case 'expired':
        return {
          message: '❌ This pass has expired.',
          color: 'text-red-600'
        };
      default:
        return {
          message: '❌ This pass is invalid.',
          color: 'text-red-600'
        };
    }
  };

  const status = getStatusDisplay();

  return (
    <div className="container mx-auto px-4 py-8 max-w-md text-center">
      <h1 className="text-3xl font-bold mb-6">QR Pass Verification</h1>
      {status && (
        <div className="mb-6">
          <p className={`text-xl font-bold ${status.color}`}>{status.message}</p>
          {pass.validation_message && (
            <p className="text-gray-600 mt-2">{pass.validation_message}</p>
          )}
        </div>
      )}
      {pass && (
        <div className="mt-4 text-left border p-4 rounded shadow bg-white">
          <p><strong>Pass ID:</strong> {pass.pass_id}</p>
          <p><strong>Visitor Name:</strong> {pass.visitor_name}</p>
          <p><strong>Visit Type:</strong> {pass.visit_type}</p>          <p><strong>Purpose:</strong> {pass.purpose}</p>
          <p><strong>Valid From:</strong> {moment(pass.valid_from).tz('Asia/Kolkata').format('MMM D, YYYY, hh:mm A')}</p>
          <p><strong>Valid Until:</strong> {moment(pass.valid_until).tz('Asia/Kolkata').format('MMM D, YYYY, hh:mm A')}</p>
          <p><strong>Status:</strong> {pass.status}</p>
        </div>
      )}
    </div>
  );
};

export default QrVerifyPassPage;
