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

  const handleSubmit = (e) => {
    e.preventDefault();
    
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
      detailsImage: eventData.image, // Save the main image for the details page
      galleryImages: [
        eventData.image,
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
            <label>Image URL</label>
            <input
              type="url"
              value={eventData.image}
              onChange={(e) => setEventData({...eventData, image: e.target.value})}
              required
            />
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
            <button type="submit" className="submit-btn">
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm; 