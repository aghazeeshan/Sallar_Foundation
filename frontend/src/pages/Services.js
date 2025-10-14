import React, { useEffect, useState } from 'react';
import Breadcrumb from '../components/Breadcrumb';
import { serviceService } from '../services/serviceService';

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
          {loading && <p>Loading services...</p>}
          {error && !loading && <p style={{ color: 'red' }}>{error}</p>}

          {!loading && !error && (
            <div className="services-grid">
              {services.length === 0 ? (
                <p>No services available right now.</p>
              ) : (
                services.map(service => (
                  <div key={service.id} className="service-card">
                    <h3>{service.title || 'Untitled Service'}</h3>
                    {service.image_url && (
                      <img
                        src={service.image_url}
                        alt={service.title || 'Service'}
                        style={{ width: '100%', height: 'auto', borderRadius: 8 }}
                      />
                    )}
                    {service.description && <p>{service.description}</p>}
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
