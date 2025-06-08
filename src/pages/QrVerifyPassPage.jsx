import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import moment from 'moment-timezone';
import { API_PATH } from '../path/apiPath';
import { formatDateTimeIST, formatTimeIST, getCurrentTimeIST } from '../utils/dateUtils';

const QrVerifyPassPage = () => {
  const { passId } = useParams();
  const [pass, setPass] = useState(null);
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    const fetchPass = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_PATH}/api/passes/verify/${passId}`);
        setPass(response.data.pass);
        setError(null);
      } catch (err) {
        const errorData = err.response?.data;
        const errorMessage = errorData?.message || 'Failed to verify pass';

        if (errorData?.code === 'NOT_FOUND') {
          setError(`Pass ID ${errorData.id}: ${errorMessage}`);
        } else {
          setError(errorMessage);
        }
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchPass();
  }, [passId]);
  const verifyPass = async () => {
    try {
      setVerifying(true);
      const response = await axios.post(`${API_PATH}/api/passes/${passId}/verify`);
      setVerificationResult(response.data);

      // Refetch the pass to get updated entry/exit times
      const updatedPassResponse = await axios.get(`${API_PATH}/api/passes/verify/${passId}`);
      setPass(updatedPassResponse.data.pass);

      toast.success(response.data.message);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to verify pass';
      toast.error(errorMessage);
      setVerificationResult({ error: errorMessage });
    } finally {
      setVerifying(false);
    }
  };
  const getStatusDisplay = () => {
    if (!pass) return null;

    const now = getCurrentTimeIST();
    const validFrom = moment.utc(pass.valid_from).tz('Asia/Kolkata');
    const validUntil = moment.utc(pass.valid_until).tz('Asia/Kolkata');

    // If pass has expired
    if (now > validUntil || pass.status === 'expired') {
      return {
        message: '❌ This pass has expired',
        details: `Expired on ${formatDateTimeIST(pass.valid_until)}`,
        color: 'text-red-600'
      };
    }

    // If pass is cancelled or deleted
    if (pass.status === 'cancelled') {
      return {
        message: '⚠️ This pass has been cancelled',
        details: 'Please contact the issuing authority',
        color: 'text-yellow-600'
      };
    }

    if (pass.status === 'deleted') {
      return {
        message: '❌ This pass has been deleted',
        details: 'Please contact the issuing authority',
        color: 'text-red-600'
      };
    }

    // If pass is not yet valid
    if (now < validFrom) {
      return {
        message: '⚠️ This pass is not yet valid',
        details: `Valid from ${formatDateTimeIST(pass.valid_from)}`,
        color: 'text-yellow-600'
      };
    }    // Check visit status
    if (pass.entry_status === 'exited' || (pass.entry_time && pass.exit_time)) {
      return {
        message: '✅ Pass has been fully used',
        details: `Exit recorded at ${formatTimeIST(pass.exit_time)}`,
        color: 'text-purple-600'
      };
    }

    if (pass.entry_status === 'entered' || pass.entry_time) {
      return {
        message: '🔵 Visitor currently inside',
        details: `Entry recorded at ${formatTimeIST(pass.entry_time)}`,
        color: 'text-blue-600'
      };
    }// Active pass, not yet used
    if (!pass.entry_time) {
      return {
        message: '🟢 Pass is ready for entry',
        details: `Valid until ${formatTimeIST(pass.valid_until)}`,
        color: 'text-green-600'
      };
    }

    // Pass has entry but no exit
    return {
      message: '🔵 Visitor currently inside',
      details: `Entry recorded at ${formatTimeIST(pass.entry_time)}`,
      color: 'text-blue-600'
    };
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-md text-center">
        <h1 className="text-3xl font-bold mb-6">QR Pass Verification</h1>
        <div className="animate-pulse text-gray-600">Loading pass verification...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-md text-center">
        <h1 className="text-3xl font-bold mb-6">QR Pass Verification</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-red-600 font-bold mb-4">{error}</div>
          <button
            onClick={() => window.location.href = '/verify-pass'}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Pass Verification
          </button>
        </div>
      </div>
    );
  }

  const status = getStatusDisplay();

  return (
    <div className="container mx-auto px-4 py-8 max-w-md text-center">
      <h1 className="text-3xl font-bold mb-6">QR Pass Verification</h1>
      {status && (
        <div className="mb-6">
          <p className={`text-xl font-bold ${status.color}`}>{status.message}</p>
          <p className="text-gray-600 mt-2">{status.details}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Pass Details</h2>
        <div className="space-y-3 text-left">
          <div>
            <span className="font-semibold">Pass ID:</span>
            <span className="ml-2">{pass.pass_id}</span>
          </div>
          <div>
            <span className="font-semibold">Visitor:</span>
            <span className="ml-2">{pass.visitor_name}</span>
          </div>
          {pass.visit_type=='parent_visit' && <div>
            <span className="font-semibold">Department:</span>
            <span className="ml-2">{pass.department}</span>
          </div>}
          <div>
            <span className="font-semibold">Purpose:</span>
            <span className="ml-2">{pass.purpose}</span>
          </div>
          <div>
            <span className="font-semibold">Visit Type:</span>
            <span className="ml-2 capitalize">{pass.visit_type.replace('_', ' ')}</span>
          </div>          <div>
            <span className="font-semibold">Valid Period:</span>
            <span className="ml-2">
              {formatDateTimeIST(pass.valid_from)} - {formatDateTimeIST(pass.valid_until)}
            </span>
          </div>
          {pass.entry_time && (
            <div>
              <span className="font-semibold">Entry Time:</span>
              <span className="ml-2">{formatDateTimeIST(pass.entry_time)}</span>
            </div>
          )}
          {pass.exit_time && (
            <div>
              <span className="font-semibold">Exit Time:</span>
              <span className="ml-2">{formatDateTimeIST(pass.exit_time)}</span>
            </div>
          )}
        </div>        {!error && (!pass.entry_status || pass.entry_status === 'entered') && (
          <button
            onClick={verifyPass}
            disabled={verifying || !pass || pass.entry_status === 'exited' || (pass.entry_time && pass.exit_time)}
            className={`mt-6 w-full py-2 px-4 rounded-lg text-white font-semibold
              ${verifying
                ? 'bg-gray-400 cursor-not-allowed'
                : pass.entry_status === 'entered'
                  ? 'bg-red-600 hover:bg-red-700 transition-colors'
                  : 'bg-blue-600 hover:bg-blue-700 transition-colors'}`}
          >
            {verifying
              ? 'Verifying...'
              : pass.entry_status === 'entered'
                ? 'Record Exit'
                : 'Record Entry'}
          </button>
        )}
      </div>
    </div>
  );
};

export default QrVerifyPassPage;
