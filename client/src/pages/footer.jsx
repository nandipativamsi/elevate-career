import React from 'react';
import logo from '../assets/logo.png'; 
import './footer.css'; 

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-column logo-container">
          <img src={logo} alt="Elevate Career" className="logo" />
        </div>
        <div className="footer-column">
          <h4>Navigation</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/login">Login</a></li>
            <li><a href="/registration">Registration</a></li>
            <li><a href="/jobs-board">Jobs Board</a></li>
            <li><a href="/events">Events</a></li>
            <li><a href="/help-center">Help Center</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>Contact</h4>
          <ul>
            <li><a href="/about">About Us</a></li>
            <li><a href="/profile">Profile</a></li>
            <li><a href="/applications">Applications</a></li>
            <li><a href="/faq">FAQ</a></li>
            <li><a href="/contact">Contact Us</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>Follow Us</h4>
          <div className="social-media">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
