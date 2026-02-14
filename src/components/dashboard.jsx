import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Calendar as CalendarIcon, 
  List, 
  Filter,
  Search,
  Edit,
  Trash2,
  Eye,
  Clock,
  TrendingUp,
  FileText,
  Bell,
  ChevronLeft,
  ChevronRight,
  X,
  Users,
  Settings,
  LogOut,
  BarChart3,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import axios from 'axios';
import Alert from './alert';
import './dashboard.css';
export default function AdminDashboard() {
  const [activeView, setActiveView] = useState('overview');
  const [calendarView, setCalendarView] = useState('monthly'); // 'today', 'weekly', 'monthly'
  const [cases, setCases] = useState([]);
  const [hearings, setHearings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddCaseModal, setShowAddCaseModal] = useState(false);
  const [showAddHearingModal, setShowAddHearingModal] = useState(false);
  const [showEditCaseModal, setShowEditCaseModal] = useState(false);
  const [showEditHearingModal, setShowEditHearingModal] = useState(false);
  const [showViewCaseModal, setShowViewCaseModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [selectedHearing, setSelectedHearing] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const casesPerPage = 10;
  
    
const [userInfo, setUserInfo] = useState({
    name:  localStorage.getItem('userName'),
    email: localStorage.getItem('userEmail')
  });
  // Calendar state
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [currentWeekStart, setCurrentWeekStart] = useState(getWeekStart(new Date()));

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Form states for new case
  const [newCase, setNewCase] = useState({
    caseid: '',
    partyname: '',
    taxyear: '',
    noticesection: '',
    authority: '',
    remarks: '',
    dateofnoticeissue: '',
    dateofcomplaince: '',
    status: 'Open'
  });

  // Form states for editing case
  const [editCase, setEditCase] = useState({
    caseid: '',
    partyname: '',
    taxyear: '',
    noticesection: '',
    authority: '',
    remarks: '',
    dateofnoticeissue: '',
    dateofcomplaince: '',
    status: 'Open'
  });

  // Form states for new hearing
  const [newHearing, setNewHearing] = useState({
    hearingdate: '',
    hearingremarks: '',
    caseId: ''
  });

  // Form states for editing hearing
  const [editHearing, setEditHearing] = useState({
    hearingdate: '',
    hearingremarks: '',
    caseId: ''
  });

  useEffect(() => {
    fetchData();
     const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
    console.log("Dashboard",process.env.REACT_APP_FRONTENED_URL)
      const [casesRes, hearingsRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_FRONTENED_URL}/api/case/getcases`, config),
        axios.get(`${process.env.REACT_APP_FRONTENED_URL}/api/case/gethearings`, config)
      ]);

      setCases(casesRes.data.data || []);
      setHearings(hearingsRes.data.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      showNotification('Error loading dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Helper function to get week start
  function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  }

  // Helper function to format date
  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Get hearings for a specific date
  const getHearingsForDate = (dateStr) => {
    return hearings.filter(h => {
      const hearingDate = new Date(h.hearingdate);
      return formatDate(hearingDate) === dateStr;
    });
  };

  // Get hearings for today
  const getTodayHearings = () => {
    const today = formatDate(new Date());
    return getHearingsForDate(today).sort((a, b) => 
      new Date(a.hearingdate) - new Date(b.hearingdate)
    );
  };

  const handleAddCase = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.REACT_APP_FRONTENED_URL}/api/case/addcase`,
        newCase,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      showNotification('Case added successfully!', 'success');
      setShowAddCaseModal(false);
      setNewCase({
        caseid: '',
        partyname: '',
        taxyear: '',
        noticesection: '',
        authority: '',
        remarks: '',
        dateofnoticeissue: '',
        dateofcomplaince: '',
        status: 'Open'
      });
      fetchData();
    } catch (error) {
      showNotification(error.response?.data?.message || 'Error adding case', 'error');
    }
  };

  const handleEditCase = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${process.env.REACT_APP_FRONTENED_URL}/api/case/updatecase/${selectedCase._id}`,
        editCase,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      showNotification('Case updated successfully!', 'success');
      setShowEditCaseModal(false);
      setSelectedCase(null);
      fetchData();
    } catch (error) {
      showNotification(error.response?.data?.message || 'Error updating case', 'error');
    }
  };

  const handleDeleteCase = async (caseId) => {
    if (!window.confirm('Are you sure you want to delete this case? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${process.env.REACT_APP_FRONTENED_URL}/api/case/deletecase/${caseId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      showNotification('Case deleted successfully!', 'success');
      fetchData();
    } catch (error) {
      showNotification(error.response?.data?.message || 'Error deleting case', 'error');
    }
  };

  const handleAddHearing = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.REACT_APP_FRONTENED_URL}/api/case/hearings`,
        newHearing,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      showNotification('Hearing added successfully!', 'success');
      setShowAddHearingModal(false);
      setNewHearing({
        hearingdate: '',
        hearingremarks: '',
        caseId: ''
      });
      fetchData();
    } catch (error) {
      showNotification(error.response?.data?.message || 'Error adding hearing', 'error');
    }
  };

  const handleEditHearing = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${process.env.REACT_APP_FRONTENED_URL}/api/case/updatehearing/${selectedHearing._id}`,
        editHearing,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      showNotification('Hearing updated successfully!', 'success');
      setShowEditHearingModal(false);
      setSelectedHearing(null);
      fetchData();
    } catch (error) {
      showNotification(error.response?.data?.message || 'Error updating hearing', 'error');
    }
  };

  const handleDeleteHearing = async (hearingId) => {
    if (!window.confirm('Are you sure you want to delete this hearing?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${process.env.REACT_APP_FRONTENED_URL}/api/case/deletehearing/${hearingId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      showNotification('Hearing deleted successfully!', 'success');
      fetchData();
    } catch (error) {
      showNotification(error.response?.data?.message || 'Error deleting hearing', 'error');
    }
  };

  const openEditCaseModal = (caseItem) => {
    setSelectedCase(caseItem);
    setEditCase({
      caseid: caseItem.caseid,
      partyname: caseItem.partyname,
      taxyear: caseItem.taxyear,
      noticesection: caseItem.noticesection,
      authority: caseItem.authority,
      remarks: caseItem.remarks,
      dateofnoticeissue: caseItem.dateofnoticeissue.split('T')[0],
      dateofcomplaince: caseItem.dateofcomplaince.split('T')[0],
      status: caseItem.status
    });
    setShowEditCaseModal(true);
  };

  const openEditHearingModal = (hearing) => {
    setSelectedHearing(hearing);
    const hearingDateTime = new Date(hearing.hearingdate);
    const formattedDateTime = hearingDateTime.toISOString().slice(0, 16);
    
    setEditHearing({
      hearingdate: formattedDateTime,
      hearingremarks: hearing.hearingremarks,
      caseId: hearing.case?._id || hearing.caseId
    });
    setShowEditHearingModal(true);
  };

  const openViewCaseModal = (caseItem) => {
    setSelectedCase(caseItem);
    setShowViewCaseModal(true);
  };

  // Stats calculations
  const stats = {
    totalCases: cases.length,
    activeCases: cases.filter(c => c.status !== 'Closed').length,
    upcomingHearings: hearings.filter(h => new Date(h.hearingdate) > new Date()).length,
    closedCases: cases.filter(c => c.status === 'Closed').length
  };

  // Get upcoming hearings (next 30 days)
  const getUpcomingHearings = (days = 30) => {
    const now = new Date();
    const future = new Date();
    future.setDate(now.getDate() + days);
    
    return hearings
      .filter(h => {
        const hearingDate = new Date(h.hearingdate);
        return hearingDate >= now && hearingDate <= future;
      })
      .sort((a, b) => new Date(a.hearingdate) - new Date(b.hearingdate))
      .slice(0, 5);
  };

  // Filter and search cases
  const filteredCases = cases.filter(c => {
    const matchesSearch = c.partyname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.caseid.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const indexOfLastCase = currentPage * casesPerPage;
  const indexOfFirstCase = indexOfLastCase - casesPerPage;
  const currentCases = filteredCases.slice(indexOfFirstCase, indexOfLastCase);
  const totalPages = Math.ceil(filteredCases.length / casesPerPage);

  // Calendar rendering functions
  const renderMonthlyCalendar = () => {
    const firstDay = new Date(calendarYear, calendarMonth, 1).getDay();
    const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(calendarYear, calendarMonth, 0).getDate();
    
    const calendarDays = [];
    
    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const date = new Date(calendarYear, calendarMonth - 1, day);
      calendarDays.push({ day, date, isOtherMonth: true });
    }
    
    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(calendarYear, calendarMonth, day);
      calendarDays.push({ day, date, isOtherMonth: false });
    }
    
    // Next month days
    const remainingCells = 42 - calendarDays.length;
    for (let day = 1; day <= remainingCells; day++) {
      const date = new Date(calendarYear, calendarMonth + 1, day);
      calendarDays.push({ day, date, isOtherMonth: true });
    }
    
    return (
      <div className="calendar-view-container">
        <div className="calendar-header-controls">
          <div className="calendar-nav">
            <button onClick={() => {
              if (calendarMonth === 0) {
                setCalendarMonth(11);
                setCalendarYear(calendarYear - 1);
              } else {
                setCalendarMonth(calendarMonth - 1);
              }
            }} className="btn-calendar-nav">
              <ChevronLeft size={20} />
            </button>
            <h3>{months[calendarMonth]} {calendarYear}</h3>
            <button onClick={() => {
              if (calendarMonth === 11) {
                setCalendarMonth(0);
                setCalendarYear(calendarYear + 1);
              } else {
                setCalendarMonth(calendarMonth + 1);
              }
            }} className="btn-calendar-nav">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="calendar-grid-new">
          {/* Day headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="calendar-day-header-new">
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {calendarDays.map((dayInfo, index) => {
            const dateStr = formatDate(dayInfo.date);
            const dayHearings = getHearingsForDate(dateStr);
            const isToday = formatDate(new Date()) === dateStr;
            
            return (
              <div 
                key={index} 
                className={`calendar-day-cell ${dayInfo.isOtherMonth ? 'other-month' : ''} ${isToday ? 'today' : ''}`}
              >
                <div className="day-number-new">{dayInfo.day}</div>
                <div className="day-hearings">
                  {dayHearings.map(hearing => (
                    <div 
                      key={hearing._id} 
                      className={`hearing-item-small ${hearing.issent ? 'sent' : 'pending'}`}
                      onClick={() => openEditHearingModal(hearing)}
                      title={`${hearing.case?.caseid}: ${hearing.case?.partyname} - ${hearing.hearingremarks}`}
                    >
                      <div className="hearing-time-small">
                        {new Date(hearing.hearingdate).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      <div className="hearing-case-small">
                        {hearing.case?.caseid}: {hearing.case?.partyname}
                      </div>
                      <div className="hearing-remarks-small">
                        {hearing.hearingremarks}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="calendar-legend">
          <div className="legend-item-new">
            <div className="legend-color-new sent"></div>
            <span>Reminder Sent</span>
          </div>
          <div className="legend-item-new">
            <div className="legend-color-new pending"></div>
            <span>Reminder Pending</span>
          </div>
        </div>
      </div>
    );
  };

  const renderWeeklyCalendar = () => {
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart);
      date.setDate(date.getDate() + i);
      weekDays.push(date);
    }

    const hours = ['9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM'];
    const today = new Date();

    return (
      <div className="weekly-view-container">
        <div className="weekly-header-controls">
          <button onClick={() => {
            const newStart = new Date(currentWeekStart);
            newStart.setDate(newStart.getDate() - 7);
            setCurrentWeekStart(newStart);
          }} className="btn-calendar-nav">
            <ChevronLeft size={20} /> Previous Week
          </button>
          <h3>
            {months[currentWeekStart.getMonth()]} {currentWeekStart.getDate()} - 
            {months[weekDays[6].getMonth()]} {weekDays[6].getDate()}, {currentWeekStart.getFullYear()}
          </h3>
          <button onClick={() => {
            const newStart = new Date(currentWeekStart);
            newStart.setDate(newStart.getDate() + 7);
            setCurrentWeekStart(newStart);
          }} className="btn-calendar-nav">
            Next Week <ChevronRight size={20} />
          </button>
        </div>

        <div className="weekly-grid-container">
          {/* Header row */}
          <div className="weekly-grid-header">
            <div className="weekly-time-column">Time</div>
            {weekDays.map((date, i) => (
              <div 
                key={i} 
                className={`weekly-day-header ${formatDate(date) === formatDate(today) ? 'today' : ''}`}
              >
                <div>{daysOfWeek[date.getDay()]}</div>
                <div className="weekly-date-number">{date.getDate()}</div>
              </div>
            ))}
          </div>

          {/* Time slots */}
          {hours.map((hour, hourIndex) => (
            <div key={hourIndex} className="weekly-grid-row">
              <div className="weekly-time-slot">{hour}</div>
              {weekDays.map((date, dayIndex) => {
                const dateStr = formatDate(date);
                const dayHearings = getHearingsForDate(dateStr).filter(h => {
                  const hearingTime = new Date(h.hearingdate).toLocaleTimeString('en-US', { hour: 'numeric' });
                  return hearingTime.includes(hour.split(' ')[0]);
                });

                return (
                  <div 
                    key={dayIndex} 
                    className={`weekly-cell ${formatDate(date) === formatDate(today) ? 'today' : ''}`}
                  >
                    {dayHearings.map(hearing => (
                      <div 
                        key={hearing._id}
                        className={`weekly-hearing-item ${hearing.issent ? 'sent' : 'pending'}`}
                        onClick={() => openEditHearingModal(hearing)}
                      >
                        <div className="weekly-hearing-case">{hearing.case?.caseid}</div>
                        <div className="weekly-hearing-party">{hearing.case?.partyname}</div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTodayView = () => {
    const todayHearings = getTodayHearings();
    const today = new Date();
    const hours = ['9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM'];

    return (
      <div className="today-view-container">
        <div className="today-header-section">
          <h2>{months[today.getMonth()]} {today.getDate()}, {today.getFullYear()}</h2>
          <p className="today-day-name">{daysOfWeek[today.getDay()]}</p>
        </div>

        {todayHearings.length === 0 ? (
          <div className="empty-state">
            <CalendarIcon size={64} />
            <h3>No hearings scheduled for today</h3>
            <button className="btn-primary" onClick={() => setShowAddHearingModal(true)}>
              <Plus size={20} />
              Schedule Hearing
            </button>
          </div>
        ) : (
          <div className="today-timeline">
            {hours.map((hour, index) => {
              const hourHearings = todayHearings.filter(h => {
                const hearingTime = new Date(h.hearingdate).toLocaleTimeString('en-US', { hour: 'numeric' });
                return hearingTime.includes(hour.split(' ')[0]);
              });

              return (
                <div key={index} className={`today-time-block ${hourHearings.length > 0 ? 'active' : ''}`}>
                  <div className="today-time-label">{hour}</div>
                  <div className="today-events">
                    {hourHearings.map(hearing => (
                      <div 
                        key={hearing._id} 
                        className={`today-hearing-card ${hearing.issent ? 'sent' : 'pending'}`}
                        onClick={() => openEditHearingModal(hearing)}
                      >
                        <div className="today-hearing-header">
                          <h4>{hearing.case?.partyname}</h4>
                          <span className="today-hearing-time">
                            {new Date(hearing.hearingdate).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <p className="today-case-id">Case: {hearing.case?.caseid}</p>
                        <p className="today-remarks">{hearing.hearingremarks}</p>
                        <div className="today-hearing-footer">
                          <span className="today-authority">{hearing.case?.authority}</span>
                          <span className={`status-badge status-${hearing.case?.status.toLowerCase().replace(' ', '-')}`}>
                            {hearing.case?.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Notification Toast */}
      {notification.show && (
        <div className={`notification-toast ${notification.type}`}>
          {notification.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="admin-logo">
            <div className="logo-icon">
              <Settings size={24} />
            </div>
            <div>
              <h2>Member Panel</h2>
              <p>BAR ASSOCIATION Case Management</p>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeView === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveView('overview')}
          >
            <TrendingUp size={20} />
            <span>Dashboard</span>
          </button>
          
          <button 
            className={`nav-item ${activeView === 'cases' ? 'active' : ''}`}
            onClick={() => setActiveView('cases')}
          >
            <FileText size={20} />
            <span>Manage Cases</span>
          </button>
          
          <button 
            className={`nav-item ${activeView === 'hearings' ? 'active' : ''}`}
            onClick={() => setActiveView('hearings')}
          >
            <CalendarIcon size={20} />
            <span>Manage Hearings</span>
          </button>

          <button 
            className={`nav-item ${activeView === 'calendar' ? 'active' : ''}`}
            onClick={() => setActiveView('calendar')}
          >
            <Clock size={20} />
            <span>Calendar View</span>
          </button>

          <button 
            className={`nav-item ${activeView === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveView('analytics')}
          >
            <BarChart3 size={20} />
            <span>Analytics</span>
          </button>
        </nav>

        <div className="sidebar-actions">
          <button 
            className="btn-primary"
            onClick={() => setShowAddCaseModal(true)}
          >
            <Plus size={20} />
            <span>New Case</span>
          </button>
          
          <button 
            className="btn-secondary"
            onClick={() => setShowAddHearingModal(true)}
          >
            <Clock size={20} />
            <span>Add Hearing</span>
          </button>
        </div>

        <div className="sidebar-footer">
          <div className="admin-profile">
            <div className="profile-avatar">{userInfo.name.at(0)}</div>
            <div className="profile-info">
              <p className="profile-name">{userInfo.name}</p>
              <p className="profile-email">{userInfo.email}</p>
            </div>
            <button className="logout-btn" title="Logout">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Header */}
        <div className="dashboard-header">
          <div className="header-left">
            <h1>
              {activeView === 'overview' && 'Dashboard Overview'}
              {activeView === 'cases' && 'Manage Cases'}
              {activeView === 'hearings' && 'Manage Hearings'}
              {activeView === 'calendar' && 'Calendar View'}
              {activeView === 'analytics' && 'Analytics & Reports'}
            </h1>
            <p className="header-subtitle">
              {activeView === 'overview' && 'Monitor and manage your cases efficiently'}
              {activeView === 'cases' && 'Add, edit, and delete case records'}
              {activeView === 'hearings' && 'Schedule and manage hearing dates'}
              {activeView === 'calendar' && 'View all scheduled hearings'}
              {activeView === 'analytics' && 'Detailed insights and statistics'}
            </p>
          </div>
          <div className="header-right">
            <button className="notification-btn">
              <Bell size={20} />
              <span className="notification-badge">3</span>
            </button>
          </div>
        </div>

        {/* Overview View */}
        {activeView === 'overview' && (
          <div className="overview-content">
            {/* Stats Grid */}
            <div className="stats-grid">
              <div className="stat-card stat-primary">
                <div className="stat-icon">
                  <FileText size={32} />
                </div>
                <div className="stat-content">
                  <h3>{stats.totalCases}</h3>
                  <p>Total Cases</p>
                  <span className="stat-trend positive">
                    <TrendingUp size={14} /> +12% from last month
                  </span>
                </div>
              </div>

              <div className="stat-card stat-success">
                <div className="stat-icon">
                  <CheckCircle size={32} />
                </div>
                <div className="stat-content">
                  <h3>{stats.activeCases}</h3>
                  <p>Active Cases</p>
                  <span className="stat-trend positive">
                    <TrendingUp size={14} /> Currently open
                  </span>
                </div>
              </div>

              <div className="stat-card stat-warning">
                <div className="stat-icon">
                  <Clock size={32} />
                </div>
                <div className="stat-content">
                  <h3>{stats.upcomingHearings}</h3>
                  <p>Upcoming Hearings</p>
                  <span className="stat-trend neutral">
                    Next 30 days
                  </span>
                </div>
              </div>

              <div className="stat-card stat-info">
                <div className="stat-icon">
                  <XCircle size={32} />
                </div>
                <div className="stat-content">
                  <h3>{stats.closedCases}</h3>
                  <p>Closed Cases</p>
                  <span className="stat-trend neutral">
                    Completed
                  </span>
                </div>
              </div>
            </div>

            {/* Upcoming Hearings */}
            <div className="upcoming-hearings-section">
              <div className="section-header">
                <h2>Upcoming Hearings</h2>
                <span className="badge">{getUpcomingHearings().length} scheduled</span>
              </div>

              <div className="hearings-list">
                {getUpcomingHearings().length === 0 ? (
                  <div className="empty-state">
                    <CalendarIcon size={48} />
                    <p>No upcoming hearings</p>
                    <button className="btn-primary" onClick={() => setShowAddHearingModal(true)}>
                      Schedule a Hearing
                    </button>
                  </div>
                ) : (
                  getUpcomingHearings().map(hearing => (
                    <div key={hearing._id} className="hearing-card">
                      <div className="hearing-date">
                        <span className="date-day">
                          {new Date(hearing.hearingdate).getDate()}
                        </span>
                        <span className="date-month">
                          {new Date(hearing.hearingdate).toLocaleString('default', { month: 'short' })}
                        </span>
                      </div>
                      <div className="hearing-details">
                        <h4>{hearing.case?.partyname || 'N/A'}</h4>
                        <p className="hearing-case-id">Case ID: {hearing.case?.caseid || 'N/A'}</p>
                        <p className="hearing-remarks">{hearing.hearingremarks}</p>
                      </div>
                      <div className="hearing-actions">
                        <div className="hearing-time">
                          {new Date(hearing.hearingdate).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                        <div className="action-buttons">
                          <button 
                            className="btn-icon btn-edit" 
                            onClick={() => openEditHearingModal(hearing)}
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            className="btn-icon btn-danger" 
                            onClick={() => handleDeleteHearing(hearing._id)}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Cases */}
            <div className="recent-cases-section">
              <div className="section-header">
                <h2>Recent Cases</h2>
                <button className="btn-link" onClick={() => setActiveView('cases')}>
                  View All Cases →
                </button>
              </div>

              <div className="cases-table-compact">
                <table>
                  <thead>
                    <tr>
                      <th>Case ID</th>
                      <th>Party Name</th>
                      <th>Tax Year</th>
                      <th>Status</th>
                      <th>Authority</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cases.slice(0, 5).map(caseItem => (
                      <tr key={caseItem._id}>
                        <td className="case-id">{caseItem.caseid}</td>
                        <td>{caseItem.partyname}</td>
                        <td>{caseItem.taxyear}</td>
                        <td>
                          <span className={`status-badge status-${caseItem.status.toLowerCase().replace(' ', '-')}`}>
                            {caseItem.status}
                          </span>
                        </td>
                        <td>{caseItem.authority}</td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="btn-icon" 
                              onClick={() => openViewCaseModal(caseItem)}
                              title="View"
                            >
                              <Eye size={16} />
                            </button>
                            <button 
                              className="btn-icon btn-edit" 
                              onClick={() => openEditCaseModal(caseItem)}
                              title="Edit"
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              className="btn-icon btn-danger" 
                              onClick={() => handleDeleteCase(caseItem._id)}
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Cases View */}
        {activeView === 'cases' && (
          <div className="cases-content">
            <div className="cases-controls">
              <div className="search-box">
                <Search size={20} />
                <input
                  type="text"
                  placeholder="Search by case ID or party name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="filter-controls">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="status-filter"
                >
                  <option value="all">All Status</option>
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Adjourned">Adjourned</option>
                  <option value="Closed">Closed</option>
                </select>

                <button className="btn-primary" onClick={() => setShowAddCaseModal(true)}>
                  <Plus size={20} />
                  Add New Case
                </button>
              </div>
            </div>

            <div className="cases-table">
              <table>
                <thead>
                  <tr>
                    <th>Case ID</th>
                    <th>Party Name</th>
                    <th>Tax Year</th>
                    <th>Notice Section</th>
                    <th>Authority</th>
                    <th>Status</th>
                    <th>Notice Date</th>
                    <th>Compliance Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentCases.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="empty-table">
                        <div className="empty-state">
                          <FileText size={48} />
                          <p>No cases found</p>
                          <button className="btn-primary" onClick={() => setShowAddCaseModal(true)}>
                            Add Your First Case
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    currentCases.map(caseItem => (
                      <tr key={caseItem._id}>
                        <td className="case-id">{caseItem.caseid}</td>
                        <td>{caseItem.partyname}</td>
                        <td>{caseItem.taxyear}</td>
                        <td>{caseItem.noticesection}</td>
                        <td>{caseItem.authority}</td>
                        <td>
                          <span className={`status-badge status-${caseItem.status.toLowerCase().replace(' ', '-')}`}>
                            {caseItem.status}
                          </span>
                        </td>
                        <td>{new Date(caseItem.dateofnoticeissue).toLocaleDateString()}</td>
                        <td>{new Date(caseItem.dateofcomplaince).toLocaleDateString()}</td>
                        <td>
                          <div className="action-buttons">
                            <button 
                              className="btn-icon" 
                              onClick={() => openViewCaseModal(caseItem)}
                              title="View"
                            >
                              <Eye size={16} />
                            </button>
                            <button 
                              className="btn-icon btn-edit" 
                              onClick={() => openEditCaseModal(caseItem)}
                              title="Edit"
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              className="btn-icon btn-danger" 
                              onClick={() => handleDeleteCase(caseItem._id)}
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="pagination-btn"
                >
                  <ChevronLeft size={20} />
                  Previous
                </button>
                
                <div className="pagination-pages">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`pagination-page ${currentPage === i + 1 ? 'active' : ''}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="pagination-btn"
                >
                  Next
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Hearings View */}
        {activeView === 'hearings' && (
          <div className="hearings-content">
            <div className="hearings-controls">
              <h2>All Hearings</h2>
              <button className="btn-primary" onClick={() => setShowAddHearingModal(true)}>
                <Plus size={20} />
                Schedule Hearing
              </button>
            </div>

            <div className="hearings-grid">
              {hearings.length === 0 ? (
                <div className="empty-state">
                  <CalendarIcon size={64} />
                  <h3>No hearings scheduled</h3>
                  <p>Start by scheduling your first hearing</p>
                  <button className="btn-primary" onClick={() => setShowAddHearingModal(true)}>
                    <Plus size={20} />
                    Schedule Hearing
                  </button>
                </div>
              ) : (
                hearings
                  .sort((a, b) => new Date(a.hearingdate) - new Date(b.hearingdate))
                  .map(hearing => (
                    <div key={hearing._id} className="hearing-item-card">
                      <div className="hearing-header">
                        <div className="hearing-date-badge">
                          <div className="badge-day">
                            {new Date(hearing.hearingdate).getDate()}
                          </div>
                          <div className="badge-month">
                            {new Date(hearing.hearingdate).toLocaleString('default', { month: 'short' })}
                          </div>
                        </div>
                        <div className="hearing-case-info">
                          <h3>{hearing.case?.partyname || 'N/A'}</h3>
                          <p className="case-id-small">Case: {hearing.case?.caseid || 'N/A'}</p>
                        </div>
                      </div>

                      <div className="hearing-body">
                        <div className="hearing-time-info">
                          <Clock size={16} />
                          <span>
                            {new Date(hearing.hearingdate).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <p className="hearing-remarks">{hearing.hearingremarks}</p>
                        <div className="hearing-meta">
                          <span className="authority-tag">{hearing.case?.authority}</span>
                          <span className={`status-badge status-${hearing.case?.status.toLowerCase().replace(' ', '-')}`}>
                            {hearing.case?.status}
                          </span>
                          <span className={`status-badge ${hearing.issent ? 'status-sent' : 'status-pending'}`}>
                            {hearing.issent ? "Reminder Sent" : "Reminder Pending"}
                          </span>
                        </div>
                      </div>

                      <div className="hearing-footer">
                        <button 
                          className="btn-edit-small" 
                          onClick={() => openEditHearingModal(hearing)}
                        >
                          <Edit size={16} />
                          Edit
                        </button>
                        <button 
                          className="btn-delete-small" 
                          onClick={() => handleDeleteHearing(hearing._id)}
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        )}

        {/* Calendar View - NEW INTEGRATED VIEW */}
        {activeView === 'calendar' && (
          <div className="calendar-content">
            <div className="calendar-view-tabs">
              <button 
                className={`calendar-tab ${calendarView === 'today' ? 'active' : ''}`}
                onClick={() => setCalendarView('today')}
              >
                Today
              </button>
              <button 
                className={`calendar-tab ${calendarView === 'weekly' ? 'active' : ''}`}
                onClick={() => setCalendarView('weekly')}
              >
                Weekly
              </button>
              <button 
                className={`calendar-tab ${calendarView === 'monthly' ? 'active' : ''}`}
                onClick={() => setCalendarView('monthly')}
              >
                Monthly
              </button>
            </div>

            {calendarView === 'today' && renderTodayView()}
            {calendarView === 'weekly' && renderWeeklyCalendar()}
            {calendarView === 'monthly' && renderMonthlyCalendar()}
          </div>
        )}

        {/* Analytics View */}
        {activeView === 'analytics' && (
          <div className="analytics-content">
            <h2>Analytics & Reports</h2>
            
            <div className="analytics-grid">
              <div className="analytics-card">
                <h3>Case Status Distribution</h3>
                <div className="chart-placeholder">
                  <div className="status-breakdown">
                    <div className="status-item">
                      <span className="status-label">Open</span>
                      <div className="status-bar">
                        <div className="status-fill status-open" style={{width: `${(cases.filter(c => c.status === 'Open').length / cases.length * 100) || 0}%`}}></div>
                      </div>
                      <span className="status-count">{cases.filter(c => c.status === 'Open').length}</span>
                    </div>
                    <div className="status-item">
                      <span className="status-label">In Progress</span>
                      <div className="status-bar">
                        <div className="status-fill status-in-progress" style={{width: `${(cases.filter(c => c.status === 'In Progress').length / cases.length * 100) || 0}%`}}></div>
                      </div>
                      <span className="status-count">{cases.filter(c => c.status === 'In Progress').length}</span>
                    </div>
                    <div className="status-item">
                      <span className="status-label">Adjourned</span>
                      <div className="status-bar">
                        <div className="status-fill status-adjourned" style={{width: `${(cases.filter(c => c.status === 'Adjourned').length / cases.length * 100) || 0}%`}}></div>
                      </div>
                      <span className="status-count">{cases.filter(c => c.status === 'Adjourned').length}</span>
                    </div>
                    <div className="status-item">
                      <span className="status-label">Closed</span>
                      <div className="status-bar">
                        <div className="status-fill status-closed" style={{width: `${(cases.filter(c => c.status === 'Closed').length / cases.length * 100) || 0}%`}}></div>
                      </div>
                      <span className="status-count">{cases.filter(c => c.status === 'Closed').length}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="analytics-card">
                <h3>Cases by Authority</h3>
                <div className="authority-breakdown">
                  {['FBR', 'Commissioner', 'Appellate', 'Authority', 'Court'].map(auth => (
                    <div key={auth} className="authority-item">
                      <span className="authority-name">{auth}</span>
                      <span className="authority-count">{cases.filter(c => c.authority === auth).length}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="analytics-card">
                <h3>Monthly Statistics</h3>
                <div className="monthly-stats">
                  <div className="stat-item">
                    <p className="stat-label">New Cases This Month</p>
                    <p className="stat-value">{cases.filter(c => {
                      const caseDate = new Date(c.dateofnoticeissue);
                      const now = new Date();
                      return caseDate.getMonth() === now.getMonth() && caseDate.getFullYear() === now.getFullYear();
                    }).length}</p>
                  </div>
                  <div className="stat-item">
                    <p className="stat-label">Hearings This Month</p>
                    <p className="stat-value">{hearings.filter(h => {
                      const hearingDate = new Date(h.hearingdate);
                      const now = new Date();
                      return hearingDate.getMonth() === now.getMonth() && hearingDate.getFullYear() === now.getFullYear();
                    }).length}</p>
                  </div>
                  <div className="stat-item">
                    <p className="stat-label">Closed This Month</p>
                    <p className="stat-value">{cases.filter(c => c.status === 'Closed').length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Action Buttons - Fixed at bottom for mobile */}
      <div className="mobile-action-buttons">
        <button 
          className="btn-primary"
          onClick={() => setShowAddCaseModal(true)}
        >
          <Plus size={20} />
          <span>New Case</span>
        </button>
        
        <button 
          className="btn-secondary"
          onClick={() => setShowAddHearingModal(true)}
        >
          <Clock size={20} />
          <span>Add Hearing</span>
        </button>
      </div>

      {/* All Modals (Add Case, Edit Case, View Case, Add Hearing, Edit Hearing) */}
      {/* [Keep all your existing modal code here - unchanged] */}
      
      {/* Add Case Modal */}
      {showAddCaseModal && (
        <div className="modal-overlay" onClick={() => setShowAddCaseModal(false)}>
          <div className="modal-content large-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Case</h2>
              <button className="btn-close" onClick={() => setShowAddCaseModal(false)}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAddCase} className="case-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Case ID *</label>
                  <input
                    type="text"
                    value={newCase.caseid}
                    onChange={(e) => setNewCase({...newCase, caseid: e.target.value})}
                    placeholder="Enter case ID"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Party Name *</label>
                  <input
                    type="text"
                    value={newCase.partyname}
                    onChange={(e) => setNewCase({...newCase, partyname: e.target.value})}
                    placeholder="Enter party name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Tax Year *</label>
                  <input
                    type="text"
                    value={newCase.taxyear}
                    onChange={(e) => setNewCase({...newCase, taxyear: e.target.value})}
                    placeholder="e.g., 2023-2024"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Notice Section *</label>
                  <input
                    type="text"
                    value={newCase.noticesection}
                    onChange={(e) => setNewCase({...newCase, noticesection: e.target.value})}
                    placeholder="Enter notice section"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Authority *</label>
                  <select
                    value={newCase.authority}
                    onChange={(e) => setNewCase({...newCase, authority: e.target.value})}
                    required
                  >
                    <option value="">Select Authority</option>
                    <option value="FBR">FBR</option>
                    <option value="Commissioner">Commissioner</option>
                    <option value="Appellate">Appellate</option>
                    <option value="Authority">Authority</option>
                    <option value="Court">Court</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Status *</label>
                  <select
                    value={newCase.status}
                    onChange={(e) => setNewCase({...newCase, status: e.target.value})}
                    required
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Adjourned">Adjourned</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Date of Notice Issue *</label>
                  <input
                    type="date"
                    value={newCase.dateofnoticeissue}
                    onChange={(e) => setNewCase({...newCase, dateofnoticeissue: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Date of Compliance *</label>
                  <input
                    type="date"
                    value={newCase.dateofcomplaince}
                    onChange={(e) => setNewCase({...newCase, dateofcomplaince: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <label>Remarks *</label>
                <textarea
                  value={newCase.remarks}
                  onChange={(e) => setNewCase({...newCase, remarks: e.target.value})}
                  rows="4"
                  placeholder="Enter case remarks and details"
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowAddCaseModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <Plus size={20} />
                  Add Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Case Modal */}
      {showEditCaseModal && selectedCase && (
        <div className="modal-overlay" onClick={() => setShowEditCaseModal(false)}>
          <div className="modal-content large-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Case</h2>
              <button className="btn-close" onClick={() => setShowEditCaseModal(false)}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleEditCase} className="case-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Case ID *</label>
                  <input
                    type="text"
                    value={editCase.caseid}
                    onChange={(e) => setEditCase({...editCase, caseid: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Party Name *</label>
                  <input
                    type="text"
                    value={editCase.partyname}
                    onChange={(e) => setEditCase({...editCase, partyname: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Tax Year *</label>
                  <input
                    type="text"
                    value={editCase.taxyear}
                    onChange={(e) => setEditCase({...editCase, taxyear: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Notice Section *</label>
                  <input
                    type="text"
                    value={editCase.noticesection}
                    onChange={(e) => setEditCase({...editCase, noticesection: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Authority *</label>
                  <select
                    value={editCase.authority}
                    onChange={(e) => setEditCase({...editCase, authority: e.target.value})}
                    required
                  >
                    <option value="">Select Authority</option>
                    <option value="FBR">FBR</option>
                    <option value="Commissioner">Commissioner</option>
                    <option value="Appellate">Appellate</option>
                    <option value="Authority">Authority</option>
                    <option value="Court">Court</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Status *</label>
                  <select
                    value={editCase.status}
                    onChange={(e) => setEditCase({...editCase, status: e.target.value})}
                    required
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Adjourned">Adjourned</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Date of Notice Issue *</label>
                  <input
                    type="date"
                    value={editCase.dateofnoticeissue}
                    onChange={(e) => setEditCase({...editCase, dateofnoticeissue: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Date of Compliance *</label>
                  <input
                    type="date"
                    value={editCase.dateofcomplaince}
                    onChange={(e) => setEditCase({...editCase, dateofcomplaince: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <label>Remarks *</label>
                <textarea
                  value={editCase.remarks}
                  onChange={(e) => setEditCase({...editCase, remarks: e.target.value})}
                  rows="4"
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowEditCaseModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <Edit size={20} />
                  Update Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Case Modal */}
      {showViewCaseModal && selectedCase && (
        <div className="modal-overlay" onClick={() => setShowViewCaseModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Case Details</h2>
              <button className="btn-close" onClick={() => setShowViewCaseModal(false)}>
                <X size={24} />
              </button>
            </div>

            <div className="case-details-view">
              <div className="detail-group">
                <label>Case ID</label>
                <p>{selectedCase.caseid}</p>
              </div>

              <div className="detail-group">
                <label>Party Name</label>
                <p>{selectedCase.partyname}</p>
              </div>

              <div className="detail-group">
                <label>Tax Year</label>
                <p>{selectedCase.taxyear}</p>
              </div>

              <div className="detail-group">
                <label>Notice Section</label>
                <p>{selectedCase.noticesection}</p>
              </div>

              <div className="detail-group">
                <label>Authority</label>
                <p>{selectedCase.authority}</p>
              </div>

              <div className="detail-group">
                <label>Status</label>
                <span className={`status-badge status-${selectedCase.status.toLowerCase().replace(' ', '-')}`}>
                  {selectedCase.status}
                </span>
              </div>

              <div className="detail-group">
                <label>Date of Notice Issue</label>
                <p>{new Date(selectedCase.dateofnoticeissue).toLocaleDateString()}</p>
              </div>

              <div className="detail-group">
                <label>Date of Compliance</label>
                <p>{new Date(selectedCase.dateofcomplaince).toLocaleDateString()}</p>
              </div>

              <div className="detail-group full-width">
                <label>Remarks</label>
                <p>{selectedCase.remarks}</p>
              </div>
            </div>

            <div className="modal-actions more">
              <button className="btn-secondary edit" onClick={() => setShowViewCaseModal(false)}>
                Close
              </button>
              <button 
                className="btn-primary edit" 
                onClick={() => {
                  setShowViewCaseModal(false);
                  openEditCaseModal(selectedCase);
                }}
              >
                <Edit size={20} />
                Edit Case
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Hearing Modal */}
      {showAddHearingModal && (
        <div className="modal-overlay" onClick={() => setShowAddHearingModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Schedule New Hearing</h2>
              <button className="btn-close" onClick={() => setShowAddHearingModal(false)}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAddHearing} className="hearing-form">
              <div className="form-group">
                <label>Select Case *</label>
                <select
                  value={newHearing.caseId}
                  onChange={(e) => setNewHearing({...newHearing, caseId: e.target.value})}
                  required
                >
                  <option value="">Select a case</option>
                  {cases.filter(c => c.status !== 'Closed').map(c => (
                    <option key={c._id} value={c._id}>
                      {c.caseid} - {c.partyname}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Hearing Date & Time *</label>
                <input
                  type="datetime-local"
                  value={newHearing.hearingdate}
                  onChange={(e) => setNewHearing({...newHearing, hearingdate: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Hearing Remarks *</label>
                <textarea
                  value={newHearing.hearingremarks}
                  onChange={(e) => setNewHearing({...newHearing, hearingremarks: e.target.value})}
                  rows="4"
                  placeholder="Enter hearing details and remarks"
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowAddHearingModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <Plus size={20} />
                  Schedule Hearing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Hearing Modal */}
      {showEditHearingModal && selectedHearing && (
        <div className="modal-overlay" onClick={() => setShowEditHearingModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Hearing</h2>
              <button className="btn-close" onClick={() => setShowEditHearingModal(false)}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleEditHearing} className="hearing-form">
              <div className="form-group">
                <label>Select Case *</label>
                <select
                  value={editHearing.caseId}
                  onChange={(e) => setEditHearing({...editHearing, caseId: e.target.value})}
                  required
                >
                  <option value="">Select a case</option>
                  {cases.map(c => (
                    <option key={c._id} value={c._id}>
                      {c.caseid} - {c.partyname}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Hearing Date & Time *</label>
                <input
                  type="datetime-local"
                  value={editHearing.hearingdate}
                  onChange={(e) => setEditHearing({...editHearing, hearingdate: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Hearing Remarks *</label>
                <textarea
                  value={editHearing.hearingremarks}
                  onChange={(e) => setEditHearing({...editHearing, hearingremarks: e.target.value})}
                  rows="4"
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowEditHearingModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <Edit size={20} />
                  Update Hearing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}