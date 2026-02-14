import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Shield, Save } from 'lucide-react';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    businesName: ''
  });

  useEffect(() => {
    const userInfo = localStorage.getItem('user');
    if (userInfo) {
      const userData = JSON.parse(userInfo);
      setUser(userData);
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        address: userData.address || '',
        city: userData.city || '',
        role: userData.role || ''
      });
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Update user data in localStorage
    const updatedUser = { ...user, ...formData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };
  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar-large">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div className="profile-header-info">
            <h1>{user.name}</h1>
            <p className="profile-role">
              <Shield size={16} />
              {user.role}
            </p>
          </div>
          <button 
            className="edit-profile-btn"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {/* Profile Content */}
        <div className="profile-content">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>
                    <User size={18} />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    <Mail size={18} />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>
                    <Phone size={18} />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label>
                    <MapPin size={18} />
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group full-width">
                  <label>
                    <MapPin size={18} />
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="save-btn">
                  <Save size={18} />
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-info">
              <div className="info-grid">
                <div className="info-item">
                  <div className="info-label">
                    <Mail size={18} />
                    Email
                  </div>
                  <div className="info-value">{user.email}</div>
                </div>

                <div className="info-item">
                  <div className="info-label">
                    <Phone size={18} />
                    Phone
                  </div>
                  <div className="info-value">{user.phone || 'Not provided'}</div>
                </div>

                <div className="info-item">
                  <div className="info-label">
                    <MapPin size={18} />
                    City
                  </div>
                  <div className="info-value">{user.city || 'Not provided'}</div>
                </div>

                <div className="info-item">
                  <div className="info-label">
                    <Shield size={18} />
                    BusinesName
                  </div>
                  <div className="info-value">{user.businesName}</div>
                </div>

                <div className="info-item full-width">
                  <div className="info-label">
                    <MapPin size={18} />
                    Address
                  </div>
                  <div className="info-value">{user.address || 'Not provided'}</div>
                </div>

                <div className="info-item full-width">
                  <div className="info-label">
                    <Calendar size={18} />
                    Member Since
                  </div>
                  <div className="info-value">{user.createdAt || 'N/A'}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;