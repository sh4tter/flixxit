import { createContext, useContext, useState, useEffect } from 'react';
import { authApiCalls } from '../utils/authApiCalls';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Check if user is logged in on app start
    const checkAuth = async () => {
      const storedUser = localStorage.getItem('adminUser');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          // Verify token is still valid
          const response = await authApiCalls.verifyToken(userData.accessToken);
          if (response.isValid && response.user && response.user.isAdmin) {
            console.log('User authenticated from storage:', response.user);
            setUser(response.user);
          } else {
            console.log('Token invalid, clearing storage');
            localStorage.removeItem('adminUser');
          }
        } catch (error) {
          console.error('Token verification error:', error);
          localStorage.removeItem('adminUser');
        }
      }
      setLoading(false);
      setAuthChecked(true);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      console.log('AuthContext: Starting login process...');
      const response = await authApiCalls.login(email, password);
      console.log('AuthContext: Login response received:', response);
      
      // Check if the response contains admin information
      if (response && response.isAdmin) {
        console.log('AuthContext: Login successful, setting user state...');
        
        // Set user state immediately
        setUser(response);
        localStorage.setItem('adminUser', JSON.stringify(response));
        console.log('AuthContext: User state updated and stored in localStorage');
        
        // Force a small delay to ensure state propagation
        await new Promise(resolve => setTimeout(resolve, 50));
        
        return { success: true };
      } else {
        console.log('AuthContext: Login failed - not admin user');
        return { 
          success: false, 
          message: 'Access denied. Admin privileges required.' 
        };
      }
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      return { 
        success: false, 
        message: error.message || 'Login failed. Please check your credentials.' 
      };
    }
  };

  const logout = () => {
    console.log('AuthContext: Logging out user');
    setUser(null);
    localStorage.removeItem('adminUser');
  };

  // Debug: Log user state changes
  useEffect(() => {
    console.log('AuthContext: User state changed:', user);
  }, [user]);

  const value = {
    user,
    loading,
    authChecked,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
