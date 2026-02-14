import React, { useState } from 'react';
import './home.css';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const stats = [
    { number: '500+', label: 'Active Members' },
    { number: '1000+', label: 'Cases Handled' },
    { number: '25+', label: 'Years of Service' },
    { number: '50+', label: 'Legal Events' }
  ];

  const services = [
    {
      icon: '⚖️',
      title: 'Legal Representation',
      description: 'Professional tax law representation for individuals and businesses across Pakistan.'
    },
    {
      icon: '📄',
      title: 'Case Management',
      description: 'Comprehensive case tracking and management system for all members.'
    },
    {
      icon: '👥',
      title: 'Member Support',
      description: 'Dedicated support and resources for all BAR ASSOCIATION members and their clients.'
    },
    {
      icon: '📅',
      title: 'Events & Training',
      description: 'Regular seminars, workshops, and networking events for professional development.'
    }
  ];

  return (
    <div>
      {/* Navigation */}
      <nav className="homepage-nav">
        <div className="nav-container">
          {/* Logo */}
          <a href="/" className="nav-logo">
            <div className="logo-icon">BA</div>
            <div className="logo-text">
              <h1>BAR ASSOCIATION</h1>
              <p>Pakistan Tax Bar Association</p>
            </div>
          </a>
          
          {/* Desktop Menu */}
          <ul className="nav-menu">
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><a href="/login" className="nav-login-btn">Login</a></li>
          </ul>

          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <ul className="mobile-menu-list">
            <li><a href="#home" onClick={() => setMobileMenuOpen(false)}>Home</a></li>
            <li><a href="#about" onClick={() => setMobileMenuOpen(false)}>About</a></li>
            <li><a href="#services" onClick={() => setMobileMenuOpen(false)}>Services</a></li>
            <li><a href="#contact" onClick={() => setMobileMenuOpen(false)}>Contact</a></li>
            <li><a href="/login" className="nav-login-btn">Login</a></li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1>Pakistan Tax Bar Association</h1>
            <p>
              Professional legal representation and support for tax law practitioners across Pakistan. 
              Join our community of dedicated professionals.
            </p>
            <div className="hero-buttons">
              <a href="/register" className="btn-primary">Become a Member</a>
              <a href="#services" className="btn-secondary">Learn More</a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="about-container">
          <h2 className="section-title">About BAR ASSOCIATION</h2>
          <div className="title-underline"></div>
          <p className="section-description">
            The Pakistan Tax Bar Association is a premier organization dedicated to supporting 
            tax law professionals across the country with comprehensive resources, training, 
            and advocacy. We empower our members to excel in their practice and serve their 
            clients with the highest standards of professionalism.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services-section">
        <div className="services-container">
          <div style={{ textAlign: 'center' }}>
            <h2 className="section-title">Our Services</h2>
            <div className="title-underline"></div>
          </div>

          <div className="services-grid">
            {services.map((service, index) => (
              <div key={index} className="service-card">
                <div className="service-icon">
                  <span style={{ fontSize: '2rem' }}>{service.icon}</span>
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2>Ready to Join BAR ASSOCIATION?</h2>
          <p>
            Become part of Pakistan's leading tax law professional community today.
          </p>
          <div className="cta-buttons">
            <a href="/register" className="btn-primary">Register Now</a>
            <a href="/login" className="btn-secondary">Member Login</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="footer">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-section">
              <h3>BAR ASSOCIATION</h3>
              <p>
                Pakistan Tax Bar Association - Supporting tax law professionals across Pakistan.
              </p>
            </div>
            
            <div className="footer-section">
              <h3>Quick Links</h3>
              <ul className="footer-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="/login">Login</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h3>Contact</h3>
              <div className="footer-contact">
                <p>Email: info@ptba.org.pk</p>
                <p>Phone: +92 XXX XXXXXXX</p>
                <p>Address: Pakistan</p>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2026 Pakistan Tax Bar Association. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}