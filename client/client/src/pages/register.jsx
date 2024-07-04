import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL, ACCESS_TOKEN_NAME } from '../constants/apiConstants';
import { useNavigate } from 'react-router-dom';
import project from '../assets/project.jpg'; // Import the background image
import './login.css';

function RegistrationForm(props) {
    const [state, setState] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        whoAreYou: "",
        contactNumber: "",
        education: "",
        yearOfGraduation: "",
        workExperience: "",
        successMessage: null
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setState(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const sendDetailsToServer = () => {
        if (state.email.length && state.password.length) {
            props.showError(null);
            const payload = {
                "email": state.email,
                "password": state.password,
                "name": state.userName
            };
            axios.post(`${API_BASE_URL}/user/register`, payload)
                .then(function (response) {
                    if (response.status === 200) {
                        setState(prevState => ({
                            ...prevState,
                            'successMessage': 'Registration successful. Redirecting to home page...'
                        }));
                        localStorage.setItem(ACCESS_TOKEN_NAME, response.data.token);
                        redirectToHome();
                        props.showError(null);
                    } else {
                        props.showError("An error occurred during registration.");
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        } else {
            props.showError('Please enter a valid email and password.');
        }
    };

    const redirectToHome = () => {
        props.updateTitle('Home');
        props.history.push('/home');
    };

    const redirectToLogin = () => {
        props.updateTitle('Login');
        props.history.push('/login');
    };

    const handleSubmitClick = (e) => {
        e.preventDefault();
        if (state.password === state.confirmPassword) {
            sendDetailsToServer();
        } else {
            props.showError('Passwords do not match.');
        }
    };

    return (
        <div className="login-container" style={{ backgroundImage: `url(${project})` }}>
            <form className="login-form" onSubmit={handleSubmitClick}>
                <h2 className="login-header">Register</h2>
                <div className="form-group">
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        placeholder="First Name"
                        value={state.firstName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        placeholder="Last Name"
                        value={state.lastName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Email Address"
                        value={state.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Password"
                        value={state.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={state.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <select
                        id="whoAreYou"
                        name="whoAreYou"
                        value={state.whoAreYou}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Who are you?</option>
                        <option value="student">Student</option>
                        <option value="alumni">Alumni</option>
                    </select>
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        id="contactNumber"
                        name="contactNumber"
                        placeholder="Contact Number"
                        value={state.contactNumber}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <select
                        id="education"
                        name="education"
                        value={state.education}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Education Level</option>
                        <option value="graduation">Graduation</option>
                        <option value="masters">Masters</option>
                    </select>
                </div>
                <div className="form-group">
                    <select
                        id="yearOfGraduation"
                        name="yearOfGraduation"
                        value={state.yearOfGraduation}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Year of Graduation</option>
                        <option value="2023">2023</option>
                        <option value="2024">2024</option>
                    </select>
                </div>
                <div className="form-group">
                    <select
                        id="workExperience"
                        name="workExperience"
                        value={state.workExperience}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Years of Experience</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                    </select>
                </div>
                <button type="submit" className="login-button">Register</button>

                <div className="login-link">
                    <p>Already have an account? <button type="button" onClick={redirectToLogin} className="register-button-link">Login</button></p>
                </div>
            </form>
        </div>
    );
}

export default RegistrationForm;
