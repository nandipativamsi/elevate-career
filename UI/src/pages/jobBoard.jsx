import { Form, Row, Col } from 'react-bootstrap';
import heroImg from '../assets/jobBoardHero.png'
import jobPostingImg from '../assets/job-posting-image.jpeg'
import "../css/jobboard.css"
export default function jobBoard() {
    return (
        <div>
            <section className="py-5 jobboard-hero-section flex-container">
                <div className="jobboard-hero-image-container">
                    <img src={heroImg} alt="person-with-hiring-sign-by-window" />
                </div>
                <div className="jobboard-hero-text-container">
                    <h1 className='fw-bold'>JOBS BOARD</h1>
                    <p>Welcome to our exclusive job board designed to bridge the gap between ambitious students and accomplished alumni. Here, you can discover a variety of opportunities, including jobs, internships, and freelancing projects, all posted by our experienced alumni network. This platform is dedicated to helping you gain hands-on experience, build professional connections, and pave the way for a successful career. Whether you are looking to dive into your first job, secure a meaningful internship, or take on freelance work, our job board is the perfect place to start your journey. Unlock your potential and explore the myriad of opportunities awaiting you!</p>
                </div>
            </section>
            <section className='py-5 jobboard-filter-section'>
                <Form className="dropdowns-container">
                    <Row className="justify-content-center">
                        <Col xs={12} sm={6} md={4} lg={3} className="dropdown-col">
                            <div className="dropdown-wrapper">
                                <Form.Control as="select" className="dropdown-input">
                                    <option value="">Full-time</option>
                                    <option value="full-time">Full-time</option>
                                    <option value="part-time">Part-time</option>
                                    <option value="contract">Contract</option>
                                    <option value="temporary">Temporary</option>
                                    <option value="other">Other</option>
                                </Form.Control>
                                <i className="bi bi-caret-down-fill dropdown-icon"></i>
                            </div>
                        </Col>
                        <Col xs={12} sm={6} md={4} lg={3} className="dropdown-col">
                            <div className="dropdown-wrapper">
                                <Form.Control as="select" className="dropdown-input">
                                    <option value="">Select Work Mode</option>
                                    <option value="remote">Remote</option>
                                    <option value="hybrid">Hybrid</option>
                                    <option value="on-site">On-site</option>
                                </Form.Control>
                                <i className="bi bi-caret-down-fill dropdown-icon"></i>
                            </div>
                        </Col>
                        <Col xs={12} sm={6} md={4} lg={3} className="dropdown-col">
                            <div className="dropdown-wrapper">
                                <Form.Control as="select" className="dropdown-input">
                                    <option value="">Select Location</option>
                                    <option value="location1">Location 1</option>
                                    <option value="location2">Location 2</option>
                                    <option value="location3">Location 3</option>
                                </Form.Control>
                                <i className="bi bi-caret-down-fill dropdown-icon"></i>
                            </div>
                        </Col>
                    </Row>
                </Form>

                <div className="job-list flex-container">
                    <div className="job-box flex-container">
                        <div className="job-posting-image">
                            <img src={jobPostingImg} alt="" />
                        </div>
                        <div className='job-posting-text'>
                            <p className="job-title"> Video Editor - Youtube / Instagram</p>
                            <p className="company-name">TDG Scaling</p>
                            <p className="location-jobtype">Canada <span>(Remote)</span></p>
                            <p className="job-salary">CA $45,000</p>
                        </div>
                    </div>
                </div>
            </section>


        </div>
    )
}