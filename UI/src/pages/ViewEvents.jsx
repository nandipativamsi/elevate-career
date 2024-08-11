import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import heroImg from '../assets/feature2.jpg';
import { Link, useHistory } from 'react-router-dom';
import "../css/events.css";
import "../css/index.css";
import { FaCalendarAlt } from "react-icons/fa";
import { useAuth } from '../AuthContext.jsx';
import axios from 'axios';

const ViewEvents = () => {
    const { user } = useAuth();
    const history = useHistory();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [registeredEvents, setRegisteredEvents] = useState({});

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
                        price
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
                        price
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

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    const handleShow = async (event) => {
        setSelectedEvent(event);
        const query = `
            query checkRegistration($eventId: ID!, $userId: ID!) {
                checkRegistration(eventId: $eventId, userId: $userId)
            }
        `;
        try {
            const response = await fetch('http://localhost:3000/graphql', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query,
                    variables: {
                        eventId: event._id,
                        userId: user._id
                    }
                }),
            });
    
            const { data, errors } = await response.json();
    
            if (errors) {
                throw new Error(errors[0].message);
            }
    
            // Set registration status in state
            setRegisteredEvents(prevState => ({
                ...prevState,
                [event._id]: data.checkRegistration
            }));
            setShowModal(true);
        } catch (error) {
            setError(error.message);
        }
    };
    
    

    const handleClose = () => {
        setShowModal(false);
        setSelectedEvent(null);
    };

    const handleRegister = async () => {
        console.log("Selected Event:", selectedEvent); // Debugging line
        console.log("Registered Events:", registeredEvents); // Debugging line
    
        if (selectedEvent.price !== 'Free') {
            try {
                const response = await fetch('http://localhost:3000/payment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        eventId: selectedEvent._id,
                        userId: user._id,
                        eventTitle: selectedEvent.title,
                        amount: selectedEvent.price,
                        userEmail: user.email
                    }),
                });
                  
                const data = await response.json();
                if (data.url) {
                    window.location.href = data.url;
                } else {
                    console.error('Payment failed:', data.message);
                }
            } catch (error) {
                console.error('Error making payment:', error);
            }
        } else {
            const mutation = `
                mutation registerForEvent($eventId: ID!, $userId: ID!) {
                    registerForEvent(eventId: $eventId, userId: $userId)
                }
            `;
    
            try {
                const response = await fetch('http://localhost:3000/graphql', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        query: mutation,
                        variables: {
                            eventId: selectedEvent._id,
                            userId: user._id
                        }
                    }),
                });
    
                const { data, errors } = await response.json();
    
                if (errors) {
                    throw new Error(errors[0].message);
                }
    
                if (data.registerForEvent) {
                    setRegisteredEvents(prevState => ({
                        ...prevState,
                        [selectedEvent._id]: true
                    }));
                    alert("Registration successful!");
                } else {
                    alert("Registration failed. You might already be registered.");
                }
            } catch (error) {
                setError(error.message);
            }
        }
    };
    

    const currentTime = Date.now();
    const filteredEvents = events.filter(event => {
        const eventTime = new Date(event.date).getTime();
        if (filter === 'upcoming') {
            return eventTime >= currentTime;
        } else if (filter === 'expired') {
            return eventTime < currentTime;
        }
        return true; // For 'all' option or any other unrecognized filter, show all events
    });

    // New logic for button text
    const isRegistered = (attendees) => {
        if (!user?._id || !attendees) return false;
        const attendeeIds = attendees.split(',').map(id => id.trim());
        return attendeeIds.includes(user._id);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div>
            <section className="event-hero-section">
                <div className="event-hero-text-container">
                    <h1 className="fw-bold">EVENTS</h1>
                    <p>
                        The Events section of Career Elevate offers a diverse array of opportunities designed to enhance professional growth and network expansion. From industry-specific conferences and expert-led webinars to hands-on workshops and dynamic networking mixers, these events cater to a wide range of career stages and interests. Participants can gain valuable insights into emerging trends, acquire new skills, and connect with like-minded professionals. Whether you’re looking to deepen your expertise, explore new career paths, or simply stay current in your field, Career Elevate’s events provide the perfect platform to elevate your career aspirations.
                    </p>
                </div>
            </section>
            <section className="pt-3 event-filter-section">
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
            <section className="pb-5 px-5 events-section">
                <h2 className="reccomendation-tittle mb-5">RECOMMENDATIONS FOR YOU</h2>
                <Row className="event-box-container">
                    {filteredEvents.map(event => (
                        <Col xs={12} sm={6} md={4} lg={3} key={event._id} className="mb-4">
                            <Card className="event-card">
                            <img className="card-img" src={event.image ? `/src/assets/EventImages/${event.image}` : heroImg} alt={event.title} />
                                <Card.Body>
                                    <Card.Title>{event.title}</Card.Title>
                                    <Card.Text className='d-flex justify-content-start align-items-center gap-2'>
                                        <FaCalendarAlt />
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
                                            <Button
                                                className={`my-btn ${isRegistered(event.attendees) ? 'btn-registered' : ''}`}
                                                onClick={() => handleShow(event)}
                                            >
                                                {isRegistered(event.attendees) ? 'Registered' : 'Details'}
                                            </Button>
                                            <Button className='btn btn-danger text-white mx-1 px-3' onClick={() => deleteEvent(event._id)}>Delete</Button>
                                            <Link to={`/editEvent/${event._id}`} className="btn btn-warning text-white px-3 me-2">
                                                Edit
                                            </Link>
                                        </>
                                    ) : (
                                        <Button
                                            className={`my-btn ${isRegistered(event.attendees) ? 'btn-registered' : ''}`}
                                            onClick={() => handleShow(event)}
                                        >
                                            {isRegistered(event.attendees) ? 'Registered' : 'Details'}
                                        </Button>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </section>

            {selectedEvent && (
                <Modal show={showModal} onHide={handleClose} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>{selectedEvent.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <img
                            src={selectedEvent.image ? `/src/assets/EventImages/${selectedEvent.image}` : heroImg}
                            alt={selectedEvent.title}
                            className="img-fluid mb-3"
                        />
                        <p><strong>Description:</strong> {selectedEvent.description}</p>
                        <p><strong>Date:</strong> {new Date(selectedEvent.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                        })} at {new Date(`${selectedEvent.date.split('T')[0]}T${selectedEvent.time}`).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true
                        })}</p>
                        <p><strong>Location:</strong> {selectedEvent.location}</p>
                        <p><strong>Limit:</strong> {selectedEvent.limit}</p>
                        <p><strong>Price:</strong> ${selectedEvent.price}</p>
                        <p><strong>Attendees:</strong> {new Set(selectedEvent.attendees.split(',').map(id => id.trim()).filter(id => id !== '')).size}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        {registeredEvents[selectedEvent._id] ? (
                            <Button variant="secondary" disabled>Registered</Button>
                        ) : (
                            <Button variant="primary" onClick={handleRegister}>Register</Button>
                        )}
                        <Button variant="secondary" onClick={handleClose}>Close</Button>
                    </Modal.Footer>
                </Modal>
)}

        </div>
    );
};

export default ViewEvents;
