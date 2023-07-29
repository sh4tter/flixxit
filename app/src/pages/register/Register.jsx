import { useRef } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./register.scss";
import { axiosInstance } from "../../axiosInstance";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();
  const emailRef = useRef();
  const passwordRef = useRef();
  const usernameRef = useRef();

  const handleStart = () => {
    const emailValue = emailRef.current.value.trim();
    if (!isValidEmail(emailValue)) {
      setEmailError("Invalid email address");
    } else {
      setEmailError("");
      setEmail(emailValue);
    }
  };

  const handleSignIn = () => {
    navigate("/login");
  };

  const handleFinish = async (e) => {
    e.preventDefault();
    setPassword(passwordRef.current.value);
    setUsername(usernameRef.current.value);
    if (!isValidPassword(password)) {
      setPasswordError(
        "Password should be at least 6 characters long and contain a special character and a number."
      );
    } else {
      setPasswordError("");
      try {
        await axiosInstance.post("auth/register", {
          email,
          username,
          password,
        });
        navigate("/login");
      } catch (err) {}
    }
  };

  const isValidEmail = (email) => {
    // Basic email validation using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password) => {
    // Password validation using regex
    const passwordRegex =
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/;
    return passwordRegex.test(password);
  };
  return (
    <div className="register">
      <div className="top">
        <div className="wrapper">
          <div>
            <img
              className="logo"
              src="https://imgtr.ee/images/2023/07/29/874aa6d159c78664eba369521a387358.webp"
              alt=""
            />
          </div>
          <div>
            <button className="loginButton" onClick={handleSignIn}>
              Sign In
            </button>
          </div>
        </div>
      </div>
      <div className="container">
        <h1>Unlimited movies, TV shows, and more.</h1>
        <h2>Watch anywhere. Cancel anytime.</h2>
        <p>
          Ready to watch? Enter your email to create or restart your membership.
        </p>
        {!email ? (
          <div className="input">
            <input
              className="formInputEmail"
              type="email"
              placeholder="email address"
              ref={emailRef}
            />
            {emailError && <span className="error">{emailError}</span>}
            <button className="registerButton" onClick={handleStart}>
              Get Started
            </button>
          </div>
        ) : (
          <form className="input">
            <input type="username" placeholder="username" ref={usernameRef} />
            <input
              type="password"
              placeholder="password"
              ref={passwordRef}
              autoComplete="new-password"
            />
            {passwordError && <span className="error">{passwordError}</span>}
            <button className="registerButton" onClick={handleFinish}>
              Start
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
