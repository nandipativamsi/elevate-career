import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Ensure Leaflet's CSS is imported
import '../css/login.css';
import { CCard, CCardBody, CCardHeader, CCollapse } from '@coreui/react';

const HelpCenter = () => {
  const [showCollapsible1, setShowCollapsible1] = useState(false);
  const [showCollapsible2, setShowCollapsible2] = useState(false);
  const [showCollapsible3, setShowCollapsible3] = useState(false);
  const [showCollapsible4, setShowCollapsible4] = useState(false);

  // Update the position array with the given latitude and longitude
  const position = [43.3896, -80.4044]; // Note: Leaflet uses [latitude, longitude] format

  return (
    <div>
    <div style={{ height: '33.33vh', width: '100%', marginTop: '10px' }}>
      <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position}>
          <Popup>
            Conestoga Doon Campus Library
          </Popup>
        </Marker>
      </MapContainer>
    </div>
    <div style={{ marginTop: '10px'}}>
    <h5 className='header'>WE ARE HERE TO HELP</h5> 
      <div>
        <div className="login-container">
          <form className="login-form" >
              
            <div className="form-group">
                <input 
                    type="email" 
                    name="email"
                    placeholder="Email Address" 
                />
                
            </div>

            <div className="form-group">
                <input 
                    type="comment" 
                    name="comment"
                    placeholder="Your Comment"  
                />
            </div>

            <button type="submit" className="login-button">SUBMIT</button>
              
          </form>
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
              Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad
              squid. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt
              sapiente ea proident.
            </CCardBody>
          </CCard>
      </CCollapse>

        <div className="collapsible" onClick={() => setShowCollapsible2(!showCollapsible2)}>
          Check or add an email address <span className="icon">{showCollapsible2 ? '▲' : '▼'}</span>
        </div>
        <CCollapse visible={showCollapsible2}>
          <CCard className="mt-3">
            <CCardBody className="card-body-margin">
              Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad
              squid. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt
              sapiente ea proident.
            </CCardBody>
          </CCard>
      </CCollapse>

        <div className="collapsible" onClick={() => setShowCollapsible3(!showCollapsible3)}>
          Delete an account <span className="icon">{showCollapsible3 ? '▲' : '▼'}</span>
        </div>
        <CCollapse visible={showCollapsible3}>
          <CCard className="mt-3">
            <CCardBody className="card-body-margin">
              Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad
              squid. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt
              sapiente ea proident.
            </CCardBody>
          </CCard>
      </CCollapse>

        <div className="collapsible" onClick={() => setShowCollapsible4(!showCollapsible4)}>
          How to attend an event? <span className="icon">{showCollapsible4 ? '▲' : '▼'}</span>
        </div>
        <CCollapse visible={showCollapsible4}>
          <CCard className="mt-3">
            <CCardBody className="card-body-margin">
              Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad
              squid. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt
              sapiente ea proident.
            </CCardBody>
          </CCard>
      </CCollapse>

      </div>
      </div>

    </div>
  );
};

export default HelpCenter;