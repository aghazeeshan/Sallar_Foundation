import React, { useEffect, useState } from 'react';
import Breadcrumb from '../components/Breadcrumb';
import { serviceService } from '../services/serviceService';
import './Services.css';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await serviceService.getAllServices();
        setServices(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Failed to load services');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="services-page">
      <Breadcrumb title="Our Services" />

      <section className="services-section">
        <div className="container">
          <div className="services-header">
            <span className="section-tag">Our Services</span>
            <h2 className="section-title">
              We Do It For All People<br />
              Humanist Services
            </h2>
          </div>

          {loading && <p className="loading-text">Loading services...</p>}
          {error && !loading && <p className="error-text">{error}</p>}

          {!loading && !error && (
            <div className="services-grid">
              {services.length === 0 ? (
                <p>No services available right now.</p>
              ) : (
                services.map(service => (
                  <div key={service.id} className="service-card">
                    <div className="service-image">
                      <img src={service.image_url} alt={service.title || 'Service'} />
                      <div className="service-icon">
                        <div className="charity-icon green">
                          <i className={`fas ${service.icon_class || 'fa-hands-helping'}`}></i>
                        </div>
                      </div>
                    </div>
                    <div className="service-content">
                      <h3>{service.title || 'Untitled Service'}</h3>
                      <p>{service.description}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Services;
