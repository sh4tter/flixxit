import { useContext, useState, useEffect } from "react";
import { login } from "../../authContext/apiCalls";
import { AuthContext } from "../../authContext/AuthContext";
import LoadingSpinner from "../../components/LoadingSpinner";
import "./login.scss";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { user, isFetching, error: authError, dispatch } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Clear error when user starts typing
  const handleInputChange = (field, value) => {
    if (error) {
      setError("");
    }
    
    if (field === 'email') {
      setEmail(value);
    } else if (field === 'password') {
      setPassword(value);
    }
  };

  // Redirect to home page when user is authenticated
  useEffect(() => {
    if (user) {
      // Add a small delay to prevent quick redirects and show success state
      const timer = setTimeout(() => {
        navigate("/");
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [user, navigate]);

  // Handle auth errors from context
  useEffect(() => {
    if (authError) {
      setError("Invalid email or password. Please try again.");
    }
  }, [authError]);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (isLoading) return;
    
    setIsLoading(true);
    setError("");

    try {
      await login({ email, password }, dispatch);
      // Don't set loading to false here as the component will redirect
    } catch (err) {
      setIsLoading(false);
      console.error("Login error:", err);
      
      // Handle different types of errors
      if (err.response?.status === 401) {
        setError("Invalid email or password. Please check your credentials.");
      } else if (err.response?.status === 400) {
        setError("Please provide valid email and password.");
      } else if (err.response?.status === 500) {
        setError("Server error. Please try again later.");
      } else if (err.code === 'NETWORK_ERROR' || err.code === 'ECONNABORTED') {
        setError("Server is starting up. Please wait a moment and try again.");
      } else if (err.message && err.message.includes('timeout')) {
        setError("Server is taking longer than usual to respond. Please try again.");
      } else {
        setError("Login failed. Please try again.");
      }
    }
  };

  // Show loading spinner during cold start
  if (isLoading && !error) {
    return <LoadingSpinner message="Connecting to server..." />;
  }

  return (
    <div className="login">
      <div className="login-background">
        <div className="login-overlay"></div>
        <img 
          className="background-image"
          src="https://assets.nflxext.com/ffe/siteui/vlv3/530fc327-2ddb-4038-a3f0-2da2d9ccede1/9c547c8a-e707-4bdb-bdbc-843f134dd2a6/IN-en-20230619-popsignuptwoweeks-perspective_alpha_website_large.jpg"
          alt=""
        />
      </div>

      <div className="login-header">
        <div className="header-wrapper">
          <img
            className="logo"
            src="https://imgtr.ee/images/2023/07/29/874aa6d159c78664eba369521a387358.webp"
            alt="Flixxit"
          />
        </div>
      </div>

      <div className="login-container">
        <div className="login-card">
          <h1>Sign In</h1>
          
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}
          
          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                disabled={isLoading}
                className={email ? 'has-value' : ''}
              />
              <label htmlFor="email">Email or phone number</label>
            </div>

            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
                disabled={isLoading}
                className={password ? 'has-value' : ''}
              />
              <label htmlFor="password">Password</label>
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={isFetching || isLoading || !email || !password}
            >
              {isLoading ? (
                <span className="loading-spinner">
                  <div className="spinner"></div>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span className="checkmark"></span>
                Remember me
              </label>
              <a href="#" className="help-link">Need help?</a>
            </div>
          </form>

          <div className="login-footer">
            <p className="new-to-netflix">
              New to Flixxit?{" "}
              <Link to="/register" className="signup-link">
                Sign up now
              </Link>
            </p>
            <p className="recaptcha-notice">
              This page is protected by Google reCAPTCHA to ensure you're not a bot.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
