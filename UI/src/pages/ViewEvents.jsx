import React, { useState, useEffect } from 'react';
import defaultEventImage from '../assets/defaultEventImage.jpeg';

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

    return (
        <div>
            <h2>Events List</h2>
            <ul>
                {events.map(event => (
                    <li key={event._id}>
                        <div>
                            <img
                                src={event.image ? `/src/assets/EventImages/${event.image}` : defaultEventImage}
                                alt="Event-Image"
                            />
                        </div>
                        <h3>{event.title}</h3>
                        <p><strong>Description:</strong> {event.description}</p>
                        <p><strong>Date:</strong> {event.date}</p>
                        <p><strong>Location:</strong> {event.location}</p>
                        <p><strong>Attendees:</strong> {event.attendees}</p>
                        <p><strong>Posted By:</strong> {event.postedBy}</p>
                        <p><strong>Limit:</strong> {event.limit}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ViewEvents;
