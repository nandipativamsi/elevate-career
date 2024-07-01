// import React from 'react';
import '../css/index.css'
import "../css/home.css"
import '../css/navbar.css'
import rowimg1 from '../assets/row1.png'
import rowimg2 from '../assets/row2.png'
import rowimg3 from '../assets/row3.png'
import featureImg1 from '../assets/feature1.jpg'
import featureImg2 from '../assets/feature2.jpg'
import featureImg3 from '../assets/feature3.jpg'
import reachoutImg from '../assets/ReachOut.png'

import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { ACCESS_TOKEN_NAME, API_BASE_URL } from '../constants/apiConstants';
import axios from 'axios'

function HomePage() {
  return (
    <div>
      <header className="py-5 bg-image">
        <div className="hero-text">
          <div className="text-center">
            <h4 className='fs-5'>ONE STEP TOWARDS</h4>
            <h1 className="fw-bolder fs-1">EXCELLENCE!!</h1>
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
      <section className="py-5 bg-light">
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
                <button className="feature-button my-btn">CLICK HERE</button>
              </div>
            </div>
            <div className="right-feature-container">
              <div className="feature upper-container">
                <img src={featureImg2} alt="Events" className="feature-image" />
                <h3 className="feature-title">EVENTS</h3>
                <p className="feature-description">Join the events posted by alumni such as job fairs, networking sessions, meetups, workshops, and more.</p>
                <button className="feature-button my-btn">CLICK HERE</button>
              </div>
              <div className="feature lower-container">
                <img src={featureImg3} alt="Resources library" className="feature-image" />
                <h3 className="feature-title">RESOURCES LIBRARY</h3>
                <p className="feature-description">Find great sources of articles, webinars, career guidance tips, trends in technology, resume preparation, and more to educate yourself and get prepared.</p>
                <button className="feature-button my-btn">CLICK HERE</button>
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
            <button className="feature-button my-btn">CLICK HERE</button>
          </div>
        </div>

        <div className="reachout-info flex-container align-text-center">
          <div>
            <h5 className='fw-bold'>HOW TO REACH US</h5>
          </div>
          <div className='flex-container email-phone'>
            <div className='reachout-email'>contact@elevatecareer.com</div>
            <div>+1 (123) 456-7890</div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Home(props) {
  useEffect(() => {
    axios.get(API_BASE_URL + '/user/me', { headers: { 'token': localStorage.getItem(ACCESS_TOKEN_NAME) } })
      .then(function (response) {
        if (response.status !== 200) {
          redirectToLogin()
        }
      })
      .catch(function (error) {
        redirectToLogin()
      });
  }, [])
  function redirectToLogin() {
    props.history.push('/login');
  }
  return (
    <div className="mt-2">
      Home page content
    </div>
  )
}

export default withRouter(HomePage);
