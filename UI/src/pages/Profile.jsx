import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext.jsx';
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
                <form className="ProfileForm" onSubmit={handleSubmit}>
                    <div>
                        <h2 className='form-heading'>Edit Profile</h2>
                        {Object.keys(formData).map((field) => (
                            (field !== 'profileImage') && (
                                <div key={field}>
                                    <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                                    <input
                                        type="text"
                                        name={field}
                                        value={formData[field]}
                                        onChange={handleChange}
                                    />
                                    {errors[field] && <span style={{ color: 'red' }}>{errors[field]}</span>}
                                </div>
                            )
                        ))}
                    </div>
                    {/* <div>
                        <label>Profile Image</label>
                        <input
                            type="file"
                            name="profileImage"
                            onChange={handleFileChange}
                        />
                        {errors.profileImage && <span style={{ color: 'red' }}>{errors.profileImage}</span>}
                    </div> */}
                    <button type="submit">Update Profile</button>
                    <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                </form>
            ) : (
                <div>
                    <h2 className='form-heading'>Profile Information</h2>
                    {Object.keys(formData).map((field) => (
                        (field !== 'profileImage') && (
                            <div key={field}>
                                <p><strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong> {formData[field] || 'N/A'}</p>
                            </div>
                        )
                    ))}
                    <button onClick={handleEditClick}>Edit</button>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
