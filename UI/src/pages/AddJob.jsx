import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';

const AddJob = () => {
    const { id } = useParams();
    const history = useHistory();
    const [formData, setFormData] = useState({
        jobType: '',
        title: '',
        description: '',
        company: '',
        location: '',
        experience: '',
        salary: '',
        workType: '',
        image: '',
    });
    const [errors, setErrors] = useState({});
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        if (id) {
            // Fetch the job data and populate the form
            const fetchJob = async () => {
                const query = `
                    query singleJob($id: ID!) {
                        singleJob(id: $id) {
                            jobType
                            title
                            description
                            company
                            location
                            experience
                            salary
                            workType
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

                    setFormData(data.singleJob);
                } catch (error) {
                    console.error('Error fetching job data:', error);
                }
            };

            fetchJob();
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

                    const response = await fetch('http://localhost:3000/JobImage/upload', {
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
                        mutation updateJob($id: ID!, $job: JobInput!) {
                            updateJob(id: $id, job: $job) {
                                _id
                            }
                        }
                    `
                    : `
                        mutation addJob($job: JobInput!) {
                            addJob(job: $job) {
                                _id
                            }
                        }
                    `;

                const jobResponse = await fetch('http://localhost:3000/graphql', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        query,
                        variables: {
                            id,
                            job: { ...formData, image: imageName },
                        },
                    }),
                });

                if (!jobResponse.ok) {
                    throw new Error('Job submission failed');
                }

                alert(id ? 'Job updated successfully!' : 'Job created successfully!');
                history.push('/jobBoard');
            } catch (error) {
                console.error('There was an error submitting the job!', error);
            }
        }
    };

    return (
        <form className="AddNewForm" onSubmit={handleSubmit}>
            <div>
                <h2 className='form-heading'>{id ? 'Edit Job' : 'Create New Job'}</h2>
                <label>Job Type</label>
                <select name="jobType" value={formData.jobType} onChange={handleChange}>
                    <option value="">Select job type</option>
                    <option value="FullTime">Full time</option>
                    <option value="PartTime">Part time</option>
                    <option value="Contract">Contract</option>
                    <option value="Seasonal">Seasonal</option>
                </select>
                {errors.jobType && <span style={{ color: 'red' }}>{errors.jobType}</span>}
            </div>
            <div>
                <label>Work Type</label>
                <select name="workType" value={formData.workType} onChange={handleChange}>
                    <option value="">Select work type</option>
                    <option value="OnSite">On-Site</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                </select>
                {errors.workType && <span style={{ color: 'red' }}>{errors.workType}</span>}
            </div>
            {Object.keys(formData).map((field) => (
                (field !== 'jobType' && field !== 'workType' && field !== 'description' && field !== 'image') && (
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
                        src={`/src/assets/JobImages/${formData.image}`}
                        alt="Job Image"
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
            <button type="submit">{id ? 'Update Job' : 'Create Job'}</button>
        </form>
    );
};

export default AddJob;
