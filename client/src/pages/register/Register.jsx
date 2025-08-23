import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import "./register.scss";
import { register } from "../../authContext/apiCalls";

export default function Register() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Username validation
    if (!formData.username) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters long";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = "Username can only contain letters, numbers, and underscores";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    } else if (!isValidPassword(formData.password)) {
      newErrors.password = "Password must contain at least one number and one special character";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const userData = {
        email: formData.email,
        username: formData.username,
        password: formData.password,
      };
      
      console.log("Sending registration data:", { ...userData, password: "[HIDDEN]" });
      
      await register(userData);
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);
      
      // Handle different types of errors
      if (err.message) {
        // Use the specific error message from our improved apiCalls
        setErrors({ general: err.message });
      } else if (err.response?.status === 400) {
        const errorMessage = err.response?.data?.message || "Invalid registration data";
        setErrors({ general: errorMessage });
      } else if (err.response?.status === 409) {
        const errorMessage = err.response?.data?.message || "Email or username already exists";
        setErrors({ general: errorMessage });
      } else if (err.response?.status === 500) {
        setErrors({ general: "Server error. Please try again later." });
      } else if (err.code === 'NETWORK_ERROR' || err.code === 'ECONNABORTED') {
        setErrors({ general: "Server is starting up. Please wait a moment and try again." });
      } else if (err.message && err.message.includes('timeout')) {
        setErrors({ general: "Server is taking longer than usual to respond. Please try again." });
      } else {
        setErrors({ general: "Registration failed. Please check your connection and try again." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/;
    return passwordRegex.test(password);
  };

  // Show loading spinner during cold start
  if (isLoading && !errors.general) {
    return <LoadingSpinner message="Creating your account..." />;
  }

  return (
    <div className="register">
      <div className="register-background">
        <div className="register-overlay"></div>
        <img 
          className="background-image"
          src="https://assets.nflxext.com/ffe/siteui/vlv3/530fc327-2ddb-4038-a3f0-2da2d9ccede1/9c547c8a-e707-4bdb-bdbc-843f134dd2a6/IN-en-20230619-popsignuptwoweeks-perspective_alpha_website_large.jpg"
          alt=""
        />
      </div>

      <div className="register-header">
        <div className="header-wrapper">
          <img
            className="logo"
            src="https://imgtr.ee/images/2023/07/29/874aa6d159c78664eba369521a387358.webp"
            alt="Flixxit"
            onClick={() => navigate("/")}
          />
          <button className="signin-button" onClick={() => navigate("/login")}>
            Sign In
          </button>
        </div>
      </div>

      <div className="register-container">
        <div className="register-content">
          <div className="hero-section">
            <h1>Unlimited movies, TV shows, and more</h1>
            <h2>Watch anywhere. Cancel anytime.</h2>
            <p>Ready to watch? Enter your email to create or restart your membership.</p>
          </div>

          <div className="register-card">
            <h3>Create Account</h3>
            
            {errors.general && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {errors.general}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="register-form">
              <div className="input-group">
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  disabled={isLoading}
                  className={formData.email ? 'has-value' : ''}
                />
                <label htmlFor="email">Email address</label>
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>

              <div className="input-group">
                <input
                  type="text"
                  id="username"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  required
                  disabled={isLoading}
                  className={formData.username ? 'has-value' : ''}
                />
                <label htmlFor="username">Username</label>
                {errors.username && <span className="field-error">{errors.username}</span>}
              </div>

              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                  disabled={isLoading}
                  className={formData.password ? 'has-value' : ''}
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
                {errors.password && <span className="field-error">{errors.password}</span>}
              </div>

              <div className="input-group">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  required
                  disabled={isLoading}
                  className={formData.confirmPassword ? 'has-value' : ''}
                />
                <label htmlFor="confirmPassword">Confirm Password</label>
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </button>
                {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
              </div>

              <button
                type="submit"
                className="register-button"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading-spinner">
                    <div className="spinner"></div>
                    Creating Account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <div className="register-footer">
              <p className="already-member">
                Already have an account?{" "}
                <button 
                  className="signin-link"
                  onClick={() => navigate("/login")}
                  disabled={isLoading}
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
