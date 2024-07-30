import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';

const AddResource = () => {
    const { id } = useParams();
    const history = useHistory();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image: '',
    });
    const [errors, setErrors] = useState({});
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        if (id) {
            // Fetch existing resource data if id is provided
            const fetchResource = async () => {
                const query = `
                    query singleResource($id: ID!) {
                        singleResource(id: $id) {
                            title
                            description
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

                    setFormData(data.singleResource);
                } catch (error) {
                    console.error('Error fetching resource data:', error);
                }
            };

            fetchResource();
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
                    const formData = new FormData();
                    formData.append('image', imageFile);

                    const response = await fetch('http://localhost:3000/ResourceImage/upload', {
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

                const query = id
                    ? `
                        mutation updateResource($id: ID!, $resource: ResourceInput!) {
                            updateResource(id: $id, resource: $resource) {
                                _id
                            }
                        }
                    `
                    : `
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
                        variables: { 
                            id,
                            resource: { ...formData, image: imageName }
                        },
                    }),
                });

                const responseData = await response.json();

                if (responseData.errors) {
                    throw new Error(responseData.errors[0].message);
                }

                alert(id ? 'Resource updated successfully!' : 'Resource created successfully!');
                history.push('/viewResources');
            } catch (error) {
                console.error('There was an error submitting the resource!', error);
            }
        }
    };

    return (
        <form className="AddNewForm" onSubmit={handleSubmit}>
            <div>
                <h2 className='form-heading'>{id ? 'Edit Resource' : 'Create New Resource'}</h2>
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
                <label>Image</label>
                {formData.image && (
                    <div>
                        <img
                            src={`/src/assets/ResourceImages/${formData.image}`}
                            alt="Resource Image"
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
            <button type="submit">{id ? 'Update Resource' : 'Create Resource'}</button>
        </form>
    );
};

export default AddResource;
