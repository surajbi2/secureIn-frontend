import React from 'react';
import { motion } from 'framer-motion';
import Button from '../components/Back.jsx';
import { Link } from 'react-router-dom';
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

const TermsOfServicePage = () => {
  const sections = [
    {
      title: 'Acceptance of Terms',
      content: `By accessing and using SecureIn, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.`,
    },
    {
      title: 'Service Description',
      content: (
        <>
          <p>SecureIn provides visitor management services including:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Entry pass generation and management</li>
            <li>QR code-based verification</li>
            <li>Visitor tracking and analytics</li>
            <li>Security monitoring and reporting</li>
          </ul>
        </>
      ),
    },
    {
      title: 'User Responsibilities',
      content: (
        <>
          <p>Users must:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide accurate and truthful information</li>
            <li>Maintain the confidentiality of their credentials</li>
            <li>Follow security protocols and guidelines</li>
            <li>Not misuse or attempt to circumvent the system</li>
            <li>Report any security concerns promptly</li>
          </ul>
        </>
      ),
    },
    {
      title: 'Limitations of Use',
      content: (
        <>
          <p>Users may not:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Share or transfer entry passes</li>
            <li>Use expired or invalid passes</li>
            <li>Create duplicate or fake passes</li>
            <li>Interfere with system operation</li>
          </ul>
        </>
      ),
    },
    {
      title: 'Intellectual Property',
      content: `All content, features, and functionality of SecureIn are owned by Central University of Karnataka and protected by intellectual property laws.`,
    },
    {
      title: 'Disclaimer of Warranties',
      content: `The service is provided "as is" without warranties of any kind. We do not guarantee uninterrupted or error-free operation.`,
    },
    {
      title: 'Limitation of Liability',
      content: `We shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.`,
    },
    {
      title: 'Changes to Terms',
      content: `We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.`,
    },
  ];

  return (
    
    <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link to="/" className='mb-6 inline-block'>
        <Button/>
        </Link>
      <motion.h1
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="text-4xl font-bold mb-10 text-center text-neutral-800"
      >
        Terms of Service
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-lg p-8 space-y-10"
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
            <h2 className="text-2xl font-semibold text-neutral-900 border-l-4 border-blue-600 pl-4">
              {section.title}
            </h2>
            <div className="text-gray-700 text-base leading-relaxed">
              {section.content}
            </div>
          </motion.section>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="pt-6 border-t text-sm text-gray-500"
        >
          <p>Last updated: June 8, 2025</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TermsOfServicePage;
