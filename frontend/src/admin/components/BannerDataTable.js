import React, { useState } from 'react';
import './BannerDataTable.css';

const BannerDataTable = ({ banners, onEdit, onDelete, onToggleActive, onView }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');

  // Sort banners
  const sortedBanners = [...banners].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (sortField === 'created_at') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBanners = sortedBanners.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(banners.length / itemsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDelete = (banner) => {
    if (window.confirm(`Do you want to delete "${banner.title}"?`)) {
      onDelete(banner.id);
      alert('Banner has been deleted successfully.');
    }
  };

  const handleToggleActive = (banner) => {
    const action = banner.is_active ? 'deactivate' : 'activate';
    if (window.confirm(`Do you want to ${action} "${banner.title}"?`)) {
      onToggleActive(banner.id);
      alert(`Banner has been ${action}d successfully.`);
    }
  };

  const handleView = (banner) => {
    onView(banner);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          className={`page-btn ${currentPage === i ? 'active' : ''}`}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="pagination">
        <button
          className="page-btn"
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {pages}
        <button
          className="page-btn"
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="banner-data-table">
      <div className="table-header">
        <h3>Banner Management</h3>
        <div className="table-info">
          Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, banners.length)} of {banners.length} banners
        </div>
      </div>

      <div className="table-container">
        <table className="banners-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('title')}>
                Banner Info
                <i className={`fas fa-sort ${sortField === 'title' ? (sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down') : ''}`}></i>
              </th>
              <th onClick={() => handleSort('text_alignment')}>
                Alignment
                <i className={`fas fa-sort ${sortField === 'text_alignment' ? (sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down') : ''}`}></i>
              </th>
              <th onClick={() => handleSort('is_active')}>
                Status
                <i className={`fas fa-sort ${sortField === 'is_active' ? (sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down') : ''}`}></i>
              </th>
              <th onClick={() => handleSort('created_at')}>
                Created
                <i className={`fas fa-sort ${sortField === 'created_at' ? (sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down') : ''}`}></i>
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentBanners.map(banner => (
              <tr key={banner.id}>
                <td>
                  <div className="banner-info">
                    <div className="banner-thumbnail">
                      {banner.image_url ? (
                        <img 
                          src={banner.image_url} 
                          alt={banner.title}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className="no-image" style={{ display: banner.image_url ? 'none' : 'flex' }}>
                        <i className="fas fa-image"></i>
                      </div>
                    </div>
                    <div className="banner-details">
                      <h4>{banner.title}</h4>
                      <p>{banner.sub_heading}</p>
                      <p className="description">{banner.description ? banner.description.substring(0, 50) + '...' : ''}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`alignment-badge ${banner.text_alignment || 'center'}`}>
                    <i className={`fas fa-align-${banner.text_alignment || 'center'}`}></i>
                    {banner.text_alignment ? banner.text_alignment.charAt(0).toUpperCase() + banner.text_alignment.slice(1) : 'Center'}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${banner.is_active ? 'active' : 'inactive'}`}>
                    <i className={`fas fa-${banner.is_active ? 'check-circle' : 'times-circle'}`}></i>
                    {banner.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <div className="date-info">
                    <div className="date">{new Date(banner.created_at).toLocaleDateString()}</div>
                    <div className="time">{new Date(banner.created_at).toLocaleTimeString()}</div>
                  </div>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="action-btn view-btn"
                      onClick={() => handleView(banner)}
                      title="View Banner"
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    <button
                      className="action-btn edit-btn"
                      onClick={() => onEdit(banner)}
                      title="Edit Banner"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      className={`action-btn toggle-btn ${banner.is_active ? 'deactivate' : 'activate'}`}
                      onClick={() => handleToggleActive(banner)}
                      title={banner.is_active ? 'Deactivate' : 'Activate'}
                    >
                      <i className={`fas fa-${banner.is_active ? 'pause' : 'play'}`}></i>
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDelete(banner)}
                      title="Delete Banner"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {renderPagination()}
    </div>
  );
};

export default BannerDataTable;
