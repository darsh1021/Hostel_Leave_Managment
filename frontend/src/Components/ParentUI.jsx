import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DashboardLayout } from './UI/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from './UI/Card';
import { Button } from './UI/Button';
import { Badge } from './UI/Badge';
import { Input } from './UI/Input';
import ParentReviewModel from './SubComponents/ParentReviewModel';
import { WelcomeSplash, EmptyState, LoadingScreen } from './UI/PolishedElements';
import { 
  User, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  ChevronRight, 
  ClipboardCheck,
  AlertCircle,
  Activity,
  History
} from 'lucide-react';

import { useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';

function ParentUI() {
    const email = localStorage.getItem("email");
    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);
    const activeTab = queryParams.get('tab') || 'status';

    const [parentInfo, setParentInfo] = useState({
        email: "",
        studentName: "Loading..."
    });
    const [selectedApp, setSelectedApp] = useState(null);
    const [previousApplications, setPreviousApplications] = useState([]);
    const [approvedApplications, setApprovedApplications] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(true);

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        return new Date(dateStr).toLocaleDateString("en-GB");
    };

    const fetchStudent = async () => {
        try {
            const res = await axios.get('https://cp-project-5ths.onrender.com/Student', { params: { email } });
            setParentInfo({
                email: res.data.data.p_email || email,
                studentName: res.data.data.s_name || "Resident"
            });
        } catch (err) {
            console.error("Error fetching student info");
        }
    };

    const fetchApplications = async () => {
        try {
            // Fetch Pending (0)
            const resPending = await axios.get("https://cp-project-5ths.onrender.com/getApplications", {
                params: { accept: 0, email: parentInfo.email }
            });
            
            const pendingApps = (resPending.data.data || []).map((info) => ({
                id: info._id,
                _id: info._id,
                type: info.ApplicationType,
                date: formatDate(info.start_Date),
                end_date: formatDate(info.end_date),
                reason: info.reason,
                status: 'Awaiting Your Approval',
                email: info.email,
                urgancy: info.urgancy,
                start_Date: info.start_Date
            }));
            setPreviousApplications(pendingApps);

            // Fetch Approved History (1, 2, 4)
            const states = [1, 2, 4, 5];
            const historyRequests = states.map(s => 
                axios.get("https://cp-project-5ths.onrender.com/getApplications", {
                    params: { accept: s, email: parentInfo.email }
                })
            );
            
            const historyResponses = await Promise.all(historyRequests);
            const allHistory = historyResponses.flatMap((res, index) => (res.data.data || []).map(info => ({
                id: info._id,
                type: info.ApplicationType,
                date: formatDate(info.start_Date),
                end_date: formatDate(info.end_date),
                reason: info.reason,
                status: states[index] === 4 ? 'Fully Authorized' : 
                        states[index] === 5 ? 'Rejected' : 
                        'Processing Chain',
                code: states[index],
                urgancy: info.urgancy
            })));

            setApprovedApplications(allHistory.sort((a, b) => b.id.localeCompare(a.id)));
        } catch (err) {
            console.error("Error fetching applications");
        }
    };

    useEffect(() => {
        const init = async () => {
            await fetchStudent();
            setLoading(false);
        };
        init();
    }, []);

    useEffect(() => {
        if (parentInfo.email) {
            fetchApplications();
        }
    }, [parentInfo.email, activeTab]);

    const handleAccept = async (app) => {
        try {
            const payload = { ...app, accept: 1, _id: app.id };
            setPreviousApplications((prev) => prev.filter((a) => a.id !== app.id));
            await axios.post("https://cp-project-5ths.onrender.com/auth/updateApplication", payload);
            setSelectedApp(null);
            fetchApplications(); // Refresh history
        } catch (err) {
            console.error("Failed to accept application");
        }
    };

    const handleReject = async (app) => {
        try {
            const payload = { ...app, accept: 5, _id: app.id };
            setPreviousApplications((prev) => prev.filter((a) => a.id !== app.id));
            await axios.post("https://cp-project-5ths.onrender.com/auth/updateApplication", payload);
            setSelectedApp(null);
            fetchApplications(); // Refresh history
        } catch (err) {
            console.error("Failed to reject application");
        }
    };

    const activityData = [
        { date: 'Today', status: 'checked_in', time: '08:30 AM', location: 'Hostel Main Gate' },
        { date: 'Yesterday', status: 'checked_out', time: '06:00 PM', location: 'Campus Library' },
        { date: 'Yesterday', status: 'checked_in', time: '09:00 PM', location: 'Hostel Main Gate' },
        { date: '18 Oct', status: 'checked_in', time: '08:15 AM', location: 'Hostel Main Gate' },
    ];

    const getActivityStatusColor = (status) => {
        return status === 'checked_in' ? 'bg-emerald-500' : 'bg-red-500';
    };

    if (loading) return <LoadingScreen />;

    return (
        <DashboardLayout 
            title="Parent Portal" 
            role="parent" 
            user={{ name: "Authorized Guardian", role: parentInfo.email }}
            notificationsCount={previousApplications.length}
        >
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {(activeTab === 'status' || activeTab === 'notifications') && (
                    <>
                        <WelcomeSplash name="Guardian" />

                        <div className="flex flex-col md:flex-row items-center gap-6 bg-white p-6 rounded-[32px] shadow-sm border border-slate-100">
                            <div className="h-16 w-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-primary shadow-inner">
                                <User size={30} />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-xl font-black tracking-tight text-slate-900">Ward: {parentInfo.studentName}</h2>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                                        <ShieldCheck size={12} /> Secure Monitoring Active
                                    </span>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">• Level 4 Authorization</span>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Button variant="outline" className="rounded-xl h-11 border-slate-200">
                                    <Phone className="mr-2 h-4 w-4" /> warden
                                </Button>
                                <Button className="rounded-xl h-11 shadow-xl shadow-primary/20">
                                    <Mail className="mr-2 h-4 w-4" /> Message
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                            {[
                                { label: 'Attendance', value: '98%', icon: ClipboardCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                                { label: 'Curfew Status', value: 'In Room', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
                                { label: 'Total Leaves', value: approvedApplications.length.toString(), icon: History, color: 'text-amber-600', bg: 'bg-amber-50' },
                                { label: 'Violations', value: '0', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
                            ].map((stat, i) => (
                                <Card key={i} className="border-none shadow-sm hover:translate-y-[-2px] transition-all">
                                    <CardContent className="p-5 flex items-center gap-4">
                                        <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                                            <stat.icon size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-0.5">{stat.label}</p>
                                            <p className="text-xl font-black text-slate-900">{stat.value}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between px-2">
                                    <h3 className="text-lg font-black flex items-center gap-2 italic">
                                        <ShieldCheck size={20} className="text-primary" />
                                        Action Required
                                    </h3>
                                    {previousApplications.length > 0 && <Badge className="bg-primary px-3 rounded-full font-black text-[10px]">{previousApplications.length} NEW</Badge>}
                                </div>
                                
                                <div className="space-y-4">
                                    {previousApplications.map((app) => (
                                        <Card key={app.id} className="border-none shadow-sm hover:shadow-lg transition-all duration-300 rounded-[24px] overflow-hidden group">
                                            <CardContent className="p-6">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                                                            <CalendarIcon size={24} />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-black text-slate-900 leading-tight">{app.type}</h4>
                                                            <p className="text-[11px] font-bold text-slate-400 uppercase mt-0.5 tracking-tighter">Requested for {app.date}</p>
                                                        </div>
                                                    </div>
                                                    <Badge variant={app.urgancy ? "destructive" : "secondary"} className="rounded-full px-3 h-6 font-black text-[9px] tracking-widest">
                                                        {app.urgancy ? "EMERGENCY" : "STANDARD"}
                                                    </Badge>
                                                </div>
                                                
                                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6 italic text-sm text-slate-600 leading-relaxed font-medium">
                                                    "{app.reason}"
                                                </div>

                                                <div className="flex gap-3">
                                                    <Button className="flex-1 h-12 rounded-xl font-bold shadow-lg shadow-primary/20" onClick={() => setSelectedApp(app)}>Review Action</Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                    {previousApplications.length === 0 && (
                                        <EmptyState 
                                            icon={ClipboardCheck}
                                            title="All Set!" 
                                            description="No pending leave requests require your attention at this moment."
                                        />
                                    )}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between px-2">
                                    <h3 className="text-lg font-black flex items-center gap-2 italic">
                                        <Activity size={20} className="text-primary" />
                                        Movement Feed
                                    </h3>
                                    <Input 
                                        type="date" 
                                        className="w-40 h-10 rounded-xl bg-white border-slate-200 text-xs font-bold" 
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                    />
                                </div>

                                <Card className="border-none shadow-sm overflow-hidden rounded-[24px]">
                                    <div className="bg-white p-5 border-b border-slate-50 flex items-center justify-between">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live Activity Log</span>
                                        <Badge variant="outline" className="h-5 text-[9px] border-emerald-200 text-emerald-600 bg-emerald-50">SYNCED</Badge>
                                    </div>
                                    <CardContent className="p-0">
                                        <div className="divide-y divide-slate-50">
                                            {activityData.map((activity, index) => (
                                                <div key={index} className="px-6 py-5 flex items-center gap-5 hover:bg-slate-50/80 transition-colors">
                                                    <div className="text-center min-w-[50px]">
                                                        <p className="text-xs font-black text-slate-900 leading-none">{activity.time.split(' ')[0]}</p>
                                                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">{activity.time.split(' ')[1]}</p>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <div className={`h-2 w-2 rounded-full ${getActivityStatusColor(activity.status)} shadow-[0_0_8px_rgba(16,185,129,0.3)]`} />
                                                            <span className="text-[13px] font-black text-slate-900 uppercase tracking-tighter italic">
                                                                {activity.status.replace('_', ' ')}
                                                            </span>
                                                        </div>
                                                        <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                                                            <MapPin size={12} className="opacity-40" /> {activity.location}
                                                        </p>
                                                    </div>
                                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{activity.date}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'approvals' && (
                    <div className="space-y-6">
                         <div className="flex flex-col mb-10">
                            <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2 italic flex items-center gap-3">
                                <History size={36} className="text-primary" />
                                Authorization History
                            </h1>
                            <p className="text-slate-500 font-bold tracking-tight text-lg italic">Comprehensive log of previously processed leave requests.</p>
                        </div>

                        <Card className="border-none shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] rounded-[32px] overflow-hidden bg-white border border-slate-50">
                            <CardContent className="p-0">
                                {approvedApplications.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead>
                                                <tr className="bg-slate-50 border-b border-slate-100">
                                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Application Type</th>
                                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Period</th>
                                                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Priority</th>
                                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Approval Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {approvedApplications.map((app) => (
                                                    <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                                                        <td className="px-8 py-5 font-black text-slate-900 italic">{app.type}</td>
                                                        <td className="px-6 py-5">
                                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                                                {app.date} <ArrowRight size={12} className="opacity-30" /> {app.end_date}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <Badge variant={app.urgancy ? "destructive" : "secondary"} className="rounded-full px-3 py-1 font-black text-[8px] tracking-widest uppercase">
                                                                {app.urgancy ? "Emergency" : "Standard"}
                                                            </Badge>
                                                        </td>
                                                        <td className="px-8 py-5 text-right">
                                                            <Badge className={cn(
                                                                "rounded-full px-4 py-1.5 font-black text-[9px] uppercase tracking-widest italic shadow-sm",
                                                                app.code === 4 ? "bg-emerald-500 text-white shadow-emerald-100" : 
                                                                app.code === 5 ? "bg-red-500 text-white shadow-red-100" : 
                                                                "bg-primary text-white shadow-slate-100"
                                                            )}>
                                                                {app.status}
                                                            </Badge>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="py-20">
                                        <EmptyState 
                                            icon={History}
                                            title="No History Found" 
                                            description="Records of approved or rejected leaves will appear here once processed."
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>

            {selectedApp && (
                <ParentReviewModel
                    application={selectedApp}
                    onClose={() => setSelectedApp(null)}
                    onAccept={handleAccept}
                    onReject={handleReject}
                />
            )}
        </DashboardLayout>
    );
}

const ArrowRight = ({ size, className }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="M5 12h14m-6-6 6 6-6 6"/>
    </svg>
);

export default ParentUI;
