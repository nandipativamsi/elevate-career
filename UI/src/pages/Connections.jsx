import { Container, Row, Col, Form, Card } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../css/Connections.css"

const data = [
    { name: "Smeet Parmar", college: "Conestoga College Kitchener, ON", experience: "Eternal Impressions" },
    { name: "Harshavi Moradia", college: "Conestoga College Kitchener, ON", experience: "Pictures by Radhik Joseph" },
    { name: "Harshavi Moradia", college: "Conestoga College Kitchener, ON", experience: "Pictures by Radhik Joseph" },
    { name: "Smeet Parmar", college: "Conestoga College Kitchener, ON", experience: "Eternal Impressions" },
    { name: "Smeet Parmar", college: "Conestoga College Kitchener, ON", experience: "Eternal Impressions" },
    { name: "Smeet Parmar", college: "Conestoga College Kitchener, ON", experience: "Eternal Impressions" },
];

const ConnectionsPage = () => {
    return (
        <Container className='my-5'>
            <Row className="my-4">
                <Col>
                    <div className="search-box">
                        <FaSearch className="search-icon" />
                        <Form.Control type="text" placeholder="Search" className="search-input" />
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
                {data.map((person, index) => (
                    <Col md={4} className="my-3" key={index}>
                        <Card className='connection-card'>
                            <Card.Body className="text-center">
                                <Card.Img variant="top" src="https://via.placeholder.com/100" className="rounded-circle w-50 mb-3" />
                                <Card.Title>{person.name}</Card.Title>
                                <Card.Text>{person.college}</Card.Text>
                                <Card.Text><strong>Experience:&nbsp;</strong>{person.experience}</Card.Text>
                                <button className="my-btn">Connect</button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default ConnectionsPage;
