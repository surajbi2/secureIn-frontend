import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Plus, CalendarCheck, Trash2, Pencil } from 'lucide-react';
import { API_PATH } from '../path/apiPath';
const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { user } = useAuth();

  const initialFormData = {
    name: '',
    description: '',
    venue: '',
    startDate: '',
    endDate: '',
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${API_PATH}/api/events`);
      setEvents(response.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch events');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (selectedEvent) {
        await axios.put(`${API_PATH}/api/events/${selectedEvent.id}`, formData);
        toast.success('Event updated successfully');
      } else {
        await axios.post(`${API_PATH}/api/events`, formData);
        toast.success('Event created successfully');
      }

      setFormData(initialFormData);
      setSelectedEvent(null);
      setShowForm(false);
      fetchEvents();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (event) => {
    setSelectedEvent(event);
    setFormData({
      name: event.name,
      description: event.description,
      venue: event.venue,
      startDate: new Date(event.start_date).toISOString().split('T')[0],
      endDate: new Date(event.end_date).toISOString().split('T')[0],
    });
    setShowForm(true);
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      await axios.delete(`${API_PATH}/api/events/${eventId}`);
      toast.success('Event deleted successfully');
      fetchEvents();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to delete event');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <CalendarCheck className="w-7 h-7 text-blue-500" />
            Events Management
          </h1>
          <p className="text-gray-500 mt-1">Manage and organize your department's events.</p>
        </div>
        <button
          onClick={() => {
            setSelectedEvent(null);
            setFormData(initialFormData);
            setShowForm(!showForm);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          <Plus className="w-5 h-5" />
          {showForm ? 'Cancel' : 'Add Event'}
        </button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-md mb-10"
        >
          <h2 className="text-xl font-semibold mb-4">
            {selectedEvent ? 'Edit Event' : 'Create New Event'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Event Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full border-gray-300 border rounded-md hover:shadow-xl focus:ring-blue-500 focus:border-blue-500 p-2"
                  placeholder='Enter event name'
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Venue</label>
                <input
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleInputChange}
                  required
                  className="w-full border-gray-300 border rounded-md hover:shadow-xl focus:ring-blue-500 focus:border-blue-500 p-2"
                  placeholder='Enter venue'
                />
              </div>
              <div className="md:col-span-2">
                <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full border-gray-300 border rounded-md hover:shadow-xl focus:ring-blue-500 focus:border-blue-500 p-2"
                  placeholder='Enter event description'
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                  className="w-full border-gray-300 border rounded-md hover:shadow-xl focus:ring-blue-500 focus:border-blue-500 p-2"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  required
                  className="w-full border-gray-300 border rounded-md hover:shadow-xl focus:ring-blue-500 focus:border-blue-500 p-2"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setSelectedEvent(null);
                  setFormData(initialFormData);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : selectedEvent ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-xl shadow overflow-hidden"
      >
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Event Name', 'Venue', 'Date', 'Created By', 'Actions'].map((header) => (
                <th
                  key={header}
                  className={`px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase ${
                    header === 'Actions' && 'text-right'
                  }`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {events.map((event) => (
              <tr key={event.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{event.name}</div>
                  <div className="text-sm text-gray-500">{event.description}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{event.venue}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(event.start_date).toLocaleDateString()} –{' '}
                  {new Date(event.end_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{event.creator_name}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => handleEdit(event)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
};

export default EventsPage;
