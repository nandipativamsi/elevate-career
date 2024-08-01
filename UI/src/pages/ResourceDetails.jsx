import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import defaultResourceImage from '../assets/defaultResourceImage.jpeg';
import '../css/resourceDetails.css';

const ResourceDetails = () => {
    const { id } = useParams();
    const history = useHistory();
    const [resource, setResource] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResource = async () => {
            const query = `
                query($id: ID!) {
                    singleResource(id: $id) {
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

            try {
                const response = await fetch('http://localhost:3000/graphql', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query, variables: { id } }),
                });

                const { data, errors } = await response.json();

                if (errors) {
                    throw new Error(errors[0].message);
                }

                setResource(data.singleResource);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchResource();
    }, [id]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="resource-details-container">
            <Card className="resource-details-card">
                <Card.Img
                    variant="top"
                    src={resource.image ? `/src/assets/ResourceImages/${resource.image}` : defaultResourceImage}
                    alt={resource.title}
                />
                <Card.Body>
                    <Card.Title>{resource.title}</Card.Title>
                    <Card.Text>{resource.description}</Card.Text>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className="d-flex align-items-center">
                            <strong>Posted by: {resource.postedBy}</strong>
                        </div>
                        <div className="d-flex align-items-center">
                            <div className="d-flex align-items-center me-3">
                                Likes: {resource.likes}
                            </div>
                            <div className="d-flex align-items-center me-3">
                                Dislikes: {resource.dislikes}
                            </div>
                            <div className="d-flex align-items-center">
                                Comments: {resource.comments.length}
                            </div>
                        </div>
                    </div>
                    <Button variant="primary" onClick={() => history.goBack()}>Go Back</Button>
                </Card.Body>
            </Card>
            <section className="comments-section">
                <h3>Comments</h3>
                {resource.comments.map((comment, index) => (
                    <div key={index} className="comment">
                        <strong>{comment.userID}:</strong> {comment.comment}
                    </div>
                ))}
            </section>
        </div>
    );
};

export default ResourceDetails;
