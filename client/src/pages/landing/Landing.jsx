import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TrendingMovies from '../../components/trending/TrendingMovies';
import './landing.scss';

const Landing = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleGetStarted = (e) => {
    e.preventDefault();
    if (email) {
      navigate('/register', { state: { email } });
    }
  };

  const handleSignIn = () => {
    navigate('/login');
  };

  return (
    <div className="landing">
      <div className="landing-background">
        <div className="landing-overlay"></div>
        <img 
          className="background-image"
          src="https://assets.nflxext.com/ffe/siteui/vlv3/530fc327-2ddb-4038-a3f0-2da2d9ccede1/9c547c8a-e707-4bdb-bdbc-843f134dd2a6/IN-en-20230619-popsignuptwoweeks-perspective_alpha_website_large.jpg"
          alt=""
        />
      </div>

      <div className="landing-header">
        <div className="header-wrapper">
          <img
            className="logo"
            src="https://imgtr.ee/images/2023/07/29/874aa6d159c78664eba369521a387358.webp"
            alt="Flixxit"
          />
          <div className="header-right">
            <select className="language-selector">
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
            </select>
            <button className="signin-button" onClick={handleSignIn}>
              Sign In
            </button>
          </div>
        </div>
      </div>

      <div className="landing-content">
        <div className="hero-section">
          <h1>Unlimited movies, TV shows, and more</h1>
          <h2>Starts at ₹149. Cancel at any time.</h2>
          <p>Ready to watch? Enter your email to create or restart your membership.</p>
          
          <form onSubmit={handleGetStarted} className="email-form">
            <div className="input-group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
              />
            </div>
            <button type="submit" className="get-started-button">
              Get Started &gt;
            </button>
          </form>
        </div>
      </div>

      <div className="landing-sections">
        {/* Trending Now Section */}
        <TrendingMovies />

        {/* Features Section */}
        <section className="features-section">
          <h2>More reasons to join</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Enjoy on your TV</h3>
              <p>Watch on smart TVs, PlayStation, Xbox, Chromecast, Apple TV, Blu-ray players and more.</p>
              <div className="feature-icon">📺</div>
            </div>
            <div className="feature-card">
              <h3>Download your shows to watch offline</h3>
              <p>Save your favourites easily and always have something to watch.</p>
              <div className="feature-icon">⬇️</div>
            </div>
            <div className="feature-card">
              <h3>Watch everywhere</h3>
              <p>Stream unlimited movies and TV shows on your phone, tablet, laptop and TV.</p>
              <div className="feature-icon">📱</div>
            </div>
            <div className="feature-card">
              <h3>Create profiles for kids</h3>
              <p>Send kids on adventures with their favourite characters in a space made just for them — free with your membership.</p>
              <div className="feature-icon">👶</div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-list">
            <div className="faq-item">
              <button className="faq-question">
                What is Flixxit?
                <span className="faq-icon">+</span>
              </button>
            </div>
            <div className="faq-item">
              <button className="faq-question">
                How much does Flixxit cost?
                <span className="faq-icon">+</span>
              </button>
            </div>
            <div className="faq-item">
              <button className="faq-question">
                Where can I watch?
                <span className="faq-icon">+</span>
              </button>
            </div>
            <div className="faq-item">
              <button className="faq-question">
                How do I cancel?
                <span className="faq-icon">+</span>
              </button>
            </div>
            <div className="faq-item">
              <button className="faq-question">
                What can I watch on Flixxit?
                <span className="faq-icon">+</span>
              </button>
            </div>
            <div className="faq-item">
              <button className="faq-question">
                Is Flixxit good for kids?
                <span className="faq-icon">+</span>
              </button>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="bottom-cta">
          <p>Ready to watch? Enter your email to create or restart your membership.</p>
          <form onSubmit={handleGetStarted} className="email-form">
            <div className="input-group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
              />
            </div>
            <button type="submit" className="get-started-button">
              Get Started &gt;
            </button>
          </form>
        </section>
      </div>

      <footer className="landing-footer">
        <div className="footer-content">
          <p className="contact-info">Questions? Call 000-800-919-1743</p>
          <div className="footer-links">
            <div className="footer-column">
              <a href="#">FAQ</a>
              <a href="#">Account</a>
              <a href="#">Investor Relations</a>
              <a href="#">Ways to Watch</a>
              <a href="#">Privacy</a>
              <a href="#">Corporate Information</a>
              <a href="#">Speed Test</a>
              <a href="#">Only on Flixxit</a>
            </div>
            <div className="footer-column">
              <a href="#">Help Centre</a>
              <a href="#">Media Centre</a>
              <a href="#">Jobs</a>
              <a href="#">Terms of Use</a>
              <a href="#">Cookie Preferences</a>
              <a href="#">Contact Us</a>
              <a href="#">Legal Notices</a>
            </div>
          </div>
          <div className="footer-bottom">
            <select className="language-selector">
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
            </select>
            <p className="region">Flixxit India</p>
          </div>
          <p className="legal-notice">
            This page is protected by Google reCAPTCHA to ensure you're not a bot. Learn more.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
