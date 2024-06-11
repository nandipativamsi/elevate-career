// import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import '../css/navbar.css'
import "../css/index.css"
import { withRouter } from "react-router-dom";
import { ACCESS_TOKEN_NAME } from '../constants/apiConstants';
import logo from "../assets/logo.png"

const MyNavbar = (props) => {
  const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }
  let title = capitalize(props.location.pathname.substring(1, props.location.pathname.length))
  if (props.location.pathname === '/') {
    title = 'Welcome'
  }
  function renderLogout() {
    if (props.location.pathname === '/home') {
      return (
        <div className="ml-auto">
          <button className="btn btn-danger" onClick={() => handleLogout()}>Logout</button>
        </div>
      )
    }
  }
  // function handleLogout() {
  //   localStorage.removeItem(ACCESS_TOKEN_NAME)
  //   props.history.push('/login')
  // }
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

export default withRouter(MyNavbar);
