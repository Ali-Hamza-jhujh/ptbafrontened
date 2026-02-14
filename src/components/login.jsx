import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./login.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    cnic: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log(process.env.REACT_APP_FRONTENED_URL);
      const response = await axios.post(
        `${process.env.REACT_APP_FRONTENED_URL}/api/user/login`,
        formData,
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Redirect based on role
      if (
        response.data.user.role === "admin" ||
        response.data.user.role === "Admin"
      ) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Left Purple Sidebar */}
      <div className="login-sidebar">
        <div className="sidebar-content">
          <div className="sidebar-header">
            <h1 className="sidebar-title">BAR ASSOCIATION</h1>
            <p className="sidebar-subtitle">Pakistan Tax Bar Association</p>
          </div>
          <div className="sidebar-footer">
            <p className="sidebar-tagline"></p>
          </div>
        </div>
      </div>

      {/* Right Content Area */}
      <div className="login-content">
        <div className="login-form-container">
          {/* Login Card */}
          <div className="login-card">
            <h2 className="form-title">LOGIN HERE</h2>
            <div className="title-underline"></div>
            <p className="form-subtitle">Enter credentials</p>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">CNIC</label>
                <input
                  type="text"
                  name="cnic"
                  placeholder="xxxxx-xxxxxxx-x"
                  value={formData.cnic}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <button type="submit" disabled={loading} className="btn-login">
                {loading ? "Logging in..." : "login"}
              </button>
            </form>

            <p className="register-link">
              Don't have an account?
              <Link to="/register" className="link">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;