import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import jobPostingImg from '../assets/defaultJobImage.jpeg';
import '../css/jobDetails.css';
import bannerImage from '../assets/defaultJobImage.jpeg';
import '@fortawesome/fontawesome-free/css/all.min.css';



const JobDetails = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchJob = async () => {
            const query = `
                query {
                    singleJob(id: "${id}") {
                        _id
                        jobType
                        title
                        description
                        company
                        location
                        postedBy
                        applications
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
                    body: JSON.stringify({ query }),
                });

                const { data, errors } = await response.json();

                if (errors) {
                    throw new Error(errors[0].message);
                }

                setJob(data.singleJob);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchJob();
    }, [id]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (!job) {
        return <p>No job found.</p>;
    }

    return (
        <div className="job-details-container">
            <section className="job-details-hero">
                <img className="job-details-hero-image" src={bannerImage} alt="banner" />
                <div className="job-details-company-logo-container">
                    <img className="job-details-company-logo" src={job.image ? `/src/assets/JobImages/${job.image}` : jobPostingImg} alt="job posting"/>
                </div>
                <h1 className="job-details-company-name">{job.company}</h1>
                <div className="job-details-button-container">
                    <div className="job-details-button-alumni">
                        <i className="fas fa-user job-details-alumni-button"></i>{job.postedBy}</div>
                    <div className="job-details-button">Apply Now</div>
                </div>
            </section>
            <section className="job-details-content">
                <div className="about-div"> About Job </div>
                <h1 className="job-details-title">{job.title}</h1>
                <div className="job-details-meta">
                    <p><strong>Location:</strong> {job.location}</p>
                    <p><strong>Job Type:</strong> {job.jobType}</p>
                    <p><strong>Work Type:</strong> {job.workType}</p>
                    <p><strong>Salary:</strong> {job.salary}</p>
                </div>
                <div className="job-details-description">
                    <p>{job.description}</p>
                </div>
                {/* Additional sections as needed */}
            </section>
        </div>
    );
};

export default JobDetails;