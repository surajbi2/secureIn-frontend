import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/Back.jsx';
import { Link } from 'react-router-dom';
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const ContactUsPage = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
        <Link to="/">
        <Button/>
        </Link>
      <motion.h1
        className="text-4xl font-bold mb-12 text-center text-blue-700"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        Contact Us
      </motion.h1>

      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        {/* Contact Info Card */}
        <div className="bg-white rounded-2xl shadow-lg p-4 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Get in Touch</h2>

          <div className="space-y-6">
            {/* Row 1 */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex items-start space-x-4 w-full">
                <MapPin className="text-blue-600 w-6 h-6 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-800">Address</h3>
                  <p className="text-gray-600">
                    Central University of Karnataka<br />
                    Kadaganchi, Aland Road<br />
                    Kalaburagi - 585367, Karnataka, India
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 w-full">
                <Phone className="text-blue-600 w-6 h-6 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-800">Phone</h3>
                  <p className="text-gray-600">+91 12345-67890</p>
                </div>
              </div>
            </div>

            {/* Row 2 */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex items-start space-x-4 w-full">
                <Mail className="text-blue-600 w-6 h-6 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-800">Email</h3>
                  <p className="text-gray-600">security@cuk.ac.in</p>
                  <p className="text-gray-600">info@cuk.ac.in</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 w-full">
                <Clock className="text-blue-600 w-6 h-6 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-800">Office Hours</h3>
                  <p className="text-gray-600">Mon - Fri: 9:00 AM - 5:00 PM</p>
                  <p className="text-gray-600">Saturday - Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-6"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Our Location</h2>
          <div className="rounded-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3799.854246954917!2d76.673365!3d17.431973!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1717846740000!5m2!1sen!2sin"
              width="100%"
              height="350"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Central University of Karnataka Location"
            ></iframe>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ContactUsPage;
