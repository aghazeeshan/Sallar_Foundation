import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import BlogSidebar from '../components/BlogSidebar';
import './BlogDetails.css';

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    // Get all events from localStorage
    const allEvents = JSON.parse(localStorage.getItem('events') || '[]');
    
    // Find the current event
    const currentEvent = allEvents.find(e => e.id === parseInt(id));
    
    if (!currentEvent) {
      navigate('/events');
      return;
    }

    setEvent(currentEvent);

    // Find related posts from the same category
    const related = allEvents
      .filter(e => e.category === currentEvent.category && e.id !== currentEvent.id)
      .slice(0, 3); // Get only 3 related posts
    
    setRelatedPosts(related);
  }, [id, navigate]);

  if (!event) return null;

  return (
    <div className="blog-details-page">
      <Breadcrumb tag={event.category} title={event.title} />

      <section className="blog-details-section">
        <div className="container">
          <div className="blog-details-layout">
            <div className="blog-details-main">
              <div className="blog-header">
                <div className="blog-meta">
                  <span className="date">
                    <i className="fas fa-calendar"></i> {event.date}
                  </span>
                  <span className="category">
                    <i className="fas fa-folder"></i> {event.category}
                  </span>
                  <span className="author">
                    <i className="fas fa-user"></i> {event.author}
                  </span>
                </div>
              </div>

              <div className="blog-hero">
                <div className="blog-image">
                  <img src={event.detailsImage || event.image} alt={event.title} />
                </div>
                <h1 className="blog-title">{event.title}</h1>
              </div>

              <div className="blog-content">
                <div className="blog-text">
                  {event.content.split('\n\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>

                {event.highlights && event.highlights.length > 0 && (
                  <div className="blog-highlights">
                    <h3>Key Highlights</h3>
                    <ul>
                      {event.highlights.map((highlight, index) => (
                        <li key={index}>
                          <i className="fas fa-check-circle"></i>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Gallery Section if there are additional images */}
                {event.galleryImages && event.galleryImages.length > 1 && (
                  <div className="blog-gallery">
                    <h3>Event Gallery</h3>
                    <div className="gallery-grid">
                      {event.galleryImages.map((img, index) => (
                        <div key={index} className="gallery-item">
                          <img src={img} alt={`${event.title} - ${index + 1}`} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Related Posts
                {relatedPosts.length > 0 && (
                  <div className="related-posts">
                    <h3>Related Posts</h3>
                    <div className="related-posts-grid">
                      {relatedPosts.map(post => (
                        <div 
                          key={post.id} 
                          className="related-post-card"
                          onClick={() => navigate(`/blog/${post.id}`)}
                        >
                          <div className="related-post-image">
                            <img src={post.image} alt={post.title} />
                          </div>
                          <div className="related-post-content">
                            <h4>{post.title}</h4>
                            <span className="date">
                              <i className="far fa-calendar"></i> {post.date}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )} */}

                <div className="blog-footer">
                  <div className="blog-tags">
                    <h3>Tags</h3>
                    <div className="tags-list">
                      {event.tags.map((tag, index) => (
                        <span key={index} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="share-section">
                    <h3>Share This Event</h3>
                    <div className="social-share">
                      <a href="#" className="share-btn facebook">
                        <i className="fab fa-facebook-f"></i>
                      </a>
                      <a href="#" className="share-btn twitter">
                        <i className="fab fa-twitter"></i>
                      </a>
                      <a href="#" className="share-btn linkedin">
                        <i className="fab fa-linkedin-in"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <BlogSidebar 
              categories={JSON.parse(localStorage.getItem('categories') || '[]')}
              searchTerm=""
              setSearchTerm={() => {}}
              selectedCategory="all"
              setSelectedCategory={() => {}}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogDetails; 