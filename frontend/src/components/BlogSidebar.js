import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './BlogSidebar.css';

const BlogSidebar = ({ categories, latestBlogs, ...props }) => {
  const [sidebarEvents, setSidebarEvents] = useState([]);

  useEffect(() => {
    const allEvents = JSON.parse(localStorage.getItem('events') || '[]');
    const latestEvents = allEvents
      .filter(event => event.isLatest)
      .slice(0, 5); // Limit to 5 latest posts
    setSidebarEvents(latestEvents);
  }, []);

  return (
    <div className="blog-sidebar">
      {/* Search Box */}
      <div className="sidebar-widget search-widget">
        <h3>Search Blogs</h3>
        <div className="search-box">
          <input 
            type="text"
            placeholder="Search blogs..."
            value={props.searchTerm}
            onChange={(e) => props.setSearchTerm(e.target.value)}
          />
          <button>
            <i className="fas fa-search"></i>
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="sidebar-widget categories-widget">
        <h3>Categories</h3>
        <ul className="categories-list">
          <li 
            className={props.selectedCategory === 'all' ? 'active' : ''}
            onClick={() => props.setSelectedCategory('all')}
          >
            All Categories
          </li>
          {categories.map(category => (
            <li 
              key={category.id}
              className={props.selectedCategory === category.id ? 'active' : ''}
              onClick={() => props.setSelectedCategory(category.id)}
            >
              {category.name}
              <span>({category.count})</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Latest Posts */}
      <div className="sidebar-widget latest-posts-widget">
        <h3>Latest Posts</h3>
        <div className="latest-posts">
          {sidebarEvents.map(event => (
            <Link to={`/blog/${event.id}`} key={event.id} className="latest-post-item">
              <div className="post-image">
                <img src={event.image} alt={event.title} />
              </div>
              <div className="post-info">
                <h4>{event.title}</h4>
                <span className="post-date">
                  <i className="far fa-calendar"></i> {event.date}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogSidebar; 