import React, { useState } from 'react';
import 'leaflet/dist/leaflet.css'; // Ensure Leaflet's CSS is imported
import './login.css';
import { CCard, CCardBody, CCardHeader, CCollapse } from '@coreui/react';
import emailjs from 'emailjs-com';

const HelpCenter = () => {
  const [showCollapsible1, setShowCollapsible1] = useState(false);
  const [showCollapsible2, setShowCollapsible2] = useState(false);
  const [showCollapsible3, setShowCollapsible3] = useState(false);
  const [showCollapsible4, setShowCollapsible4] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    comment: ''
  });
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const templateParams = {
      email: formData.email,
      msg: formData.comment
    };

    emailjs.send('', '', templateParams, '')
      .then((response) => {
        setLoading(false);
        alert('Your request has been submitted successfully. You will be contacted soon');
      }, (error) => {
        setLoading(false);
        console.log('FAILED...', error);     
      });
  };

  return (
    <div>
    <div>
      
      <iframe 
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2899.396170171839!2d-80.40930401583068!3d43.389648294975665!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b9018e9e89adf%3A0x2043c24369ede07e!2sConestoga%20College%20Kitchener%20-%20Doon%20Campus!5e0!3m2!1sen!2sca!4v1722810070885!5m2!1sen!2sca" 
        style={{ height: '33.33vh', width: '100%', marginTop: '10px' }}
       ></iframe>
        
    </div>

    <div style={{ marginTop: '10px'}}>
    <h5 className='header'>WE ARE HERE TO HELP</h5> 
      <div>
        <div className="login-container">
          <form className="login-form" onSubmit={handleSubmit}>
              
            <div className="form-group">
                <input 
                    type="email" 
                    name="email"
                    placeholder="Email Address" 
                    value={formData.email}
                    onChange={handleChange}
                />
                
            </div>

            <div className="form-group">
                <input 
                    type="comment" 
                    name="comment"
                    placeholder="Your Comment"  
                    value={formData.comment}
                    onChange={handleChange}
                />
            </div>

            <button type="submit" className="login-button">SUBMIT</button>
              
          </form>
          {loading && <div className="loading">Loading...</div>}
        </div>
      </div>
    </div>

    <div style={{ marginTop: '10px'}}>
        <h5 className='header'>YOU MIGHT LIKE TO ASK</h5> 
        <div className="collapsible-container">
        <div className="collapsible" onClick={() => setShowCollapsible1(!showCollapsible1)}>
          How to change the create an event? <span className="icon">{showCollapsible1 ? '▲' : '▼'}</span>
        </div>

        <CCollapse visible={showCollapsible1}>
          <CCard className="mt-3">
            <CCardBody className="card-body-margin">
            To change or create an event, navigate to the Events section in your account dashboard. 
            Click on 'Create Event' or select an existing event to edit its details.
            </CCardBody>
          </CCard>
      </CCollapse>

        <div className="collapsible" onClick={() => setShowCollapsible2(!showCollapsible2)}>
          Check or add an email address <span className="icon">{showCollapsible2 ? '▲' : '▼'}</span>
        </div>
        <CCollapse visible={showCollapsible2}>
          <CCard className="mt-3">
            <CCardBody className="card-body-margin">
            To check or add an email address, go to the Account Settings page. Under the Email section, 
            you can add a new email or verify your existing email addresses.
            </CCardBody>
          </CCard>
      </CCollapse>

        <div className="collapsible" onClick={() => setShowCollapsible3(!showCollapsible3)}>
          Delete an account <span className="icon">{showCollapsible3 ? '▲' : '▼'}</span>
        </div>
        <CCollapse visible={showCollapsible3}>
          <CCard className="mt-3">
            <CCardBody className="card-body-margin">
            To delete your account, visit the Account Settings page and scroll down to the Delete Account section.
             Follow the prompts to permanently remove your account.
            </CCardBody>
          </CCard>
      </CCollapse>

        <div className="collapsible" onClick={() => setShowCollapsible4(!showCollapsible4)}>
          How to attend an event? <span className="icon">{showCollapsible4 ? '▲' : '▼'}</span>
        </div>
        <CCollapse visible={showCollapsible4}>
          <CCard className="mt-3">
            <CCardBody className="card-body-margin">
            To attend an event, simply register for it through the Events page.
             On the day of the event, use the provided link or details to join at the specified time.
            </CCardBody>
          </CCard>
      </CCollapse>

      </div>
      </div>

    </div>
  );
};

export default HelpCenter;