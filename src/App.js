import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Causes from './pages/Causes';
import Donate from './pages/Donate';
import Events from './pages/Events';
import Contact from './pages/Contact';
import Volunteer from './pages/Volunteer';
import Gallery from './pages/Gallery';
import BlogDetails from './pages/BlogDetails';
import AdminDashboard from './admin/AdminDashboard';
import CategoryPage from './pages/CategoryPage';
import BlogPosts from './admin/pages/BlogPosts';
import './App.css';
import './styles/global.css';
import Footer from './components/Footer';

function App() {
  const [isAdminMode, setIsAdminMode] = useState(false);

  useEffect(() => {
    const path = window.location.pathname;
    setIsAdminMode(path.includes('/admin'));

    if (path.includes('/admin')) {
      document.body.classList.add('admin-mode');
    } else {
      document.body.classList.remove('admin-mode');
    }
  }, []);

  return (
    <Router>
      <div className={`App ${isAdminMode ? 'admin-mode' : ''}`}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/causes" element={<Causes />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/events" element={<Events />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/volunteer" element={<Volunteer />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/blog/:id" element={<BlogDetails />} />
          <Route path="/admin/dashboard" element={<AdminDashboard setIsAdminMode={setIsAdminMode} />} />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route path="/admin/blog-posts" element={<BlogPosts />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App; 