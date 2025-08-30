import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import HomePage from './pages/HomePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import MyReservationsPage from './pages/MyReservationsPage';
import AuthPage from './pages/AuthPage';
import Header from './components/Header';
import { Toaster, toast } from 'react-hot-toast';
import type { Role } from './types';

const ProtectedRoute: React.FC<{ children: React.ReactElement; role: Role }> = ({ children, role }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-800"></div></div>;
  }

  if (!user) {
    toast.error('You must be logged in to view this page.');
    return <Navigate to="/auth" replace />;
  }

  if (user.role !== role && user.role !== 'admin') { // Admins can access everything
     toast.error('You do not have permission to view this page.');
     return <Navigate to="/" replace />;
  }

  return children;
};


const App: React.FC = () => {
  return (
    <AuthProvider>
       <Toaster position="top-center" reverseOrder={false} />
      <HashRouter>
        <div className="min-h-screen flex flex-col font-sans">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route
                path="/my-reservations"
                element={
                  <ProtectedRoute role="customer">
                    <MyReservationsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute role="admin">
                    <AdminDashboardPage />
                  </ProtectedRoute>
                }
              />
               <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;
