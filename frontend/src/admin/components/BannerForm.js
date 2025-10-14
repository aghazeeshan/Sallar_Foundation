import React, { useState, useEffect } from 'react';
import './BannerForm.css';

const BannerForm = ({ isOpen, onClose, onSubmit, banner = null, isEdit = false }) => {
  const [formData, setFormData] = useState({
    id: '',
    image_url: '',
    sub_heading: '',
    title: '',
    description: '',
    button_text: '',
    link_url: '',
    text_alignment: 'center',
    is_active: true,
    created_at: new Date().toISOString()
  });

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (isEdit && banner) {
      setFormData({
        id: banner.id,
        image_url: banner.image_url || '',
        sub_heading: banner.sub_heading || '',
        title: banner.title || '',
        description: banner.description || '',
        button_text: banner.button_text || '',
        link_url: banner.link_url || '',
        text_alignment: banner.text_alignment || 'center',
        is_active: banner.is_active !== undefined ? banner.is_active : true,
        created_at: banner.created_at || new Date().toISOString()
      });
      setImagePreview(banner.image_url || '');
    } else {
      // Reset form for new banner
      setFormData({
        id: '',
        image_url: '',
        sub_heading: '',
        title: '',
        description: '',
        button_text: '',
        link_url: '',
        text_alignment: 'center',
        is_active: true,
        created_at: new Date().toISOString()
      });
      setImagePreview('');
    }
  }, [isEdit, banner, isOpen]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Update image preview
    if (name === 'image_url') {
      setImagePreview(value);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.image_url.trim()) {
      newErrors.image_url = 'Background image is required';
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Heading is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.button_text && !formData.link_url.trim()) {
      newErrors.link_url = 'Button link is required when button text is provided';
    }

    // Validate URL format
    if (formData.image_url && !isValidUrl(formData.image_url)) {
      newErrors.image_url = 'Please enter a valid image URL';
    }

    if (formData.link_url && !isValidUrl(formData.link_url)) {
      newErrors.link_url = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert('Please fix the errors before submitting');
      return;
    }

    try {
      // Generate ID for new banners
      const bannerData = {
        title: formData.title,
        sub_heading: formData.sub_heading || null,
        description: formData.description,
        image_url: formData.image_url,
        button_text: formData.button_text || null,
        button_link: formData.link_url || null,
        text_alignment: formData.text_alignment,
        is_active: formData.is_active
      };

      await onSubmit(bannerData);
      onClose();
    } catch (error) {
      console.error('Form submit error:', error);
      alert('Failed to save banner. Please try again.');
    }
  };

  const handleClose = () => {
    if (formData.image_url || formData.title || formData.description) {
      if (window.confirm('You have unsaved changes. Are you sure you want to close?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="banner-form-overlay">
      <div className="banner-form-modal">
        <div className="banner-form-header">
          <h2>{isEdit ? 'Edit Banner' : 'Add New Banner'}</h2>
          <button className="close-btn" onClick={handleClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="banner-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="image_url">Background Image URL *</label>
              <input
                type="url"
                id="image_url"
                name="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
                className={errors.image_url ? 'error' : ''}
              />
              {errors.image_url && <span className="error-text">{errors.image_url}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="text_alignment">Text Alignment</label>
              <select
                id="text_alignment"
                name="text_alignment"
                value={formData.text_alignment}
                onChange={handleInputChange}
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="sub_heading">Sub Heading</label>
            <input
              type="text"
              id="sub_heading"
              name="sub_heading"
              value={formData.sub_heading}
              onChange={handleInputChange}
              placeholder="Welcome to Sallar Foundation"
            />
          </div>

          <div className="form-group">
            <label htmlFor="title">Heading *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Together We Can Make A Difference"
              className={errors.title ? 'error' : ''}
            />
            {errors.title && <span className="error-text">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Join us in our mission to create positive change..."
              rows="4"
              className={errors.description ? 'error' : ''}
            />
            {errors.description && <span className="error-text">{errors.description}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="button_text">Button Text</label>
              <input
                type="text"
                id="button_text"
                name="button_text"
                value={formData.button_text}
                onChange={handleInputChange}
                placeholder="Donate Now"
              />
            </div>

            <div className="form-group">
              <label htmlFor="link_url">Button Link</label>
              <input
                type="url"
                id="link_url"
                name="link_url"
                value={formData.link_url}
                onChange={handleInputChange}
                placeholder="https://example.com/donate"
                className={errors.link_url ? 'error' : ''}
              />
              {errors.link_url && <span className="error-text">{errors.link_url}</span>}
            </div>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleInputChange}
              />
              <span className="checkmark"></span>
              Active Banner
            </label>
          </div>

          {/* Preview Section */}
          {imagePreview && (
            <div className="banner-preview">
              <h3>Preview</h3>
              <div 
                className="preview-banner"
                style={{
                  backgroundImage: `url(${imagePreview})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  minHeight: '200px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: formData.text_alignment,
                  padding: '20px',
                  position: 'relative'
                }}
              >
                <div style={{ 
                  textAlign: formData.text_alignment,
                  color: 'white',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
                  maxWidth: '80%'
                }}>
                  {formData.sub_heading && <p style={{ fontSize: '1.2em', margin: '0 0 10px 0' }}>{formData.sub_heading}</p>}
                  {formData.title && <h1 style={{ fontSize: '2.5em', margin: '0 0 15px 0', fontWeight: 'bold' }}>{formData.title}</h1>}
                  {formData.description && <p style={{ fontSize: '1.1em', margin: '0 0 20px 0' }}>{formData.description}</p>}
                  {formData.button_text && (
                    <button 
                      style={{
                        backgroundColor: '#28a745',
                        color: 'white',
                        padding: '12px 24px',
                        border: 'none',
                        borderRadius: '5px',
                        fontSize: '1.1em',
                        cursor: 'pointer'
                      }}
                    >
                      {formData.button_text}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="form-actions">
            <button type="button" onClick={handleClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              {isEdit ? 'Update Banner' : 'Add Banner'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BannerForm;
