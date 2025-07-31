import React, { useState } from 'react';
import './PostForm.css';

const PostForm = ({ isOpen, onClose, onSubmit }) => {
  const [postData, setPostData] = useState({
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
      ...postData,
      id: Date.now(),
      slug: createSlug(postData.title),
      tags: postData.tags.split(',').map(tag => tag.trim()),
      highlights: postData.highlights.split(',').map(highlight => highlight.trim()),
      createdAt: new Date().toISOString(),
      isLatest: true,
      author: "Admin",
      status: 'published'
    };
    
    onSubmit(formattedData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="post-form-modal">
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2>Create New Post</h2>

        
        
        <form onSubmit={handleSubmit} className="post-form">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={postData.title}
              onChange={(e) => setPostData({...postData, title: e.target.value})}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select
                value={postData.category}
                onChange={(e) => setPostData({...postData, category: e.target.value})}
                required
              >
                <option value="">Select Category</option>
                <option value="Education">Education</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Environment">Environment</option>
                <option value="Charity">Charity</option>
              </select>
            </div>

            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                value={postData.date}
                onChange={(e) => setPostData({...postData, date: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Featured Image URL</label>
            <input
              type="url"
              value={postData.image}
              onChange={(e) => setPostData({...postData, image: e.target.value})}
              required
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="form-group">
            <label>Short Description</label>
            <textarea
              value={postData.description}
              onChange={(e) => setPostData({...postData, description: e.target.value})}
              required
              rows="2"
              placeholder="Brief description of the post..."
            />
          </div>

          <div className="form-group">
            <label>Content</label>
            <textarea
              value={postData.content}
              onChange={(e) => setPostData({...postData, content: e.target.value})}
              required
              rows="6"
              placeholder="Main content of the post..."
            />
          </div>

          <div className="form-group">
            <label>Tags (comma-separated)</label>
            <input
              type="text"
              value={postData.tags}
              onChange={(e) => setPostData({...postData, tags: e.target.value})}
              placeholder="Education, Children, Charity"
            />
          </div>

          <div className="form-group">
            <label>Highlights (comma-separated)</label>
            <input
              type="text"
              value={postData.highlights}
              onChange={(e) => setPostData({...postData, highlights: e.target.value})}
              placeholder="Key point 1, Key point 2, Key point 3"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Create Post
            </button>
          </div>
        </form>
      </div>

      
    </div>

    
  );
};

export default PostForm; 