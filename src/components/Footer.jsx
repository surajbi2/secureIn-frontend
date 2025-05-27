import React from 'react'

const Footer = () => {
  return (
    <>
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto text-center">
          <p className="text-sm">© 2025 <strong>SecureIn</strong> | A product developed by central university of karnataka. All rights reserved.</p>
          <ul className="flex justify-center space-x-4 mt-2">
            <li><a href="#" className="text-white hover:text-gray-400">Privacy Policy</a></li>
            <li><a href="#" className="text-white hover:text-gray-400">Terms of Service</a></li>
            <li><a href="#" className="text-white hover:text-gray-400">Contact Us</a></li>
          </ul>
        </div>
      </footer>
    </>
  )
}

export default Footer
