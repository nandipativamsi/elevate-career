import React, { useState, useEffect } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import heroImg from '../assets/feature2.jpg';
import jobPostingImg from '../assets/job-posting-image.jpeg';
import "../css/jobboard.css";

const ViewEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            const query = `
                query {
                    eventList {
                        _id
                        title
                        description
                        date
                        location
                        attendees
                        postedBy
                        limit
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

                setEvents(data.eventList);
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
            <section className="py-5 jobboard-hero-section flex-container">
                <div className="jobboard-hero-image-container">
                    <img src={heroImg} alt="person-with-hiring-sign-by-window" />
                </div>
                <div className="jobboard-hero-text-container">
                    <h1 className="fw-bold">EVENTS BOARD</h1>
                    <p>
                    The Events section of Career Elevate offers a diverse array of opportunities designed to enhance professional growth and network expansion. From industry-specific conferences and expert-led webinars to hands-on workshops and dynamic networking mixers, these events cater to a wide range of career stages and interests. Participants can gain valuable insights into emerging trends, acquire new skills, and connect with like-minded professionals. Whether you're looking to deepen your expertise, explore new career paths, or simply stay current in your field, Career Elevate's events provide the perfect platform to elevate your career aspirations.
                    </p>
                </div>
            </section>
            <section className="py-5 jobboard-filter-section">
            <Form className="dropdowns-container">
                    <Row className="justify-content-center">
                        <Col xs={12} sm={6} md={4} lg={3} className="dropdown-col">
                            <div className="dropdown-wrapper">
                                <Form.Control as="select" className="dropdown-input">
                                    <option value="">Full-time</option>
                                    <option value="full-time">Full-time</option>
                                    <option value="part-time">Part-time</option>
                                    <option value="contract">Contract</option>
                                    <option value="temporary">Temporary</option>
                                    <option value="other">Other</option>
                                </Form.Control>
                                <i className="bi bi-caret-down-fill dropdown-icon"></i>
                            </div>
                        </Col>
                        <Col xs={12} sm={6} md={4} lg={3} className="dropdown-col">
                            <div className="dropdown-wrapper">
                                <Form.Control as="select" className="dropdown-input">
                                    <option value="">Select Work Mode</option>
                                    <option value="remote">Remote</option>
                                    <option value="hybrid">Hybrid</option>
                                    <option value="on-site">On-site</option>
                                </Form.Control>
                                <i className="bi bi-caret-down-fill dropdown-icon"></i>
                            </div>
                        </Col>
                        <Col xs={12} sm={6} md={4} lg={3} className="dropdown-col">
                            <div className="dropdown-wrapper">
                                <Form.Control as="select" className="dropdown-input">
                                    <option value="">Select Location</option>
                                    <option value="location1">Location 1</option>
                                    <option value="location2">Location 2</option>
                                    <option value="location3">Location 3</option>
                                </Form.Control>
                                <i className="bi bi-caret-down-fill dropdown-icon"></i>
                            </div>
                        </Col>
                    </Row>
                </Form>
                <ul>
                    {events.map(event => (
                        <div key={event._id} className="job-box flex-container">
                            <div className="job-posting-image">
                                <img src={jobPostingImg} alt="job-posting" />
                            </div>
                            <div className="job-posting-text">
                                <p className="job-title">{event.title}</p>
                                <p className="company-name">{event.date}</p>
                                <p className="location-jobtype">
                                    {event.location} <span>({event.limit})</span>
                                </p>
                                <p className="job-salary">{event.postedBy}</p>
                            </div>
                        </div>
                        // <li key={event._id}>
                        //     <h3>{event.title}</h3>
                        //     <p><strong>Description:</strong> {event.description}</p>
                        //     <p><strong>Date:</strong> {event.date}</p>
                        //     <p><strong>Location:</strong> {event.location}</p>
                        //     <p><strong>Attendees:</strong> {event.attendees}</p>
                        //     <p><strong>Posted By:</strong> {event.postedBy}</p>
                        //     <p><strong>Limit:</strong> {event.limit}</p>
                        // </li>
                    ))}
                </ul>
            </section>
        </div>
    );
};

export default ViewEvents;
