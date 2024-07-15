import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa'; 
import logo from '../assets/logo.webp'; 
import './footer.css'; 

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row className="footer-content">
          <Col xs={12} md={3} className="footer-column footer-logo-container">
            <img src={logo} alt="Elevate Career" className="footer-logo" />
            <div className="social-media-icons">
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
              <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
            </div>
          </Col>

          <Col xs={6} md={3} className="footer-column">
            <h4>Navigation</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/login">Login</a></li>
              <li><a href="/registration">Registration</a></li>
              <li><a href="/jobs-board">Jobs Board</a></li>
              <li><a href="/events">Events</a></li>
              <li><a href="/help-center">Help Center</a></li>
            </ul>
          </Col>
          <Col xs={6} md={3} className="footer-column">
            <h4>Contact</h4>
            <ul>
              <li><a href="/about">About Us</a></li>
              <li><a href="/profile">Profile</a></li>
              <li><a href="/applications">Applications</a></li>
              <li><a href="/faq">FAQ</a></li>
              <li><a href="/contact">Contact Us</a></li>
            </ul>
          </Col>
          <Col xs={12} md={3} className="footer-column">
            <h4>Follow Us</h4>
            <div className="social-media">
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
              <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
