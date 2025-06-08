import React from 'react';
import { motion } from 'framer-motion';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: 'easeOut',
    },
  }),
};

const PrivacyPolicyPage = () => {
  const sections = [
    {
      title: 'Information We Collect',
      content: (
        <>
          <p>When you use SecureIn, we collect the following types of information:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Personal information (name, phone number, ID details)</li>
            <li>Student information for parent visits</li>
            <li>Visit purpose and timing information</li>
            <li>Entry and exit timestamps</li>
            <li>QR code scanning data</li>
          </ul>
        </>
      ),
    },
    {
      title: 'How We Use Your Information',
      content: (
        <>
          <p>We use the collected information for:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Generating and managing entry passes</li>
            <li>Verifying visitor identity</li>
            <li>Maintaining security records</li>
            <li>Generating visitor analytics and reports</li>
            <li>Improving our services</li>
          </ul>
        </>
      ),
    },
    {
      title: 'Data Security',
      content: (
        <>
          <p>We implement security measures to protect your information:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Secure data storage with encryption</li>
            <li>Access controls and authentication</li>
            <li>Regular security audits</li>
            <li>Limited data retention periods</li>
          </ul>
        </>
      ),
    },
    {
      title: 'Data Retention',
      content: (
        <>
          <p>We retain visitor information for:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Active passes: Until expiration</li>
            <li>Visit records: 6 months</li>
            <li>Analytics data: 1 year</li>
          </ul>
        </>
      ),
    },
    {
      title: 'Your Rights',
      content: (
        <>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access your personal information</li>
            <li>Request corrections to your data</li>
            <li>Request data deletion</li>
            <li>Object to data processing</li>
          </ul>
        </>
      ),
    },
    {
      title: 'Updates to Privacy Policy',
      content: (
        <p>
          We may update this privacy policy from time to time. Any changes will be posted on this page with an updated revision date.
        </p>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <motion.h1
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-extrabold text-slate-800 text-center mb-10"
      >
        Privacy Policy
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white max-w-4xl mx-auto rounded-xl shadow-lg p-8 space-y-10"
      >
        {sections.map((section, i) => (
          <motion.section
            key={i}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="space-y-4"
          >
            <h2 className="text-2xl font-semibold text-slate-800 border-l-4 border-sky-500 pl-4">
              {section.title}
            </h2>
            <div className="text-slate-600 text-base leading-relaxed">
              {section.content}
            </div>
          </motion.section>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="pt-6 border-t text-sm text-slate-400"
        >
          <p>Last updated: June 8, 2025</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PrivacyPolicyPage;
