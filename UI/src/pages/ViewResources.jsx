import React, { useState, useEffect } from 'react';

const ViewResources = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const query = `
                query {
                    resourceList {
                        _id
                        title
                        description
                        likes
                        dislikes
                        image
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
                    body: JSON.stringify({ query }),
                });

                const { data, errors } = await response.json();

                if (errors) {
                    throw new Error(errors[0].message);
                }

                setResources(data.resourceList);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div>
            <h2>Resources List</h2>
            <ul>
                {resources.map(resource => (
                    <li key={resource._id}>
                        <div>
                            <img
                                src={resource.image ? `../assets/ResourceImages/${resource.image}` : "ND"}
                                alt="Resource-Image"
                            />
                        </div>
                        <h3>{resource.title}</h3>
                        <p><strong>Description:</strong> {resource.description}</p>
                        <p><strong>Likes:</strong> {resource.likes}</p>
                        <p><strong>Dislikes:</strong> {resource.dislikes}</p>
                        <div>
                            <strong>Comments:</strong>
                            <ul>
                                {resource.comments.map((comment, index) => (
                                    <li key={index}>
                                        <p><strong>User ID:</strong> {comment.userID}</p>
                                        <p><strong>Comment:</strong> {comment.comment}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ViewResources;
