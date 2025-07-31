import React, { useState, useEffect } from 'react';
import './PostForm.css';

const EditPostForm = ({ isOpen, onClose, onSubmit, post }) => {
  const [postData, setPostData] = useState(post || {
    title: '',
    category: '',
    date: '',
    image: '',
    description: '',
    content: '',
    tags: '',
    highlights: ''
  });

  useEffect(() => {
    if (post) {
      setPostData({
        ...post,
        tags: Array.isArray(post.tags) ? post.tags.join(', ') : post.tags,
        highlights: Array.isArray(post.highlights) ? post.highlights.join(', ') : post.highlights
      });
    }
  }, [post]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formattedData = {
      ...postData,
      tags: postData.tags.split(',').map(tag => tag.trim()),
      highlights: postData.highlights.split(',').map(highlight => highlight.trim()),
      updatedAt: new Date().toISOString()
    };
    
    onSubmit(formattedData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="post-form-modal">
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2>Edit Post</h2>
        
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
            />
          </div>

          <div className="form-group">
            <label>Content</label>
            <textarea
              value={postData.content}
              onChange={(e) => setPostData({...postData, content: e.target.value})}
              required
              rows="6"
            />
          </div>

          <div className="form-group">
            <label>Tags (comma-separated)</label>
            <input
              type="text"
              value={postData.tags}
              onChange={(e) => setPostData({...postData, tags: e.target.value})}
            />
          </div>

          <div className="form-group">
            <label>Highlights (comma-separated)</label>
            <input
              type="text"
              value={postData.highlights}
              onChange={(e) => setPostData({...postData, highlights: e.target.value})}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Update Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPostForm; 