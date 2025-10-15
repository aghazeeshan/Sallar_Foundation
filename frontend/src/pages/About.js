import React from 'react';
import Breadcrumb from '../components/Breadcrumb';
import { Link } from 'react-router-dom';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <Breadcrumb title="About Us" />
      
      {/* Introduction Section */}
      <section className="intro-section">
        <div className="container">
          <div className="intro-content">
            <h2>Welcome to SALLAR FOUNDATION</h2>
            <p className="intro-text">
              At SALLAR FOUNDATION we are driven by a purpose: to create a brighter, more equitable world for those who need it most. 
              Our foundation works tirelessly to provide support and create lasting change for individuals and communities facing challenges.
            </p>
            <div className="cta-buttons">
              <Link to="/volunteer" className="cta-btn">Volunteer</Link>
              <Link to="/donate" className="cta-btn primary">Donate</Link>
              <Link to="/services" className="cta-btn">Services</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="mission-vision-section">
        <div className="container">
          <span className="section-tag">Our Foundation</span>
          <h2 className="section-title">
            The Mission And Vision<br />
            Select Your Support
          </h2>
          
          <div className="mission-vision-grid">
            <div className="mission-vision-image">
              <img src="/images/img1.png" alt="Foundation Work" />
              <div className="brush-stroke"></div>
            </div>

            <div className="mission-vision-cards">
              <div className="mv-card">
                
                <h3 className="plan-title">Our Mission</h3>
                <p className="plan-subtitle">
                Founded in 2013, SALLAR FOUNDATION is a charitable foundation committed to core mission “empowering underserved communities,” “improving access to education and healthcare, providing employment opportunities, building shelter and we arrange marriage for poor needy families and bear all expenses including dowry. Our mission is to create sustainable, transformative change by addressing the root causes.
Our work spans across interior, collaborating with local communities, non-profits, and global partners to bring about meaningful change. We believe in the power of collective action—together, we can achieve more.

                </p>
              </div>

              <div className="mv-card premium">
                
                <h3 className="plan-title">Our Vision</h3>
                <p className="plan-subtitle">
                "We want to create a society where every individual, regardless of their circumstances, has the opportunity to live a life free from poverty, with access to basic needs, dignity, and the chance to thrive to create a society where no one lives in hunger or despair, and all people have the resources, support, and opportunities they need to build a brighter future."
                </p>
                <p className="plan-subtitle">These vision statements emphasize:</p>
                <ul className="vision-list">
                  <li>Empowerment: Providing individuals with the tools and opportunities they need to improve their lives.</li>
                  <li>Dignity: Ensuring that the poor and needy are treated with respect and given the chance to thrive, not just survive.</li>
                  <li>Hope and Change: Inspiring hope by working toward long-term solutions to poverty.</li>
                </ul>
               
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <h2>Our Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <i className="fas fa-heart"></i>
              <h4>Care & Respect</h4>
              <p>We are committed to supporting individuals and communities with care, respect, and understanding.</p>
            </div>
            <div className="value-card">
              <i className="fas fa-handshake"></i>
              <h4>Transparency</h4>
              <p>We uphold transparency and ethical practices in all our endeavors.</p>
            </div>
            <div className="value-card">
              <i className="fas fa-users"></i>
              <h4>Collaboration</h4>
              <p>We work hand-in-hand with local leaders, organizations, and donors to amplify our efforts.</p>
            </div>
            <div className="value-card">
              <i className="fas fa-chart-line"></i>
              <h4>Sustainability</h4>
              <p>We focus on long-term solutions that create lasting positive change.</p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="what-we-do-section">
        <div className="container">
          <h2>What We Do</h2>
          <div className="programs-grid">
            <div className="program-card">
              <div className="program-icon">
                <i className="fas fa-home"></i>
              </div>
              <h4>Providing Shelter</h4>
              <p>Creating safe and stable housing solutions for those in need.</p>
            </div>
            <div className="program-card">
              <div className="program-icon">
                <i className="fas fa-medkit"></i>
              </div>
              <h4>Medical Camp</h4>
              <p>Monthly medical camps in rural areas providing free medication.</p>
            </div>
            <div className="program-card">
              <div className="program-icon">
                <i className="fas fa-briefcase"></i>
              </div>
              <h4>Employment Opportunity</h4>
              <p>Providing rickshaws and creating sustainable income opportunities.</p>
            </div>
            <div className="program-card">
              <div className="program-icon">
                <i className="fas fa-hand-holding-heart"></i>
              </div>
              <h4>Women Empowerment</h4>
              <p>Providing sewing machines for women to work from home.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      
    </div>
  );
};

export default About; 