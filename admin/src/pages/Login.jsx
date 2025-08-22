import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.scss';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    if (user && user.isAdmin) {
      console.log('Login component: User already authenticated, redirecting to dashboard');
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (loading) return;
    
    setLoading(true);
    setError('');

    try {
      const result = await login(email, password);
      if (!result.success) {
        setError(result.message);
        setLoading(false);
        // Add a delay to keep error visible
        setTimeout(() => {
          setError('');
        }, 8000); // Keep error visible for 8 seconds
      } else {
        // Login successful - redirect manually as fallback
        console.log('Login successful, redirecting...');
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 100);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please try again.');
      setLoading(false);
      // Add a delay to keep error visible
      setTimeout(() => {
        setError('');
      }, 8000); // Keep error visible for 8 seconds
    }
  };

  const handleInputChange = (field, value) => {
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
    
    if (field === 'email') {
      setEmail(value);
    } else if (field === 'password') {
      setPassword(value);
    }
  };

  const clearError = () => {
    setError('');
  };

  return (
    <div className="login">
      <div className="login-container">
        <div className="login-header">
          <h1>Flixxit Admin</h1>
          <p>Sign in to manage your content</p>
        </div>

        {error && (
          <div className="error-message" style={{ animation: 'fadeIn 0.3s ease-in' }}>
            <div className="error-content">
              <strong>Login Failed:</strong> {error}
            </div>
            <button 
              className="error-dismiss" 
              onClick={clearError}
              title="Dismiss error"
            >
              ×
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              required
              placeholder="Enter your password"
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading || !email || !password} 
            className="login-button"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <p>Only admin users can access this panel</p>
          <p style={{ fontSize: '0.8rem', marginTop: '10px', opacity: 0.7 }}>
            Test credentials: sunnydowari@gmail.com / admin123
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
