import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import './login_enhanced.css';
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../util";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPass] = useState("");
    const [showCheckIn, setShowCheckIn] = useState(false);
    const [checkInData, setCheckInData] = useState({
        studentId: '',
        roomNumber: '',
        purpose: '',
        expectedReturn: ''
    });
    const [checkInHistory, setCheckInHistory] = useState([
        {
            id: 1,
            studentId: 'E2023001',
            studentName: 'Rajesh Kumar',
            roomNumber: 'A-105',
            checkInTime: '2024-01-20 08:30',
            purpose: 'Leave for Home',
            status: 'checked_out'
        },
        {
            id: 2,
            studentId: 'E2023002',
            studentName: 'Priya Sharma',
            roomNumber: 'B-210',
            checkInTime: '2024-01-20 09:15',
            purpose: 'Medical Checkup',
            status: 'checked_out'
        },
        {
            id: 3,
            studentId: 'E2023003',
            studentName: 'Amit Singh',
            roomNumber: 'C-315',
            checkInTime: '2024-01-20 10:00',
            purpose: 'Library Study',
            status: 'checked_in'
        }
    ]);

    const submit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            return handleError("Fill the information properly");
        }

        const logininfo = { email, password };

        try {
            const url = "https://cp-project-5ths.onrender.com/auth/login";
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(logininfo)
            });

            const result = await response.json();
            const { success, message, jwtToken, name, error, role } = result;

            if (success) {
                handleSuccess(message + " " + role);

                localStorage.setItem('token', jwtToken);
                localStorage.setItem('loggedInUser', name);
                localStorage.setItem('userRole', role);
                localStorage.setItem('email',email);
                
                console.log(email);
                setTimeout(() => {
                    console.log(typeof (role));
                    if (role === 'user') {
                        handleSuccess("Logged in as Student");
                        navigate("/student-ui");
                    }
                    else if (role === 'admin') {
                        handleSuccess("Logged in as Admin");
                        navigate("/admin-ui");
                    }
                    else if (role === 'parent') {
                        handleSuccess("Logged in as Parent");
                        navigate("/parent-ui");
                    }
                    else if (role === 'mentor') {
                        handleSuccess("Logged in as Mentor");
                        navigate("/mentor-ui");
                    }
                    else {
                        handleError("User not exist")
                        navigate("/");
                    }
                }, 1000);
            }
            else if (error) {
                const details = error?.details[0].message;
                handleError(details);
            }
            else if (!success) {
                handleError(message)
            }

        } catch (err) {
            handleError("Network error: " + err);
        }
    }

    const handleCheckIn = (e) => {
        e.preventDefault();
        // Add new check-in record
        const newCheckIn = {
            id: checkInHistory.length + 1,
            studentId: checkInData.studentId,
            studentName: 'Student Name', // In real app, fetch from database
            roomNumber: checkInData.roomNumber,
            checkInTime: new Date().toLocaleString(),
            purpose: checkInData.purpose,
            status: 'checked_out'
        };
        setCheckInHistory([newCheckIn, ...checkInHistory]);
        
        // Reset form
        setCheckInData({
            studentId: '',
            roomNumber: '',
            purpose: '',
            expectedReturn: ''
        });
        
        handleSuccess("Check-in recorded successfully!");
    };

    const getStatusColor = (status) => {
        return status === 'checked_in' ? '#10b981' : '#dc2626';
    };

    const getStatusIcon = (status) => {
        return status === 'checked_in' ? '🏠' : '🚪';
    };

    return (
        <div className="login">
            <div className="login-container">
                {/* Login Form */}
                <form className="form_login">
                    <h1>Hostel Management System</h1>
                    <h2>Login</h2>
                    <input type="email" placeholder="Email" onChange={(e) => { setEmail(e.target.value) }} />
                    <input type="password" placeholder="Password" onChange={(e) => { setPass(e.target.value) }} />
                    <input type="submit" onClick={submit} value="Login" />

                    
                    {/* Demo Access Links */}
                    <div className="demo-access">
                        <h3>Demo Access</h3>
                        <div className="demo-buttons">
                            <button type="button" onClick={() => navigate('/admin-ui')} className="demo-btn admin">
                                👨‍💼 Admin Demo
                            </button>
                            <button type="button" onClick={() => navigate('/student-ui')} className="demo-btn student">
                                👨‍🎓 Student Demo
                            </button>
                            <button type="button" onClick={() => navigate('/parent-ui')} className="demo-btn parent">
                                👨‍👩‍👧‍👦 Parent Demo
                            </button>
                        </div>
                    </div>
                </form>

                {/* Check-in Section */}
                <div className="checkin-section">
                    <div className="checkin-header">
                        <h2>Student Check-in System</h2>
                        <button 
                            className="toggle-checkin"
                            onClick={() => setShowCheckIn(!showCheckIn)}
                        >
                            {showCheckIn ? 'Hide' : 'Show'} Check-in
                        </button>
                    </div>

                    {showCheckIn && (
                        <div className="checkin-content">
                            {/* Quick Stats */}
                            <div className="checkin-stats">
                                <div className="stat-item">
                                    <span className="stat-number">24</span>
                                    <span className="stat-label">Students in Hostel</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-number">8</span>
                                    <span className="stat-label">Checked Out Today</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-number">16</span>
                                    <span className="stat-label">Expected Returns</span>
                                </div>
                            </div>

                            {/* Check-in Form */}
                            <form onSubmit={handleCheckIn} className="checkin-form">
                                <h3>New Check-in/Check-out</h3>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Student ID</label>
                                        <input
                                            type="text"
                                            value={checkInData.studentId}
                                            onChange={(e) => setCheckInData({...checkInData, studentId: e.target.value})}
                                            placeholder="E2023001"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Room Number</label>
                                        <input
                                            type="text"
                                            value={checkInData.roomNumber}
                                            onChange={(e) => setCheckInData({...checkInData, roomNumber: e.target.value})}
                                            placeholder="A-105"
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div className="form-group">
                                    <label>Purpose</label>
                                    <select
                                        value={checkInData.purpose}
                                        onChange={(e) => setCheckInData({...checkInData, purpose: e.target.value})}
                                        required
                                    >
                                        <option value="">Select Purpose</option>
                                        <option value="Leave for Home">Leave for Home</option>
                                        <option value="Medical Checkup">Medical Checkup</option>
                                        <option value="Library Study">Library Study</option>
                                        <option value="Emergency">Emergency</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                
                                <div className="form-group">
                                    <label>Expected Return Time</label>
                                    <input
                                        type="datetime-local"
                                        value={checkInData.expectedReturn}
                                        onChange={(e) => setCheckInData({...checkInData, expectedReturn: e.target.value})}
                                        required
                                    />
                                </div>
                                
                                <div className="form-actions">
                                    <button type="submit" className="submit-btn">
                                        📝 Record Check-out
                                    </button>
                                    <button type="button" className="checkin-btn">
                                        🏠 Record Check-in
                                    </button>
                                </div>
                            </form>

                            {/* Recent Activity */}
                            <div className="recent-activity">
                                <h3>Recent Activity</h3>
                                <div className="activity-list">
                                    {checkInHistory.slice(0, 5).map((record) => (
                                        <div key={record.id} className="activity-item">
                                            <div className="activity-icon">
                                                <span>{getStatusIcon(record.status)}</span>
                                            </div>
                                            <div className="activity-details">
                                                <h4>{record.studentName}</h4>
                                                <p>ID: {record.studentId} | Room: {record.roomNumber}</p>
                                                <p>Purpose: {record.purpose}</p>
                                                <span className="activity-time">{record.checkInTime}</span>
                                            </div>
                                            <div className="activity-status">
                                                <span 
                                                    className="status-badge"
                                                    style={{ backgroundColor: getStatusColor(record.status) }}
                                                >
                                                    {record.status === 'checked_in' ? 'In Hostel' : 'Checked Out'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default Login;
