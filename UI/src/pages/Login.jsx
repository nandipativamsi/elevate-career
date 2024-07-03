import React, { useState } from 'react';
import { withRouter } from "react-router-dom";
import './login.css';

function LoginForm(props) {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const validate = () => {
        const newErrors = {};

        // Email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!emailPattern.test(formData.email)) {
            newErrors.email = "Invalid email address";
        }

        // Password validation
        if (!formData.password.trim()) {
            newErrors.password = "Password is required";
        } 
        // else if (formData.password.length < 8) {
        //     newErrors.password = "Password must be at least 8 characters";
        // }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validate()) {
            const query = `
                mutation login($credentials: LoginInput!) {
                    login(credentials: $credentials) {
                        user {
                            _id
                            name
                        }
                    }
                }
            `;

            try {
                const response = await fetch('http://localhost:3000/graphql', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        query,
                        variables: {
                            credentials: {
                                email: formData.email,
                                password: formData.password,
                            }
                        }
                    }),
                    credentials: 'include', // Important for session-based auth
                });

                const responseData = await response.json();

                if (responseData.errors) {
                    throw new Error(responseData.errors[0].message);
                }

                const { user } = responseData.data.login;

                setSuccessMessage('Login successful. Redirecting to home page..');
                setErrorMessage(null);

                setTimeout(() => {
                    redirectToHome();
                }, 2000);
            } catch (error) {
                console.error('There was an error logging in!', error);
                setErrorMessage('Invalid credentials. Please try again.');
                setSuccessMessage(null);
            }
        }
    };

    const redirectToHome = () => {
        props.updateTitle('Home');
        props.history.push('/home');
    };

    const redirectToRegister = () => {
        props.history.push('/register');
        props.updateTitle('Register');
    };

    return (
        <div>
            <div className="login-container">
                <form className="login-form" onSubmit={handleSubmit}>
                    <h2 className='login-header'>LOGIN</h2>
                    <div className="form-group">
                        <input 
                            type="email" 
                            name="email"
                            placeholder="Email Address" 
                            value={formData.email} 
                            onChange={handleChange}  
                        />
                        {errors.email && <span style={{ color: 'red' }}>{errors.email}</span>}
                    </div>
                    <div className="form-group">
                        <input 
                            type="password" 
                            name="password"
                            placeholder="Password" 
                            value={formData.password} 
                            onChange={handleChange}  
                        />
                        {errors.password && <span style={{ color: 'red' }}>{errors.password}</span>}
                    </div>
                    <button type="submit" className="login-button">Login</button>
                    <p className="signup-link">
                        Don't have an account?
                    </p>
                    <button type="button" className="register-button" onClick={redirectToRegister}>Register here</button>
                </form>
                <div className="alert alert-success mt-2" style={{ display: successMessage ? 'block' : 'none' }} role="alert">
                    {successMessage}
                </div>
                <div className="alert alert-danger mt-2" style={{ display: errorMessage ? 'block' : 'none' }} role="alert">
                    {errorMessage}
                </div>
            </div>
        </div>    
    )
}

export default withRouter(LoginForm);
