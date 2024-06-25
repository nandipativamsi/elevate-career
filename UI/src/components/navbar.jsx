// import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import '../css/navbar.css'
import "../css/index.css"
import logo from "../assets/logo.png"

const MyNavbar = () => {
  return (
    <Navbar className='navbar'>
      <Container>
      <LinkContainer to="/">
          <Navbar.Brand>
            <img
              src={logo}
              alt="Logo"
              className="navbar-brand-img"
            />
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/">
              <Nav.Link>HOME</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/helpcenter">
              <Nav.Link>HELP CENTER</Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      <button className="my-btn nav-btn">LOGIN/SIGNUP</button>
      </Container>
    </Navbar>
  );
};

export default MyNavbar;
