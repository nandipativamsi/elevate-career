import React, { useState } from 'react';
import '../css/AddNew.css';
import AddEvent from './AddEvent';
import AddJob from './AddJob';
import AddResource from './AddResource';

const FormPage = () => {
    const [activeForm, setActiveForm] = useState('event');

    const handleFormChange = (e) => {
        setActiveForm(e.target.value);
    };

    return (
        <div className="form-page">
            <div className="form-dropdown">
                <h3>Select Item To Add: </h3>
                <select value={activeForm} onChange={handleFormChange}>
                    <option value="event">Event</option>
                    <option value="job">Job</option>
                    <option value="resource">Resource</option>
                </select>
            </div>
            <div className="form-container">
                {activeForm === 'event' && <AddEvent />}
                {activeForm === 'job' && <AddJob />}
                {activeForm === 'resource' && <AddResource />}
            </div>
        </div>
    );
};

export default FormPage;
