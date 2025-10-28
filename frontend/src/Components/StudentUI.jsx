import React, { useEffect, useState } from 'react';
import './StudentUI.css';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import { handleSuccess ,handleError} from '../util';
import { useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code'; 

function StudentUI() {
    
     const email =localStorage.getItem("email");
     const handleSubmit = async(e) => {
    e.preventDefault();
    
     const  ApplicationD = {StudentName:studentInfo.name,Room_no:studentInfo.room,email:email,ApplicationType:formData.applicationType,start_Date:formData.startDate,end_date:formData.endDate,reason:formData.reason,urgancy:formData.urgent,SupportingDoc:""};
      const res =  await axios.post("https://cp-project-5ths.onrender.com/auth/storeApplication",ApplicationD);
      if(res.data.success)
      {
        handleSuccess(res.data.msg);
        setFormData({
        applicationType: "",
        startDate: "",
        endDate: "",
        reason: "",
        urgent: false,
        documents: [],
      });

      }
      else{ handleError("No data present");};
  };
   const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "checkbox" || type === "radio") {
      setFormData({ ...formData, [name]: checked });
    } else if (type === "file") {
      setFormData({ ...formData, [name]: files });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
   
    const [formData, setFormData] = useState({
    applicationType: "",
    startDate: "",
    endDate: "",
    reason: "",
    urgent: false,
    documents: [],
  });

     const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-GB");
  };

    useEffect(()=>{

        const fetchApplication = async() =>{
        const res = await axios.get("https://cp-project-5ths.onrender.com/getApplicationsEmail", {
           params: { accept:1,email:email}
         });

         res.data.data.forEach((info,index)=>{const newApp ={id:info.length+1,type:info.ApplicationType+" [ Approved by Rector ]",date:formatDate(info.start_Date),reason:info.reason,status:'Approved'};
         setpreviousApplications([...previousApplications, newApp])});
        }
        const fetchStudent = async()=>{
        if (!email) {
        console.error("No email found in localStorage");
        return;
      }
      else
      {
        const res = await axios.get('https://cp-project-5ths.onrender.com/Student',{params: { email }});
        setStudentInfo({name:res.data.data.s_name,department:res.data.data.department,room:res.data.data.r_no,application:res.data.data.application,status:'Active'})
      }
        }

        fetchStudent();
        fetchApplication();
    },[])
    const [activeTab, setActiveTab] = useState('status');
    const [studentInfo, setStudentInfo] = useState({
        name: 'Loading',
        department: 'Loading',
        room: 'fetching',
        application:-1,
        status: 'Active'
    });
     const [qrData , setQrData] = useState();

     const getQr =async ()=>{
        console.log("Fuction called");
        const res = await axios.get("https://cp-project-5ths.onrender.com/getQr",{params: { email }});
         
        const qrArray = res.data.data;

  if (qrArray && qrArray.length > 0) {
    setQrData(qrArray);
    handleSuccess("Permission Granted");
  } else {
    setQrData(null);
    handleError("Permission not granted");
  }
     }

    const [previousApplications , setpreviousApplications] = useState([]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved': return '#10b981';
            case 'Pending': return '#f59e0b';
            case 'Rejected': return '#dc2626';
            default: return '#6b7280';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Approved': return '✅';
            case 'Pending': return '⏳';
            case 'Rejected': return '❌';
            default: return '📋';
        }
    };

    const navigate = useNavigate();

    return (
        <div className="student-ui">
            {/* Header */}
            <div className="student-header">
                <div className="student-title">
                    <h1>Student Portal</h1>
                    <p>Hostel Management System</p>
                </div>
                <div className="student-profile">
                    <div className="student-photo">
                        <div className="photo-placeholder">
                            <span>👨‍🎓</span>
                        </div>
                        <div className="student-details">
                            <h3>{studentInfo.name}</h3>
                            <p>{studentInfo.department}</p>
                        </div>
                    </div>
                    <div className="status-indicator">
                        <span className="status-dot active"></span>
                        Active
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="student-tabs">
                <button 
                    className={activeTab === 'status' ? 'tab active' : 'tab'}
                    onClick={() => setActiveTab('status')}
                >
                    Status
                </button>
                <button 
                    className={activeTab === 'apply' ? 'tab active' : 'tab'}
                    onClick={() => setActiveTab('apply')}
                >
                    Apply
                </button>
                <button 
                    className={activeTab === 'qr' ? 'tab active' : 'tab'}
                    onClick={() => {setActiveTab('qr'); getQr()}}
                >
                    QR Code
                </button>
            </div>

            {/* Main Content */}
            <div className="student-content">
                {activeTab === 'status' && (
                    <div className="status-content">
                        <div className="status-cards">
                            <div className="status-card">
                                <div className="card-icon">🏠</div>
                                <div className="card-info">
                                    <h3>Room Assignment</h3>
                                    <p className="room-number">{studentInfo.room}</p>
                                    <span className="room-status active">Active</span>
                                </div>
                            </div>
                            <div className="status-card">
                                <div className="card-icon">📋</div>
                                <div className="card-info">
                                    <h3>Applications</h3>
                                    <p className="app-count">{(previousApplications.length>studentInfo.application)?previousApplications.length:studentInfo.application}</p>
                                    <span className="app-status pending">1 Pending</span>
                                </div>
                            </div>
                            <div className="status-card">
                                <div className="card-icon">⏰</div>
                                <div className="card-info">
                                    <h3>Check-in Status</h3>
                                    <p className="check-time">Last: 2 hours ago</p>
                                    <span className="check-status active">Checked In</span>
                                </div>
                            </div>
                        </div>

                        <div className="quick-actions">
                            <button className="action-btn primary"  onClick={() => setActiveTab('apply')}>
                                📝 New Application
                            </button>
                            <button className="action-btn secondary" onClick={() => {setActiveTab('qr'); getQr()}}>
                                📱 View QR
                            </button>
                            <button className="action-btn secondary">
                                📞 Contact Warden
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'apply' && (
                    <div className="apply-content">
                        {/* Existing form unchanged */}
                        <form className="application-form" onSubmit={handleSubmit}>
                            <h3>New Application</h3>
                            <div className="form-group">
                                <label>Application Type</label>
                                <select
                                    name="applicationType"
                                    value={formData.applicationType}
                                    onChange={handleChange}
                                >
                                    <option value="">-- Select --</option>
                                    <option value="Leave Application">Leave Application</option>
                                    <option value="Room Change Request">Room Change Request</option>
                                    <option value="Maintenance Request">Maintenance Request</option>
                                    <option value="Special Permission">Special Permission</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Start Date</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>End Date</label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Reason</label>
                                <textarea
                                    name="reason"
                                    placeholder="Please provide detailed reason..."
                                    rows="4"
                                    value={formData.reason}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <input
                                    type="radio"
                                    name="urgent"
                                    checked={formData.urgent}
                                    onChange={handleChange}
                                />
                                <label>URGENT </label>
                            </div>
                            <div className="form-group">
                                <label>Supporting Documents</label>
                                <input
                                    type="file"
                                    name="documents"
                                    multiple
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="submit-btn">
                                    Submit Application
                                </button>
                                <button type="button" className="cancel-btn">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {activeTab === 'qr' && (
  <div className="qr-content">
    <h3>Your Hostel QR Code</h3>

    {qrData && (
      <div className="qr-card">
        <QRCode value={`HostelID:${studentInfo.room}-Email:${email}`} size={180} />
        <h3>{studentInfo.name}</h3>
        <h3>Room No: {studentInfo.room}</h3>
        <p>Accepted at : {new Date(qrData[0].createdAt).toLocaleString()} <br></br><b>The QR will be disable after 2 hours from accepted time</b></p>
        <p>Start Date: {qrData[0].start_date}</p>
        <p>End Date: {qrData[0].end_date}</p>
        

      </div>
    )}
    {
        qrData === null && 
        <div className="qr-card">
        <QRCode value={`Take the wardan permission before leave :${studentInfo.room}-Email:${email}`} size={180} />
        <h2>Ask for Leave</h2>
      </div>
    }
  </div>
)}

            </div>

            {/* Previous Applications */}
            <div className="applications-section">
                <h3>Previous Applications</h3>
                <div className="applications-list">
                    {previousApplications.map((app) => (
                        <div key={app.id} className="application-item">
                            <div className="app-icon">
                                {getStatusIcon(app.status)}
                            </div>
                            <div className="app-details">
                                <h4>{app.type}</h4>
                                <p>{app.reason}</p>
                                <span className="app-date">{app.date}</span>
                            </div>
                            <div className="app-status">
                                <span 
                                    className="status-badge" 
                                    style={{ backgroundColor: getStatusColor(app.status) }}
                                >
                                    {app.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <ToastContainer/>
        </div>
    );
}

export default StudentUI;
