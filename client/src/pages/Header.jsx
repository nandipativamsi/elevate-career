import React from 'react';
import { withRouter } from "react-router-dom";
import { ACCESS_TOKEN_NAME } from '../constants/apiConstants';
import './header.css'; 
import logo from '../assets/logo.png'; 
function Header(props) {
    const capitalize = (s) => {
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
    }
    let title = capitalize(props.location.pathname.substring(1,props.location.pathname.length))
    if(props.location.pathname === '/') {
        title = 'Welcome'
    }
    function renderLogout() {
        if(props.location.pathname === '/home'){
            return(
                <div className="ml-auto">
                    <button className="btn btn-danger" onClick={() => handleLogout()}>Logout</button>
                </div>
            )
        }
    }
    function handleLogout() {
        localStorage.removeItem(ACCESS_TOKEN_NAME)
        props.history.push('/login')
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
                <li><a href="/login-signup">Login / Signup</a></li>
                </ul>
            </nav>
        </header>
    )
}
export default withRouter(Header);