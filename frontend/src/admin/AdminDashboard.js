import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import LoginModal from '../components/LoginModal';
import AdminHeader from './components/AdminHeader';
import EventForm from './components/EventForm';
import PostForm from './components/PostForm';
import EditPostForm from './components/EditPostForm';
import DonationDetailsModal from './components/DonationDetailsModal';
import { generateVolunteerPDF } from '../utils/generateVolunteerPDF';
import VolunteerDetailsModal from '../components/VolunteerDetailsModal';
import './AdminDashboard.css';
import Settings from './pages/Settings';

const AdminDashboard = ({ setIsAdminMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [isPostFormOpen, setIsPostFormOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [userEmail, setUserEmail] = useState('admin@gmail.com');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [donations, setDonations] = useState(() => {
    return JSON.parse(localStorage.getItem('donations') || '[]');
  });
  const [isEditPostFormOpen, setIsEditPostFormOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [selectedDonations, setSelectedDonations] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [volunteers, setVolunteers] = useState([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [isVolunteerModalOpen, setIsVolunteerModalOpen] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState([]);

  useEffect(() => {
    setIsAdminMode(true);
    document.body.classList.add('admin-mode');
    
    return () => {
      setIsAdminMode(false);
      document.body.classList.remove('admin-mode');
    };
  }, [setIsAdminMode]);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
    }
  }, []);

  useEffect(() => {
    const savedEvents = JSON.parse(localStorage.getItem('events') || '[]');
    setEvents(savedEvents);
  }, []);

  useEffect(() => {
    const savedVolunteers = JSON.parse(localStorage.getItem('volunteers') || '[]');
    setVolunteers(savedVolunteers);
  }, []);

  useEffect(() => {
    const savedContacts = JSON.parse(localStorage.getItem('contacts') || '[]');
    setContacts(savedContacts);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsAdminMode(false);
    document.body.classList.remove('admin-mode');
    navigate('/');
  };

  const handleAddEvent = (newEvent) => {
    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    localStorage.setItem('events', JSON.stringify(updatedEvents));
  };

  const handleDeleteEvent = (eventId) => {
    const updatedEvents = events.filter(event => event.id !== eventId);
    setEvents(updatedEvents);
    localStorage.setItem('events', JSON.stringify(updatedEvents));
  };

  const handleEditEvent = (eventId) => {
    const postToEdit = events.find(event => event.id === eventId);
    setSelectedPost(postToEdit);
    setIsEditPostFormOpen(true);
  };

  const handleAddPost = (newPost) => {
    const updatedEvents = [...events, newPost];
    setEvents(updatedEvents);
    localStorage.setItem('events', JSON.stringify(updatedEvents));
  };

  const handleUpdatePost = (updatedPost) => {
    const updatedEvents = events.map(event => 
      event.id === updatedPost.id ? updatedPost : event
    );
    setEvents(updatedEvents);
    localStorage.setItem('events', JSON.stringify(updatedEvents));
    setSelectedPost(null);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isSidebarOpen && 
          !e.target.closest('.admin-sidebar') && 
          !e.target.closest('.sidebar-toggle')) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarOpen]);

  const handleViewPost = (event) => {
    // Navigate to blog detail page
    window.open(`/blog/${event.id}`, '_blank');
  };

  const handleDownloadReceipt = (donation) => {
    const receiptContent = `
Donation Receipt
--------------
Date: ${new Date(donation.date).toLocaleDateString()}
Receipt No: ${donation.id}

Donor Information:
Name: ${donation.firstName} ${donation.lastName}
Email: ${donation.email}
Phone: ${donation.phone}

Donation Details:
Amount: $${Number(donation.amount).toLocaleString()}
Campaign: ${donation.campaign}
Frequency: ${donation.frequency}

Thank you for your generous donation!
`;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `donation-receipt-${donation.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedDonations(donations.map(d => d.id));
    } else {
      setSelectedDonations([]);
    }
  };

  const handleSelectDonation = (donationId) => {
    setSelectedDonations(prev => {
      if (prev.includes(donationId)) {
        return prev.filter(id => id !== donationId);
      } else {
        return [...prev, donationId];
      }
    });
  };

  const handleBulkDelete = () => {
    if (window.confirm('Are you sure you want to delete selected donations?')) {
      const updatedDonations = donations.filter(d => !selectedDonations.includes(d.id));
      localStorage.setItem('donations', JSON.stringify(updatedDonations));
      setDonations(updatedDonations);
      setSelectedDonations([]);
    }
  };

  const handleBulkDownload = () => {
    const selectedData = donations.filter(d => selectedDonations.includes(d.id));
    selectedData.forEach(donation => {
      handleDownloadReceipt(donation);
    });
  };

  const handleApproveVolunteer = (volunteerId) => {
    const updatedVolunteers = volunteers.map(volunteer => 
      volunteer.id === volunteerId ? { ...volunteer, status: 'approved' } : volunteer
    );
    setVolunteers(updatedVolunteers);
    localStorage.setItem('volunteers', JSON.stringify(updatedVolunteers));
    setSelectedVolunteer(null);
  };

  const handleDeleteVolunteer = (volunteerId) => {
    const updatedVolunteers = volunteers.filter(volunteer => volunteer.id !== volunteerId);
    setVolunteers(updatedVolunteers);
    localStorage.setItem('volunteers', JSON.stringify(updatedVolunteers));
    setSelectedVolunteer(null);
  };

  const handleMarkAsRead = (contactId) => {
    const updatedContacts = contacts.map(contact => 
      contact.id === contactId ? { ...contact, status: 'read' } : contact
    );
    setContacts(updatedContacts);
    localStorage.setItem('contacts', JSON.stringify(updatedContacts));
  };

  const handleDeleteContact = (contactId) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      const updatedContacts = contacts.filter(contact => contact.id !== contactId);
      setContacts(updatedContacts);
      localStorage.setItem('contacts', JSON.stringify(updatedContacts));
    }
  };

  const handleSelectAllContacts = (e) => {
    if (e.target.checked) {
      setSelectedContacts(contacts.map(c => c.id));
    } else {
      setSelectedContacts([]);
    }
  };

  const handleSelectContact = (contactId) => {
    setSelectedContacts(prev => {
      if (prev.includes(contactId)) {
        return prev.filter(id => id !== contactId);
      } else {
        return [...prev, contactId];
      }
    });
  };

  const handleBulkDeleteContacts = () => {
    if (window.confirm('Are you sure you want to delete selected messages?')) {
      const updatedContacts = contacts.filter(c => !selectedContacts.includes(c.id));
      setContacts(updatedContacts);
      localStorage.setItem('contacts', JSON.stringify(updatedContacts));
      setSelectedContacts([]);
    }
  };

  const handleBulkMarkAsRead = () => {
    const updatedContacts = contacts.map(contact => 
      selectedContacts.includes(contact.id) ? { ...contact, status: 'read' } : contact
    );
    setContacts(updatedContacts);
    localStorage.setItem('contacts', JSON.stringify(updatedContacts));
    setSelectedContacts([]);
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'blog-posts':
        return (
          <div className="blog-posts-content">
            <div className="content-header">
              <div className="header-left">
                <h1>Blog Posts</h1>
                <p>Manage your blog posts</p>
              </div>
              <div className="header-actions">
                <button className="add-new-btn" onClick={() => setIsPostFormOpen(true)}>
                  <i className="fas fa-plus"></i> Add New Post
                </button>
              </div>
            </div>

            <div className="blog-stats">
              <div className="stat-card">
                <i className="fas fa-blog"></i>
                <div className="stat-info">
                  <h3>Total Posts</h3>
                  <p>{events.length}</p>
                </div>
              </div>
              <div className="stat-card">
                <i className="fas fa-eye"></i>
                <div className="stat-info">
                  <h3>Total Views</h3>
                  <p>2,345</p>
                </div>
              </div>
              <div className="stat-card">
                <i className="fas fa-comments"></i>
                <div className="stat-info">
                  <h3>Comments</h3>
                  <p>156</p>
                </div>
              </div>
            </div>

            <section className="posts-section">
              <div className="posts-header">
                <h2>All Posts</h2>
                <div className="posts-actions">
                  <div className="filter-buttons">
                    <button 
                      className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
                      onClick={() => setFilterStatus('all')}
                    >
                      <i className="fas fa-list"></i>
                      <span>All</span>
                    </button>
                    <button 
                      className={`filter-btn ${filterStatus === 'education' ? 'active' : ''}`}
                      onClick={() => setFilterStatus('education')}
                    >
                      <i className="fas fa-graduation-cap"></i>
                      <span>Education</span>
                    </button>
                    <button 
                      className={`filter-btn ${filterStatus === 'healthcare' ? 'active' : ''}`}
                      onClick={() => setFilterStatus('healthcare')}
                    >
                      <i className="fas fa-heartbeat"></i>
                      <span>Healthcare</span>
                    </button>
                    <button 
                      className={`filter-btn ${filterStatus === 'charity' ? 'active' : ''}`}
                      onClick={() => setFilterStatus('charity')}
                    >
                      <i className="fas fa-hand-holding-heart"></i>
                      <span>Charity</span>
                    </button>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Search posts..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="posts-table">
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Views</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events
                      .filter(event => {
                        if (filterStatus === 'all') return true;
                        return event.category.toLowerCase() === filterStatus;
                      })
                      .filter(event => {
                        const searchStr = `${event.title} ${event.description}`.toLowerCase();
                        return searchStr.includes(searchTerm.toLowerCase());
                      })
                      .map(event => (
                        <tr key={event.id}>
                          <td>
                            <div className="post-info">
                              <img src={event.image} alt={event.title} />
                              <div>
                                <h4>{event.title}</h4>
                                <p>{event.description.substring(0, 60)}...</p>
                              </div>
                            </div>
                          </td>
                          <td>{event.category}</td>
                          <td>{event.date}</td>
                          <td>
                            <span className="status-badge published">Published</span>
                          </td>
                          <td>245</td>
                          <td>
                            <div className="action-buttons">
                              <button 
                                className="edit-btn" 
                                onClick={() => handleEditEvent(event.id)} 
                                title="Edit Post"
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button 
                                className="delete-btn" 
                                onClick={() => handleDeleteEvent(event.id)} 
                                title="Delete Post"
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                              <button 
                                className="view-btn" 
                                onClick={() => handleViewPost(event)} 
                                title="View Post"
                              >
                                <i className="fas fa-eye"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </section>

            <PostForm 
              isOpen={isPostFormOpen}
              onClose={() => setIsPostFormOpen(false)}
              onSubmit={handleAddPost}
            />
          </div>
        );
      
      case 'dashboard':
      default:
        return (
          <>
            <div className="welcome-section">
              <div className="welcome-header">
                <div className="welcome-text">
                  <h1>Welcome Back, Admin!</h1>
                  <p>Here's what's happening with your website today.</p>
                </div>
                <div className="date-time">
                  <div className="current-time">
                    <i className="far fa-clock"></i>
                    {new Date().toLocaleTimeString()}
                  </div>
                  <div className="current-date">
                    <i className="far fa-calendar"></i>
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                </div>
              </div>

              <div className="admin-profile">
                <div className="profile-card">
                  <div className="profile-header">
                    <div className="profile-cover"></div>
                    <div className="profile-avatar">
                      <i className="fas fa-user"></i>
                    </div>
                  </div>
                  <div className="profile-info">
                    <h2>Admin User</h2>
                    <p className="profile-email">{userEmail}</p>
                    <div className="profile-stats">
                      <div className="stat-item">
                        <span className="stat-value">45</span>
                        <span className="stat-label">Posts</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-value">2.3k</span>
                        <span className="stat-label">Views</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-value">156</span>
                        <span className="stat-label">Comments</span>
                      </div>
                    </div>
                  </div>
                  <div className="profile-actions">
                    <button className="edit-profile-btn">
                      <i className="fas fa-edit"></i> Edit Profile
                    </button>
                    <button className="settings-btn">
                      <i className="fas fa-cog"></i> Settings
                    </button>
                  </div>
                </div>

                <div className="quick-stats">
                  <div className="stat-card">
                    <i className="fas fa-blog"></i>
                    <div className="stat-info">
                      <h3>Total Posts</h3>
                      <p>24</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <i className="fas fa-users"></i>
                    <div className="stat-info">
                      <h3>Users</h3>
                      <p>156</p>
                    </div>
                  </div>
                  <div className="stat-card">
                    <i className="fas fa-eye"></i>
                    <div className="stat-info">
                      <h3>Views</h3>
                      <p>2,345</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="recent-activity">
                <h2>Recent Activity</h2>
                <div className="activity-list">
                  <div className="activity-item">
                    <div className="activity-icon">
                      <i className="fas fa-plus-circle"></i>
                    </div>
                    <div className="activity-details">
                      <p>New post created: "Making a Difference"</p>
                      <span>2 hours ago</span>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon">
                      <i className="fas fa-edit"></i>
                    </div>
                    <div className="activity-details">
                      <p>Updated profile information</p>
                      <span>5 hours ago</span>
                    </div>
                  </div>
                  <div className="activity-item">
                    <div className="activity-icon">
                      <i className="fas fa-comment"></i>
                    </div>
                    <div className="activity-details">
                      <p>New comment on "Healthcare Initiative"</p>
                      <span>1 day ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      case 'donations':
        return (
          <div className="donations-content">
            <div className="content-header">
              <div className="header-left">
                <h1>Donations</h1>
                <p>Manage all donations and donor information</p>
              </div>
            </div>

            <div className="donation-stats">
              <div className="stat-card">
                <i className="fas fa-dollar-sign"></i>
                <div className="stat-info">
                  <h3>Total Donations</h3>
                  <p>${donations.reduce((sum, d) => sum + Number(d.amount), 0).toLocaleString()}</p>
                </div>
              </div>
              <div className="stat-card">
                <i className="fas fa-users"></i>
                <div className="stat-info">
                  <h3>Total Donors</h3>
                  <p>{donations.length}</p>
                </div>
              </div>
              <div className="stat-card">
                <i className="fas fa-chart-line"></i>
                <div className="stat-info">
                  <h3>Average Donation</h3>
                  <p>${(donations.reduce((sum, d) => sum + Number(d.amount), 0) / (donations.length || 1)).toFixed(2)}</p>
                </div>
              </div>
            </div>

            <section className="donations-section">
              <div className="donations-header">
                <h2>All Donations</h2>
                <div className="donations-actions">
                  {selectedDonations.length > 0 && (
                    <div className="bulk-actions">
                      <span>{selectedDonations.length} selected</span>
                      <button 
                        className="bulk-action-btn delete" 
                        onClick={handleBulkDelete}
                        title="Delete Selected"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                      <button 
                        className="bulk-action-btn download" 
                        onClick={handleBulkDownload}
                        title="Download Selected"
                      >
                        <i className="fas fa-download"></i>
                      </button>
                    </div>
                  )}
                  <div className="donations-filters">
                    <div className="filter-buttons">
                      <button 
                        className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
                        onClick={() => setFilterStatus('all')}
                      >
                        <i className="fas fa-list"></i>
                        <span>All</span>
                      </button>
                      <button 
                        className={`filter-btn ${filterStatus === 'donation' ? 'active' : ''}`}
                        onClick={() => setFilterStatus('donation')}
                      >
                        <i className="fas fa-donate"></i>
                        <span>Donation</span>
                      </button>
                      <button 
                        className={`filter-btn ${filterStatus === 'zakat' ? 'active' : ''}`}
                        onClick={() => setFilterStatus('zakat')}
                      >
                        <i className="fas fa-star-and-crescent"></i>
                        <span>Zakat</span>
                      </button>
                      <button 
                        className={`filter-btn ${filterStatus === 'sadqa' ? 'active' : ''}`}
                        onClick={() => setFilterStatus('sadqa')}
                      >
                        <i className="fas fa-hands-helping"></i>
                        <span>Sadqa</span>
                      </button>
                    </div>
                    <input 
                      type="text" 
                      placeholder="Search donors..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="donations-table">
                <table>
                  <thead>
                    <tr>
                      <th>
                        <input 
                          type="checkbox" 
                          checked={selectedDonations.length === donations.length}
                          onChange={handleSelectAll}
                        />
                      </th>
                      <th>Donor Information</th>
                      <th>Contact Details</th>
                      <th>Donation Details</th>
                      <th>Payment Information</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donations
                      .filter(d => {
                        if (filterStatus === 'all') return true;
                        return d.donationType === filterStatus;
                      })
                      .filter(d => {
                        const searchStr = `${d.firstName} ${d.lastName} ${d.email}`.toLowerCase();
                        return searchStr.includes(searchTerm.toLowerCase());
                      })
                      .map(donation => (
                        <tr key={donation.id}>
                          <td>
                            <input 
                              type="checkbox"
                              checked={selectedDonations.includes(donation.id)}
                              onChange={() => handleSelectDonation(donation.id)}
                            />
                          </td>
                          <td>
                            <div className="donor-info">
                              <div className="donor-avatar">
                                <i className="fas fa-user"></i>
                              </div>
                              <div>
                                <h4>{donation.firstName} {donation.lastName}</h4>
                                <p>{donation.anonymous ? 'Anonymous Donor' : 'Public Donor'}</p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="contact-info">
                              <p><i className="fas fa-envelope"></i> {donation.email}</p>
                              <p><i className="fas fa-phone"></i> {donation.phone}</p>
                              <p><i className="fas fa-map-marker-alt"></i> {donation.address}</p>
                            </div>
                          </td>
                          <td>
                            <div className="donation-details">
                              <p className="amount">${Number(donation.amount).toLocaleString()}</p>
                              <p className="campaign">{donation.campaign}</p>
                              <p className="frequency">{donation.frequency}</p>
                            </div>
                          </td>
                          <td>
                            <div className="payment-info">
                              <p>Card: **** **** **** {donation.cardNumber?.slice(-4)}</p>
                              <p>Name: {donation.cardName}</p>
                              <p>Date: {new Date(donation.date).toLocaleDateString()}</p>
                            </div>
                          </td>
                          <td>
                            <span className="status-badge success">
                              {donation.status || 'Completed'}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button 
                                className="view-btn" 
                                title="View Details"
                                onClick={() => {
                                  setSelectedDonation(donation);
                                  setIsDonationModalOpen(true);
                                }}
                              >
                                <i className="fas fa-eye"></i>
                              </button>
                              {donation.message && (
                                <button 
                                  className="message-btn" 
                                  title="View Message"
                                  onClick={() => {
                                    setSelectedDonation(donation);
                                    setIsDonationModalOpen(true);
                                  }}
                                >
                                  <i className="fas fa-envelope"></i>
                                </button>
                              )}
                              <button 
                                className="receipt-btn" 
                                title="Download Receipt"
                                onClick={() => handleDownloadReceipt(donation)}
                              >
                                <i className="fas fa-file-download"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        );
      case 'volunteers':
        return (
          <div className="volunteers-content">
            <div className="content-header">
              <div className="header-left">
                <h1>Volunteers</h1>
                <p>Manage volunteer applications</p>
              </div>
            </div>

            <div className="volunteer-stats">
              <div className="stat-card">
                <i className="fas fa-user-plus"></i>
                <div className="stat-info">
                  <h3>Total Applications</h3>
                  <p>{volunteers.length}</p>
                </div>
              </div>
              <div className="stat-card">
                <i className="fas fa-check-circle"></i>
                <div className="stat-info">
                  <h3>Approved</h3>
                  <p>{volunteers.filter(v => v.status === 'approved').length}</p>
                </div>
              </div>
              <div className="stat-card">
                <i className="fas fa-clock"></i>
                <div className="stat-info">
                  <h3>Pending</h3>
                  <p>{volunteers.filter(v => v.status === 'pending').length}</p>
                </div>
              </div>
            </div>

            <section className="volunteers-section">
              <div className="volunteers-header">
                <h2>All Applications</h2>
                <div className="volunteers-actions">
                  <div className="filter-buttons">
                    <button 
                      className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
                      onClick={() => setFilterStatus('all')}
                    >
                      <i className="fas fa-list"></i>
                      <span>All</span>
                    </button>
                    <button 
                      className={`filter-btn ${filterStatus === 'pending' ? 'active' : ''}`}
                      onClick={() => setFilterStatus('pending')}
                    >
                      <i className="fas fa-clock"></i>
                      <span>Pending</span>
                    </button>
                    <button 
                      className={`filter-btn ${filterStatus === 'approved' ? 'active' : ''}`}
                      onClick={() => setFilterStatus('approved')}
                    >
                      <i className="fas fa-check"></i>
                      <span>Approved</span>
                    </button>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Search volunteers..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="volunteers-table">
                <table>
                  <thead>
                    <tr>
                      <th>Volunteer Info</th>
                      <th>Contact Details</th>
                      <th>Skills & Interests</th>
                      <th>Availability</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {volunteers
                      .filter(v => {
                        if (filterStatus === 'all') return true;
                        return v.status === filterStatus;
                      })
                      .filter(v => {
                        const searchStr = `${v.firstName} ${v.lastName} ${v.email}`.toLowerCase();
                        return searchStr.includes(searchTerm.toLowerCase());
                      })
                      .map(volunteer => (
                        <tr key={volunteer.id}>
                          <td>
                            <div className="volunteer-info">
                              <div className="volunteer-avatar">
                                <i className="fas fa-user"></i>
                              </div>
                              <div>
                                <h4>{volunteer.firstName} {volunteer.lastName}</h4>
                                <p>{volunteer.occupation}</p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="contact-info">
                              <p><i className="fas fa-envelope"></i> {volunteer.email}</p>
                              <p><i className="fas fa-phone"></i> {volunteer.phone}</p>
                              <p><i className="fas fa-map-marker-alt"></i> {volunteer.address}</p>
                            </div>
                          </td>
                          <td>
                            <div className="skills-info">
                              <p className="skills">{volunteer.skills}</p>
                              <p className="interests">{volunteer.interests}</p>
                            </div>
                          </td>
                          <td>
                            <div className="availability-info">
                              <p>{volunteer.availability}</p>
                              <p className="hours">{volunteer.hours} hours/week</p>
                            </div>
                          </td>
                          <td>
                            <span className={`status-badge ${volunteer.status}`}>
                              {volunteer.status}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button 
                                className="view-btn" 
                                title="View Details"
                                onClick={() => {
                                  setSelectedVolunteer(volunteer);
                                  setIsVolunteerModalOpen(true);
                                }}
                              >
                                <i className="fas fa-eye"></i>
                              </button>
                              <button 
                                className="download-btn" 
                                title="Download Application"
                                onClick={() => generateVolunteerPDF(volunteer)}
                              >
                                <i className="fas fa-file-download"></i>
                              </button>
                              <button 
                                className="approve-btn" 
                                title="Approve Application"
                                onClick={() => handleApproveVolunteer(volunteer.id)}
                              >
                                <i className="fas fa-check"></i>
                              </button>
                              <button 
                                className="delete-btn" 
                                title="Delete Application"
                                onClick={() => handleDeleteVolunteer(volunteer.id)}
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
            </section>
          </div>
        );
      case 'contacts':
        return (
          <div className="contacts-content">
            <div className="stats-grid">
              <div className="stat-box">
                <div className="stat-icon">
                  <i className="fas fa-inbox"></i>
                </div>
                <div className="stat-details">
                  <h3>Total Messages</h3>
                  <h2>{contacts.length}</h2>
                </div>
              </div>

              <div className="stat-box">
                <div className="stat-icon">
                  <i className="fas fa-envelope"></i>
                </div>
                <div className="stat-details">
                  <h3>Unread</h3>
                  <h2>{contacts.filter(c => c.status === 'unread').length}</h2>
                </div>
              </div>

              <div className="stat-box">
                <div className="stat-icon">
                  <i className="fas fa-check-circle"></i>
                </div>
                <div className="stat-details">
                  <h3>Read</h3>
                  <h2>{contacts.filter(c => c.status === 'read').length}</h2>
                </div>
              </div>
            </div>

            <section className="contacts-section">
              <div className="contacts-header">
                <h2>All Messages</h2>
                <div className="contacts-actions">
                  <div className="filter-buttons">
                    <button 
                      className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
                      onClick={() => setFilterStatus('all')}
                    >
                      <i className="fas fa-list"></i>
                      <span>All</span>
                    </button>
                    <button 
                      className={`filter-btn ${filterStatus === 'unread' ? 'active' : ''}`}
                      onClick={() => setFilterStatus('unread')}
                    >
                      <i className="fas fa-envelope"></i>
                      <span>Unread</span>
                    </button>
                    <button 
                      className={`filter-btn ${filterStatus === 'read' ? 'active' : ''}`}
                      onClick={() => setFilterStatus('read')}
                    >
                      <i className="fas fa-check"></i>
                      <span>Read</span>
                    </button>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Search messages..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="messages-grid">
                {contacts
                  .filter(c => {
                    if (filterStatus === 'all') return true;
                    return c.status === filterStatus;
                  })
                  .filter(c => {
                    const searchStr = `${c.name} ${c.email} ${c.subject}`.toLowerCase();
                    return searchStr.includes(searchTerm.toLowerCase());
                  })
                  .map(contact => (
                    <div key={contact.id} className={`message-card ${contact.status}`}>
                      <div className="card-header">
                        <div className="sender-info">
                          <div className="sender-avatar">
                            <i className="fas fa-user"></i>
                          </div>
                          <div>
                            <h4>{contact.name}</h4>
                            <p>{new Date(contact.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <span className={`status-badge ${contact.status}`}>
                          {contact.status}
                        </span>
                      </div>

                      <div className="card-body">
                        <div className="contact-info">
                          <p><i className="fas fa-envelope"></i> {contact.email}</p>
                          <p><i className="fas fa-tag"></i> {contact.subject}</p>
                        </div>
                        <div className="message-preview">
                          <p>{contact.message.substring(0, 100)}...</p>
                        </div>
                      </div>

                      <div className="card-footer">
                        <div className="action-buttons">
                          <button 
                            className="view-btn" 
                            title="View Message"
                            onClick={() => {
                              setSelectedContact(contact);
                              setIsContactModalOpen(true);
                            }}
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button 
                            className="mark-read-btn" 
                            title="Mark as Read"
                            onClick={() => handleMarkAsRead(contact.id)}
                          >
                            <i className="fas fa-check"></i>
                          </button>
                          <button 
                            className="delete-btn" 
                            title="Delete Message"
                            onClick={() => handleDeleteContact(contact.id)}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          </div>
        );
      case 'contact-forms':
        return (
          <div className="contacts-content">
            <div className="content-header">
              <div className="header-left">
                <h1>Contact Form Submissions</h1>
                <p>Manage contact form submissions</p>
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-box">
                <div className="stat-icon">
                  <i className="fas fa-inbox"></i>
                </div>
                <div className="stat-details">
                  <h3>Total Submissions</h3>
                  <h2>{contacts.length}</h2>
                </div>
              </div>

              <div className="stat-box">
                <div className="stat-icon">
                  <i className="fas fa-envelope"></i>
                </div>
                <div className="stat-details">
                  <h3>Unread</h3>
                  <h2>{contacts.filter(c => c.status === 'unread').length}</h2>
                </div>
              </div>

              <div className="stat-box">
                <div className="stat-icon">
                  <i className="fas fa-check-circle"></i>
                </div>
                <div className="stat-details">
                  <h3>Read</h3>
                  <h2>{contacts.filter(c => c.status === 'read').length}</h2>
                </div>
              </div>
            </div>

            <section className="contacts-section">
              <div className="contacts-header">
                <h2>All Submissions</h2>
                <div className="contacts-actions">
                  <div className="filter-buttons">
                    <button 
                      className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
                      onClick={() => setFilterStatus('all')}
                    >
                      <i className="fas fa-list"></i>
                      <span>All</span>
                    </button>
                    <button 
                      className={`filter-btn ${filterStatus === 'unread' ? 'active' : ''}`}
                      onClick={() => setFilterStatus('unread')}
                    >
                      <i className="fas fa-envelope"></i>
                      <span>Unread</span>
                    </button>
                    <button 
                      className={`filter-btn ${filterStatus === 'read' ? 'active' : ''}`}
                      onClick={() => setFilterStatus('read')}
                    >
                      <i className="fas fa-check"></i>
                      <span>Read</span>
                    </button>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Search submissions..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="messages-grid">
                {contacts
                  .filter(c => {
                    if (filterStatus === 'all') return true;
                    return c.status === filterStatus;
                  })
                  .filter(c => {
                    const searchStr = `${c.name} ${c.email} ${c.subject}`.toLowerCase();
                    return searchStr.includes(searchTerm.toLowerCase());
                  })
                  .map(contact => (
                    <div key={contact.id} className={`message-card ${contact.status}`}>
                      <div className="card-header">
                        <div className="sender-info">
                          <div className="sender-avatar">
                            <i className="fas fa-user"></i>
                          </div>
                          <div>
                            <h4>{contact.name}</h4>
                            <p>{new Date(contact.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <span className={`status-badge ${contact.status}`}>
                          {contact.status}
                        </span>
                      </div>

                      <div className="card-body">
                        <div className="contact-info">
                          <p><i className="fas fa-envelope"></i> {contact.email}</p>
                          <p><i className="fas fa-tag"></i> {contact.subject}</p>
                        </div>
                        <div className="message-preview">
                          <p>{contact.message.substring(0, 100)}...</p>
                        </div>
                      </div>

                      <div className="card-footer">
                        <div className="action-buttons">
                          <button 
                            className="view-btn" 
                            title="View Message"
                            onClick={() => {
                              setSelectedContact(contact);
                              setIsContactModalOpen(true);
                            }}
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button 
                            className="mark-read-btn" 
                            title="Mark as Read"
                            onClick={() => handleMarkAsRead(contact.id)}
                          >
                            <i className="fas fa-check"></i>
                          </button>
                          <button 
                            className="delete-btn" 
                            title="Delete Message"
                            onClick={() => handleDeleteContact(contact.id)}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          </div>
        );
      case 'settings':
        return <Settings />;
    }
  };

  return (
    <>
      <div className="admin-dashboard">
        <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <div className="admin-brand">
            <i className="fas fa-user-shield"></i>
            <span>Admin Panel</span>
          </div>
          <nav className="admin-nav">
            <a 
              href="#" 
              className={activeTab === 'dashboard' ? 'active' : ''}
              onClick={() => setActiveTab('dashboard')}
            >
              <i className="fas fa-home"></i> Dashboard
            </a>
            <a 
              href="#" 
              className={activeTab === 'blog-posts' ? 'active' : ''}
              onClick={() => setActiveTab('blog-posts')}
            >
              <i className="fas fa-blog"></i> Blog Posts
            </a>
            <a 
              href="#" 
              className={activeTab === 'donations' ? 'active' : ''}
              onClick={() => setActiveTab('donations')}
            >
              <i className="fas fa-hand-holding-heart"></i> Donations
            </a>
            <a 
              href="#" 
              className={activeTab === 'volunteers' ? 'active' : ''}
              onClick={() => setActiveTab('volunteers')}
            >
              <i className="fas fa-users"></i> Volunteers
            </a>
            <a 
              href="#" 
              className={activeTab === 'contacts' ? 'active' : ''}
              onClick={() => setActiveTab('contacts')}
            >
              <i className="fas fa-envelope"></i> Messages
            </a>
            <a 
              href="#" 
              className={activeTab === 'contact-forms' ? 'active' : ''}
              onClick={() => setActiveTab('contact-forms')}
            >
              <i className="fas fa-envelope"></i> Contact Forms
            </a>
            <a 
              href="#" 
              className={activeTab === 'settings' ? 'active' : ''}
              onClick={() => setActiveTab('settings')}
            >
              <i className="fas fa-cog"></i> Settings
            </a>
            <button onClick={handleLogout} className="logout-btn">
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          </nav>
        </aside>

        <div className="admin-content">
          <AdminHeader 
            userEmail={userEmail} 
            toggleSidebar={toggleSidebar}
          />
          
          <main className="admin-main">
            {renderContent()}
          </main>
        </div>
      </div>
      
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => {
          setIsLoginModalOpen(false);
          if (!localStorage.getItem('isLoggedIn')) {
            navigate('/');
          }
        }} 
      />

      <EventForm 
        isOpen={isEventFormOpen}
        onClose={() => setIsEventFormOpen(false)}
        onSubmit={handleAddEvent}
      />

      <EditPostForm 
        isOpen={isEditPostFormOpen}
        onClose={() => {
          setIsEditPostFormOpen(false);
          setSelectedPost(null);
        }}
        onSubmit={handleUpdatePost}
        post={selectedPost}
      />

      <DonationDetailsModal 
        isOpen={isDonationModalOpen}
        onClose={() => {
          setIsDonationModalOpen(false);
          setSelectedDonation(null);
        }}
        donation={selectedDonation}
      />

      <VolunteerDetailsModal 
        isOpen={isVolunteerModalOpen}
        onClose={() => {
          setIsVolunteerModalOpen(false);
          setSelectedVolunteer(null);
        }}
        volunteer={selectedVolunteer}
      />
    </>
  );
};

export default AdminDashboard; 