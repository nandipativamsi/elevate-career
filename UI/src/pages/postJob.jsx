import React, { useState } from 'react';
import axios from 'axios';

const JobForm = () => {
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
            console.log(formData);
            try {
                if(await axios.post('http://localhost:3000/postJob', formData))
                {
                    alert('Job created successfully!');
                }
                
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
        <form onSubmit={handleSubmit}>
            <div>
                <label>Job Type</label>
                <select name="jobType" value={formData.jobType} onChange={handleChange}>
                    <option value="">Select job type</option>
                    <option value="Full time">Full time</option>
                    <option value="Part time">Part time</option>
                    <option value="Contract">Contract</option>
                    <option value="Seasonal">Seasonal</option>
                </select>
                {errors.jobType && <span style={{ color: 'red' }}>{errors.jobType}</span>}
            </div>
            <div>
                <label>Work Type</label>
                <select name="workType" value={formData.workType} onChange={handleChange}>
                    <option value="">Select work type</option>
                    <option value="In-person">In-person</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Remote">Remote</option>
                </select>
                {errors.workType && <span style={{ color: 'red' }}>{errors.workType}</span>}
            </div>
            {Object.keys(formData).map((field) => (
                (field !== 'jobType' && field !== 'workType') && (
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
            <button type="submit">Create Job</button>
        </form>
    );
};

export default JobForm;
