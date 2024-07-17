import React, { useState } from 'react';

const AddJob = () => {
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

                    const response = await fetch('http://localhost:3000/JobImage/upload', {
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
                    mutation addJob($job: JobInput!) {
                    addJob(job: $job) {
                            _id
                        }
                    }
                `;

                const jobResponse = await fetch('http://localhost:3000/graphql', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        query,
                        variables: {
                            job: { ...formData, image: imageName }
                        }
                    }),
                });

                if (!jobResponse.ok) {
                    throw new Error('Job creation failed');
                }

                alert('Job created successfully!');
                setFormData({
                    jobType: '',
                    title: '',
                    description: '',
                    company: '',
                    location: '',
                    experience: '',
                    salary: '',
                    workType: '',
                });
                setErrors({});
                setImageFile(null);
            } catch (error) {
                console.error('There was an error creating the job!', error);
            }
        }
    };

    return (
        <form className="AddNewForm" onSubmit={handleSubmit}>
            <div>
                <h2 className='form-heading'>Create New Job</h2>
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
                <input
                    type="file"
                    name="image"
                    onChange={handleFileChange}
                />
                {errors.image && <span style={{ color: 'red' }}>{errors.image}</span>}
            </div>
            <button type="submit">Create Job</button>
        </form>
    );
};

export default AddJob;
