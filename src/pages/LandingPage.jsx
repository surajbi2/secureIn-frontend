import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const LandingPage = () => {
  return (
    <div className="flex-1 bg-white text-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-20">
        <div className="container mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-balance"
          >
            Welcome to <span className="text-blue-600">SecureIn</span>
          </motion.h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            A secure and efficient gate entry system for <span className='text-gray-800'><strong>Central University of Karnataka.</strong></span>
          </p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <Link
              to="/login"
              className="inline-block px-8 py-4 bg-blue-600 text-white font-semibold text-lg rounded-lg shadow hover:bg-blue-700 transition duration-300"
            >
              Get Started
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Features</h2>
            <p className="mt-2 text-3xl sm:text-4xl font-bold">Better security, better management</p>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              Streamline your gate entry with our modern and intelligent access system.
            </p>
          </div>

          <div className="mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Quick Entry Process",
                desc: "Fast and efficient check-in for students, staff, and visitors.",
                icon: "M12 6v6m0 0v6m0-6h6m-6 0H6",
              },
              {
                title: "Enhanced Security",
                desc: "Real-time monitoring and smart alerts ensure a secure campus.",
                icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
              },
              {
                title: "Detailed Analytics",
                desc: "Track entries and generate insights with comprehensive reports.",
                icon:
                  "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
              },
              {
                title: "Easy Management",
                desc: "A clean interface for managing access approvals and logs.",
                icon:
                  "M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122",
              },
            ].map((feature, i) => (
              <div key={i} className="flex flex-col items-start p-5 rounded-xl bg-gray-50 hover:shadow-lg transition">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d={feature.icon} />
                  </svg>
                </div>
                <h4 className="mt-4 text-lg font-semibold">{feature.title}</h4>
                <p className="mt-2 text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
