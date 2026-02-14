import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { lazy ,Suspense} from 'react';
import Navbar from './components/navbar';
import './App.css';
import ProtectedRoute from './components/protectedroute';
const Home=lazy(()=>import('./components/home.jsx'));
const Register=lazy(()=>import('./components/register.jsx'));
const Login=lazy(()=>import('./components/login.jsx'));
const SetPassword=lazy(()=>import('./components/setpassword.jsx'));
const AdminDashboard=lazy(()=>import('./components/Admindasboard.jsx'));
const MemberDashboard=lazy(()=>import('./components/dashboard.jsx'));
const Profile=lazy(()=>import('./components/profile.jsx'));
const Settings=lazy(()=>import('./components/setting.jsx'));

const Loading = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '1.2rem',
    color: '#667eea'
    
  }}>
    
    <div className="loading-spinner">Loading...</div>
  </div>
);
function App() {
  return (
    <Router>
      <Suspense fallback={<Loading />}>
      <div className="app">
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/setpassword" element={<SetPassword />} />

          {/* Admin Routes - Only admins can access */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Member Routes - Only members can access */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute memberOnly={true}>
                <MemberDashboard />
              </ProtectedRoute>
            }
          />

          {/* Profile and Settings Routes - Both admins and members can access */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* Default Redirect */}
          <Route path="/" element={<Home/>} />

          {/* 404 - Not Found */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
      </Suspense>
    </Router>
  );
}

export default App;