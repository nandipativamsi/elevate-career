import React, { useState, useEffect } from 'react';

const ViewJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            const query = `
                query {
                    jobList {
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

                setJobs(data.jobList);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        loadData();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div>
            <h2>Jobs List</h2>
            <ul>
                {jobs.map(job => (
                    <li key={job._id}>
                        <h3>{job.title}</h3>
                        <p><strong>Job Type:</strong> {job.jobType}</p>
                        <p><strong>Description:</strong> {job.description}</p>
                        <p><strong>Company:</strong> {job.company}</p>
                        <p><strong>Location:</strong> {job.location}</p>
                        <p><strong>Posted By:</strong> {job.postedBy}</p>
                        <p><strong>Applications:</strong> {job.applications}</p>
                        <p><strong>Experience:</strong> {job.experience}</p>
                        <p><strong>Salary:</strong> {job.salary}</p>
                        <p><strong>Work Type:</strong> {job.workType}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ViewJobs;
