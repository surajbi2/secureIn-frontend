import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: delay => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.5, ease: 'easeOut' }
  })
};

const VisitorEntryPage = () => {
  const { register, handleSubmit, reset } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async data => {
    setIsLoading(true);
    try {
      
      console.log(data);
      toast.success('Visitor entry recorded successfully');
      reset();
    } catch {
      toast.error('Failed to record visitor entry');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-50 flex items-center justify-center p-1"
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      custom={0}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-lg max-w-2xl w-full p-8"
        variants={fadeInUp}
        custom={0.2}
      >
        <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          Visitor Entry
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={fadeInUp}
            custom={0.4}
          >
            {[
              { label: 'Visitor Name', name: 'visitorName', type: 'text' },
              { label: 'Phone Number', name: 'phoneNumber', type: 'tel' },
              { label: 'Purpose of Visit', name: 'purpose', type: 'text' },
              { label: 'Person to Meet', name: 'personToMeet', type: 'text' },
            ].map((field, i) => (
              <div key={field.name} className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  {...register(field.name, { required: true })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                />
              </div>
            ))}

            <motion.div
              className="space-y-1"
              variants={fadeInUp}
              custom={0.6}
            >
              <label className="block text-sm font-medium text-gray-700">
                ID Type
              </label>
              <select
                {...register('idType', { required: true })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              >
                <option value="">Select ID Type</option>
                <option value="aadhar">Aadhar Card</option>
                <option value="drivingLicense">Driving License</option>
                <option value="voterID">Voter ID</option>
                <option value="passport">Passport</option>
              </select>
            </motion.div>

            <motion.div
              className="space-y-1"
              variants={fadeInUp}
              custom={0.8}
            >
              <label className="block text-sm font-medium text-gray-700">
                ID Number
              </label>
              <input
                type="text"
                {...register('idNumber', { required: true })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </motion.div>

            <motion.div
              className="md:col-span-2 space-y-1"
              variants={fadeInUp}
              custom={1}
            >
              <label className="block text-sm font-medium text-gray-700">
                Additional Notes
              </label>
              <textarea
                {...register('notes')}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
            </motion.div>
          </motion.div>

          <motion.div
            className="flex justify-end space-x-4"
            variants={fadeInUp}
            custom={1.2}
          >
            <button
              type="button"
              onClick={() => reset()}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50"
            >
              {isLoading ? 'Recording...' : 'Record Entry'}
            </button>
          </motion.div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default VisitorEntryPage;
