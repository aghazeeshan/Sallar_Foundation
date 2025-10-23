import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { bannerService } from '../services/bannerService';
import { serviceService } from '../services/serviceService';
import DonorPopup from '../components/DonorPopup';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './Home.css';

const getHeroStyle = (activeBanner) => {
  const defaultBg = `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${process.env.PUBLIC_URL + '/images/bg.jpg'})`;
  
  let bannerBg = defaultBg;
  if (activeBanner?.image_url) {
    // Check if it's a full URL or a relative path
    if (activeBanner.image_url.startsWith('http')) {
      bannerBg = `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${activeBanner.image_url})`;
    } else if (activeBanner.image_url.startsWith('/uploads/')) {
      // Backend uploaded image
      bannerBg = `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(http://localhost:5000${activeBanner.image_url})`;
    } else {
      // Local image from public folder
      bannerBg = `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${process.env.PUBLIC_URL}${activeBanner.image_url})`;
    }
  }
  
  console.log('Banner data:', activeBanner);
  console.log('Banner image URL:', activeBanner?.image_url);
  console.log('Full background:', bannerBg);
  
  return {
    backgroundImage: bannerBg,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };
};

const Home = () => {
  const [banners, setBanners] = useState([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [services, setServices] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    // Get all active banners from API
    const loadBanners = async () => {
      try {
        const bannersData = await bannerService.getAllBanners();
        // If we get data from backend, use it, otherwise use defaults
        if (bannersData && bannersData.length > 0) {
        setBanners(bannersData);
        } else {
          setBanners(getDefaultBanners());
        }
      } catch (error) {
        console.error('Error loading banners:', error);
        // Fallback to hardcoded banners when backend is not available
        setBanners(getDefaultBanners());
      }
    };
    loadBanners();
  }, []);

  const getDefaultBanners = () => {
    return [
      {
        id: 1,
        title: "Building Hope, One Life at a Time",
        sub_heading: "Join Our Mission ",
        description: "Together, we break the cycles of poverty and despair by educating children, building safe homes for the vulnerable, providing critical aid during floods, empowering women to achieve economic independence, and delivering essential medical care through free camps.",
        image_url: "/images/fund.jpg",
        button_text: "Donate Us",
        link_url: "/donate",
        text_alignment: "left"
      },
      {
        id: 2,
        title: "Shelter & Housing",
        sub_heading: "Be Part of the Change",
        description: "We restore dignity and security by building safe, durable homes for families without shelter and reconstructing communities devastated by natural disasters. We provide more than just four walls; we provide a stable foundation from which families can rebuild their lives, seek opportunities, and foster growth away from vulnerability and fear.",
        image_url: "/images/home.jpg",
        button_text: "Donate For Home",
        link_url: "/donate",
        text_alignment: "left"
      },
      {
        id: 3,
        title: "Flood & Disaster Relief",
        sub_heading: "Provide Emergency Aid",
        description: "Acting as a vital lifeline in times of crisis, our emergency response teams provide immediate relief during floods by distributing clean water, food, and temporary shelter, while our long-term commitment focuses on helping communities recover, rebuild, and regain their self-sufficiency after the disaster has passed.",
        image_url: "/images/sf-img6.jpeg",
        button_text: "Donate For Flood",
        link_url: "/donate",
        text_alignment: "left"
      },
      {
        id: 4,
        title: "Women's Empowerment",
        sub_heading: "Empower a Woman Today",
        description: "We are dedicated to fostering women's empowerment by providing vocational training, resources, and support systems for those unable to work outside the home, enabling them to develop skills, generate sustainable income, and gain financial independence, thereby transforming their own lives and the futures of their families.",
        image_url: "/images/women-img.jpg",
        button_text: "Donate For Women's Empowerment",
        link_url: "/donate",
        text_alignment: "left"
      },
      {
        id: 5,
        title: "Medical Aid",
        sub_heading: "Support a Medical Camp",
        description: "Understanding that health is a fundamental human right, our medical aid program operates free health camps in underserved communities, offering critical consultations, treatments, and medications to those who need it most, ensuring that lack of funds never stands between an individual and their well-being.",
        image_url: "/images/sf-img9.jpg",
        button_text: "Donate For Medical Aid",
        link_url: "/donate",
        text_alignment: "left"
      },
      {
        id: 6,
          title: "Zakat Campaigning",
        sub_heading: "Calculate & Donate Your Zakat",
        description: "We fulfill your religious obligation with transparency and profound impact, ensuring your Zakat reaches the most deserving recipients—including the poor, the needy, and the indebted—directly funding our life-changing work in education, shelter, food, and medical care to uplift entire communities in accordance with Islamic principles.",
        image_url: "/images/zakat-img.jpg",
        button_text: "Donate For Zakat Campaigning",
        link_url: "/donate",
        text_alignment: "left"
      },

      {
        id: 7,
          title: "Children's Education",
        sub_heading: "Sponsor a Child's Education",
        description: "We believe every child deserves the chance to learn and thrive. Our education initiative unlocks potential by creating quality learning environments, providing essential supplies like books and uniforms, and supporting nutritional and emotional well-being to ensure that poverty is not a barrier to a child's dreams and a brighter future.",
        image_url: "/images/edu-img.jpg",
        button_text: "Donate For Education",
        link_url: "/donate",
        text_alignment: "left"
      }
    ];
  };

  useEffect(() => {
    // Get all active services from API
    const loadServices = async () => {
      try {
        const servicesData = await serviceService.getAllServices();
        // If we get data from backend, use it, otherwise use defaults
        if (servicesData && servicesData.length > 0) {
        setServices(servicesData);
        } else {
          setServices(getDefaultServices());
        }
      } catch (error) {
        console.error('Error loading services:', error);
        // Fallback to hardcoded services when backend is not available
        setServices(getDefaultServices());
      }
    };
    loadServices();
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

  useEffect(() => {
    // Get gallery images from API (limit to 12 for home page)
    const loadGalleryImages = async () => {
      try {
        const response = await fetch('/api/gallery?limit=12');
        const data = await response.json();
        if (data.success && data.data && data.data.length > 0) {
          setGalleryImages(data.data);
        } else {
          // Fallback to default images
          setGalleryImages(getDefaultGalleryImages());
        }
      } catch (error) {
        console.error('Error loading gallery images:', error);
        // Fallback to default images
        setGalleryImages(getDefaultGalleryImages());
      }
    };
    loadGalleryImages();
  }, []);

  useEffect(() => {
    // Get blogs from API or use defaults
    const loadBlogs = async () => {
      try {
        // Try to fetch from API first
        const response = await fetch('/api/events?limit=6');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data && data.data.length > 0) {
            setBlogs(data.data);
            return;
          }
        }
      } catch (error) {
        console.error('Error loading blogs from API:', error);
      }
      
      // Fallback to localStorage
      try {
        const savedBlogs = localStorage.getItem('events');
        const allBlogs = savedBlogs ? JSON.parse(savedBlogs) : [];
        if (allBlogs && allBlogs.length > 0) {
          const latestBlogs = allBlogs.slice(0, 6);
          setBlogs(latestBlogs);
        } else {
          setBlogs(getDefaultBlogs());
        }
      } catch (error) {
        console.error('Error loading blogs from localStorage:', error);
        setBlogs(getDefaultBlogs());
      }
    };
    loadBlogs();
  }, []);

  const getDefaultBlogs = () => {
    return [
      {
        id: '1',
        title: "Sponsor a Child's Education Today",
        description: 'We believe every child deserves the chance to learn and thrive. Our education initiative creates quality learning environments and provides essential supplies.',
        image: '/images/edu-img.jpg',
        date: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Fund a Home for a Family in Need',
        description: 'We restore dignity and security by building safe, durable homes for families without shelter and reconstructing communities devastated by disasters.',
        image: '/images/home.jpg',
        date: new Date().toISOString()
      },
      {
        id: '3',
        title: 'Provide Emergency Aid During Crisis',
        description: 'Our emergency response teams provide immediate relief during floods by distributing clean water, food, and temporary shelter to affected communities.',
        image: '/images/sf-img6.jpeg',
        date: new Date().toISOString()
      },
      {
        id: '4',
        title: 'Empower a Woman Today',
        description: 'We foster women\'s empowerment by providing vocational training, resources, and support systems to help them achieve financial independence.',
        image: '/images/women-img.jpg',
        date: new Date().toISOString()
      },
      {
        id: '5',
        title: 'Support a Medical Camp',
        description: 'Our medical aid program operates free health camps in underserved communities, offering critical consultations, treatments, and medications.',
        image: '/images/sf-img9.jpg',
        date: new Date().toISOString()
      },
      {
        id: '6',
        title: 'Calculate & Donate Your Zakat',
        description: 'We fulfill your religious obligation with transparency, ensuring your Zakat reaches the most deserving recipients in accordance with Islamic principles.',
        image: '/images/zakat-img.jpg',
        date: new Date().toISOString()
      }
    ];
  };

  const getDefaultGalleryImages = () => {
    return [
      { id: 1, image_url: '/images/sf-img1.jpg', title: 'Community Support' },
      { id: 2, image_url: '/images/sf-img2.jpg', title: 'Education Program' },
      { id: 3, image_url: '/images/sf-img3.jpg', title: 'Medical Camp' },
      { id: 4, image_url: '/images/sf-img4.webp', title: 'Food Distribution' },
      { id: 5, image_url: '/images/sf-img5.jpeg', title: 'Clean Water Initiative' },
      { id: 6, image_url: '/images/sf-img6.jpeg', title: 'Vocational Training' },
      { id: 7, image_url: '/images/sf-img7.jpg', title: 'Women Empowerment' },
      { id: 8, image_url: '/images/sf-img8.webp', title: 'Child Welfare' },
      { id: 9, image_url: '/images/sf-img9.jpg', title: 'Community Building' },
      { id: 10, image_url: '/images/sf-img10.jpg', title: 'Healthcare Services' },
      { id: 11, image_url: '/images/sf-img11.jpg', title: 'Emergency Relief' },
      { id: 12, image_url: '/images/sf-img12.jpg', title: 'Shelter Program' },
    ];
  };

  // Auto-rotate banners every 5 seconds
  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBannerIndex((prevIndex) => 
          (prevIndex + 1) % banners.length
        );
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [banners.length]);

  const currentBanner = banners[currentBannerIndex];


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


  return (
    <div className="home">
      <div className="hero-banner" style={getHeroStyle(currentBanner)}>
        <div className="hero-content" style={{ textAlign: currentBanner?.text_alignment || 'left' }}>
          {currentBanner?.sub_heading && <span className="subtitle">{currentBanner.sub_heading}</span>}
          {currentBanner?.title && <h1 className="title">{currentBanner.title}</h1>}
          {currentBanner?.description && <p className="description">{currentBanner.description}</p>}
          <div className="hero-buttons">
            {currentBanner?.button_text && currentBanner?.link_url ? (
              <Link to={currentBanner.link_url} className="primary-btn">{currentBanner.button_text}</Link>
            ) : (
              <>
                <Link to="/donate" className="primary-btn">Donate Now</Link>
                <Link to="/volunteer" className="secondary-btn">Become A Volunteer</Link>
              </>
            )}
          </div>
        </div>
        
        {/* Banner Navigation Dots */}
        {banners.length > 1 && (
          <div className="banner-dots">
            {banners.map((_, index) => (
              <button
                key={index}
                className={`banner-dot ${index === currentBannerIndex ? 'active' : ''}`}
                onClick={() => setCurrentBannerIndex(index)}
              />
            ))}
          </div>
        )}
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
                <img src="/images/img1.png" alt="Happy child" />
              </div>
              <div className="brush-stroke"></div>
            </div>
          </div>
        </div>
      </section>

     

      <section className="services-section">
        <div className="container">
          <div className="services-header-wrapper">
            <div className="services-header-content">
              <span className="section-tag">Our Services</span>
              <h2 className="section-title">
                We Do It For All People<br />
                Humanist Services
              </h2>
            </div>
            {services.length > 0 && (
              <div className="services-nav-arrows">
                <button className="services-prev">
                  <i className="fas fa-arrow-left"></i>
                </button>
                <button className="services-next">
                  <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            )}
          </div>

          <div className="services-slider-container">
            {services.length > 0 ? (
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={30}
                slidesPerView={3}
                navigation={{
                  nextEl: '.services-next',
                  prevEl: '.services-prev',
                }}
                pagination={{
                  clickable: true,
                  el: '.services-pagination',
                }}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                }}
                breakpoints={{
                  320: {
                    slidesPerView: 1,
                    spaceBetween: 20,
                  },
                  768: {
                    slidesPerView: 2,
                    spaceBetween: 25,
                  },
                  1024: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                  },
                }}
                className="services-swiper"
              >
                {services.map((service, index) => {
                  // Construct proper image URL
                  let imageUrl = service.image_url;
                  if (service.image_url?.startsWith('/uploads/')) {
                    imageUrl = `http://localhost:5000${service.image_url}`;
                  } else if (service.image_url && !service.image_url.startsWith('http')) {
                    imageUrl = `${process.env.PUBLIC_URL}${service.image_url}`;
                  }
                  
                  return (
                    <SwiperSlide key={service.id}>
                      <div className="service-card">
                        <div className="service-image">
                          <img src={imageUrl} alt={service.title} />
                          <div className="service-icon">
                            <div className="charity-icon green">
                              <i className={`fas ${service.icon_class || 'fa-cog'}`}></i>
                            </div>
                          </div>
                        </div>
                        <div className="service-content">
                          <h3>{service.title}</h3>
                          <p>{service.description}</p>
                        </div>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            ) : (
              // Fallback static content if no services loaded
              <div className="services-grid">
                <div className="service-card">
                  <div className="service-image">
                    <img src="/images/img8.jpg" alt="Children's Education" />
                    <div className="service-icon">
                    <div className="charity-icon green">
                        <i className="fas fa-graduation-cap"></i>
                      </div>
                    </div>
                  </div>
                  <div className="service-content">
                    <h3>Children's Education</h3>
                    <p>We believe every child deserves the chance to learn and thrive. Our education initiative unlocks potential by creating quality learning environments.</p>
                  </div>
                </div>

                <div className="service-card">
                  <div className="service-image">
                    <img src="/images/img10.jpg" alt="Shelter & Housing" />
                    <div className="service-icon">
                    <div className="charity-icon green">
                        <i className="fas fa-home"></i>
                      </div>
                    </div>
                  </div>
                  <div className="service-content">
                    <h3>Shelter & Housing</h3>
                    <p>We restore dignity and security by building safe, durable homes for families without shelter and reconstructing communities devastated by natural disasters.</p>
                  </div>
                </div>

                <div className="service-card">
                  <div className="service-image">
                    <img src="/images/img3.jpg" alt="Flood & Disaster Relief" />
                    <div className="service-icon">
                    <div className="charity-icon green">
                        <i className="fas fa-hands-helping"></i>
                      </div>
                    </div>
                  </div>
                  <div className="service-content">
                    <h3>Flood & Disaster Relief</h3>
                    <p>Acting as a vital lifeline in times of crisis, our emergency response teams provide immediate relief during floods by distributing clean water, food, and temporary shelter.</p>
                  </div>
                </div>
              </div>
            )}
            
            {services.length > 0 && (
              <div className="services-pagination"></div>
            )}
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
                    <img src="/images/sallar_img1.jpg" alt="Children" />
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
              <img src="/images/sallar_img2.jpg" alt="Donation Impact" />
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
              <img src="/images/sallar_img3.jpg" alt="Children smiling" />
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
            {blogs.length > 0 ? (
              blogs.map((blog, index) => (
                <div key={blog.id || index} className="blog-card">
                  <div className="blog-image">
                    <img 
                      src={blog.image || `/images/img${(index % 9) + 1}.jpg`} 
                      alt={blog.title || `Blog ${index + 1}`} 
                    />
                    <div className="blog-overlay">
                      <h3>{blog.title || `Blog ${index + 1}`}</h3>
                      <Link to={`/blog/${blog.id || index + 1}`} className="read-more">
                        Read More <i className="fas fa-arrow-right"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Fallback to default blogs if no blogs are available
              <>
            <div className="blog-card">
              <div className="blog-image">
                    <img src="/images/Pakistani_Education.jpg" alt="Sponsor a Child's Education" />
                <div className="blog-overlay">
                      <h3>Sponsor a Child's Education Today</h3>
                      <Link to="/blog/1" className="read-more">
                    Read More <i className="fas fa-arrow-right"></i>
                  </Link>
                </div>
              </div>
            </div>

            <div className="blog-card">
              <div className="blog-image">
                    <img src="/images/home-banner-bg.jpg" alt="Fund a Home" />
                <div className="blog-overlay">
                      <h3>Fund a Home for a Family in Need</h3>
                  <Link to="/blog/2" className="read-more">
                    Read More <i className="fas fa-arrow-right"></i>
                  </Link>
                </div>
              </div>
            </div>

            <div className="blog-card">
              <div className="blog-image">
                    <img src="/images/sallar_img3.jpg" alt="Emergency Aid" />
                <div className="blog-overlay">
                      <h3>Provide Emergency Aid During Crisis</h3>
                  <Link to="/blog/3" className="read-more">
                    Read More <i className="fas fa-arrow-right"></i>
                  </Link>
                </div>
              </div>
            </div>

            <div className="blog-card">
              <div className="blog-image">
                    <img src="/images/997107-women-1448317966.jpg" alt="Empower Women" />
                <div className="blog-overlay">
                      <h3>Empower a Woman Today</h3>
                  <Link to="/blog/4" className="read-more">
                    Read More <i className="fas fa-arrow-right"></i>
                  </Link>
                </div>
              </div>
            </div>

            <div className="blog-card">
              <div className="blog-image">
                    <img src="/images/sallar_img5.jpg" alt="Medical Camp" />
                <div className="blog-overlay">
                      <h3>Support a Medical Camp</h3>
                  <Link to="/blog/5" className="read-more">
                    Read More <i className="fas fa-arrow-right"></i>
                  </Link>
                </div>
              </div>
            </div>

                <div className="blog-card">
                  <div className="blog-image">
                    <img src="/images/sallar_img6.webp" alt="Zakat Campaign" />
                    <div className="blog-overlay">
                      <h3>Calculate & Donate Your Zakat</h3>
                      <Link to="/blog/6" className="read-more">
                        Read More <i className="fas fa-arrow-right"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="gallery-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Our Gallery</span>
            <h2 className="section-title">
              Making A Difference In<br />People's Lives
            </h2>
          </div>
          
          <div className="gallery-grid">
            {galleryImages.map((image, index) => {
              // Determine image URL based on source
              let imageUrl = image.image_url;
              if (imageUrl) {
                if (imageUrl.startsWith('http')) {
                  // Full URL, use as is
                  imageUrl = imageUrl;
                } else if (imageUrl.startsWith('/uploads/')) {
                  // Backend uploaded image
                  imageUrl = `/api${imageUrl}`;
                } else if (imageUrl.startsWith('/images/')) {
                  // Local public image
                  imageUrl = imageUrl;
                } else {
                  // Assume local public image
                  imageUrl = imageUrl;
                }
              }
              
              return (
              <div 
                key={image.id || index} 
                className="gallery-item"
                onClick={() => {
                  setSelectedImage(image);
                  setCurrentImageIndex(index);
                }}
              >
                <img 
                    src={imageUrl} 
                  alt={image.title || `Gallery ${index + 1}`} 
                />
                <div className="gallery-hover">
                  <i className="fas fa-eye"></i>
                </div>
              </div>
              );
            })}
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
            <img 
              src={(() => {
                if (typeof selectedImage === 'string') return selectedImage;
                let imgUrl = selectedImage.image_url;
                if (!imgUrl) return '';
                if (imgUrl.startsWith('http')) return imgUrl;
                if (imgUrl.startsWith('/uploads/')) return `/api${imgUrl}`;
                return imgUrl;
              })()} 
              alt={selectedImage.title || "Preview"} 
            />
            <button className="nav-btn next" onClick={handleNextImage}>
              <i className="fas fa-chevron-right"></i>
            </button>
            <span className="close-modal">&times;</span>
          </div>
        )}
      </section>

      <DonorPopup />
    </div>
  );
};

export default Home; 