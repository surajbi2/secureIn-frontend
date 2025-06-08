import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <>
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto text-center">
          <p className="text-sm">© 2025 <strong>SecureIn</strong> | A product developed by Central University of Karnataka. All rights reserved.</p>
          <ul className="flex justify-center space-x-4 mt-2">
            <li>
              <Link to="/privacy-policy" className="text-white hover:text-gray-400 transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms-of-service" className="text-white hover:text-gray-400 transition-colors">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link to="/contact-us" className="text-white hover:text-gray-400 transition-colors">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
      </footer>
    </>
  )
}

export default Footer
