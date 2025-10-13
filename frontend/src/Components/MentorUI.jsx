import React, { useEffect, useState } from 'react';
import './MentorUI.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReviewModel from './SubComponents/ReviewModel';

const MentorUI = () => {

    const handleAccept = async(app) => {
    console.log("Accepted:", app);
    app.accept = 1;
    setSelectedApp(null)
    setApplications((prevApps) => prevApps.filter((a) => a._id !== app._id));
   await axios.post("http://localhost:5000/auth/updateApplication",app); 
  };

  const handleReject = (app) => {
    console.log("Rejected:", app);
    setSelectedApp(null);
  };

  const [selectedApp, setSelectedApp] = useState(null);
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const getAppl = async () => {
      try {
        const res = await axios.get("http://localhost:5000/getApplications", {
          params: { accept: 0 }
        });

        console.log("API Data:", res.data);

        // Assuming res.data is an array of applications
        setApplications(res.data.data);
      } catch (err) {
        console.error("Error fetching applications:", err);
      }
    };

    getAppl();
  }, []);

  const getStatusClass = (accepted) => {
    if (accepted === 1) return "status-approved";
    if (accepted === 0) return "status-pending";
    if (accepted === 2) return "status-progress";
    return "status-default";
  };

  // Helper: format date
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-GB"); // dd/mm/yyyy
  };

  return (
    <div className="mentor-portal">
      <header className="portal-header">
        <h1>Mentor Portal</h1>
        <p>Manage Student Applications & Requests</p>
      </header>

      <section className="applications-section">
        <div className="section-header">
          <h2>Student Applications</h2>
          <div className="applications-summary">
            <span className="total-count">{applications.length} Total</span>
            <span className="pending-count">
              {applications.filter(app => app.Accepted === 0).length} Pending
            </span>
          </div>
        </div>

        <div className="applications-list">
          {applications.map((application) => (
            <div key={application._id} className="application-card">
              <div className="application-header">
                <h3 className="application-type">{application.ApplicationType}</h3>
                <span className={`status-badge ${getStatusClass(application.Accepted)}`}>
                  {application.Accepted === 1
                    ? "Approved"
                    : application.Accepted === 0
                    ? "Pending Review"
                    : "In Progress"}
                </span>
              </div>

              <div className="application-content">
                <p className="application-title">{application.reason}</p>
                <div className="application-meta">
                  <span className="student-name">Student: {application.StudentName}</span>
                  <span className="student-room">Room: {application.Room_no}</span>
                  <span className="application-email">{application.email}</span>
                  <span className="application-dates">
                    {formatDate(application.start_Date)} → {formatDate(application.end_date)}
                  </span>
                  <span className="application-remark">
                    Urgency: {application.urgancy ? "High" : "Normal"}
                  </span>
                </div>
              </div>

              <div className="application-actions">
                <button className="btn btn-primary" onClick={() =>{setSelectedApp(application);console.log(application)}}>Review</button>
                <button className="btn btn-secondary">View Details</button>
              </div>
            </div>
          ))}
        </div>
      </section>

            {selectedApp && (
        <ReviewModel
          application={selectedApp}
          onClose={() => setSelectedApp(null)}
          onAccept={handleAccept}
          onReject={handleReject}
        />
      )}
    </div>
  );
};

export default MentorUI;
