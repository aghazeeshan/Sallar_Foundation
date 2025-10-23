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
        if (data && Array.isArray(data) && data.length > 0) {
          setServices(data);
        } else {
          // Use default services if no data from backend
          setServices(getDefaultServices());
        }
      } catch (err) {
        console.error('Error loading services:', err);
        // Use default services on error
        setServices(getDefaultServices());
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const getDefaultServices = () => {
    return [
      {
        id: 1,
        title: "Children's Education",
        description: "We believe every child deserves the chance to learn and thrive. Our education initiative unlocks potential by creating quality learning environments, providing essential supplies like books and uniforms, and supporting nutritional and emotional well-being to ensure that poverty is not a barrier to a child's dreams and a brighter future.",
        image_url: "/images/edu-img.jpg",
        icon_class: "fa-graduation-cap"
      },
      {
        id: 2,
        title: "Shelter & Housing",
        description: "We restore dignity and security by building safe, durable homes for families without shelter and reconstructing communities devastated by natural disasters. We provide more than just four walls; we provide a stable foundation from which families can rebuild their lives, seek opportunities, and foster growth away from vulnerability and fear.",
        image_url: "/images/home.jpg",
        icon_class: "fa-home"
      },
      {
        id: 3,
        title: "Flood & Disaster Relief",
        description: "Acting as a vital lifeline in times of crisis, our emergency response teams provide immediate relief during floods by distributing clean water, food, and temporary shelter, while our long-term commitment focuses on helping communities recover, rebuild, and regain their self-sufficiency after the disaster has passed.",
        image_url: "/images/sf-img6.jpeg",
        icon_class: "fa-hands-helping"
      },
      {
        id: 4,
        title: "Women's Empowerment",
        description: "We are dedicated to fostering women's empowerment by providing vocational training, resources, and support systems for those unable to work outside the home, enabling them to develop skills, generate sustainable income, and gain financial independence, thereby transforming their own lives and the futures of their families.",
        image_url: "/images/women-img.jpg",
        icon_class: "fa-venus"
      },
      {
        id: 5,
        title: "Medical Aid",
        description: "Understanding that health is a fundamental human right, our medical aid program operates free health camps in underserved communities, offering critical consultations, treatments, and medications to those who need it most, ensuring that lack of funds never stands between an individual and their well-being.",
        image_url: "/images/sf-img9.jpg",
        icon_class: "fa-medkit"
      },
      {
        id: 6,
        title: "Zakat Campaigning",
        description: "We fulfill your religious obligation with transparency and profound impact, ensuring your Zakat reaches the most deserving recipients—including the poor, the needy, and the indebted—directly funding our life-changing work in education, shelter, food, and medical care to uplift entire communities in accordance with Islamic principles.",
        image_url: "/images/zakat-img.jpg",
        icon_class: "fa-mosque"
      }
    ];
  };

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
                services.map(service => {
                  // Construct proper image URL
                  const imageUrl = service.image_url?.startsWith('/uploads/') 
                    ? `http://localhost:5000${service.image_url}` 
                    : service.image_url;
                  
                  return (
                    <div key={service.id} className="service-card">
                      <div className="service-image">
                        <img src={imageUrl} alt={service.title || 'Service'} />
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
                  );
                })
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Services;
