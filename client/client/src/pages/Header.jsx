import React from 'react';
//import { withRouter } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { ACCESS_TOKEN_NAME } from '../constants/apiConstants';
import './header.css'; 
import logo from '../assets/logo.png'; 
function Header(props) {
    const location = useLocation();
    const capitalize = (s) => {
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
    }
    let title = capitalize(location.pathname.substring(1,location.pathname.length))
    if(location.pathname === '/') {
        title = 'Welcome'
    }
    function renderLogout() {
        if(location.pathname === '/home'){
            return(
                <div className="ml-auto">
                    <button className="btn btn-danger" onClick={() => handleLogout()}>Logout</button>
                </div>
            )
        }
    }
    function handleLogout() {
        
    }
    return(
        /*<nav className="navbar navbar-dark bg-primary">
            <div className="row col-12 d-flex justify-content-center text-white">
                <span className="h3">{props.title || title}</span>
                {renderLogout()}
            </div>
        </nav>*/

        <header className="header">
            <div className="logo-container">
                <img src={logo} alt="Elevate Career" className="logo" />
            </div>
            <nav className="navigation">
                <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/help-center">Help Center</a></li>
                <li><a href="/login">Login</a></li>
                <li><a href="/register">Signup</a></li>
                </ul>
            </nav>
        </header>
    )
}
export default Header;