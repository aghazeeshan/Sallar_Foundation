import React, { useState } from 'react';
import Breadcrumb from '../components/Breadcrumb';
import './Gallery.css';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
    '/images/img12.jpg',
    '/images/img11.jpg',
    // Add more images here
  ];

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
    <div className="gallery-page">
      <Breadcrumb tag="Our Gallery" title="Photo Gallery" />
      
      <section className="gallery-section">
        <div className="container">
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
        </div>
      </section>

      {/* Image Preview Modal */}
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
    </div>
  );
};

export default Gallery; 