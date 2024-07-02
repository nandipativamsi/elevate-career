import { useState } from 'react';
import { Link, withRouter } from "react-router-dom";
import { ACCESS_TOKEN_NAME } from '../constants/apiConstants';
import './header.css'; 
import logo from '../assets/logo.png'; 

function Header(props) {
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
    function handleLogout() {
        localStorage.removeItem(ACCESS_TOKEN_NAME)
        props.history.push('/login')
    }
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };
    return (
        <header className="header">
            <div className="logo-container">
                <Link to="/">
                    <img src={logo} alt="Elevate Career" className="logo" />
                </Link>
            </div>
            <nav className="navigation">
                <ul className={menuOpen ? 'show' : ''}>
                    <li><a href="/">Home</a></li>
                    <li><a href="/jobboard">Job Board</a></li>
                    <li><a href="/help-center">Help Center</a></li>
                    <li><a href="/login">Login / Signup</a></li>
                    <li><a href="/addJob">Add Job</a></li>
                    <li><a href="/viewJobs">Jobs</a></li>
                    <li><a href="/addEvent">Add Event</a></li>
                    <li><a href="/viewEvents">Events</a></li>
                    <li><a href="/addResource">Add Resource</a></li>
                    <li><a href="/viewResources">Resources</a></li>
                </ul>
                <button className={`menu-toggle ${menuOpen ? 'cancel-icon' : ''}`} onClick={toggleMenu}>
                    {menuOpen ? '✖' : '☰'}
                </button>
            </nav>
        </header>
    )
}

export default withRouter(Header);
