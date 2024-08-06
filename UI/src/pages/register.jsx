import { useState } from 'react';
import { withRouter } from "react-router-dom";
import './login.css';
import '../css/RegisterForm.css';
import PropTypes from 'prop-types';


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

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

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
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        }

        // Confirm Password validation
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        // Role validation
        if (!formData.role.trim()) {
            newErrors.role = "Select an appropriate role from dropdown";
        }

        // Contact Number validation
        const phonePattern = /^[0-9]{10}$/;
        if (!formData.contactNumber.trim()) {
            newErrors.contactNumber = "Contact number is required";
        } else if (!phonePattern.test(formData.contactNumber)) {
            newErrors.contactNumber = "Invalid contact number";
        }

        // Role validation
        if (!formData.role.trim()) {
            newErrors.education = "Select an appropriate role from dropdown";
        }

        // Education validation
        if (!formData.education.trim()) {
            newErrors.education = "Select an appropriate education from dropdown";
        }

        // Year of Graduation validation
        if (!formData.yearOfGraduation) {
            newErrors.yearOfGraduation = "Year of graduation is required";
        } else if (formData.yearOfGraduation < 2015 || formData.yearOfGraduation > 2027) {
            newErrors.yearOfGraduation = "Year of graduation must be between 2015 and 2027";
        }

        // Work Experience validation
        if (!formData.workExperience) {
            newErrors.workExperience = "Work experience is required";
        } else if (formData.workExperience < 0 || formData.workExperience > 50) {
            newErrors.workExperience = "Work experience must be between 0 and 50 years";
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
    
                setSuccessMessage('Registration successful. Redirecting to login page..');
    
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
                    redirectToLogin();
                }, 2000);
            } catch (error) {
                console.error('There was an error registering the user!', error);
            }
        }
    };

    const redirectToLogin = () => {
        props.updateTitle('Login');
        props.history.push('/login');
    };

    return (
        <div className="registration-container">
            <div className="info-section">
                <h2>INFORMATION</h2>
                <p>
    Registering for our events is quick and easy. Simply fill out the registration form with your details to secure your spot.
</p>
<p className="highlight">
    Benefits of Registration: Gain exclusive access to event materials, receive timely updates, and connect with fellow participants.
</p>
<p>
    Ensure to provide a valid email address as all important event information and updates will be sent to you via email.
</p>
<p className="highlight">
    Join Us: By registering, you become part of a vibrant community eager to share knowledge and experiences. Don't miss out!
</p>
<p>
    For any assistance during the registration process, our support team is always ready to help. Contact us at support@example.com.
</p>

                <button className="account-button" onClick={redirectToLogin}>Have An Account</button>
            </div>
            <div className="form-section">
                <h2>REGISTER FORM</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input 
                            type="text" 
                            name="name" 
                            placeholder="Full Name" 
                            value={formData.name} 
                            onChange={handleChange}  
                        />
                        {errors.name && <span style={{ color: 'red' }}>{errors.name}</span>}
                    </div>
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
                    <div className="form-group">
                        <input 
                            type="password" 
                            name="confirmPassword" 
                            placeholder="Confirm Password" 
                            value={formData.confirmPassword} 
                            onChange={handleChange}  
                        />
                        {errors.confirmPassword && <span style={{ color: 'red' }}>{errors.confirmPassword}</span>}
                    </div>
                    <div className="form-group">
                        <select name="role" value={formData.role} onChange={handleChange} >
                            <option value="">Select User Type...</option>
                            <option value="Student">Student</option>
                            <option value="Alumni">Alumni</option>
                            <option value="Admin">Admin</option>
                        </select>
                        {errors.role && <span style={{ color: 'red' }}>{errors.role}</span>}
                    </div>
                    <div className="form-group">
                        <input 
                            type="text" 
                            name="contactNumber" 
                            placeholder="Contact Number" 
                            value={formData.contactNumber} 
                            onChange={handleChange}  
                        />
                        {errors.contactNumber && <span style={{ color: 'red' }}>{errors.contactNumber}</span>}
                    </div>
                    <div className="form-group">
                        <select name="education" value={formData.education} onChange={handleChange}>
                            <option value="">Select Education...</option>
                            <option value="Graduation">Graduation</option>
                            <option value="Masters">Masters</option>
                            <option value="Diploma">Diploma</option>
                            <option value="Degree">Degree</option>
                        </select>
                        {errors.education && <span style={{ color: 'red' }}>{errors.education}</span>}
                    </div>
                    <div className="form-group">
                        <input 
                            type="number" 
                            name="yearOfGraduation" 
                            min="2015" 
                            max="2027" 
                            placeholder="Year of Graduation" 
                            value={formData.yearOfGraduation} 
                            onChange={handleChange}  
                        />
                        {errors.yearOfGraduation && <span style={{ color: 'red' }}>{errors.yearOfGraduation}</span>}
                    </div>
                    <div className="form-group">
                        <input 
                            type="number" 
                            name="workExperience" 
                            placeholder="Work Experience" 
                            value={formData.workExperience} 
                            onChange={handleChange}  
                        />
                        {errors.workExperience && <span style={{ color: 'red' }}>{errors.workExperience}</span>}
                    </div>
                        <button type="submit" className="button-register">Register</button>
                        {successMessage && <span style={{ color: 'green' }}>{successMessage}</span>}
                    </form>
            </div>
        </div>
    );
}
RegistrationForm.propTypes = {
    updateTitle: PropTypes.func.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired
    }).isRequired
  };

export default withRouter(RegistrationForm);
