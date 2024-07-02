import React, { useState } from 'react';
import { withRouter } from "react-router-dom";
import './login.css';

function RegistrationForm(props) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
        contactNumber: "",
        education: "",
        yearOfGraduation: "",
        workExperience: "",
    });

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const validate = () => {
        const newErrors = {};
        for (const key in formData) {
            if (!formData[key] && key !== 'confirmPassword') {
                newErrors[key] = `${key} is required`;
            }
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (validate()) {
            try {
                const query = `
                    mutation addUser($user: UserInput!) {
                        addUser(user: $user) {
                            _id
                        }
                    }
                `;
                
                const response = await fetch('http://localhost:3000/graphql', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        query,
                        variables: {
                            user: {
                                _id: formData._id,
                                name: formData.name,
                                email: formData.email,
                                password: formData.password,
                                role: formData.role,
                                contactNumber: formData.contactNumber,
                                education: formData.education,
                                yearOfGraduation: formData.yearOfGraduation,
                                workExperience: formData.workExperience,
                            }
                        }
                    }),
                });
    
                const responseData = await response.json();
    
                if (responseData.errors) {
                    throw new Error(responseData.errors[0].message);
                }
    
                setSuccessMessage('Registration successful. Redirecting to home page..');
    
                setFormData({
                    name: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                    role: "",
                    contactNumber: "",
                    education: "",
                    yearOfGraduation: "",
                    workExperience: "",
                });
                setErrors({});
                setTimeout(() => {
                    redirectToHome();
                }, 2000);
            } catch (error) {
                console.error('There was an error registering the user!', error);
            }
        }
    };

    const redirectToHome = () => {
        props.updateTitle('Login');
        props.history.push('/login');
    };

    const redirectToLogin = () => {
        props.updateTitle('Login');
        props.history.push('/login');
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2 className='login-header'>REGISTRATION</h2>
                <div className="form-group">
                    <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
                    {errors.name && <span style={{ color: 'red' }}>{errors.name}</span>}
                </div>
                <div className="form-group">
                    <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
                    {errors.email && <span style={{ color: 'red' }}>{errors.email}</span>}
                </div>
                <div className="form-group">
                    <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                    {errors.password && <span style={{ color: 'red' }}>{errors.password}</span>}
                </div>
                <div className="form-group">
                    <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
                    {errors.confirmPassword && <span style={{ color: 'red' }}>{errors.confirmPassword}</span>}
                </div>
                <div className="form-group">
                    <select name="role" value={formData.role} onChange={handleChange} required>
                        <option value="">Select User Type...</option>
                        <option value="Student">Student</option>
                        <option value="Alumni">Alumni</option>
                        <option value="Admin">Admin</option>
                    </select>
                    {errors.role && <span style={{ color: 'red' }}>{errors.role}</span>}
                </div>
                <div className="form-group">
                    <input type="text" name="contactNumber" placeholder="Contact Number" value={formData.contactNumber} onChange={handleChange} required />
                    {errors.contactNumber && <span style={{ color: 'red' }}>{errors.contactNumber}</span>}
                </div>
                <div className="form-group">
                    <select name="education" value={formData.education} onChange={handleChange} required>
                        <option value="">Select Education...</option>
                        <option value="Graduation">Graduation</option>
                        <option value="Masters">Masters</option>
                        <option value="Diploma">Diploma</option>
                        <option value="Degree">Degree</option>
                    </select>
                    {errors.education && <span style={{ color: 'red' }}>{errors.education}</span>}
                </div>
                <div className="form-group">
                    <input type="number" name="yearOfGraduation" min="2015" max="2027" placeholder="Year of Graduation" value={formData.yearOfGraduation} onChange={handleChange} required />
                    {errors.yearOfGraduation && <span style={{ color: 'red' }}>{errors.yearOfGraduation}</span>}
                </div>
                <div className="form-group">
                    <input type="number" name="workExperience" min="0" max="50" placeholder="Work Experience" value={formData.workExperience} onChange={handleChange} required />
                    {errors.workExperience && <span style={{ color: 'red' }}>{errors.workExperience}</span>}
                </div>
                <button type="submit" className="login-button">Register</button>
                {successMessage && <span style={{ color: 'green' }}>{successMessage}</span>}
                <div className="login-link">
                    <p>Already have an account? </p>
                </div>
                <button type="button" className="register-button" onClick={redirectToLogin}>Login</button>
            </form>
        </div>
    );
}

export default withRouter(RegistrationForm);
