import React, { useState, useEffect } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import heroImg from '../assets/jobBoardHero.png';
import { Link, useHistory } from 'react-router-dom';
import jobPostingImg from '../assets/defaultJobImage.jpeg';
import "../css/jobboard.css";
import { useAuth } from '../AuthContext.jsx';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

const JobBoard = () => {
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [jobType, setJobType] = useState('');
    const [workType, setWorkType] = useState('');
    const [noJobsFound, setNoJobsFound] = useState(false);

    const history = useHistory();

    const handleEdit = (jobId) => {
        history.push(`/editJob/${jobId}`);
    };

    const loadData = async () => {
        console.log(user?.role);

        const query = user?.role === 'Alumni'
            ? `
                query jobsByUser($userId: ID!, $jobType: JobType, $workType: WorkType) {
                    jobsByUser(userId: $userId, jobType: $jobType, workType: $workType) {
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
            `
            : `
                query jobList($jobType: JobType, $workType: WorkType) {
                    jobList(jobType: $jobType, workType: $workType) {
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

        const variables = user?.role === 'Alumni'
            ? { userId: user._id, jobType: jobType || null, workType: workType || null }
            : { jobType: jobType || null, workType: workType || null };

        try {
            const response = await fetch('http://localhost:3000/graphql', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query, variables }),
            });

            const { data, errors } = await response.json();

            if (errors) {
                throw new Error(errors[0].message);
            }

            const fetchedJobs = user?.role === 'Alumni' ? data.jobsByUser : data.jobList;

            setJobs(fetchedJobs);
            setNoJobsFound(fetchedJobs.length === 0);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            loadData();
        }
    }, [user, jobType, workType]);

    const deleteJob = async (_id) => {
        if (window.confirm("Are you sure you want to delete the job?")) {
            const query = `
                mutation deleteJob($_id: ID!) {
                    deleteJob(_id: $_id)
                }
            `;

            try {
                const response = await fetch('http://localhost:3000/graphql', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query, variables: { _id } }),
                });

                const { data, errors } = await response.json();

                if (errors) {
                    throw new Error(errors[0].message);
                }

                if (data) {
                    alert("Job Deleted Successfully!");
                    loadData();
                } else {
                    alert("Failed to delete the job");
                }
            } catch (error) {
                setError(error.message);
            }
        }
    };

    return (
        <div>
            <section className="py-5 jobboard-hero-section flex-container">
                <div className="jobboard-hero-image-container">
                    <img src={heroImg} alt="person-with-hiring-sign-by-window" />
                </div>
                <div className="jobboard-hero-text-container">
                    <h1 className="fw-bold">JOBS BOARD</h1>
                    <p>
                        Welcome to our exclusive job board designed to bridge the gap between ambitious students and accomplished alumni. Here, you can discover a variety of opportunities, including jobs, internships, and freelancing projects, all posted by our experienced alumni network. This platform is dedicated to helping you gain hands-on experience, build professional connections, and pave the way for a successful career. Whether you are looking to dive into your first job, secure a meaningful internship, or take on freelance work, our job board is the perfect place to start your journey. Unlock your potential and explore the myriad of opportunities awaiting you!
                    </p>
                </div>
            </section>
            <section className="py-5 jobboard-filter-section">
                <Form className="dropdowns-container">
                    <Row className="justify-content-center">
                        <Col xs={12} sm={6} md={4} lg={3} className="dropdown-col">
                            <div className="dropdown-wrapper">
                                <Form.Control
                                    as="select"
                                    className="dropdown-input"
                                    value={jobType}
                                    onChange={(e) => setJobType(e.target.value)}>
                                    <option value="">Select Job Type</option>
                                    <option value="FullTime">Full-time</option>
                                    <option value="PartTime">Part-time</option>
                                    <option value="Contract">Contract</option>
                                    <option value="Seasonal">Seasonal</option>
                                </Form.Control>
                                <i className="bi bi-caret-down-fill dropdown-icon"></i>
                            </div>
                        </Col>
                        <Col xs={12} sm={6} md={4} lg={3} className="dropdown-col">
                            <div className="dropdown-wrapper">
                                <Form.Control
                                    as="select"
                                    className="dropdown-input"
                                    value={workType}
                                    onChange={(e) => setWorkType(e.target.value)}
                                >
                                    <option value="">Select Work Type</option>
                                    <option value="Remote">Remote</option>
                                    <option value="Hybrid">Hybrid</option>
                                    <option value="OnSite">On-site</option>
                                </Form.Control>
                                <i className="bi bi-caret-down-fill dropdown-icon"></i>
                            </div>
                        </Col>
                    </Row>
                </Form>

                <div className="job-list flex-container">
                    {loading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p>Error: {error}</p>
                    ) : noJobsFound ? (
                        <p>No jobs found based on the selected filter.</p>
                    ) : (
                        jobs.map((job) => (
                            user?.role === 'Student' ? (
                                <Link to={`/jobDetails/${job._id}`} className="job-box flex-container" key={job._id}>
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
                                            {job.location} <span>({job.jobType})</span>
                                        </p>
                                        <p className="job-salary">{job.salary}</p>
                                    </div>
                                </Link>
                            ) : (
                                <div className="job-box flex-container" key={job._id}>
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
                                            {job.location} <span>({job.jobType})</span>
                                        </p>
                                        <p className="job-salary">{job.salary}</p>
                                        <div className='col'>
                                            <Link to={`/jobDetails/${job._id}`} className="btn btn-dark px-3 me-1">
                                                Details
                                            </Link>

                                            <Link to={`/jobApplications/${job._id}`} className="btn btn-success px-3 me-2">
                                                View Applications
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="job-actions fs-4">
                                        <FaEdit
                                            className="icon icon-edit"
                                            onClick={() => handleEdit(job._id)}
                                        />
                                        <FaTrashAlt
                                            className="icon icon-delete"
                                            onClick={() => deleteJob(job._id)}
                                        />
                                    </div>
                                </div>
                            )
                        ))
                    )}
                </div>
            </section>
        </div>
    );
};

export default JobBoard;
