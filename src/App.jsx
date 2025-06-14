import React from 'react'
import { Route, BrowserRouter as Router, Routes, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import SecurityDashboard from './pages/SecurityDashboard'
import HeadDashboard from './pages/HeadDashboard'
import VisitorEntryPage from './pages/VisitorEntryPage'
import EntryPassPage from './pages/EntryPassPage'
import VerifyPassPage from './pages/VerifyPassPage'
import EventsPage from './pages/EventsPage'
import ReportsPage from './pages/ReportsPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsOfServicePage from './pages/TermsOfServicePage'
import ContactUsPage from './pages/ContactUsPage'
import './App.css'
import QrVerifyPassPage from './pages/QrVerifyPassPage'
import NotFoundPage from './pages/NotFoundPage'
// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  console.log('ProtectedRoute user:', user, 'loading:', loading);
  if (loading) {
    // Optionally, render a loading indicator or null while verifying token
    return null;
  }
  if (!user) {
    return <Navigate to="/login" />;
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms-of-service" element={<TermsOfServicePage />} />
              <Route path="/contact-us" element={<ContactUsPage />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <DashboardPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/security-dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['security']}>
                    <SecurityDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/head-dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['staff']}>
                    <HeadDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/visitor-entry" 
                element={
                  <ProtectedRoute allowedRoles={['admin', 'security']}>
                    <VisitorEntryPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/entry-pass" 
                element={
                  <ProtectedRoute allowedRoles={['admin', 'security']}>
                    <EntryPassPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/verify-pass" 
                element={
                  <ProtectedRoute allowedRoles={['admin', 'security']}>
                    <VerifyPassPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/qr-verify-pass/:passId" 
                element={
                  <QrVerifyPassPage />
                } 
              />
              <Route 
                path="/events" 
                element={
                  <ProtectedRoute allowedRoles={['admin', 'staff']}>
                    <EventsPage />
                  </ProtectedRoute>
                } 
              />
              <Route
                path="/reports"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'staff', 'security']}>
                    <ReportsPage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
