import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import BlogSidebar from '../components/BlogSidebar';
import './CategoryPage.css';

const CategoryPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryId);
  const eventsPerPage = 9;

  useEffect(() => {
    const allEvents = JSON.parse(localStorage.getItem('events') || '[]');
    const categoryEvents = allEvents.filter(
      event => event.category.toLowerCase() === categoryId.toLowerCase()
    );
    setEvents(categoryEvents);
  }, [categoryId]);

  // Get categories from localStorage
  const categories = JSON.parse(localStorage.getItem('categories') || '[]');

  // Pagination logic
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(events.length / eventsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="category-page">
      <Breadcrumb title={`Category: ${categoryId}`} />
      
      <section className="category-section">
        <div className="container">
          <div className="category-layout">
            <div className="category-main">
              <div className="category-grid">
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
                          <span>
                            <i className="far fa-calendar"></i> {event.date}
                          </span>
                          <span>
                            <i className="fas fa-tag"></i> {event.category}
                          </span>
                        </div>
                        <h3>{event.title}</h3>
                        <p className="event-description">{event.description}</p>
                        <span className="read-more">
                          Read More <i className="fas fa-arrow-right"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

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

            <BlogSidebar 
              categories={categories}
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

export default CategoryPage; 