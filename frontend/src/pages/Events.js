import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import BlogSidebar from '../components/BlogSidebar';
import './Events.css';

const Events = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const eventsPerPage = 9;
  const navigate = useNavigate();
  
  // Get events from localStorage
  const [events, setEvents] = useState(() => {
    const savedEvents = localStorage.getItem('events');
    return savedEvents ? JSON.parse(savedEvents) : [
      // Default events if localStorage is empty
      {
        id: 1,
        title: "Every Contribution Counts: Make a Difference",
        date: "March 24, 2024",
        category: "Education",
        image: "/images/img1.jpg",
        description: "Supporting education initiatives for underprivileged children worldwide."
      },
      {
        id: 2,
        title: "Healthcare for All: Community Support",
        date: "March 28, 2024",
        category: "Healthcare",
        image: "/images/img2.jpg",
        description: "Providing essential healthcare services to communities in need."
      }
    ];
  });

  // Categories data
  const categories = [
    { id: 'education', name: 'Education', count: 5 },
    { id: 'healthcare', name: 'Healthcare', count: 3 },
    { id: 'charity', name: 'Charity', count: 4 },
    { id: 'environment', name: 'Environment', count: 2 },
  ];

  // Latest blogs data
  const latestBlogs = [
    {
      id: 1,
      title: "Recent Education Initiative Success",
      date: "March 24, 2024",
      image: "/images/img1.jpg"
    },
    // Add more latest blogs...
  ];

  // Filter events based on search and category
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || event.category.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination logic
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  // Pagination handler
  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Update the event card description style
  const descriptionStyle = {
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  };

  return (
    <div className="events-page">
      <Breadcrumb title="Events & Blog" />

      <section className="events-section">
        <div className="container">
          <div className="events-layout">
            {/* Main Content */}
            <div className="events-main">
              <div className="events-grid">
                {currentEvents.map(event => (
                  <div 
                    className="event-card" 
                    key={event.id}
                    onClick={() => navigate(`/blog/${event.id}`)}
                  >
                    <div className="event-image">
                      <img src={event.image} alt={event.title} />
                      <div className="event-overlay">
                        <div className="event-meta">
                          <span className="event-date">
                            <i className="far fa-calendar"></i> {event.date}
                          </span>
                          <span className="event-category">
                            <i className="fas fa-tag"></i> {event.category}
                          </span>
                        </div>
                        <h3>{event.title}</h3>
                        {/* <p style={descriptionStyle}>{event.description}</p> */}
                        <span className="read-more">
                          Read More <i className="fas fa-arrow-right"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button 
                    className={`page-btn ${currentPage === 1 ? 'disabled' : ''}`}
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <i className="fas fa-chevron-left"></i> Previous
                  </button>
                  
                  <div className="page-numbers">
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index + 1}
                        className={`page-number ${currentPage === index + 1 ? 'active' : ''}`}
                        onClick={() => paginate(index + 1)}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>

                  <button 
                    className={`page-btn ${currentPage === totalPages ? 'disabled' : ''}`}
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <BlogSidebar 
              categories={categories}
              latestBlogs={latestBlogs}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Events; 