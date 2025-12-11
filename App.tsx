import React, { ReactNode } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { UserPortal } from './pages/UserPortal';
import { UserProfile } from './pages/UserProfile';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';

// Protected Route Component for Admin Dashboard
const ProtectedAdminRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAdmin } = useAuth();
  
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

// Route wrapper for portal (needs login)
const ProtectedUserRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div className="bg-gray-50 dark:bg-[#050505] min-h-screen text-gray-900 dark:text-gray-100 font-sans selection:bg-red-500 selection:text-white transition-colors duration-300">
    <Navbar />
    {children}
  </div>
);

const AppRoutes = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        
        <Route path="/portal" element={
          <ProtectedUserRoute>
            <UserPortal />
          </ProtectedUserRoute>
        } />

        <Route path="/profile" element={
          <ProtectedUserRoute>
            <UserProfile />
          </ProtectedUserRoute>
        } />
        
        <Route path="/admin/login" element={<AdminLogin />} />
        
        <Route path="/admin/dashboard" element={
          <ProtectedAdminRoute>
            <AdminDashboard />
          </ProtectedAdminRoute>
        } />
      </Routes>
    </Layout>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <AppRoutes />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;