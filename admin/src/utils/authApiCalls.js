import axiosInstance from './axiosInstance';

export const authApiCalls = {
  login: async (email, password) => {
    try {
      console.log('Attempting admin login for:', email);
      const response = await axiosInstance.post('/auth/admin', {
        email,
        password,
      });
      console.log('Admin login successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('Admin login error:', error.response?.data || error.message);
      
      // Handle specific error cases
      if (error.response?.status === 401) {
        if (error.response?.data?.message === "Unauthorized") {
          throw new Error('Invalid email or password. Please check your credentials.');
        } else {
          throw new Error('Invalid email or password');
        }
      } else if (error.response?.status === 403) {
        throw new Error('Access denied. Admin privileges required.');
      } else if (error.response?.status === 404) {
        throw new Error('User not found. Please check your email address.');
      } else if (error.response?.status === 500) {
        throw new Error('Server error. Please try again later.');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNABORTED') {
        throw new Error('Connection failed. Please check your internet connection.');
      } else {
        throw new Error('Login failed. Please check your connection and try again.');
      }
    }
  },

  verifyToken: async (token) => {
    try {
      const response = await axiosInstance.get('/auth/verify', {
        headers: { token: `Bearer ${token}` }
      });
      return { isValid: true, user: response.data };
    } catch (error) {
      console.error('Token verification error:', error.response?.data || error.message);
      return { isValid: false, user: null };
    }
  },
};
