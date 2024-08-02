import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

const AddEvent = () => {
    const { user } = useAuth();
    const { id } = useParams();
    const history = useHistory();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        limit: '',
        price: '',
        image: '',
          
    });
    const [errors, setErrors] = useState({});
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        if (id) {
            // Fetch the event data and populate the form
            const fetchEvent = async () => {
                const query = `
                    query singleEvent($id: ID!) {
                        singleEvent(id: $id) {
                            title
                            description
                            date
                            time
                            location
                            limit
                            price
                            image
                        }
                    }
                `;

                try {
                    const response = await fetch('http://localhost:3000/graphql', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ query, variables: { id } }),
                    });

                    const { data, errors } = await response.json();

                    if (errors) {
                        throw new Error(errors[0].message);
                    }

                    const event = data.singleEvent;
                    const formattedDate = event.date ? event.date.split('T')[0] : '';
                    
                    setFormData({
                        ...event,
                        date: formattedDate,
                    });
                } catch (error) {
                    console.error('Error fetching event data:', error);
                }
            };

            fetchEvent();
        }
    }, [id]);

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
        for (const key in formData) {
            if (!formData[key] && key !== 'image') {
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
                let imageName = formData.image;

                if (imageFile) {
                    const imageData = new FormData();
                    imageData.append('image', imageFile);

                    const response = await fetch('http://localhost:3000/EventImage/upload', {
                        method: 'POST',
                        body: imageData,
                    });

                    if (!response.ok) {
                        throw new Error('Image upload failed');
                    }

                    const responseData = await response.json();

                    if (responseData.error) {
                        throw new Error(responseData.error);
                    }

                    imageName = responseData.imageName;
                }

                const query = id
                    ? `
                        mutation updateEvent($id: ID!, $event: EventInput!) {
                            updateEvent(id: $id, event: $event) {
                                _id
                            }
                        }
                    `
                    : `
                        mutation addEvent($event: EventInput!) {
                            addEvent(event: $event) {
                                _id
                            }
                        }
                    `;

                const eventResponse = await fetch('http://localhost:3000/graphql', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        query,
                        variables: {
                            id,
                            event: { ...formData, image: imageName, postedBy: user?._id || '' },
                        },
                    }),
                });

                if (!eventResponse.ok) {
                    throw new Error('Event submission failed');
                }

                alert(id ? 'Event updated successfully!' : 'Event created successfully!');
                history.push('/viewEvents');
            } catch (error) {
                console.error('There was an error submitting the event!', error);
            }
        }
    };

    return (
        <form className="AddNewForm" onSubmit={handleSubmit}>
            <div>
                <h2 className='form-heading'>{id ? 'Edit Event' : 'Create New Event'}</h2>
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
                <label>Time</label>
                <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                />
                {errors.time && <span style={{ color: 'red' }}>{errors.time}</span>}
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
            <div>
                <label>Price (For One Person)</label>
                <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                />
                {errors.price && <span style={{ color: 'red' }}>{errors.price}</span>}
            </div>
            <div>
                <label>Image</label>
                {formData.image && (
                <div>
                    <img
                        src={`/src/assets/EventImages/${formData.image}`}
                        alt="Event Image"
                        style={{ width: '200px', height: 'auto' }}
                    />
                    <p >If you want to change image upload new one, otherwise old image will remain as it is...</p  >
                </div>
                )}
                <input
                    type="file"
                    name="image"
                    onChange={handleFileChange}
                />
                {errors.image && <span style={{ color: 'red' }}>{errors.image}</span>}
            </div>
            <button type="submit">{id ? 'Update Event' : 'Create Event'}</button>
        </form>
    );
};

export default AddEvent;
