import React, { useState } from 'react';
import './EventForm.css';

const EventForm = ({ isOpen, onClose, onSubmit }) => {
  const [eventData, setEventData] = useState({
    title: '',
    category: '',
    date: '',
    image: '',
    description: '',
    content: '',
    tags: '',
    highlights: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.imageUrl;
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      // Fallback to base64 if upload fails
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    
    try {
      let imageUrl = eventData.image;
      
      // If file is selected, upload it
      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile);
      }
      
      // Create URL-friendly slug from title
      const createSlug = (title) => {
        return title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');
      };
      
      const formattedData = {
        ...eventData,
        id: Date.now(),
        slug: createSlug(eventData.title),
        tags: eventData.tags.split(',').map(tag => tag.trim()),
        highlights: eventData.highlights.split(',').map(highlight => highlight.trim()),
        createdAt: new Date().toISOString(),
        isLatest: true,
        author: "Admin", // You can make this dynamic later
        content: eventData.content,
        image: imageUrl, // Use uploaded image URL
        detailsImage: imageUrl, // Save the main image for the details page
        galleryImages: [
          imageUrl,
          // You can add more images here if needed
        ]
      };
    
    // Get existing events
    const existingEvents = JSON.parse(localStorage.getItem('events') || '[]');
    
    // Update isLatest flag for older posts if we have more than 5 latest posts
    const updatedEvents = existingEvents.map(event => ({
      ...event,
      isLatest: existingEvents.filter(e => e.isLatest).length < 5 ? event.isLatest : false
    }));
    
    // Add new event
    const newEvents = [formattedData, ...updatedEvents];
    localStorage.setItem('events', JSON.stringify(newEvents));
    
    // Update categories count
    const categories = JSON.parse(localStorage.getItem('categories') || '[]');
    const categoryIndex = categories.findIndex(cat => cat.id === eventData.category.toLowerCase());
    
    if (categoryIndex !== -1) {
      categories[categoryIndex].count += 1;
    } else {
      categories.push({
        id: eventData.category.toLowerCase(),
        name: eventData.category,
        count: 1
      });
    }
    
    localStorage.setItem('categories', JSON.stringify(categories));
    
    onSubmit(formattedData);
    onClose();
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Error creating event. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Get categories from localStorage
  const categories = JSON.parse(localStorage.getItem('categories') || '[]');

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="event-form-modal">
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2>Add New Event</h2>
        
        <form onSubmit={handleSubmit} className="event-form">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={eventData.title}
              onChange={(e) => setEventData({...eventData, title: e.target.value})}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select
                value={eventData.category}
                onChange={(e) => setEventData({...eventData, category: e.target.value})}
                required
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                value={eventData.date}
                onChange={(e) => setEventData({...eventData, date: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Image</label>
            <div className="image-upload-section">
              <div className="upload-options">
                <div className="file-upload">
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="image-upload" className="upload-btn">
                    <i className="fas fa-upload"></i> Upload Image
                  </label>
                </div>
                <div className="or-divider">OR</div>
                <div className="url-input">
                  <input
                    type="url"
                    placeholder="Enter image URL"
                    value={eventData.image}
                    onChange={(e) => setEventData({...eventData, image: e.target.value})}
                  />
                </div>
              </div>
              
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                  <button 
                    type="button" 
                    className="remove-image-btn"
                    onClick={() => {
                      setSelectedFile(null);
                      setImagePreview(null);
                    }}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              )}
              
              {eventData.image && !imagePreview && (
                <div className="url-preview">
                  <img src={eventData.image} alt="URL Preview" />
                  <button 
                    type="button" 
                    className="remove-image-btn"
                    onClick={() => setEventData({...eventData, image: ''})}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Short Description</label>
            <input
              type="text"
              value={eventData.description}
              onChange={(e) => setEventData({...eventData, description: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Content</label>
            <textarea
              value={eventData.content}
              onChange={(e) => setEventData({...eventData, content: e.target.value})}
              required
              rows="6"
            />
          </div>

          <div className="form-group">
            <label>Tags (comma-separated)</label>
            <input
              type="text"
              value={eventData.tags}
              onChange={(e) => setEventData({...eventData, tags: e.target.value})}
              placeholder="Education, Children, Charity"
            />
          </div>

          <div className="form-group">
            <label>Highlights (comma-separated)</label>
            <input
              type="text"
              value={eventData.highlights}
              onChange={(e) => setEventData({...eventData, highlights: e.target.value})}
              placeholder="Supporting education, Building schools, Training teachers"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={isUploading}>
              {isUploading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Creating...
                </>
              ) : (
                'Create Event'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm; 