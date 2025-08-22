import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import './App.scss';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading, authChecked } = useAuth();
  
  console.log('ProtectedRoute: Current state:', { user: !!user, loading, authChecked, isAdmin: user?.isAdmin });
  
  if (loading || !authChecked) {
    console.log('ProtectedRoute: Still loading or auth not checked...');
    return <div className="loading">Loading...</div>;
  }
  
  if (!user || !user.isAdmin) {
    console.log('ProtectedRoute: User not authenticated or not admin, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  console.log('ProtectedRoute: User authenticated, rendering protected content');
  return children;
};

// Login Route Component - redirect if already logged in
const LoginRoute = () => {
  const { user, loading, authChecked } = useAuth();
  
  console.log('LoginRoute: Current state:', { user: !!user, loading, authChecked, isAdmin: user?.isAdmin });
  
  if (loading || !authChecked) {
    return <div className="loading">Loading...</div>;
  }
  
  if (user && user.isAdmin) {
    console.log('LoginRoute: User already authenticated, redirecting to dashboard');
    return <Navigate to="/" replace />;
  }
  
  return <Login />;
};

// Main App Component
const AppContent = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginRoute />} />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

// App with Auth Provider
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
