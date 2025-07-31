import React from 'react';
import { Link } from 'react-router-dom';
import './Breadcrumb.css';

const Breadcrumb = ({ tag, title }) => {
  const breadcrumbStyle = {
    background: `linear-gradient(rgb(1 110 92 / 90%), rgb(1 110 92 / 81%)), url(${process.env.PUBLIC_URL + '/images/bg.jpg'})`,
      backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <div className="page-header" style={breadcrumbStyle}>
      <div className="container">
        <span className="section-tag">{tag}</span>
        <h1 className="page-title">{title}</h1>
        <div className="breadcrumb-nav">
          <Link to="/">Home</Link>
          <span className="separator">→</span>
          <span className="current">{title}</span>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb; 