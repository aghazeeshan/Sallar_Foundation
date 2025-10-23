import React, { useState, useEffect } from 'react';
import Breadcrumb from '../components/Breadcrumb';
import './Gallery.css';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGalleryImages();
  }, []);

  const loadGalleryImages = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/gallery');
      const data = await response.json();
      if (data.success && data.data) {
        // Map to include full URL
        const images = data.data.map(img => ({
          ...img,
          fullUrl: `http://localhost:5000${img.image_url}`
        }));
        setGalleryImages(images);
      } else {
        // Fallback to default images if API fails
        setGalleryImages(getDefaultImages());
      }
    } catch (error) {
      console.error('Error loading gallery images:', error);
      // Fallback to default images
      setGalleryImages(getDefaultImages());
    }
    setLoading(false);
  };

  const getDefaultImages = () => {
    return [
      { id: 1, fullUrl: '/images/sf-img1.jpg', title: 'Gallery 1', category: 'general' },
      { id: 2, fullUrl: '/images/sf-img2.jpg', title: 'Gallery 2', category: 'general' },
      { id: 3, fullUrl: '/images/sf-img3.jpg', title: 'Gallery 3', category: 'general' },
      { id: 4, fullUrl: '/images/sf-img4.jpg', title: 'Gallery 4', category: 'general' },
      { id: 5, fullUrl: '/images/sf-img5.jpg', title: 'Gallery 5', category: 'general' },
      { id: 6, fullUrl: '/images/sf-img6.jpg', title: 'Gallery 6', category: 'general' },
      { id: 7, fullUrl: '/images/sf-img7.jpg', title: 'Gallery 7', category: 'general' },
      { id: 8, fullUrl: '/images/sf-img8.jpg', title: 'Gallery 8', category: 'general' },
      { id: 9, fullUrl: '/images/sf-img9.jpg', title: 'Gallery 9', category: 'general' },
      { id: 10, fullUrl: '/images/sf-img10.jpg', title: 'Gallery 10', category: 'general' },
      { id: 11, fullUrl: '/images/sf-img11.jpg', title: 'Gallery 11', category: 'general' },
      { id: 12, fullUrl: '/images/sf-img12.jpg', title: 'Gallery 12', category: 'general' },
    ];
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    const newIndex = currentImageIndex === 0 ? galleryImages.length - 1 : currentImageIndex - 1;
    setCurrentImageIndex(newIndex);
    setSelectedImage(galleryImages[newIndex]);
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    const newIndex = currentImageIndex === galleryImages.length - 1 ? 0 : currentImageIndex + 1;
    setCurrentImageIndex(newIndex);
    setSelectedImage(galleryImages[newIndex]);
  };

  return (
    <div className="gallery-page">
      <Breadcrumb tag="Our Gallery" title="Photo Gallery" />
      
      <section className="gallery-section">
        <div className="container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <p>Loading gallery...</p>
            </div>
          ) : (
            <div className="gallery-grid">
              {galleryImages.map((image, index) => (
                <div 
                  key={image.id || index} 
                  className="gallery-item"
                  onClick={() => {
                    setSelectedImage(image);
                    setCurrentImageIndex(index);
                  }}
                >
                  <img src={image.fullUrl} alt={image.title || `Gallery ${index + 1}`} />
                  <div className="gallery-hover">
                    <i className="fas fa-eye"></i>
                    {image.title && <p>{image.title}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div className="image-preview-modal" onClick={() => setSelectedImage(null)}>
          <button className="nav-btn prev" onClick={handlePrevImage}>
            <i className="fas fa-chevron-left"></i>
          </button>
          <img src={selectedImage.fullUrl} alt={selectedImage.title || "Preview"} />
          <button className="nav-btn next" onClick={handleNextImage}>
            <i className="fas fa-chevron-right"></i>
          </button>
          <span className="close-modal">&times;</span>
          {selectedImage.title && (
            <div className="image-info">
              <h3>{selectedImage.title}</h3>
              {selectedImage.description && <p>{selectedImage.description}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Gallery; 