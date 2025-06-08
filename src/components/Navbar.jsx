import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleLogout = () => {
    signOut();
    navigate('/login');
  };
  
  const getNavLinks = () => {
    if (user?.role === 'admin') {
      return [
        { name: 'Dashboard', to: '/dashboard' },
        { name: 'Generate Pass', to: '/entry-pass' },
        { name: 'Verify Pass', to: '/verify-pass' },
        { name: 'Events', to: '/events' },
        { name: 'Reports', to: '/reports' },
      ];
    } else if (user?.role === 'security') {
      return [
        { name: 'Dashboard', to: '/security-dashboard' },
        { name: 'Generate Pass', to: '/entry-pass' },
        { name: 'Verify Pass', to: '/verify-pass' },
        { name: 'Reports', to: '/reports' }
      ];
    } else if (user?.role === 'head') {
      return [
        { name: 'Dashboard', to: '/head-dashboard' },
        { name: 'Events', to: '/events' },
        { name: 'Reports', to: '/reports' }
      ];
    }
    return [];
  };

  const navLinks = getNavLinks();

  const linkClass =
    'text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium';

  return (
    <nav className="bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-white text-xl font-bold tracking-tight">
            🔐 SecureIn - CUK
          </Link>
          {user && (
            <>
              {/* Desktop Menu */}
              <div className="hidden md:flex space-x-4 items-center">
                
                {navLinks.map((link) => (
                  <Link key={link.name} to={link.to} className={linkClass}>
                    {link.name}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Logout
                </button>
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md focus:outline-none"
                >
                  <span className="sr-only">Toggle menu</span>
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {isOpen ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    )}
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {user && isOpen && (
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.to}
              onClick={() => setIsOpen(false)}
              className="block text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium"
            >
              {link.name}
            </Link>
          ))}
          <button
            onClick={() => {
              handleLogout();
              setIsOpen(false);
            }}
            className="block w-full text-left text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
