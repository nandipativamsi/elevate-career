import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Card, Button } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../css/Connections.css";
import defaultProfileImage from '../assets/defaultProfileImage.jpg'

const ConnectionsPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const { user: currentUser } = useAuth();

    useEffect(() => {
        loadUsers();
    }, []);

    // Ensure currentUser is defined before calling its properties
    const currentUserId = currentUser ? currentUser._id : null;

    const loadUsers = async () => {
        const query = `
            query {
                userList {
                    _id
                    name
                    email
                    role
                    contactNumber
                    education
                    connections
                    pendingConnectionsAcceptor
                    pendingConnectionsRequestor
                    profileImage
                    yearOfGraduation
                    workExperience
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

            setUsers(data.userList);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const sendConnectionRequest = async (toUserId) => {
        if (!currentUserId) return; // Ensure currentUserId is not null

        const mutation = `
            mutation {
                sendConnectionRequest(fromUserId: "${currentUserId}", toUserId: "${toUserId}") {
                    _id
                }
            }
        `;
        await fetch('http://localhost:3000/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: mutation }),
        });
        loadUsers();
    };

    const acceptConnectionRequest = async (fromUserId) => {
        if (!currentUserId) return; // Ensure currentUserId is not null

        const mutation = `
            mutation {
                acceptConnectionRequest(fromUserId: "${fromUserId}", toUserId: "${currentUserId}") {
                    _id
                }
            }
        `;
        await fetch('http://localhost:3000/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: mutation }),
        });
        loadUsers();
    };

    const rejectConnectionRequest = async (fromUserId) => {
        if (!currentUserId) return; // Ensure currentUserId is not null

        const mutation = `
            mutation {
                rejectConnectionRequest(fromUserId: "${fromUserId}", toUserId: "${currentUserId}") {
                    _id
                }
            }
        `;
        await fetch('http://localhost:3000/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: mutation }),
        });
        loadUsers();
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const isConnected = (user) => {
        if (!currentUser || !user) return false;
        const connections = user.connections ? user.connections.split(',') : [];
        return connections.includes(currentUserId);
    };

    const isPendingConnectionAcceptor = (user) => {
        const pendingConnectionsAcceptor = user.pendingConnectionsAcceptor ? user.pendingConnectionsAcceptor.split(',') : [];
        return pendingConnectionsAcceptor.includes(currentUserId);
    };

    const isPendingConnectionRequestor = (user) => {
        const pendingConnectionsRequestor = user.pendingConnectionsRequestor ? user.pendingConnectionsRequestor.split(',') : [];
        return pendingConnectionsRequestor.includes(currentUserId);
    };
    

    const renderConnectionButtons = (user) => {
        if (!currentUser) return null;
    
        if (currentUserId === user._id) {
            return <Button variant="success" disabled>View Profile</Button>; // No buttons if the current user is the same as the user
        }
    
        if (isConnected(user)) {
            return <Button variant="success" disabled>Connected</Button>;
        } 
        
        if (isPendingConnectionAcceptor(user)) {
            
            return <Button variant="secondary" disabled>Pending</Button>;
        }

        if(isPendingConnectionRequestor(user))
        {
            return (
                <>
                    <Button variant="primary" onClick={() => acceptConnectionRequest(user._id)}>Accept</Button>
                    <Button variant="danger" onClick={() => rejectConnectionRequest(user._id)}>Reject</Button>
                </>
            );
        }
    
        return <Button variant="primary" onClick={() => sendConnectionRequest(user._id)}>Connect</Button>;
    };

    const getConnectionCount = (connections) => {
        return connections ? connections.split(',').length : 0;
    };
    

    return (
        <Container className='my-5'>
            
            <Row className="my-4">
                <Col>
                    <div className="search-box">
                        <FaSearch className="search-icon" />
                        <Form.Control
                            type="text"
                            placeholder="Search"
                            className="search-input"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                </Col>
            </Row>
            <Row>
            <p>Current User: {currentUserId}</p>
                {filteredUsers.map((user, index) => (
                    <Col md={4} className="my-3" key={index}>
                        <Card className='connection-card'>
                            <Card.Body className="text-center">
                                <Card.Img
                                    variant="top"
                                    src={user.profileImage ? `/src/assets/ProfileImages/${user.profileImage}` : defaultProfileImage}
                                    className="rounded-circle w-50 mb-3"
                                />
                                <Card.Title>{user.name}</Card.Title>
                                <Card.Text>Education : {user.education} - {user.yearOfGraduation}</Card.Text>
                                <Card.Text>Connections: {getConnectionCount(user.connections)}</Card.Text>
                                <Card.Text><strong>Experience:&nbsp;</strong>{user.workExperience} Years</Card.Text>
                                {renderConnectionButtons(user)}
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default ConnectionsPage;
