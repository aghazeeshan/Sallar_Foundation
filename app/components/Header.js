import React, { useState } from 'react';
import './Header.css';
import { Link } from 'react-router-dom';

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
    };

    return (
        <header className="header">
            <div className="header-content">
                <div className="logo">
                    <Link to="/">Sallar Foundation</Link>
                </div>
                <button className="menu-button" onClick={toggleMenu}>
                    ☰
                </button>
            </div>
            <div className={`off-canvas-menu ${isMenuOpen ? 'open' : ''}`}>
                <nav>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/about">About</Link></li>
                        <li><Link to="/services">Services</Link></li>
                        <li><Link to="/events">Events</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default Header; 