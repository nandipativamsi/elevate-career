import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../css/jobApplications.css';
import jobPostingImg from '../assets/defaultJobImage.jpeg';
import defaultProfileImage from '../assets/defaultProfileImage.jpg';
import '@fortawesome/fontawesome-free/css/all.min.css';

const JobApplications = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [applicants, setApplicants] = useState([]);

    useEffect(() => {
        const fetchJob = async () => {
            const jobQuery = `
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
                const response = await fetch('https://elevate-career.onrender.com/graphql', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query: jobQuery }),
                });

                const { data, errors } = await response.json();

                if (errors) {
                    throw new Error(errors[0].message);
                }

                setJob(data.singleJob);

                if (data.singleJob.applications) {
                    const applicantIds = data.singleJob.applications.split(',')
                    .map(id => id.trim())
                    .slice(1);


                    const applicantsQuery = `
                        query {
                            usersByIds(ids: ${JSON.stringify(applicantIds)}) {
                                _id
                                name
                                education
                                yearOfGraduation
                                workExperience
                                contactNumber
                            }
                        }
                    `;

                    const applicantsResponse = await fetch('https://elevate-career.onrender.com/graphql', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ query: applicantsQuery }),
                    });

                    const applicantsData = await applicantsResponse.json();

                    if (applicantsData.errors) {
                        throw new Error(applicantsData.errors[0].message);
                    }

                    setApplicants(applicantsData.data.usersByIds);
                }

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
        <div className='jobApplication-Container'>
            <div className="job-box flex-container">
                <div className="job-posting-image">
                    <img
                        src={job.image ? `/src/assets/JobImages/${job.image}` : jobPostingImg}
                        alt="job-posting"
                    />
                </div>
                <div className="job-posting-text">
                    <p className="job-title">{job.title}</p>
                    <p className="company-name">{job.company}</p>
                    <p className="location-jobtype">
                        {job.location} <span>({job.workType})</span>
                    </p>
                    <p className="job-salary">{job.salary}</p>
                    
                </div>
            </div>
            <div className='job-applications-container'>
                <div className="about-div"> Applications </div>
                <div className="applications">
                    {applicants.map(applicant => (
                        <div key={applicant._id} className="application-card">
                            <div className='application-image-container'>
                                <img src={defaultProfileImage} alt="applicant" />
                            </div>
                            <div className="applicant-info">
                                <p className="applicant-name">Name : {applicant.name}</p>
                                <p className="applicant-college">Education : {applicant.education}</p>
                                <p className="applicant-location">Year of Graduation : {applicant.yearOfGraduation}</p>
                                <p className="applicant-experience">Work Experience (Years) : {applicant.workExperience}</p>    
                                <button className="view-profile-button">View Profile</button>
                            </div>
                            
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default JobApplications;
