import React, { useState, useEffect } from 'react';
import './AdminUI.css';
import axios from 'axios';
import { handleError, handleSuccess } from '../util';
import { ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ReviewModelAdmin from './SubComponents/ReviewModelAdmin';

function AdminUI() {
  const navigate = useNavigate();

  const [selectedApp, setSelectedApp] = useState(null);
  const [applications, setApplications] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [TotalRooms, setTotalRooms] = useState(null);
  const [students, setTotalStudents] = useState(0);
  const [notifications, setNotification] = useState([
    { id: 'seed-2', type: 'application', message: 'Leave application approved for Jane Smith', time: '5 hours ago', urgent: false, email: null }
  ]);
  const [loading, setLoading] = useState(true);
  const sendQr = async () => {
  const data = {
    Student_Name: selectedApp?.name,
    Room_no: selectedApp?.room,
    Student_Email: selectedApp?.email,
    start_date: new Date(),
    end_date: new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours from now
  };

  try {
    const res = await axios.post("http://localhost:5000/auth/storeQR", data);
    console.log(res.data);
    handleSuccess("QR data stored successfully!");
  } catch (err) {
    console.error(err);
    handleError("Failed to store QR data");
  }
};

  // Helper to format date
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-GB"); // dd/mm/yyyy
  };

  // Helper to detect if a notification matches an application (robust)
  const matches = (notif, app) => {
    if (!notif || !app) return false;

    // possible id fields
    const notifId = notif.id;
    const appId = app.id || app._id || app.applicationId;

    // possible email fields
    const notifEmail = notif.email || notif.emails || notif.s_email;
    const appEmail = app.email || app.emails || app.s_email;

    // match if id matches OR email matches
    return (notifId && appId && String(notifId) === String(appId)) ||
           (notifEmail && appEmail && String(notifEmail) === String(appEmail));
  };

  // Accept handler: update backend, then remove only the matched notification
  const handleAccept = async (app) => {
    try {
      console.log("Accepted:", app);

      // prepare payload (preserve server shape; modify as needed)
      const payload = { ...app, accept: 3 };

      // call backend first
      await axios.post("http://localhost:5000/auth/updateApplication", payload);

      // remove from applications list if present (match by email/id)
      setApplications(prev => prev.filter(a => !( (a.email || a.s_email) === (app.email || app.s_email) || a._id === app._id || a.id === app.id )));

      // remove only the matched notification (keep everything else)
      setNotification(prevNotifs => prevNotifs.filter(n => !matches(n, app)));

      setSelectedApp(null);

      handleSuccess && handleSuccess("Application accepted.");
      console.log("Application accepted and matching notification removed.");
    } catch (err) {
      console.error("Error updating application:", err);
      handleError && handleError("Failed to accept application.");
    }
  };

  const handleReject = (app) => {
    console.log("Rejected:", app);
    setSelectedApp(null);
  };

  useEffect(() => {
    const getAppl = async () => {
      try {
        const res = await axios.get("http://localhost:5000/getApplications", {
          params: { accept: 2 }
        });

        console.log("API Data:", res.data.data);

        // Normalize each notification to contain: id, email (singular), and the other fields
        const newApps = (res.data.data || []).map(info => ({
          _id: info._id,
          email: info.s_email,            // normalize field name to `email`
          name: info.StudentName,
          room: info.Room_no,
          type: info.ApplicationType + " [ Approved by Mentor --> Parents ]",
          date: formatDate(info.start_Date),
          reason: info.reason,
          status: 'Approved',
          urgent: false,
          message: info.reason || ""
        }));

        // Replace notifications with the fetched ones (or append if you prefer)
        setNotification(newApps);
      } catch (err) {
        console.error("Error fetching applications:", err);
        handleError && handleError("Failed to load applications.");
      }
    };

    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/getAdmin");
        console.log('Response:', response.data);
        setTotalRooms(response.data.data);
      } catch (err) {
        console.error('Error:', err);
        handleError && handleError(err.message);
      }
    };

    const AllData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/getStud");
        console.log('Response:', response.data);
        setTotalStudents(response.data.data);
      } catch (err) {
        console.error('Error:', err);
        handleError && handleError(err.message);
      }
    };

    const init = async () => {
      await Promise.all([getAppl(), fetchData(), AllData()]);
      setLoading(false);
    };

    console.log(localStorage.email + " I am from server");
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debug updated notifications
  useEffect(() => {
    console.log("Updated Notifications:", notifications);
  }, [notifications]);

  // Sample rooms (UI only)
  const rooms = [
    { id: 'A101', status: 'occupied', student: 'John Doe', capacity: 2, current: 2 },
    { id: 'A102', status: 'available', student: null, capacity: 2, current: 1 },
    { id: 'A103', status: 'maintenance', student: null, capacity: 2, current: 0 },
    { id: 'B201', status: 'occupied', student: 'Jane Smith', capacity: 2, current: 2 },
    { id: 'B202', status: 'available', student: null, capacity: 2, current: 0 },
    { id: 'B203', status: 'occupied', student: 'Mike Johnson', capacity: 2, current: 1 },
    { id: 'C301', status: 'available', student: null, capacity: 2, current: 0 },
    { id: 'C302', status: 'occupied', student: 'Sarah Wilson', capacity: 2, current: 2 },
    { id: 'C303', status: 'available', student: null, capacity: 2, current: 1 }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'occupied': return '#10b981';
      case 'available': return '#3b82f6';
      case 'maintenance': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'occupied': return '🏠';
      case 'available': return '🏠';
      case 'maintenance': return '🔧';
      default: return '🏠';
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="admin-ui">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-title">
          <h1>Admin Dashboard</h1>
          <p>Hostel Management System</p>
        </div>
        <div className="admin-profile">
          <div className="admin-photo">
            <div className="photo-placeholder">
              <span>👤</span>
            </div>
            <div className="admin-details">
              <h3>Dr. Sudarshan Kumar</h3>
              <p>Administrator</p>
            </div>
          </div>
          <div className="admin-actions">
            <button className="active-btn">
              <span className="status-dot"></span>
              Active
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button className={activeTab === 'dashboard' ? 'tab active' : 'tab'} onClick={() => setActiveTab('dashboard')}>Dashboard</button>
        <button className={activeTab === 'rooms' ? 'tab active' : 'tab'} onClick={() => setActiveTab('rooms')}>Rooms</button>
        <button className={activeTab === 'applications' ? 'tab active' : 'tab'} onClick={() => setActiveTab('applications')}>
          Applications 🔔 <span className="alert-count">{notifications.length}</span>
        </button>
      </div>

      {/* Content */}
      <div className="admin-content">
        {activeTab === 'dashboard' && (
          <div className="dashboard-content">
            <div className="stats-grid">
              <div className="stat-card"><div className="stat-icon">🏠</div><div className="stat-info"><h3>{TotalRooms}</h3><p>Total Rooms</p></div></div>
              <div className="stat-card"><div className="stat-icon">👥</div><div className="stat-info"><h3>{students}</h3><p>Students</p></div></div>
              <div className="stat-card"><div className="stat-icon">📋</div><div className="stat-info"><h3>8</h3><p>Pending Applications</p></div></div>
              <div className="stat-card"><div className="stat-icon">✅</div><div className="stat-info"><h3>12</h3><p>Approved Today</p></div></div>
            </div>
          </div>
        )}

        {activeTab === 'rooms' && (
          <div className="rooms-content">
            <div className="rooms-grid">
              {rooms.map((room) => (
                <div key={room.id} className={`room-card ${room.status} ${selectedRoom === room.id ? 'selected' : ''}`} onClick={() => setSelectedRoom(room.id)}>
                  <div className="room-header"><span className="room-icon">{getStatusIcon(room.status)}</span><span className="room-number">{room.id}</span></div>
                  <div className="room-status" style={{ backgroundColor: getStatusColor(room.status) }}>{room.status.charAt(0).toUpperCase() + room.status.slice(1)}</div>
                  <div className="room-details"><p><strong>Capacity:</strong> {room.current}/{room.capacity}</p>{room.student && <p><strong>Student:</strong> {room.student}</p>}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="applications-content">
            <div className="notifications-list">
              {notifications.map((notification) => (
                <div key={notification.id} className={`notification-card ${notification.urgent ? 'urgent' : ''}`}>
                  <div className="notification-icon">
                    {notification.type?.toLowerCase().includes('leave') && '📋'}
                    {notification.type?.toLowerCase().includes('maintenance') && '🔧'}
                    {notification.type?.toLowerCase().includes('check') && '✅'}
                    {!notification.type?.toLowerCase().includes('leave') &&
                     !notification.type?.toLowerCase().includes('maintenance') &&
                     !notification.type?.toLowerCase().includes('check') && '📢'}
                  </div>

                  <div className="notification-content">
                    <h4>{notification.type}</h4>
                    <p>{notification.reason || notification.message}</p>
                    <p className="notification-time">{notification.date || notification.time}</p>
                  </div>

                  <div className="notification-actions">
                    <button className="action-btn view" onClick={() => { setSelectedApp(notification);sendQr()}}>View</button>
                    {notification.urgent && <button className="action-btn urgent">Urgent</button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedApp && (
        <ReviewModelAdmin
          application={selectedApp}
          onClose={() => setSelectedApp(null)}
          onAccept={handleAccept}
          onReject={handleReject}
        />
      )}

      {/* Bottom nav */}
      <div className="admin-bottom-nav">
        <div className="search-bar">
          <input type="text" placeholder="Search students, rooms, or applications..." />
          <button className="search-btn">🔍</button>
        </div>
        <div className="quick-actions">
          <button className="quick-btn" onClick={() => { navigate('/addStudent'); }}>➕ Add Student</button>
          <button className="quick-btn">📊 Reports</button>
          <button className="quick-btn">⚙️ Settings</button>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}

export default AdminUI;
