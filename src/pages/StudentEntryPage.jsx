import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';

const StudentEntryPage = () => {
  const { register, handleSubmit, reset } = useForm();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/students/entries');
      setEntries(response.data);
    } catch (error) {
      toast.error('Failed to fetch entries');
      console.error(error);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/students/entries', data);
      toast.success('Entry recorded successfully');
      reset();
      fetchEntries();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to record entry');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleExit = async (entryId) => {
    try {
      await axios.put(`http://localhost:5000/api/students/entries/${entryId}/exit`);
      toast.success('Exit recorded successfully');
      fetchEntries();
    } catch (error) {
      toast.error('Failed to record exit');
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Student Entry Management</h1>
      
      {/* Entry Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Record New Entry</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Registration Number</label>
              <input
                {...register('registrationNumber', { required: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter registration number"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Purpose</label>
              <input
                {...register('purpose', { required: true })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Purpose of entry/exit"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Recording...' : 'Record Entry'}
            </button>
          </div>
        </form>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by registration number or name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>      {/* Recent Entries Table */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Recent Entries</h2>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration No.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entry Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Exit Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Purpose
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {entries
                .filter(entry => 
                  searchTerm === '' ||
                  entry.registration_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  entry.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((entry) => (
                  <tr key={entry.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {entry.registration_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {entry.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(entry.entry_time).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {entry.exit_time ? new Date(entry.exit_time).toLocaleString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {entry.purpose}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {!entry.exit_time && (
                        <button
                          onClick={() => handleExit(entry.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Record Exit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              {entries.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    No entries found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentEntryPage;
