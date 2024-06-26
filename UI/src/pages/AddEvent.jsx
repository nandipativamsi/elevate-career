import React, { useState } from 'react';

const AddEvent = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        location: '',
        limit: '',
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
                    mutation addEvent($event: EventInput!) {
                        addEvent(event: $event) { 
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
                        variables: { event: formData }
                    }),
                });

                const responseData = await response.json();

                if (responseData.errors) {
                    throw new Error(responseData.errors[0].message);
                }

                alert('Event created successfully!');

                setFormData({
                    title: '',
                    description: '',
                    date: '',
                    location: '',
                    limit: '',
                });
                setErrors({});
            } catch (error) {
                console.error('There was an error creating the event!', error);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
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
                <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                />
                {errors.description && <span style={{ color: 'red' }}>{errors.description}</span>}
            </div>
            <div>
                <label>Date</label>
                <input
                    type="date"  
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                />
                {errors.date && <span style={{ color: 'red' }}>{errors.date}</span>}
            </div>
            <div>
                <label>Location</label>
                <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                />
                {errors.location && <span style={{ color: 'red' }}>{errors.location}</span>}
            </div>
            <div>
                <label>Limit</label>
                <input
                    type="text"
                    name="limit"
                    value={formData.limit}
                    onChange={handleChange}
                />
                {errors.limit && <span style={{ color: 'red' }}>{errors.limit}</span>}
            </div>
            <button type="submit">Create Event</button>
        </form>
    );
};

export default AddEvent; 