// import React from 'react';
import PropTypes from 'prop-types';
import '../css/index.css'
import "../css/home.css"
import rowimg1 from '../assets/row1.webp'
import rowimg2 from '../assets/row2.webp'
import rowimg3 from '../assets/row3.webp'
import featureImg1 from '../assets/feature1.webp'
import featureImg2 from '../assets/feature2.webp'
import featureImg3 from '../assets/feature3.webp'
import reachoutImg from '../assets/ReachOut.png'

// import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
// import { ACCESS_TOKEN_NAME, API_BASE_URL } from '../constants/apiConstants';
// import axios from 'axios'

function HomePage(props) {
  const { history } = props;
  const navigateTo = (path) => {
    history.push(path);
  };
  return (
    <div>
      <header className="py-5 bg-image">
        <div className="hero-text">
          <div className="text-center">
            <h4 className='hero-upper-tittle'>ONE STEP TOWARDS</h4>
            <h1 className="fw-bolder hero-lower-tittle">EXCELLENCE!!</h1>
          </div>
        </div>
      </header>

      <section className="py-5">
        <div>
          <div className="col-lg-12 text-center common-tittle">
            <h2 className='fw-bold'>WHAT ARE YOUR STEPS??</h2>
          </div>
        </div>
        <div className="row-container">
          <div className="row-box right-border">
            <img src={rowimg1} alt="Calender" className="row-img" />
            <h5 className="box-title">Join the Events</h5>
            <p className="box-text">
              Explore our dynamic events, where industry experts converge,
              knowledge is shared, and connections are forged.
            </p>
          </div>
          <div className="row-box right-border">
            <img src={rowimg2} alt="Calender" className="row-img size-s" />
            <h5 className="box-title">Grow Your Network</h5>
            <p className="box-text">
              Connect with a thriving community of professionals, where
              opportunities abound and connections flourish.
            </p>
          </div>
          <div className="row-box">
            <img src={rowimg3} alt="Calender" className="row-img size-ss" />
            <h5 className="box-title">Drop Your Review</h5>
            <p className="box-text">
              Share your experiences and insights with the community. Your
              feedback helps others navigate their careers.
            </p>
          </div>
        </div>
      </section>
      <section className="py-5">
        <div className="features-container">
          <div className="row">
            <div className="col-lg-12 text-center common-tittle">
              <h2 className='fw-bold'>FEATURES AT ELEVATE CAREER</h2>
            </div>
          </div>
          <div className="flex-container box-container">
            <div className="left-feature-container">
              <div className="feature full-height-container">
                <img src={featureImg1} alt="Join our team" className="feature-image aspect-ratio" />
                <h3 className="feature-title">JOBS BOARD</h3>
                <p className="feature-description">Students can apply for jobs, internships, freelancing projects posted by Alumni. It is a great way to grab opportunities, hands-on experience and setting pathways to your career.</p>
                <button className="feature-button my-btn" onClick={()=>navigateTo('/jobboard')}>CLICK HERE</button> 
              </div>
            </div>
            <div className="right-feature-container">
              <div className="feature upper-container">
                <img src={featureImg2} alt="Events" className="feature-image" />
                <h3 className="feature-title">EVENTS</h3>
                <p className="feature-description">Join the events posted by alumni such as job fairs, networking sessions, meetups, workshops, and more.</p>
                <button className="feature-button my-btn" onClick={()=>navigateTo('/viewEvents')}>CLICK HERE</button>
              </div>
              <div className="feature lower-container">
                <img src={featureImg3} alt="Resources library" className="feature-image" />
                <h3 className="feature-title">RESOURCES LIBRARY</h3>
                <p className="feature-description">Find great sources of articles, webinars, career guidance tips, trends in technology, resume preparation, and more to educate yourself and get prepared.</p>
                <button className="feature-button my-btn" onClick={()=>navigateTo('/viewResources')}>CLICK HERE</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="reachout-container">
        <div className="reachout-box flex-container">
          <div className="reachout-image-container flex-container">
            <img className="reachout-image" src={reachoutImg} alt="a girl working with laptop" />
          </div>
          <div className="reachout-text-container">
            <h1>REACH OUT !</h1>
            <p>At Elevate Career, we are here to support your professional journey every step of the way. Whether you are looking for personalized career advice, have questions about our services, or need assistance navigating your career path, we are just a click away.</p>
            <button className="feature-button my-btn" onClick={()=>navigateTo("/help-center")}>CLICK HERE</button>
          </div>
        </div>
      </section>
    </div>
  );
}

HomePage.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
};
export default withRouter(HomePage);
