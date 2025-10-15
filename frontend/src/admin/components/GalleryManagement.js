import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import './GalleryManagement.css';

const GalleryManagement = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general',
    is_featured: false,
    display_order: 0,
    image: null
  });

  useEffect(() => {
    loadGalleryImages();
  }, []);

  const loadGalleryImages = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/gallery?limit=100', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setImages(data.data);
      }
    } catch (error) {
      console.error('Error loading gallery images:', error);
    }
    setLoading(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      const submitData = new FormData();
      
      if (formData.image) {
        submitData.append('image', formData.image);
      }
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('category', formData.category);
      submitData.append('is_featured', formData.is_featured);
      submitData.append('display_order', formData.display_order);

      const url = selectedImage 
        ? `http://localhost:5000/api/gallery/${selectedImage.id}`
        : 'http://localhost:5000/api/gallery';
      
      const method = selectedImage ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: submitData
      });

      const data = await response.json();

      if (data.success) {
        alert(selectedImage ? 'Image updated successfully!' : 'Image uploaded successfully!');
        handleCloseModal();
        loadGalleryImages();
      } else {
        alert('Error: ' + (data.message || 'Failed to save image'));
      }
    } catch (error) {
      console.error('Error saving image:', error);
      alert('Error saving image: ' + error.message);
    }
    setLoading(false);
  };

  const handleEdit = (image) => {
    setSelectedImage(image);
    setFormData({
      title: image.title || '',
      description: image.description || '',
      category: image.category || 'general',
      is_featured: image.is_featured || false,
      display_order: image.display_order || 0,
      image: null
    });
    setPreview(`http://localhost:5000${image.image_url}`);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/gallery/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        alert('Image deleted successfully!');
        loadGalleryImages();
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Error deleting image');
    }
  };

  const handleOpenModal = () => {
    setSelectedImage(null);
    setFormData({
      title: '',
      description: '',
      category: 'general',
      is_featured: false,
      display_order: 0,
      image: null
    });
    setPreview('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
    setFormData({
      title: '',
      description: '',
      category: 'general',
      is_featured: false,
      display_order: 0,
      image: null
    });
    setPreview('');
  };

  return (
    <div className="gallery-management">
      <div className="gallery-header">
        <h2>Gallery Management</h2>
        <button className="btn-add" onClick={handleOpenModal}>
          <i className="fas fa-plus"></i> Add New Image
        </button>
      </div>

      {loading && <div className="loading">Loading...</div>}

      <div className="gallery-grid">
        {images.map((image) => (
          <div key={image.id} className="gallery-item">
            <div className="gallery-image">
              <img src={`http://localhost:5000${image.image_url}`} alt={image.title} />
              {image.is_featured && <span className="badge-featured">Featured</span>}
            </div>
            <div className="gallery-info">
              <h4>{image.title || 'Untitled'}</h4>
              <p>{image.category}</p>
            </div>
            <div className="gallery-actions">
              <button className="btn-edit" onClick={() => handleEdit(image)}>
                <i className="fas fa-edit"></i>
              </button>
              <button className="btn-delete" onClick={() => handleDelete(image.id)}>
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>
        ))}
      </div>

      {images.length === 0 && !loading && (
        <div className="empty-state">
          <i className="fas fa-images"></i>
          <p>No images in gallery. Click "Add New Image" to upload.</p>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedImage ? 'Edit Image' : 'Add New Image'}</h3>
              <button className="btn-close" onClick={handleCloseModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="gallery-form">
              <div className="form-group">
                <label>Image</label>
                <div className="file-upload">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    id="imageFile"
                  />
                  <label htmlFor="imageFile" className="file-upload-label">
                    <i className="fas fa-cloud-upload-alt"></i>
                    <span>{formData.image ? formData.image.name : 'Choose Image'}</span>
                  </label>
                </div>
                {preview && (
                  <div className="image-preview">
                    <img src={preview} alt="Preview" />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter image title"
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter image description"
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    <option value="general">General</option>
                    <option value="events">Events</option>
                    <option value="projects">Projects</option>
                    <option value="team">Team</option>
                    <option value="donations">Donations</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Display Order</label>
                  <input
                    type="number"
                    name="display_order"
                    value={formData.display_order}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={formData.is_featured}
                    onChange={handleInputChange}
                  />
                  <span>Mark as Featured</span>
                </label>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit" disabled={loading}>
                  {loading ? 'Saving...' : selectedImage ? 'Update Image' : 'Upload Image'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryManagement;

