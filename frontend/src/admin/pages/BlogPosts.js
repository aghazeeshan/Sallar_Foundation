import React, { useState, useEffect } from 'react';
import './BlogPosts.css';

const BlogPosts = () => {
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [categories, setCategories] = useState(() => {
    return JSON.parse(localStorage.getItem('categories') || '[]');
  });
  const [events, setEvents] = useState(() => {
    return JSON.parse(localStorage.getItem('events') || '[]');
  });

  const [newCategoryName, setNewCategoryName] = useState('');

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    const categorySlug = newCategoryName.toLowerCase().replace(/\s+/g, '-');
    const newCategoryObj = {
      id: Date.now(),
      name: newCategoryName,
      slug: categorySlug,
      count: 0
    };

    const updatedCategories = [...categories, newCategoryObj];
    setCategories(updatedCategories);
    localStorage.setItem('categories', JSON.stringify(updatedCategories));
    setNewCategoryName('');
  };

  const handleDeleteCategory = (categoryId) => {
    const updatedCategories = categories.filter(cat => cat.id !== categoryId);
    setCategories(updatedCategories);
    localStorage.setItem('categories', JSON.stringify(updatedCategories));
  };

  const handleDeleteEvent = (eventId) => {
    const updatedEvents = events.filter(event => event.id !== eventId);
    setEvents(updatedEvents);
    localStorage.setItem('events', JSON.stringify(updatedEvents));
  };

  const handleEditEvent = (eventId) => {
    // Implement edit functionality
  };

  const handleAddPost = async (postData) => {
    try {
      const response = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      const data = await response.json();
      if (response.ok) {
        // Handle success (e.g., show a success message)
      } else {
        // Handle error
      }
    } catch (error) {
      console.error('Error adding post:', error);
    }
  };

  return (
    <div className="blog-posts-page">
      <header className="page-header">
        <h1>Blog Posts</h1>
        <div className="page-actions">
          <button className="new-post-btn" onClick={() => setIsEventFormOpen(true)}>
            <i className="fas fa-plus"></i> New Post
          </button>
        </div>
      </header>

      <section className="new-category-section">
        <h2>Create New Category</h2>
        <form onSubmit={handleAddCategory}>
          <input
            type="text"
            placeholder="New Category Name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            required
          />
          <button type="submit">Add Category</button>
        </form>
        <div className="category-list">
          <h3>Existing Categories</h3>
          <ul>
            {categories.map(category => (
              <li key={category.id}>
                {category.name}
                <button onClick={() => handleDeleteCategory(category.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      </section>

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

      <div className="blog-management-grid">
        <section className="posts-section">
          <div className="posts-header">
            <h2>All Posts</h2>
            <div className="posts-filters">
              <select defaultValue="all">
                <option value="all">All Categories</option>
                <option value="education">Education</option>
                <option value="healthcare">Healthcare</option>
                <option value="charity">Charity</option>
              </select>
              <input type="text" placeholder="Search posts..." />
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
                {events.map(event => (
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
                        <button onClick={() => handleEditEvent(event.id)} title="Edit">
                          <i className="fas fa-edit"></i>
                        </button>
                        <button onClick={() => handleDeleteEvent(event.id)} title="Delete">
                          <i className="fas fa-trash"></i>
                        </button>
                        <button title="View">
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

        <section className="categories-section">
          <div className="categories-header">
            <h2>Categories</h2>
            <form onSubmit={handleAddCategory} className="add-category-form">
              <input
                type="text"
                placeholder="New category name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <button type="submit">
                <i className="fas fa-plus"></i> Add
              </button>
            </form>
          </div>

          <div className="categories-list">
            {categories.map(category => (
              <div key={category.id} className="category-item">
                <div className="category-info">
                  <h4>{category.name}</h4>
                  <span className="post-count">
                    {events.filter(event => event.category === category.name).length} posts
                  </span>
                </div>
                <div className="category-actions">
                  <button 
                    className="delete-btn"
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default BlogPosts; 