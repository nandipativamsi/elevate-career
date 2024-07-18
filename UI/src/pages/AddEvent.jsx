import React, { useState } from 'react';


const AddEvent = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        location: '',
        limit: '',
        image: '',
    });

    const [errors, setErrors] = useState({});
    const [imageFile, setImageFile] = useState(null);

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

                let imageName = '';
      
                if (imageFile) {
                    
            
                    const formData = new FormData();
                    formData.append('image', imageFile);
            
                    const response = await fetch('http://localhost:3000/EventImage/upload', {
                    method: 'POST',
                    body: formData,
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
                        variables: { 
                            event: { ...formData, image: imageName }
                        }
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
                setImageFile(null);
            } catch (error) {
                console.error('There was an error creating the event!', error);
            }
        }
    };

    return (
        <form className="AddNewForm" onSubmit={handleSubmit}>
            <div>
            <h2 className='form-heading'>Create New Event</h2>
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
                <label>Image</label>
                <input
                    type="file"
                    name="image"
                    onChange={handleFileChange}
                />
                {errors.image && <span style={{ color: 'red' }}>{errors.image}</span>}
            </div>
            <button type="submit">Create Event</button>
        </form>
    );
};

export default AddEvent; 