import React from 'react';
import Breadcrumb from '../components/Breadcrumb';

import './Health.css';

function Health() {
    return (
        <div className="health-page">
            <Breadcrumb title="Healthy Food" />
            
            <section className="health-info-section">
                <div className="health-image">
                    <div className="brush-stroke"></div>
                    <img src="/images/img10.jpg" alt="Health Services" />
                    
                </div>
                <div className="health-description">
                <span className="section-tag">Healthy Food</span>
                    <h2 className="section-title">Our Commitment to Health</h2>
                    <p>
                        We are dedicated to providing comprehensive health services to our community. 
                        Our programs focus on preventive care, health education, and access to medical resources.
                    </p>
                </div>
            </section>
        </div>
    );
}

export default Health; 