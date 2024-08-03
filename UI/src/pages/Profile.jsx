import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext.jsx';
import { Form, Button, Container, Row, Col, Alert, Card } from 'react-bootstrap';
import '../css/profile.css';
import UserPhoto from "../assets/user.jpg"
// import axios from 'axios';

const ProfilePage = () => {
    const { user, setUser } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        contactNumber: '',
        yearOfGraduation: '',
        education: '',
        workExperience: '',
        skills: '',
        interests: '',
        linkedInURL: '',
        gitHubURL: '',
        socialMediaURL: '',
    });

    const [errors, setErrors] = useState({});
    const [imageFile, setImageFile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            if (user) {
                try {
                    const query = `
                        query getUserById($id: ID!) {
                            getUserById(id: $id) {
                                name
                                email
                                contactNumber
                                yearOfGraduation
                                education
                                workExperience
                                skills
                                interests
                                linkedInURL
                                gitHubURL
                                socialMediaURL
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
                            variables: { id: user._id }
                        }),
                    });

                    const result = await response.json();
                    setFormData(result.data.getUserById);
                } catch (error) {
                    console.error('Error fetching profile data:', error);
                }
            }
        };

        fetchProfile();
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const validate = () => {
        const newErrors = {};
        ['name', 'email', 'contactNumber', 'yearOfGraduation', 'education', 'workExperience'].forEach(field => {
            if (!formData[field]) {
                newErrors[field] = `${field} is required`;
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validate()) {
            try {
                const query = `
                    mutation updateUser($id: ID!, $user: UpdateUser!) {
                        updateUser(id: $id, user: $user) {
                            _id
                        }
                    }
                `;

                const profileResponse = await fetch('http://localhost:3000/graphql', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        query,
                        variables: {
                            id: user._id,
                            user: { ...formData }
                        }
                    }),
                });

                if (!profileResponse.ok) {
                    throw new Error('Profile update failed');
                }

                const updatedUser = await profileResponse.json();
                setUser(updatedUser.data.updateUser);

                alert('Profile updated successfully!');
                setErrors({});
                setImageFile(null);
                setIsEditing(false);
            } catch (error) {
                console.error('There was an error updating the profile!', error);
            }
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    return (
        <div>
            {isEditing ? (
                <Container className="">
                    <Row className="d-flex flex-column justify-content-center align-items-center">
                        <h2 className="profile-tittle my-3 edit-tittle">Edit Profile</h2>
                        <Col md={6} className='profile-form-container'> 
                            <Form className="ProfileForm" onSubmit={handleSubmit}>
                                {Object.keys(formData).map((field) => (
                                    field !== 'profileImage' && (
                                        <Form.Group controlId={field} key={field} className="mb-3">
                                            <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name={field}
                                                value={formData[field]}
                                                onChange={handleChange}
                                                isInvalid={!!errors[field]}
                                            />
                                            {errors[field] && <Alert variant="danger" className="mt-2">{errors[field]}</Alert>}
                                        </Form.Group>
                                    )
                                ))}
                                <div className="d-flex justify-content-between">
                                    <button className='my-btn' type="submit">Update Profile</button>
                                    <button className='my-btn' type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                                </div>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            ) : (
                <Container fluid className="profile-page-container">
                    <Row>  
                    <Col md={4}>
                            <Card className="profile-card">
                                <Card.Body className="d-flex align-items-center justify-content-center flex-column">
                                    {/* <img src={formData.profileImage} alt="Profile" className="profile-image" /> */}
                                    <img src={UserPhoto} alt="Profile" className="profile-image" />
                                    <h3>{formData.name || 'N/A'}</h3>
                                    <p>{formData.email || 'N/A'}</p>
                                </Card.Body>
                            </Card>
                        </Col>              
                        <Col md={8}>
                        <h2 className="profile-tittle mb-3">Profile Information</h2>
                            <Card className="profile-card">
                                <Card.Body>
                                    <Card.Text>
                                        {Object.keys(formData).map((field) => (
                                            field !== 'profileImage' && (
                                                <div key={field} className="profile-field">
                                                    <p><strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong> {formData[field] || 'N/A'}</p>
                                                </div>
                                            )
                                        ))}
                                    </Card.Text>
                                    <div className="text-center">
                                        <button className='my-btn' onClick={handleEditClick}>Edit</button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            )}
        </div>
    );
};

export default ProfilePage;
