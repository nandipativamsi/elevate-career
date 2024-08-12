import { useState } from 'react';
import { withRouter } from "react-router-dom";
import '../css/login.css';
import PropTypes from 'prop-types';
import { useAuth } from '../AuthContext.jsx'; // Import the custom hook to use AuthContext

function LoginForm(props) {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const { setUser } = useAuth(); // Destructure setUser from useAuth

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
                console.log(user);

                // Store user and token information
                setUser(user);
                // localStorage.setItem('token', token);

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

    // Voice input handling using Web Speech API
    const handleVoiceInput = (field) => {
        if (!('webkitSpeechRecognition' in window)) {
            alert('Voice input is not supported in this browser. Please use Google Chrome.');
            return;
        }

        const recognition = new window.webkitSpeechRecognition();
        recognition.lang = 'en-US';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = (event) => {
            const voiceInput = event.results[0][0].transcript;
            setFormData((prevData) => ({
                ...prevData,
                [field]: voiceInput,
            }));
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error', event);
        };

        recognition.start();
    };

    return (
        <div className="login-container">
            <div className="info-section">
                <h2>INFORMATION</h2>
                <p>
                    Welcome back! Log in to access your account and continue enjoying our services.
                </p>
                <p className="highlight">
                    Forgot your password? No worries, use the "Forgot Password" link to reset it.
                </p>
                <p>
                    Stay connected with us to get the latest updates and personalized recommendations.
                </p>
                <p className="highlight">
                    Not a member yet? Join us today by registering for an account!
                </p>
                <button className="account-button" onClick={redirectToRegister}>Register</button>
            </div>
            <div className="form-section">
                <h2>LOGIN FORM</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group" style={{ position: 'relative' }}>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                            style={{ paddingRight: '40px' }} 
                        />
                        <button
                            type="button"
                            onClick={() => handleVoiceInput('email')}
                            aria-label="Voice input for email"
                            style={{
                                position: 'absolute',
                                right: '10px',
                                top: '40%',
                                transform: 'translateY(-50%)',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '16px',
                            }}
                        >
                            🎤
                        </button>
                        {errors.email && <span style={{ color: 'red' }}>{errors.email}</span>}
                    </div>
                    <div className="form-group" style={{ position: 'relative' }}>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            style={{ paddingRight: '40px' }} 
                        />
                        <button
                            type="button"
                            onClick={() => handleVoiceInput('password')}
                            aria-label="Voice input for password"
                            style={{
                                position: 'absolute',
                                right: '10px',
                                top: '40%',
                                transform: 'translateY(-50%)',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '16px',
                            }}
                        >
                            🎤
                        </button>
                        {errors.password && <span style={{ color: 'red' }}>{errors.password}</span>}
                    </div>

                    <button type="submit" className="button-login">Login</button>
                    <p className="signup-link">
                        Don't have an account? <span onClick={redirectToRegister} style={{ cursor: 'pointer', color: '#007bff' }}>Register here</span>
                    </p>
                </form>
                {successMessage && <div className="alert alert-success">{successMessage}</div>}
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            </div>
        </div>
    );
}

LoginForm.propTypes = {
    updateTitle: PropTypes.func.isRequired,
    history: PropTypes.shape({
        push: PropTypes.func.isRequired
    }).isRequired
};

export default withRouter(LoginForm);