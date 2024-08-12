import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { CgProfile } from "react-icons/cg";
import { BiComment } from 'react-icons/bi';
import defaultResourceImage from '../assets/defaultResourceImage.jpeg';
import '../css/resourceDetails.css';
import { useAuth } from '../AuthContext.jsx';

const ResourceDetails = () => {
    const { user } = useAuth();
    const { id } = useParams();
    const history = useHistory();
    const [resource, setResource] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [userNames, setUserNames] = useState({});
    const [hasLiked, setHasLiked] = useState(false);
    const [hasDisliked, setHasDisliked] = useState(false);

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
                const userIDs = data.singleResource.comments.map(comment => comment.userID);
                userIDs.push(data.singleResource.postedBy);
                fetchUserNames(userIDs);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchResource();
    }, [id]);

    const handleLike = async () => {
        if (hasDisliked) {
            // Remove dislike if it exists
            await handleDislike();
        }

        if (!hasLiked) {
            const mutation = `
                mutation($resourceId: ID!) {
                    likeResource(resourceId: $resourceId) {
                        _id
                        likes
                    }
                }
            `;

            try {
                const response = await fetch('http://localhost:3000/graphql', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        query: mutation,
                        variables: { resourceId: id },
                    }),
                });

                const { data, errors } = await response.json();

                if (errors) {
                    throw new Error(errors[0].message);
                }

                setResource(prevResource => ({
                    ...prevResource,
                    likes: data.likeResource.likes,
                }));
                setHasLiked(true);
            } catch (error) {
                setError(error.message);
            }
        }
    };

    const handleDislike = async () => {
        if (hasLiked) {
            // Remove like if it exists
            await handleLike();
        }

        if (!hasDisliked) {
            const mutation = `
                mutation($resourceId: ID!) {
                    dislikeResource(resourceId: $resourceId) {
                        _id
                        dislikes
                    }
                }
            `;

            try {
                const response = await fetch('http://localhost:3000/graphql', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        query: mutation,
                        variables: { resourceId: id },
                    }),
                });

                const { data, errors } = await response.json();

                if (errors) {
                    throw new Error(errors[0].message);
                }

                setResource(prevResource => ({
                    ...prevResource,
                    dislikes: data.dislikeResource.dislikes,
                }));
                setHasDisliked(true);
            } catch (error) {
                setError(error.message);
            }
        }
    };

    const handleCommentSubmit = async () => {
        const mutation = `
            mutation($resourceId: ID!, $comment: CommentInput!) {
                addComment(resourceId: $resourceId, comment: $comment) {
                    _id
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
                body: JSON.stringify({
                    query: mutation,
                    variables: {
                        resourceId: id,
                        comment: {
                            userID: user._id,
                            comment: newComment
                        }
                    }
                }),
            });

            const { data, errors } = await response.json();

            if (errors) {
                throw new Error(errors[0].message);
            }

            setResource(prevResource => ({
                ...prevResource,
                comments: data.addComment.comments
            }));
            fetchUserNames(data.addComment.comments.map(comment => comment.userID));
            setNewComment('');
        } catch (error) {
            setError(error.message);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="resource-details-container">
            <div className="resourceImg-container">
                <img
                    className="resource-heroImg"
                    src={resource.image ? `/src/assets/ResourceImages/${resource.image}` : defaultResourceImage}
                    alt={resource.title}
                />
            </div>
            <div className="resource-details-card px-3">
                <div className="card-body my-3">
                    <h2 className="card-title">{resource.title}</h2>
                    <div className="profile-like-container mb-2 my-3">
                        <div className="d-flex align-items-center profile-name-container">
                            <strong><CgProfile className='fs-3' /> {userNames[resource.postedBy] || 'Unknown User'}</strong>
                        </div>
                        <div className="d-flex align-items-center like-container">
                            <button
                                className={`btn ${hasLiked ? 'btn-primary' : 'btn-light'} me-2`}
                                onClick={handleLike}
                            >
                                <FaThumbsUp /> {resource.likes}
                            </button>
                            <button
                                className={`btn ${hasDisliked ? 'btn-danger' : 'btn-light'}`}
                                onClick={handleDislike}
                            >
                                <FaThumbsDown /> {resource.dislikes}
                            </button>
                            <div className="d-flex align-items-center ml-2">
                                <BiComment className="me-1" /> {resource.comments.length}
                            </div>
                        </div>
                    </div>
                    <h2 className="reccomendation-tittle my-3">Description</h2>
                    <p className="card-text mx-2">{resource.description}</p>
                </div>
            </div>
            <section className="comments-section px-3">
                <h2 className="reccomendation-tittle my-3">Comments</h2>
                {resource.comments.map((comment, index) => (
                    <div key={index} className="comment px-2">
                        <strong>{userNames[comment.userID] || 'Unknown User'}:</strong> {comment.comment}
                    </div>
                ))}
                <form>
                    <div className="form-group">
                        <label htmlFor="newComment">Add a Comment</label>
                        <input
                            type="text"
                            id="newComment"
                            className="form-control"
                            placeholder="Enter your comment"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                    </div>
                    <button className="my-btn" onClick={() => history.push(`/viewResources`)}>Go Back</button>
                    <button type="button" className="my-btn" onClick={handleCommentSubmit}>
                        Submit
                    </button>
                </form>
            </section>
        </div>
    );
};

export default ResourceDetails;
