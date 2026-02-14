import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    businesName: '',
    businessAddress: '',
    phone: '',
    cnic: '',
    qualification: '',
    city: '',
    barRegister: '',
    isMemberOfBar: 'No'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (!formData.name || !formData.email || !formData.businesName || 
          !formData.businessAddress || !formData.phone || !formData.cnic) {
        setError('Please fill all required fields');
        return;
      }
    }
    setError('');
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setError('');
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      console.log(process.env.REACT_APP_FRONTENED_URL)
      const response = await axios.post(`${process.env.REACT_APP_FRONTENED_URL}/api/user/register`, formData);
      setSuccess(response.data.message);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      {/* Left Purple Sidebar */}
      <div className="register-sidebar">
        <div className="sidebar-content">
          <div className="sidebar-header">
            <h1 className="sidebar-title">BAR ASSOCIATION</h1>
            <p className="sidebar-subtitle">Pakistan Tax Bar Association</p>
          </div>
          <div className="sidebar-footer">
            <p className="sidebar-tagline">Professional Excellence in Tax Law</p>
          </div>
        </div>
      </div>

      {/* Right Content Area */}
      <div className="register-content">
        <div className="register-form-container">
          {/* Note */}
          <div className="register-note">
            <p>NOTE: "Your registration request will be reviewed by the administrator. You will be notified via email once it has been approved."</p>
          </div>

          {/* Form Card */}
          <div className="register-card">
            <h2 className="form-title">REGISTER</h2>
            <div className="title-underline"></div>
            <p className="form-subtitle">Enter your details</p>

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
              {/* Step 1 */}
              {currentStep === 1 && (
                <div className="form-step">
                  <div className="form-row">
                    <input
                      type="text"
                      name="name"
                      placeholder="Name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-row">
                    <input
                      type="text"
                      name="businesName"
                      placeholder="Business name"
                      value={formData.businesName}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                    <input
                      type="text"
                      name="businessAddress"
                      placeholder="Business address"
                      value={formData.businessAddress}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-row">
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone number"
                      value={formData.phone}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                    <input
                      type="text"
                      name="cnic"
                      placeholder="CNIC"
                      value={formData.cnic}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Step 2 */}
              {currentStep === 2 && (
                <div className="form-step">
                  <div className="form-row-single">
                    <input
                      type="text"
                      name="qualification"
                      placeholder="Qualification (optional)"
                      value={formData.qualification}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-row-single">
                    <div className="select-wrapper">
                      <label>Are member of a bar association?</label>
                      <select
                        name="isMemberOfBar"
                        value={formData.isMemberOfBar}
                        onChange={handleChange}
                        className="form-select"
                      >
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleChange}
                      className="form-input"
                    />
                    <input
                      type="text"
                      name="barRegister"
                      placeholder="Bar registration number"
                      value={formData.barRegister}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                </div>
              )}

              {/* Step 3 */}
              {currentStep === 3 && (
                <div className="form-step">
                  <div className="file-upload-section">
                    <label className="file-label">CNIC/Bar certificate</label>
                    <div className="file-input-wrapper">
                      <input type="file" accept="image/*,.pdf" className="file-input-hidden" id="cnic-upload" />
                      <label htmlFor="cnic-upload" className="file-input-label">
                        Upload image
                      </label>
                    </div>
                  </div>

                  <div className="file-upload-section">
                    <label className="file-label">Profile photo</label>
                    <div className="file-input-wrapper">
                      <input type="file" accept="image/*" className="file-input-hidden" id="photo-upload" />
                      <label htmlFor="photo-upload" className="file-input-label">
                        Upload image
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="form-navigation">
                {currentStep < 3 && (
                  <button type="button" onClick={nextStep} className="btn-primary">
                    NEXT
                  </button>
                )}

                {currentStep === 3 && (
                  <button type="submit" disabled={loading} className="btn-primary">
                    {loading ? 'Submitting...' : 'Submit'}
                  </button>
                )}

                {/* Step Indicators */}
                <div className="step-indicators">
                  <div className={`step-dot ${currentStep === 1 ? 'active' : ''}`}></div>
                  <div className={`step-dot ${currentStep === 2 ? 'active' : ''}`}></div>
                  <div className={`step-dot ${currentStep === 3 ? 'active' : ''}`}></div>
                </div>

                {currentStep > 1 && (
                  <button type="button" onClick={prevStep} className="btn-back">
                    ← Back
                  </button>
                )}
              </div>
            </form>
            <p className="register-link">
              Already have an account?
              <Link to="/login" className="link">
                login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;