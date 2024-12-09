import { useEffect, useState } from 'react';
import { Link, withRouter } from "react-router-dom";
import axios from 'axios';
import { FaBars, FaTimes } from 'react-icons/fa';
import '../css/header.css';
import { useAuth } from '../AuthContext.jsx'; // Import the custom hook to use AuthContext
import logo from '../assets/logo.webp';

function Header(props) {
    const [menuOpen, setMenuOpen] = useState(false);
    const { user, setUser } = useAuth(); // Destructure user and setUser from useAuth

    useEffect(() => {
        if (user) {
            // User is logged in, you can update your header state here if needed
            console.log('User is logged in:', user);
            // Perform any actions you need when the user is present
        } else {
            // User is not logged in
            console.log('No user found');
        }
    }, [user]); // Dependency on user, will run when user changes

    const capitalize = (s) => {
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
    }

    let title = capitalize(props.location.pathname.substring(1, props.location.pathname.length));
    if (props.location.pathname === '/') {
        title = 'Welcome';
    }

    function handleLogout() {
        setUser(null); // Reset user state
        localStorage.removeItem('user'); // Clear user info from local storage
        props.history.push('/login');
    }

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
                    <li><a href="/help-center">Help Center</a></li>
                    {user ? (
                        <>
                            <li><a href="/jobboard">Job Board</a></li>
                            <li><a href="/viewEvents">Events</a></li>
                            <li><a href="/viewResources">Resources</a></li>
                            <li><a href="/connections">Connections</a></li>
                            <li><Link to={`/profile`}>Profile</Link></li>
                            <li><a href="/addNew">Add New</a></li>
                            <li><a href="/" onClick={handleLogout}>Logout</a></li>
                            <li>Hello, {user.name}</li>
                        </>
                    ) : (
                        <>
                            <li><a href="/login">Login</a> / <a href="/register">Signup</a></li>
                        </>
                    )}
                </ul>
                <button className="menu-toggle" onClick={toggleMenu}>
                    {menuOpen ? <FaTimes /> : <FaBars />}
                </button>
            </nav>
        </header>
    )
}

export default withRouter(Header);
