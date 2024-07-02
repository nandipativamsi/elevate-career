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
                    mutation addJob($job: JobInput!) {
                        addJob(job: $job) {
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
                            job: formData
                        }
                    }),
                });
    
                const responseData = await response.json();
    
                if (responseData.errors) {
                    throw new Error(responseData.errors[0].message);
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
                (field !== 'jobType' && field !== 'workType' && field !== 'description') && (
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
            <button type="submit">Create Job</button>
        </form>
    );
};

export default AddJob;
