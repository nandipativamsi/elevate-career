import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import './header.css'; 
import logo from '../assets/logo.png'; 

function Header(props) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check if user session exists
        axios.get('http://localhost:3000/api/current_user', { withCredentials: true })
            .then(response => {
                setUser(response.data.user);
            })
            .catch(error => {
                console.log('No active session found', error);
            });
    }, []);

    const capitalize = (s) => {
        if (typeof s !== 'string') return '';
        return s.charAt(0).toUpperCase() + s.slice(1);
    };

    let title = capitalize(props.location.pathname.substring(1, props.location.pathname.length));
    if (props.location.pathname === '/') {
        title = 'Welcome';
    }

    function handleLogout() {
        axios.post('http://localhost:3000/api/logout', {}, { withCredentials: true })
            .then(() => {
                setUser(null);
                props.history.push('/login');
            })
            .catch(error => {
                console.log('Error logging out', error);
            });
    }

    return (
        <header className="header">
            <div className="logo-container">
                <img src={logo} alt="Elevate Career" className="logo" />
            </div>
            <nav className="navigation">
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/jobboard">Job Board</a></li>
                    <li><a href="/help-center">Help Center</a></li>
                    {user ? (
                        <>
                            <li><a href="/addJob">Add Job</a></li>
                            <li><a href="/viewJobs">Jobs</a></li>
                            <li><a href="/addEvent">Add Event</a></li>
                            <li><a href="/viewEvents">Events</a></li>
                            <li><a href="/addResource">Add Resource</a></li>
                            <li><a href="/viewResources">Resources</a></li>
                            <li><a href="/" onClick={handleLogout}>Logout</a></li>
                            <li>Hello, {user.name}</li>
                        </>
                    ) : (
                        <>
                            <li><a href="/login">Login</a> / <a href="/register">Signup</a></li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
}

export default withRouter(Header);
