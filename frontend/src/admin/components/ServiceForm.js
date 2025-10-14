import React, { useState, useEffect } from 'react';
import './ServiceForm.css';

const ServiceForm = ({ isOpen, onClose, onSubmit, service = null, isEdit = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    icon_class: '',
    display_order: 0,
    is_active: true
  });

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (isEdit && service) {
      setFormData({
        title: service.title || '',
        description: service.description || '',
        image_url: service.image_url || '',
        icon_class: service.icon_class || '',
        display_order: service.display_order || 0,
        is_active: service.is_active !== undefined ? service.is_active : true
      });
      setImagePreview(service.image_url || '');
    } else {
      setFormData({
        title: '',
        description: '',
        image_url: '',
        icon_class: '',
        display_order: 0,
        is_active: true
      });
      setImagePreview('');
    }
  }, [isEdit, service, isOpen]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    if (name === 'image_url') {
      setImagePreview(value);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.image_url.trim()) {
      newErrors.image_url = 'Image URL is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert('Please fix the errors before submitting');
      return;
    }

    try {
      const serviceData = {
        title: formData.title,
        description: formData.description,
        image_url: formData.image_url,
        icon_class: formData.icon_class || null,
        display_order: parseInt(formData.display_order) || 0,
        is_active: formData.is_active
      };

      await onSubmit(serviceData);
      onClose();
    } catch (error) {
      console.error('Form submit error:', error);
      alert('Failed to save service. Please try again.');
    }
  };

  const handleClose = () => {
    if (formData.title || formData.description) {
      if (window.confirm('You have unsaved changes. Are you sure you want to close?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="service-form-overlay">
      <div className="service-form-modal">
        <div className="service-form-header">
          <h2>{isEdit ? 'Edit Service' : 'Add New Service'}</h2>
          <button className="close-btn" onClick={handleClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="service-form">
          <div className="form-group">
            <label htmlFor="title">Service Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Medical Camp"
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
              placeholder="Every month we organize a medical camp..."
              rows="4"
              className={errors.description ? 'error' : ''}
            />
            {errors.description && <span className="error-text">{errors.description}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="image_url">Image URL *</label>
            <input
              type="text"
              id="image_url"
              name="image_url"
              value={formData.image_url}
              onChange={handleInputChange}
              placeholder="/images/img10.jpg"
              className={errors.image_url ? 'error' : ''}
            />
            {errors.image_url && <span className="error-text">{errors.image_url}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="icon_class">Icon Class (Font Awesome)</label>
              <input
                type="text"
                id="icon_class"
                name="icon_class"
                value={formData.icon_class}
                onChange={handleInputChange}
                placeholder="fa-utensils"
              />
            </div>

            <div className="form-group">
              <label htmlFor="display_order">Display Order</label>
              <input
                type="number"
                id="display_order"
                name="display_order"
                value={formData.display_order}
                onChange={handleInputChange}
                min="0"
              />
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
              Active Service
            </label>
          </div>

          {imagePreview && (
            <div className="service-preview">
              <h3>Preview</h3>
              <div className="preview-card">
                <img src={imagePreview} alt="Preview" />
                <h4>{formData.title || 'Service Title'}</h4>
                <p>{formData.description || 'Service description...'}</p>
              </div>
            </div>
          )}

          <div className="form-actions">
            <button type="button" onClick={handleClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              {isEdit ? 'Update Service' : 'Add Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceForm;

