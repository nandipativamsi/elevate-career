import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Form } from 'react-bootstrap';
import { BiLike, BiDislike, BiComment, BiUser } from 'react-icons/bi';
import defaultResourceImage from '../assets/defaultResourceImage.jpeg';
import { Link, useHistory } from 'react-router-dom';
import "../css/resources.css";
import { useAuth } from '../AuthContext.jsx';

const ViewResources = () => {
    const { user } = useAuth();
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');
    const [userNames, setUserNames] = useState({});
    const history = useHistory();

    const loadData = async () => {
        const query = user?.role === 'Alumni'
            ? `
                query resourcesByUser($userId: ID!) {
                    resourcesByUser(userId: $userId) {
                        _id
                        title
                        description
                        likes
                        dislikes
                        postedBy
                        image
                        createdAt
                        comments {
                            userID
                            comment
                        }
                    }
                }
            `
            : `
                query {
                    resourceList {
                        _id
                        title
                        description
                        likes
                        dislikes
                        postedBy
                        image
                        createdAt
                        comments {
                            userID
                            comment
                        }
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

            setResources(data.resourceList);
            fetchUserNames(data.resourceList.map(resource => resource.postedBy));
            setResources(user?.role === 'Alumni' ? data.resourcesByUser : data.resourceList);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    const fetchUserNames = async (userIDs) => {
        const query = `
            query($ids: [ID!]!) {
                usersByIds(ids: $ids) {
                    _id
                    name
                }
            }
        `;
        const response = await fetch('http://localhost:3000/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, variables: { ids: userIDs } }),
        });
        const { data, errors } = await response.json();
        if (errors) {
            throw new Error(errors[0].message);
        }
        const namesMap = {};
        data.usersByIds.forEach(user => {
            namesMap[user._id] = user.name;
        });
        setUserNames(namesMap);
    };

    useEffect(() => {
        loadData();
    }, [user]);

    const deleteResource = async (_id) => {
        if (window.confirm("Are you sure you want to delete the resource?")) {
            const query = `
                mutation deleteResource($_id: ID!) {
                    deleteResource(_id: $_id)
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
                    alert("Resource Deleted Successfully!");
                    loadData();
                } else {
                    alert("Failed to delete the resource");
                }
            } catch (error) {
                setError(error.message);
            }
        }
    };

    const filterResources = (resources) => {
        switch (filter) {
            case 'popular':
                return resources.sort((a, b) => (b.likes + b.comments.length) - (a.likes + a.comments.length));
            case 'recent':
                return resources.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            default:
                return resources;
        }
    };

    const sortedResources = filterResources(resources);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div>
            <section className="resource-hero-section">
                <div className="hero-text-container">
                    <h1 className="fw-bold">RESOURCES BOARD</h1>
                    <p>
                    A resources library is a comprehensive collection designed to support learning, research, and professional development. It includes books, journals, multimedia resources, and access to digital databases and online courses. Study areas and computer workstations facilitate both individual and collaborative work. Specialized collections and archives offer rare materials, while support services like workshops and librarian assistance enhance user experience. Digital tools and mobile access ensure resources are available anytime, anywhere. Community engagement and technology integration further enrich the learning environment.
                    </p>
                </div>
            </section>
            <section className="pt-5 resource-filter-section">
                <Form className="dropdowns-container">
                    <Row className="justify-content-center">
                        <Col xs={12} sm={6} md={4} lg={3} className="dropdown-col">
                            <div className="dropdown-wrapper">
                                <Form.Control
                                    as="select"
                                    className="dropdown-input"
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                >
                                    <option value="all">All Resources</option>
                                    <option value="popular">Most Popular</option>
                                    <option value="recent">Recently Added</option>
                                </Form.Control>
                                <i className="bi bi-caret-down-fill dropdown-icon"></i>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </section>
            <section className="pb-5 px-5 resources-section">
                <h2 className="reccomendation-tittle mb-5">RECOMMENDED RESOURCES</h2>
                <Row className="justify-content-center align-items-center">
                    {sortedResources.map(resource => (
                        <Col xs={12} sm={6} md={4} lg={3} key={resource._id} className="mb-4">
                            <Card className="resource-card">
                                <img
                                    className='resource-card-img'
                                    src={resource.image ? `/src/assets/ResourceImages/${resource.image}` : defaultResourceImage}
                                    alt={resource.title}
                                />
                                <Card.Body>
                                    <Card.Title>
                                        {resource.title.length > 20 ? `${resource.title.substring(0, 20)}...` : resource.title}
                                    </Card.Title>
                                    <Card.Text>
                                        {resource.description.length > 30 ? `${resource.description.substring(0, 30)}...` : resource.description}
                                    </Card.Text>
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <div className="d-flex align-items-center">
                                            <BiUser className="me-1" /><strong>{userNames[resource.postedBy] || 'Unknown User'}</strong>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <div className="d-flex align-items-center me-3">
                                                <BiLike className="me-1" /> {resource.likes}
                                            </div>
                                            <div className="d-flex align-items-center me-3">
                                                <BiDislike className="me-1" /> {resource.dislikes}
                                            </div>
                                            <div className="d-flex align-items-center">
                                                <BiComment className="me-1" /> {resource.comments.length}
                                            </div>
                                        </div>
                                    </div>
                                    <Card.Text>
                                        Created on {new Date(resource.createdAt).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })} at {new Date(resource.createdAt).toLocaleTimeString('en-US', {
                                            hour: 'numeric',
                                            minute: 'numeric',
                                            hour12: true
                                        })}
                                    </Card.Text>
                                    {user?.role === 'Alumni' ? (
                                        <>
                                        <button className='my-btn' onClick={() => history.push(`/viewResourcesDetails/${resource._id}`)}>Read Article</button>
                                            <Button variant='danger' className='text-white mx-1 px-3' onClick={() => deleteResource(resource._id)}>Delete</Button>
                                            <Link to={`/editResource/${resource._id}`} className="btn btn-warning text-white px-3 me-2">
                                                Edit 
                                            </Link>
                                        </>
                                    ) : (
                                        <button className='my-btn' onClick={() => history.push(`/viewResourcesDetails/${resource._id}`)}>Read Article</button>
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

export default ViewResources;
