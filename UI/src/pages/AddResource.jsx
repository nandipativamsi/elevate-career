import React, { useState } from 'react';


const AddResource = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
    });

    const [errors, setErrors] = useState({});

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
            if (!formData[key]) {
                newErrors[key] = `${key} is required`;
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validate()) {
            try {
                const query = `
                    mutation addResource($resource: ResourceInput!) {
                        addResource(resource: $resource) {
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
                        variables: { resource: formData },
                    }),
                });

                const responseData = await response.json();

                if (responseData.errors) {
                    throw new Error(responseData.errors[0].message);
                }

                alert('Resource created successfully!');

                setFormData({
                    title: '',
                    description: '',
                });
                setErrors({});
            } catch (error) {
                console.error('There was an error creating the resource!', error);
            }
        }
    };

    return (
        <form className="AddNewForm" onSubmit={handleSubmit}>
            <div>
            <h2 className='form-heading'>Create New Resource</h2>
                <label>Title</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                />
                {errors.title && <span style={{ color: 'red' }}>{errors.title}</span>}
            </div>
            <div>
                <label>Description</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                />
                {errors.description && <span style={{ color: 'red' }}>{errors.description}</span>}
            </div>
            <button type="submit">Create Resource</button>
        </form>
    );
};

export default AddResource;
