import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Loader2, AlertTriangle, Users, ClipboardList, Calendar, Building2, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { API_PATH } from '../path/apiPath';

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

const FilterSection = ({ filters, setFilters, departments }) => (
  <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
    <input
      type="date"
      value={filters.startDate}
      onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
      className="rounded-lg border border-gray-300 px-4 py-2"
      placeholder="Start Date"
    />
    <input
      type="date"
      value={filters.endDate}
      onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
      className="rounded-lg border border-gray-300 px-4 py-2"
      placeholder="End Date"
    />
    <select
      value={filters.department}
      onChange={(e) => setFilters({ ...filters, department: e.target.value })}
      className="rounded-lg border border-gray-300 px-4 py-2"
    >
      <option value="">All Departments</option>
      {departments.map(dept => (
        <option key={dept} value={dept}>{dept}</option>
      ))}
    </select>
    <select
      value={filters.status}
      onChange={(e) => setFilters({ ...filters, status: e.target.value })}
      className="rounded-lg border border-gray-300 px-4 py-2"
    >
      <option value="">All Status</option>
      <option value="inside">Currently Inside</option>
      <option value="exited">Exited</option>
      <option value="expired">Expired</option>
    </select>
  </div>
);

const ReportsPage = () => {
  const { user } = useAuth();
  const [reportsData, setReportsData] = useState(null);
  const [visitorLogs, setVisitorLogs] = useState({ logs: [], deptStats: [], pagination: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    department: '',
    status: '',
    page: 1
  });
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_PATH}/api/reports`);
        setReportsData(response.data);

        // Extract unique departments from recent visitors
        const depts = [...new Set(response.data.recentVisitors
          .map(v => v.department)
          .filter(Boolean))];
        setDepartments(depts);
      } catch (err) {
        setError('Failed to load reports data.');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  useEffect(() => {
    const fetchVisitorLogs = async () => {
      try {
        const params = new URLSearchParams({
          ...filters,
          limit: 10
        });
        const response = await axios.get(`${API_PATH}/api/reports/visitor-logs?${params}`);
        setVisitorLogs(response.data);
      } catch (err) {
        console.error('Failed to load visitor logs:', err);
      }
    };

    fetchVisitorLogs();
  }, [filters]);

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

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
        <StatCard icon={Users} title="Currently Inside" value={reportsData.entryExitStats.currently_inside} color="text-blue-600" />
        <StatCard icon={ClipboardList} title="Total Exits Today" value={reportsData.entryExitStats.total_exits} color="text-green-600" />
        <StatCard icon={Calendar} title="Total Entries Today" value={reportsData.entryExitStats.total_entries} color="text-purple-600" />
        <StatCard icon={Building2} title="Total Events" value={reportsData.eventsCount} color="text-orange-600" />
      </div>

      <div className="mt-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">🧾 Visitor Logs</h2>
          <div className="flex items-center text-gray-600">
            <Filter size={20} className="mr-2" />
            <span>Filter Logs</span>
          </div>
        </div>

        <FilterSection
          filters={filters}
          setFilters={setFilters}
          departments={departments}
        />

        {visitorLogs.deptStats.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Department Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {visitorLogs.deptStats.map(stat => (
                <div key={stat.department} className="bg-white rounded-lg shadow p-4">
                  <h4 className="font-semibold text-gray-800">{stat.department}</h4>
                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    <p>Total Visits: {stat.total_visits}</p>
                    <p>Currently Inside: {stat.currently_inside}</p>
                    <p>Avg. Duration: {Math.round(stat.avg_duration_minutes)} mins</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl overflow-hidden shadow-lg">
            <thead className="bg-gray-100 text-gray-700 text-center">
              <tr>
                <th className="py-3 px-4">Visitor Name</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Purpose</th>
                <th className="py-3 px-4">Entry Time</th>
                <th className="py-3 px-4">Exit Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Duration</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {visitorLogs.logs.map((visitor, index) => (
                <tr
                  key={visitor.pass_id}
                  className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                >
                  <td className="py-3 px-4 text-center">{visitor.visitor_name}</td>
                  <td className="py-3 px-4 text-center">{visitor.department}</td>
                  <td className="py-3 px-4 text-center">{visitor.purpose}</td>
                  <td className="py-3 px-4 text-center">
                    {new Date(visitor.entry_time).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {visitor.exit_time ? new Date(visitor.exit_time).toLocaleString() : '-'}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${visitor.current_status === 'inside' ? 'bg-green-100 text-green-800' :
                        visitor.current_status === 'exited' ? 'bg-blue-100 text-blue-800' :
                          visitor.current_status === 'expired' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'}`}>
                      {visitor.current_status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {visitor.duration_minutes ? `${Math.round(visitor.duration_minutes)} mins` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {visitorLogs.pagination && (
          <div className="mt-6 flex justify-center gap-2">
            <button
              onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}
              disabled={filters.page === 1}
              className="px-4 py-2 rounded-lg bg-gray-100 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {filters.page} of {visitorLogs.pagination.totalPages}
            </span>
            <button
              onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}
              disabled={filters.page === visitorLogs.pagination.totalPages}
              className="px-4 py-2 rounded-lg bg-gray-100 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
