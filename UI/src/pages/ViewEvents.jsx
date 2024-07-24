import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Card, Button } from 'react-bootstrap';
import heroImg from '../assets/feature2.jpg';
import "../css/events.css";

const ViewEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');

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
                <img src={heroImg} alt="people networking at event" className="hero-image" />
                <div className="hero-text-container">
                    <h1 className="fw-bold">EVENTS BOARD</h1>
                    <p>
                        The Events section of Career Elevate offers a diverse array of opportunities designed to enhance professional growth and network expansion. From industry-specific conferences and expert-led webinars to hands-on workshops and dynamic networking mixers, these events cater to a wide range of career stages and interests. Participants can gain valuable insights into emerging trends, acquire new skills, and connect with like-minded professionals. Whether you're looking to deepen your expertise, explore new career paths, or simply stay current in your field, Career Elevate's events provide the perfect platform to elevate your career aspirations.
                    </p>
                </div>
            </section>
            <section className="py-5 event-filter-section">
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
            <section className="py-5 events-section">
                <h2 className="text-center">RECOMMENDATIONS FOR YOU</h2>
                <Row className="justify-content-center">
                    {filteredEvents.map(event => (
                        <Col xs={12} sm={6} md={4} lg={3} key={event._id} className="mb-4">
                            <Card className="event-card">
                                <Card.Img variant="top" src={heroImg} alt={event.title} />
                                <Card.Body>
                                    <Card.Title>{event.title}</Card.Title>
                                    <Card.Text>
                                        {new Date(parseInt(event.date)).toLocaleString('en-US', {
                                            weekday: 'short',
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                            hour: 'numeric',
                                            minute: 'numeric',
                                            hour12: true,
                                            timeZoneName: 'short',
                                        })}
                                    </Card.Text>
                                    <Button variant="primary">Details</Button>
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
