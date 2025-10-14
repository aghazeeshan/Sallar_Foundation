import React, { useState } from 'react';
import './ServiceDataTable.css';

const ServiceDataTable = ({ services, onEdit, onDelete, onToggleActive }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [sortField, setSortField] = useState('display_order');
  const [sortDirection, setSortDirection] = useState('asc');

  // Sort services
  const sortedServices = [...services].sort((a, b) => {
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
  const currentServices = sortedServices.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(services.length / itemsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDelete = (service) => {
    if (window.confirm(`Do you want to delete "${service.title}"?`)) {
      onDelete(service.id);
      alert('Service has been deleted successfully.');
    }
  };

  const handleToggleActive = (service) => {
    const action = service.is_active ? 'deactivate' : 'activate';
    if (window.confirm(`Do you want to ${action} "${service.title}"?`)) {
      onToggleActive(service.id);
      alert(`Service has been ${action}d successfully.`);
    }
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
    <div className="service-data-table">
      <div className="table-header">
        <h3>Service Management</h3>
        <div className="table-info">
          Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, services.length)} of {services.length} services
        </div>
      </div>

      <div className="table-container">
        <table className="services-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('title')}>
                Service Info
                <i className={`fas fa-sort ${sortField === 'title' ? (sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down') : ''}`}></i>
              </th>
              <th onClick={() => handleSort('display_order')}>
                Order
                <i className={`fas fa-sort ${sortField === 'display_order' ? (sortDirection === 'asc' ? 'fa-sort-up' : 'fa-sort-down') : ''}`}></i>
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
            {currentServices.map(service => (
              <tr key={service.id}>
                <td>
                  <div className="service-info">
                    <div className="service-thumbnail">
                      {service.image_url ? (
                        <img 
                          src={service.image_url} 
                          alt={service.title}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className="no-image" style={{ display: service.image_url ? 'none' : 'flex' }}>
                        <i className="fas fa-image"></i>
                      </div>
                    </div>
                    <div className="service-details">
                      <h4>{service.title}</h4>
                      <p className="description">{service.description ? service.description.substring(0, 80) + '...' : ''}</p>
                      {service.icon_class && <span className="icon-badge"><i className={`fas ${service.icon_class}`}></i></span>}
                    </div>
                  </div>
                </td>
                <td>
                  <span className="order-badge">{service.display_order}</span>
                </td>
                <td>
                  <span className={`status-badge ${service.is_active ? 'active' : 'inactive'}`}>
                    <i className={`fas fa-${service.is_active ? 'check-circle' : 'times-circle'}`}></i>
                    {service.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <div className="date-info">
                    <div className="date">{new Date(service.created_at).toLocaleDateString()}</div>
                    <div className="time">{new Date(service.created_at).toLocaleTimeString()}</div>
                  </div>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="action-btn edit-btn"
                      onClick={() => onEdit(service)}
                      title="Edit Service"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      className={`action-btn toggle-btn ${service.is_active ? 'deactivate' : 'activate'}`}
                      onClick={() => handleToggleActive(service)}
                      title={service.is_active ? 'Deactivate' : 'Activate'}
                    >
                      <i className={`fas fa-${service.is_active ? 'pause' : 'play'}`}></i>
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDelete(service)}
                      title="Delete Service"
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

export default ServiceDataTable;

