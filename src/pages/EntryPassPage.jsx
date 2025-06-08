import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import moment from 'moment-timezone';
import 'react-datepicker/dist/react-datepicker.css';
import { API_PATH } from '../path/apiPath';
// Always parse as UTC and convert to local for display
const to12HourString = (dateStr) => {
  if (!dateStr) return '';
  // Parse time in UTC and convert to IST
  return moment.utc(dateStr).tz('Asia/Kolkata').format('YYYY-MM-DD h:mm A [IST]');
};

const EntryPassPage = () => {
  const { register, handleSubmit, reset, watch } = useForm();
  const [loading, setLoading] = useState(false);
  const [validFrom, setValidFrom] = useState(new Date());
  const [validUntil, setValidUntil] = useState(new Date());
  const [generatedPass, setGeneratedPass] = useState(null);
  const [events, setEvents] = useState([]);
  const visitType = watch('visitType');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data } = await axios.get(`${API_PATH}/api/events`);
      setEvents(data);
    } catch {
      toast.error('Failed to fetch events');
    }
  };

  const onSubmit = async (formValues) => {
    setLoading(true);
    try {
      const payload = {
        ...formValues,
        // Always send as UTC to backend
        validFrom: moment(validFrom).utc().format('YYYY-MM-DD HH:mm:ss'),
        validUntil: moment(validUntil).utc().format('YYYY-MM-DD HH:mm:ss'),
        eventId: formValues.eventId ? parseInt(formValues.eventId) : null,
      };

      const response = await axios.post(`${API_PATH}/api/passes`, payload);
      setGeneratedPass(response.data.pass);
      toast.success('Entry pass generated successfully');
      reset();
      setValidFrom(new Date());
      setValidUntil(new Date());
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate pass');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    const p = generatedPass;
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
          <div class="pass-id">Pass ID: ${p.pass_id}</div>
          <div class="qr-code"><img src="${p.qr_code}" /></div>         
          <div class="pass-details">
            ${p.visit_type === 'parent_visit' ? `
              <div class="info-container">
                <div class="info-section">
                  <h3>Visitor Information</h3>
                  <p><strong>Visitor Name:</strong> ${p.visitor_name}</p>
                  <p><strong>Phone Number:</strong> ${p.visitor_phone}</p>
                  <p><strong>ID Type:</strong> ${p.id_type.replace('_', ' ').toUpperCase()}</p>
                  <p><strong>ID Number:</strong> ${p.id_number}</p>
                  <p><strong>Visit Type:</strong> ${p.visit_type.replace('_', ' ').toUpperCase()}</p>
                  <p><strong>Purpose:</strong> ${p.purpose}</p>
                </div>
                <div class="info-section">
                  <h3>Student Information</h3>
                  <p><strong>Student Name:</strong> ${p.student_name}</p>
                  <p><strong>Relation:</strong> ${p.relation_to_student}</p>
                  <p><strong>Department:</strong> ${p.department}</p>
                </div>
              </div>
            ` : `
              <div style="text-align: left; padding: 0 20px;">
                <h3 style="border-bottom: 1px solid #ccc; padding-bottom: 5px; margin-bottom: 15px;">Visitor Information</h3>
                <p><strong>Visitor Name:</strong> ${p.visitor_name}</p>
                <p><strong>Phone Number:</strong> ${p.visitor_phone}</p>
                <p><strong>ID Type:</strong> ${p.id_type.replace('_', ' ').toUpperCase()}</p>
                <p><strong>ID Number:</strong> ${p.id_number}</p>
                <p><strong>Visit Type:</strong> ${p.visit_type.replace('_', ' ').toUpperCase()}</p>
                <p><strong>Purpose:</strong> ${p.purpose}</p>
                ${p.event_name ? `
                  <h3 style="border-bottom: 1px solid #ccc; padding-bottom: 5px; margin: 15px 0;">Event Details</h3>
                  <p><strong>Event:</strong> ${p.event_name}</p>
                ` : ''}
              </div>
            `}
            <div style="text-align: left; padding: 0 20px;">
              <h3 style="border-bottom: 1px solid #ccc; padding-bottom: 5px; margin: 15px 0;">Validity Period</h3>
              <p class="validity">
                <strong>Valid From:</strong> ${to12HourString(p.valid_from)}<br/>
                <strong>Valid Until:</strong> ${to12HourString(p.valid_until)}
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
        <script>window.onload = ()=>window.print();</script>
      </body></html>`;

    const w = window.open('', '_blank');
    w.document.write(printHTML);
    w.document.close();
  };

  const handleReset = () => {
    reset();
    setValidFrom(new Date());
    setValidUntil(new Date());
    setGeneratedPass(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-8xl">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">Generate Visitor Entry Pass</h1>

      <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-200">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 font-medium">Visit Type</label>
              <select
                {...register('visitType', { required: true })}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Type</option>
                <option value="event_guest">Event Guest</option>
                <option value="parent_visit">Parent Visit</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">Visitor Name</label>
              <input
                {...register('visitorName', { required: true })}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Phone Number</label>
              <input
                {...register('visitorPhone', { required: true })}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">ID Type</label>
              <select
                {...register('idType', { required: true })}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select ID Type</option>
                <option value="aadhar">Aadhar Card</option>
                <option value="pan">PAN Card</option>
                <option value="driving_license">Driving License</option>
                <option value="voter_id">Voter ID</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">ID Number</label>
              <input
                {...register('idNumber', { required: true })}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {visitType === 'event_guest' && (
              <div>
                <label className="block mb-1 font-medium">Event</label>
                <select
                  {...register('eventId', { required: true })}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Event</option>
                  {events.map(event => (
                    <option key={event.id} value={event.id}>
                      {event.name} ({to12HourString(event.start_date)} – {to12HourString(event.end_date)})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {visitType === 'parent_visit' && (
              <>
                <div>
                  <label className="block mb-1 font-medium">Student Name</label>
                  <input
                    {...register('studentName', { required: true })}
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Relation to Student</label>
                  <input
                    {...register('relationToStudent', { required: true })}
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Department</label>
                  <input
                    {...register('department', { required: true })}
                    className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block mb-1 font-medium">Purpose</label>
              <input
                {...register('purpose', { required: true })}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className='relative'>
              <label className="block mb-1 font-medium">Valid From</label>
              <DatePicker
                selected={validFrom}
                onChange={(date) => setValidFrom(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="MMMM d, yyyy h:mm aa"
                className="w-full border border-gray-300 rounded-md p-2"
                placeholderText="Select date and time"
              />
              <span className='absolute top-10 left-43'>
                <img src="deadline.png" height={24} width={24} alt="" />
              </span>
            </div>

            <div className='relative'>
              <label className="block mb-1 font-medium" >Valid Until</label>
              <DatePicker
                selected={validUntil}
                onChange={(date) => setValidUntil(date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="MMMM d, yyyy h:mm aa"
                className="w-full border border-gray-300 rounded-md p-2"
                placeholderText="Select date and time"
              />
              <span className='absolute top-10 left-43'>
                <img src="deadline.png" height={22} width={22} alt="" />
              </span>
            </div>

          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              {loading && <span className="loader h-4 w-4 border-2 border-t-transparent rounded-full animate-spin"></span>}
              {loading ? 'Generating...' : 'Generate Pass'}
            </button>
          </div>
        </form>
      </div>

      {generatedPass && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-green-700">Generated Entry Pass</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p><strong>Pass ID:</strong> {generatedPass.pass_id}</p>
              <p><strong>Visitor Name:</strong> {generatedPass.visitor_name}</p>
              <p><strong>Visit Type:</strong> {generatedPass.visit_type}</p>            
              <p><strong>Valid From:</strong> {to12HourString(generatedPass.valid_from)}</p>
              <p><strong>Valid Until:</strong> {to12HourString(generatedPass.valid_until)}</p>
            </div>
            <div className="flex justify-center items-center">
              <img src={generatedPass.qr_code} alt="QR Code" className="w-40 h-40" />
            </div>
          </div>
          <div className="mt-4 text-right">
            <button
              onClick={handlePrint}
              className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
            >
              Print Pass
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EntryPassPage;