import React from 'react';
import Breadcrumb from '../components/Breadcrumb';
import { Link } from 'react-router-dom';
import './Services.css';

function Services() {
  return (
    <div className="services-page">
      <Breadcrumb title="Our Services" />
            <div className="services-grid">
              
        
            <div className="service-card">
              <div className="service-image">
                <img src="/images/img1.jpg" alt="Healthy Foods" />
                <div className="service-icon">
                <div className="charity-icon green">
                    <i className="fas fa-utensils"></i>
                  </div>
                </div>
              </div>
              <div className="service-content">
                <h3>Medical Camp</h3>
                <p>Every month we organize a medical camp in rural areas in order to meet people and provide them free medication. </p>
                {/* <button className="learn-more-btn">
                  <Link to="/health" style={{ color: 'white', textDecoration: 'none' }}>
                    Learn More <i className="fas fa-arrow-right"></i>
                  </Link>
                </button> */}
              </div>
            </div>

            <div className="service-card">
              <div className="service-image">
                <img src="/images/img3.jpg" alt="Education" />
                <div className="service-icon">
                <div className="charity-icon green">
                    <i className="fas fa-graduation-cap"></i>
                  </div>
                </div>
              </div>
              <div className="service-content">
                <h3>Employment Opportunity</h3>
                <p>We provide the employment like Buying a Rickshaw for monthly income We buy an auto rickshaw and lease it to drivers or use it for a transport business.</p>
                {/* <button className="learn-more-btn">
                  Learn More <i className="fas fa-arrow-right"></i>
                </button> */}
              </div>
            </div>

            <div className="service-card">
              <div className="service-image">
                <img src="/images/img2.jpg" alt="Medical Help" />
                <div className="service-icon">
                <div className="charity-icon green">
                    <i className="fas fa-medkit"></i>
                  </div>
                </div>
              </div>
              <div className="service-content">
                <h3>Sewing Machines</h3>
                <p>Providing sewing machines to women who can work from home on stitching, tailoring, embroidery, or making garments.</p>
                {/* <button className="learn-more-btn">
                  Learn More <i className="fas fa-arrow-right"></i>
                </button> */}
              </div>
            </div>

            <div className="service-card">
              <div className="service-image">
                <img src="/images/img9.jpg" alt="Medical Help" />
                <div className="service-icon">
                <div className="charity-icon green">
                    <i className="fas fa-medkit"></i>
                  </div>
                </div>
              </div>
              <div className="service-content">
                <h3>Buying a Cart</h3>
                <p>We Purchase carts or small mobile shops for selling goods such  as vegetables, fruits, snacks, tea, or even small household items. </p>
                {/* <button className="learn-more-btn">
                  Learn More <i className="fas fa-arrow-right"></i>
                </button> */}
              </div>
            </div>

            <div className="service-card">
              <div className="service-image">
                <img src="/images/img6.jpg" alt="Medical Help" />
                <div className="service-icon">
                <div className="charity-icon green">
                    <i className="fas fa-medkit"></i>
                  </div>
                </div>
              </div>
              <div className="service-content">
                <h3>Providing Ration Bags</h3>
                <p>We send the ration bags, including basic groceries (flour, rice, oil, pulses, sugar, etc.), or other essential items to low-income families, especially in rural or underserved urban areas. </p>
                {/* <button className="learn-more-btn">
                  Learn More <i className="fas fa-arrow-right"></i>
                </button> */}
              </div>
            </div>

            <div className="service-card">
              <div className="service-image">
                <img src="/images/img7.jpg" alt="Medical Help" />
                <div className="service-icon">
                <div className="charity-icon green">
                    <i className="fas fa-medkit"></i>
                  </div>
                </div>
              </div>
              <div className="service-content">
                <h3>Providing Shelter</h3>
                <p>We provide safe and secure housing to those in need, fostering stability and hope. Whether building new homes or offering temporary shelter, our mission is to end homelessness and create a brighter future for everyone.</p>
                {/* <button className="learn-more-btn">
                  Learn More <i className="fas fa-arrow-right"></i>
                </button> */}
              </div>
            </div>
          </div>
    </div>
       
  );
}

export default Services; 