import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Card, Button } from 'react-bootstrap';
import heroImg from '../assets/feature2.jpg';
import { Link } from 'react-router-dom';
import "../css/events.css";
import { useAuth } from '../AuthContext.jsx';

const ViewEvents = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');

    const loadData = async () => {
        const query = user?.role === 'Alumni'
            ? `
                query eventsByUser($userId: ID!) {
                    eventsByUser(userId: $userId) {
                        _id
                        title
                        description
                        date
                        time
                        location
                        attendees
                        postedBy
                        limit
                        image
                    }
                }
            `
            : `
                query {
                    eventList {
                        _id
                        title
                        description
                        date
                        time
                        location
                        attendees
                        postedBy
                        limit
                        image
                    }
                }
            `;

        const variables = user?.role === 'Alumni' ? { userId: user._id } : {};

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

            setEvents(user?.role === 'Alumni' ? data.eventsByUser : data.eventList);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [user]);

    const deleteEvent = async (_id) => {
        if (window.confirm("Are you sure you want to delete the event?")) {
            const query = `
                mutation deleteEvent($_id: ID!) {
                    deleteEvent(_id: $_id)
                }
            `;

            try {
                const response = await fetch('http://localhost:3000/graphql', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        query,
                        variables: { _id }
                    }),
                });

                const { data, errors } = await response.json();

                if (errors) {
                    throw new Error(errors[0].message);
                }

                if (data) {
                    alert("Event Deleted Successfully!");
                    loadData();
                } else {
                    alert("Failed to delete the Event");
                }
            } catch (error) {
                setError(error.message);
            }
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    const currentTime = Date.now();
    const filteredEvents = events.filter(event => {
        const eventTime = parseInt(event.date);
        if (filter === 'upcoming') {
            return eventTime >= currentTime;
        } else if (filter === 'expired') {
            return eventTime < currentTime;
        }
        return true; // For 'all' option or any other unrecognized filter, show all events
    });

    return (
        <div>
            <section className="hero-section">
                <h1 className="fw-bold event-title">EVENTS</h1>
                <div className="hero-text-container">
                    <p>
                        The Events section of Career Elevate offers a diverse array of opportunities designed to enhance professional growth and network expansion. From industry-specific conferences and expert-led webinars to hands-on workshops and dynamic networking mixers, these events cater to a wide range of career stages and interests. Participants can gain valuable insights into emerging trends, acquire new skills, and connect with like-minded professionals. Whether you're looking to deepen your expertise, explore new career paths, or simply stay current in your field, Career Elevate's events provide the perfect platform to elevate your career aspirations.
                    </p>
                </div>
            </section>
            <section className="pt-5 event-filter-section">
                <Form className="dropdowns-container">
                    <Row className="justify-content-center">
                        <Col xs={12} sm={6} md={4} lg={3} className="dropdown-col">
                            <div className="dropdown-wrapper">
                                <Form.Control as="select" className="dropdown-input" value={filter} onChange={handleFilterChange}>
                                    <option value="all">All Events</option>
                                    <option value="upcoming">Upcoming Events</option>
                                    <option value="expired">Expired Events</option>
                                </Form.Control>
                                <i className="bi bi-caret-down-fill dropdown-icon"></i>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </section>
            <section className="pb-5 px-3 events-section">
                <h2 className="m-5 recommendation-title">RECOMMENDATIONS FOR YOU</h2>
                <Row className="justify-content-center">
                    {filteredEvents.map(event => (
                        <Col xs={12} sm={6} md={4} lg={3} key={event._id} className="mb-4">
                            <Card className="event-card">
                                <Card.Img variant="top" src={event.image ? `/src/assets/EventImages/${event.image}` : heroImg} alt={event.title} />
                                <Card.Body>
                                    <Card.Title>{event.title}</Card.Title>
                                    <Card.Text>
                                        {new Date(event.date).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })} at {new Date(`${event.date.split('T')[0]}T${event.time}`).toLocaleTimeString('en-US', {
                                            hour: 'numeric',
                                            minute: 'numeric',
                                            hour12: true
                                        })}
                                    </Card.Text>

                                    {user?.role === 'Alumni' ? (
                                        <>
                                            <Button variant="primary">Details</Button>
                                            <button className='btn btn-danger text-white mx-1 px-3' onClick={() => deleteEvent(event._id)}>Delete</button>
                                            <Link to={`/editEvent/${event._id}`} className="btn btn-warning text-white px-3 me-2">
                                                Edit 
                                            </Link>
                                        </>
                                    ) : (
                                        <Button variant="primary">Details</Button>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </section>
        </div>
    );
};

export default ViewEvents;
