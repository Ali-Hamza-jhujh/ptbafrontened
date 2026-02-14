import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './setpassword.css';

const SetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    password: '',
    newpassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (!tokenFromUrl) {
      setError('Invalid or missing token. Please use the link from your email.');
    } else {
      setToken(tokenFromUrl);
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.newpassword) {
      setError('Passwords do not match!');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_FRONTENED_URL}/api/user/setpassword?token=${token}`,
        {
          password: formData.password,
          newpassword: formData.newpassword
        }
      );
      
      setSuccess(response.data.message);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to set password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="setpassword-container">
      {/* Left Purple Sidebar */}
      <div className="setpassword-sidebar">
        <div className="sidebar-content">
          <div className="sidebar-header">
            <h1 className="sidebar-title">PTBA</h1>
            <p className="sidebar-subtitle">Pakistan Tax Bar Association</p>
          </div>
          <div className="sidebar-footer">
            <p className="sidebar-tagline">TAG LINE OR LOGO</p>
          </div>
        </div>
      </div>

      {/* Right Content Area */}
      <div className="setpassword-content">
        <div className="setpassword-form-container">
          {/* SetPassword Card */}
          <div className="setpassword-card">
            <h2 className="form-title">SET PASSWORD</h2>
            <div className="title-underline"></div>
            <p className="form-subtitle">Create your account password</p>

            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}

            {success && (
              <div className="alert alert-success">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter new password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  required
                  minLength="6"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  name="newpassword"
                  placeholder="Confirm new password"
                  value={formData.newpassword}
                  onChange={handleChange}
                  className="form-input"
                  required
                  minLength="6"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !token}
                className="btn-setpassword"
              >
                {loading ? 'Setting Password...' : 'Set Password'}
              </button>
            </form>

            <p className="login-link">
              Already have a password?
              <a href="/login" className="link">Login here</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetPassword;