import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Home, 
  LogOut,
  User,
  Shield,
  Bell,
  Settings
} from 'lucide-react';
import './navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const userInfo = localStorage.getItem('user');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Don't show navbar on login, register, setpassword pages
  const publicPaths = ['/login', '/register', '/setpassword'];
  if (publicPaths.some(path => location.pathname.startsWith(path))) {
    return null;
  }

  // Don't show navbar if not logged in
  if (!user) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo/Brand */}
        <div className="navbar-brand">
          <Link to={user?.role === 'admin' || user?.role === 'Admin' ? '/admin' : '/dashboard'} className="brand-link">
            <div className="brand-logo">
              <Shield size={28} />
            </div>
            <div className="brand-text">
              <h1>BAR ASSOCIATION</h1>
              <p>Pakistan Tax Bar Association</p>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation - Only Dashboard */}
        <div className="navbar-menu desktop-menu">
          <Link 
            to={user?.role === 'admin' || user?.role === 'Admin' ? '/admin' : '/dashboard'} 
            className={`nav-link ${isActive(user?.role === 'admin' || user?.role === 'Admin' ? '/admin' : '/dashboard') ? 'active' : ''}`}
          >
            <Home size={20} />
            <span>Dashboard</span>
          </Link>
        </div>

        {/* User Profile & Actions */}
        <div className="navbar-actions">
          <button className="notification-btn">
            <Bell size={20} />
            <span className="notification-badge">3</span>
          </button>

          <div className="user-profile-dropdown" ref={dropdownRef}>
            <button 
              className="user-profile-btn"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <div className="user-avatar">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="user-info">
                <span className="user-name">{user?.name}</span>
                <span className="user-role">{user?.role}</span>
              </div>
            </button>

            {showProfileMenu && (
              <div className="profile-dropdown-menu">
                <div className="dropdown-header">
                  <div className="user-avatar-large">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="dropdown-name">{user?.name}</p>
                    <p className="dropdown-email">{user?.email}</p>
                  </div>
                </div>
                <div className="dropdown-divider"></div>
                <Link to="/profile" className="dropdown-item" onClick={() => setShowProfileMenu(false)}>
                  <User size={18} />
                  <span>My Profile</span>
                </Link>
                <Link to="/settings" className="dropdown-item" onClick={() => setShowProfileMenu(false)}>
                  <Settings size={18} />
                  <span>Settings</span>
                </Link>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item logout" onClick={handleLogout}>
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="mobile-menu-toggle" onClick={toggleMenu}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="mobile-menu">
          <Link 
            to={user?.role === 'admin' || user?.role === 'Admin' ? '/admin' : '/dashboard'} 
            className={`mobile-nav-link ${isActive(user?.role === 'admin' || user?.role === 'Admin' ? '/admin' : '/dashboard') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            <Home size={20} />
            <span>Dashboard</span>
          </Link>
          
          <div className="mobile-menu-divider"></div>
          
          <Link 
            to="/profile" 
            className="mobile-nav-link"
            onClick={closeMenu}
          >
            <User size={20} />
            <span>My Profile</span>
          </Link>
          <Link 
            to="/settings" 
            className="mobile-nav-link"
            onClick={closeMenu}
          >
            <Settings size={20} />
            <span>Settings</span>
          </Link>
          
          <button className="mobile-nav-link logout" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;