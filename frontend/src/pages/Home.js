import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './Home.css';

const heroStyle = {
  background: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${process.env.PUBLIC_URL + '/images/bg.jpg'})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
};

const Home = () => {
  const services = [
    {
      id: 1,
      name: "Education Support",
      image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?ixlib=rb-4.0.3",
      description: "Providing quality education to underprivileged children"
    },
    {
      id: 2,
      name: "Healthcare",
      image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?ixlib=rb-4.0.3",
      description: "Medical assistance to those in need"
    },
    {
      id: 3,
      name: "Food Security",
      image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3",
      description: "Fighting hunger in communities"
    },
    {
      id: 4,
      name: "Clean Water",
      image: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?ixlib=rb-4.0.3",
      description: "Providing access to clean water"
    }
  ];

  const progressRef = useRef(null);
  const progressLabelRef = useRef(null);

  useEffect(() => {
    const progressBar = progressRef.current;
    const progressLabel = progressLabelRef.current;
    
    if (progressBar && progressLabel) {
      // Start with 0 width
      progressBar.style.width = '0%';
      
      // Animate to 85% after a small delay
      setTimeout(() => {
        progressBar.style.width = '85%';
        
        // Update the label position as the bar moves
        progressBar.addEventListener('transitionend', () => {
          progressLabel.style.opacity = '1';
        });
      }, 300);
    }
  }, []);

  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === 0 ? galleryImages.length - 1 : prev - 1
    );
    setSelectedImage(galleryImages[currentImageIndex === 0 ? galleryImages.length - 1 : currentImageIndex - 1]);
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === galleryImages.length - 1 ? 0 : prev + 1
    );
    setSelectedImage(galleryImages[currentImageIndex === galleryImages.length - 1 ? 0 : currentImageIndex + 1]);
  };

  const galleryImages = [
    '/images/img1.jpg',
    '/images/img2.jpg',
    '/images/img3.jpg',
    '/images/img4.jpg',
    '/images/img5.jpg',
    '/images/img6.jpg',
    '/images/img7.jpg',
    '/images/img8.jpg',
    '/images/img9.jpg',
    '/images/img10.jpg',
    '/images/img11.jpg',
    '/images/img12.jpg',
  ];

  return (
    <div className="home">
      <div className="hero-banner" style={heroStyle}>
        <div className="hero-content">
          <span className="subtitle">Welcome to Sallar Foundation</span>
          <h1 className="title">Together We Can Make<br />A Difference</h1>
          <p className="description">
            Join us in our mission to create positive change and help those in need. 
            Your support can transform lives and build a better future for communities around the world.
          </p>
          <div className="hero-buttons">
            <Link to="/donate" className="primary-btn">Donate Now</Link>
            <Link to="/volunteer" className="secondary-btn">Become A Volunteer</Link>
          </div>
        </div>
      </div>

      <section className="about-donat">
        <div className="about-donat-container">
          <div className="about-donat-content">
            <div className="about-donat-text">
              <span className="about-donat-tag">About Sallar Foundation</span>
              <h2 className="about-donat-title">
                We Believe That We Can Save More Life's With You
              </h2>
              <p className="about-donat-description">
              As a foundation, we are proud to work with donors, volunteers, and community leaders who share our passion for creating change. Together, we can create a future where everyone has the opportunity to reach there full potential.
              </p>

              <div className="charity-types">
                <div className="charity-item">
                  <div className="charity-icon green">
                    <i className="fas fa-utensils"></i>
                  </div>
                  <span>Charity For Foods</span>
                </div>
                <div className="charity-item">
                  <div className="charity-icon yellow">
                    <i className="fas fa-tint"></i>
                  </div>
                  <span>Charity For Water</span>
                </div>
                <div className="charity-item">
                  <div className="charity-icon orange">
                    <i className="fas fa-graduation-cap"></i>
                  </div>
                  <span>Charity For Education</span>
                </div>
                <div className="charity-item">
                  <div className="charity-icon blue">
                    <i className="fas fa-medkit"></i>
                  </div>
                  <span>Charity For Medical</span>
                </div>
              </div>

              <Link to="/about" className="about-more-btn">
                About More <i className="fas fa-arrow-right"></i>
              </Link>
            </div>
            <div className="about-donat-image">
              <div className="image-frame">
                <img src="/images/img3.jpg" alt="Happy child" />
              </div>
              <div className="brush-stroke"></div>
            </div>
          </div>
        </div>
      </section>

     

      <section className="services-section">
        <div className="container">
          <span className="section-tag">Our Services</span>
          <h2 className="section-title">
            We Do It For All People<br />
            Humanist Services
          </h2>

          <div className="services-grid">
            <div className="service-card">
              <div className="service-image">
                <img src="/images/img10.jpg" alt="Healthy Foods" />
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
                <img src="/images/img6.jpg" alt="Education" />
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
                <img src="/images/img7.jpg" alt="Medical Help" />
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
          </div>
        </div>
      </section>

     
      <section className="donation-cta-section">
        <div className="container">
          <span className="section-tag">Make a Donations</span>
          <div className="donation-cta-content">
            <div className="donation-cta-text">
              <h2 className="section-title">
                Give Time, Change Lives<br />
                Become A Donate Now
              </h2>
              <p className="donation-cta-description">
                Volunteers are the heart of our organization. Join our team to make a hands-on
                difference in your community. Whether you have a few hours or a few days, your
                time and skills can help us achieve our goals.
              </p>

              <div className="donation-card">
                <div className="donation-card-content">
                  <div className="donation-image">
                    <img src="/images/img9.jpg" alt="Children" />
                  </div>
                  <div className="donation-info">
                    <h3>Big charity: build school for poor children</h3>
                    <p>Stay informed about our upcoming events and campaigns.</p>
                    
                    <div className="donation-progress">
                      <div className="progress-bar">
                        <div 
                          ref={progressRef} 
                          className="progress" 
                          style={{ width: '0%' }}
                        >
                          <span 
                            ref={progressLabelRef} 
                            className="progress-label"
                          >
                            85%
                          </span>
                        </div>
                      </div>
                      <div className="progress-stats">
                        <span>$5,00.00 Raised</span>
                        <span className="goal">Goal - $10,00.00</span>
                      </div>
                    </div>

                    <Link 
                      to="/donate" 
                      className="donate-now-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.href = '/donate';
                      }}
                    >
                      Donate Now <i className="fas fa-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="donation-cta-image">
              <img src="/images/img12.jpg" alt="Donation Impact" />
              <div className="play-button">
                <i className="fas fa-play"></i>
              </div>
            </div>
          </div>
        </div>
      </section>
     

      <section className="why-choose-section">
        <div className="why-choose-container">
          <div className="why-choose-content">
            <div className="why-choose-text">
              <span className="why-choose-tag">
                 Why Choose Us
              </span>
              <h2 className="why-choose-title">
                Together, We Can Make A<br />Difference
              </h2>
              <p className="why-choose-description">
                Our secure online donation platform allows you to make contribution quickly and safely. 
                Choose from various payment methods and set up one-time or recurring donations with ease. 
                Your support helps us continue our mission.
              </p>

              <div className="progress-bars">
                <div className="progress-item">
                  <div className="progress-label">
                    <span>Donations</span>
                    <span>55%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill green" style={{ width: '55%' }}></div>
                  </div>
                </div>
                
                <div className="progress-item">
                  <div className="progress-label">
                    <span>Charity</span>
                    <span>85%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill orange" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </div>

              <div className="features-grid">
                <div className="feature-item">
                  <div className="feature-icon green">
                    <i className="fas fa-globe"></i>
                  </div>
                  <div className="feature-content">
                    <h3>Global Community</h3>
                    <p>Volunteers are the heart of our organization. Join our team to make a hands.</p>
                  </div>
                </div>

                <div className="feature-item">
                  <div className="feature-icon orange">
                    <i className="fas fa-users"></i>
                  </div>
                  <div className="feature-content">
                    <h3>Crowdfunding</h3>
                    <p>Join our monthly giving program to provide consistent support</p>
                  </div>
                </div>
              </div>

              
            </div>
            <div className="why-choose-image">
              <img src="/images/img6.jpg" alt="Children smiling" />
              <div className="image-overlay"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="blog-section">
        <div className="container">
          <span className="section-tag">Event & Program</span>
          <h2 className="section-title">
            Our Upcoming Events
          </h2>
          <Link to="/events" className="contact-btn">View More <i className="fas fa-arrow-right"></i></Link>

          <div className="blog-grid">
            <div className="blog-card">
              <div className="blog-image">
                <img src="/images/img10.jpg" alt="Blog 1" />
                <div className="blog-overlay">
                  <h3>Empowering Communities Through Shelter and Support</h3>
                  {/* <p>Supporting education initiatives for underprivileged children worldwide.</p> */}
                  <Link to="/blog/17370088595141" className="read-more">
                    Read More <i className="fas fa-arrow-right"></i>
                  </Link>
                </div>
              </div>
            </div>

            <div className="blog-card">
              <div className="blog-image">
                <img src="/images/img1.jpg" alt="Blog 2" />
                <div className="blog-overlay">
                  <h3>Health for All: Our Monthly Medical Camps</h3>
                  {/* <p>Providing meals and nutrition support to communities in need.</p> */}
                  <Link to="/blog/2" className="read-more">
                    Read More <i className="fas fa-arrow-right"></i>
                  </Link>
                </div>
              </div>
            </div>

            <div className="blog-card">
              <div className="blog-image">
                <img src="/images/img6.jpg" alt="Blog 3" />
                <div className="blog-overlay">
                  <h3>Creating Opportunities, One Rickshaw at a Time</h3>
                  {/* <p>Delivering essential medical services to remote areas.</p> */}
                  <Link to="/blog/3" className="read-more">
                    Read More <i className="fas fa-arrow-right"></i>
                  </Link>
                </div>
              </div>
            </div>

            <div className="blog-card">
              <div className="blog-image">
                <img src="/images/img9.jpg" alt="Blog 4" />
                <div className="blog-overlay">
                  <h3>Empowering Women with Sewing Machines</h3>
                  {/* <p>Building stronger communities through local initiatives.</p> */}
                  <Link to="/blog/4" className="read-more">
                    Read More <i className="fas fa-arrow-right"></i>
                  </Link>
                </div>
              </div>
            </div>

            <div className="blog-card">
              <div className="blog-image">
                <img src="/images/img4.jpg" alt="Blog 5" />
                <div className="blog-overlay">
                  <h3>Street Vending: Small Carts, Big Impact</h3>
                  {/* <p>Supporting women through education and skill development.</p> */}
                  <Link to="/blog/5" className="read-more">
                    Read More <i className="fas fa-arrow-right"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="gallery-section">
        <div className="container">
          <div className="gallery-header">
            <span className="section-tag">Our Gallery</span>
            <h2 className="section-title">
              Making A Difference In<br />People's Lives
            </h2>
          </div>
          
          <div className="gallery-grid">
            {galleryImages.map((image, index) => (
              <div 
                key={index} 
                className="gallery-item"
                onClick={() => {
                  setSelectedImage(image);
                  setCurrentImageIndex(index);
                }}
              >
                <img src={image} alt={`Gallery ${index + 1}`} />
                <div className="gallery-hover">
                  <i className="fas fa-eye"></i>
                </div>
              </div>
            ))}
          </div>

          <div className="gallery-footer">
            <Link to="/gallery" className="view-more-btn">
              View Gallery <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        </div>

        {selectedImage && (
          <div className="image-preview-modal" onClick={() => setSelectedImage(null)}>
            <button className="nav-btn prev" onClick={handlePrevImage}>
              <i className="fas fa-chevron-left"></i>
            </button>
            <img src={selectedImage} alt="Preview" />
            <button className="nav-btn next" onClick={handleNextImage}>
              <i className="fas fa-chevron-right"></i>
            </button>
            <span className="close-modal">&times;</span>
          </div>
        )}
      </section>

    </div>
  );
};

export default Home; 