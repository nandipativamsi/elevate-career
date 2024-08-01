import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Card } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../css/Connections.css";

const ConnectionsPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

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
                    pendingConnections
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

    useEffect(() => {
        loadUsers();
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
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
                <Col>
                    <Form.Control as="select">
                        <option>Connections</option>
                    </Form.Control>
                </Col>
                <Col>
                    <Form.Control as="select">
                        <option>Pending Connections</option>
                    </Form.Control>
                </Col>
            </Row>
            <Row>
                {filteredUsers.map((user, index) => (
                    <Col md={4} className="my-3" key={index}>
                        <Card className='connection-card'>
                            <Card.Body className="text-center">
                                <Card.Img
                                    variant="top"
                                    src="https://via.placeholder.com/100"
                                    className="rounded-circle w-50 mb-3"
                                />
                                <Card.Title>{user.name}</Card.Title>
                                <Card.Text>{user.education}</Card.Text>
                                <Card.Text>Connections : {user.Connections}</Card.Text>
                                <Card.Text>Pending Connections : {user.pendingConnections}</Card.Text>
                                <Card.Text><strong>Experience:&nbsp;</strong>{user.workExperience}</Card.Text>
                                <a href={user.linkedInURL} className="my-btn" target="_blank" rel="noopener noreferrer">Connect</a>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default ConnectionsPage;
