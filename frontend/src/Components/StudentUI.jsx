import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import { handleSuccess, handleError } from '../util';
import { useNavigate, useLocation } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { DashboardLayout } from './UI/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from './UI/Card';
import { Button } from './UI/Button';
import { Input } from './UI/Input';
import { Badge } from './UI/Badge';
import { WelcomeSplash, EmptyState, LoadingScreen } from './UI/PolishedElements';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from './UI/Table';
import { 
  Home, 
  FileText, 
  QrCode, 
  Clock, 
  Send, 
  CheckCircle2, 
  AlertCircle,
  Calendar,
  ShieldCheck,
  Info,
  User,
  Mail,
  Building,
  ArrowRight
} from 'lucide-react';

function StudentUI() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const activeTab = queryParams.get('tab') || 'status';
  const email = localStorage.getItem("email");

  const [studentInfo, setStudentInfo] = useState({
    name: 'Loading...',
    department: '...',
    room: '...',
    application: 0,
    status: 'Active'
  });

  const [formData, setFormData] = useState({
    applicationType: "",
    startDate: "",
    endDate: "",
    reason: "",
    urgent: false,
    documents: [],
  });

  const [previousApplications, setPreviousApplications] = useState([]);
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-GB");
  };

  const fetchStudent = async () => {
    if (!email) return;
    try {
      const res = await axios.get('https://cp-project-5ths.onrender.com/Student', { params: { email } });
      const data = res.data.data;
      setStudentInfo({
        name: data.s_name || "Student",
        department: data.department || "Resident",
        room: data.r_no || "Unassigned",
        application: data.application || 0,
        status: 'Active'
      });
    } catch (err) {
      handleError("Failed to fetch student info");
    }
  };

  const fetchApplications = async () => {
    try {
      const states = [0, 1, 2, 4, 5];
      const requests = states.map(s => 
        axios.get("https://cp-project-5ths.onrender.com/getApplicationsEmail", {
          params: { email: email, accept: s }
        })
      );
      
      const responses = await Promise.all(requests);
      const allApps = responses.flatMap((res, index) => (res.data.data || []).map(info => ({
        id: info._id,
        type: info.ApplicationType,
        date: formatDate(info.start_Date),
        end_date: formatDate(info.end_date),
        reason: info.reason,
        status: states[index] === 4 ? 'Approved' : 
                states[index] === 5 ? 'Rejected' : 
                states[index] === 0 ? 'Awaiting Parent' :
                states[index] === 1 ? 'Awaiting Mentor' :
                'Awaiting Warden',
        code: states[index]
      })));

      setPreviousApplications(allApps.sort((a, b) => b.id.localeCompare(a.id)));
    } catch (err) {
      console.error("Error fetching applications:", err);
    }
  };

  const getQr = async () => {
    try {
      const res = await axios.get("https://cp-project-5ths.onrender.com/getQr", { params: { email } });
      const qrArray = res.data.data;
      
      if (qrArray && qrArray.length > 0) {
        setQrData(qrArray);
        return;
      }

      // Fallback: Check local history for approved app
      const approvedApp = previousApplications.find(a => a.code === 4);
      if (approvedApp) {
        setQrData([{
            start_date: approvedApp.date,
            end_date: approvedApp.end_date,
            createdAt: new Date().toISOString()
        }]);
      } else {
        setQrData(null);
      }
    } catch (err) {
      setQrData(null);
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchStudent();
      await fetchApplications();
      if (activeTab === 'qr') {
        await getQr();
      }
      setLoading(false);
    };
    init();
  }, [activeTab]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "file" ? files : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Safety check for loaded data
    if (studentInfo.name === 'Loading...' || studentInfo.room === '...') {
        return handleError("Still loading student data. Please wait a moment.");
    }

    if (!formData.applicationType || !formData.startDate || !formData.endDate || !formData.reason) {
      return handleError("Please fill in all required fields (including Return Date)");
    }

    setIsSubmitting(true);
    try {
      const payload = {
        StudentName: studentInfo.name,
        Room_no: studentInfo.room,
        ApplicationType: formData.applicationType,
        reason: formData.reason,
        start_Date: formData.startDate,
        end_date: formData.endDate,
        email: email,
        Accepted: 0, 
        urgancy: formData.urgent
      };

      const response = await fetch("https://cp-project-5ths.onrender.com/auth/storeApplication", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok || result.success || result.status === 200) {
        handleSuccess("Application Transmitted Successfully");
        setFormData({
          applicationType: "",
          startDate: "",
          endDate: "",
          reason: "",
          urgent: false,
          documents: [],
        });
        fetchApplications();
        navigate('/student-ui?tab=status');
      } else {
        handleError(result.msg || result.message || "Registry rejection. Please check details.");
      }
    } catch (err) {
      console.error("Submission Error:", err);
      handleError("Network error: Unable to reach the authorization server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <DashboardLayout role="student" title="Student Service Portal">
      <div className="max-w-7xl mx-auto space-y-8">
        {activeTab === 'status' && (
          <>
            <WelcomeSplash 
              name={studentInfo.name} 
              message="Manage your leave requests and digital gate pass with ease."
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <Card className="border-none shadow-sm bg-primary text-primary-foreground rounded-3xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium opacity-80 uppercase tracking-widest">Current Room</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-black italic tracking-tighter">{studentInfo.room}</div>
                    <div className="rounded-2xl bg-white/10 backdrop-blur-md p-3 text-white border border-white/20">
                      <Home className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white/10 w-fit px-3 py-1 rounded-full border border-white/10">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    Resident Active
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm rounded-3xl bg-slate-50/50 border border-slate-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Pending Verification</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-4xl font-black text-slate-900 tracking-tighter">
                        {previousApplications.filter(a => a.code < 4).length}
                    </div>
                    <div className="rounded-2xl bg-amber-50 p-3 text-amber-600 border border-amber-100 shadow-sm">
                      <Clock className="h-6 w-6" />
                    </div>
                  </div>
                  <p className="mt-3 text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Sequential Approval Chain</p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm rounded-3xl bg-slate-50/50 border border-slate-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Resident Standing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-4xl font-black text-emerald-600 tracking-tighter">Good</div>
                    <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600 border border-emerald-100 shadow-sm">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                  </div>
                  <p className="mt-3 text-[10px] font-black uppercase tracking-widest text-slate-400 italic">No Registry Violations</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <Card className="lg:col-span-2 border-none shadow-sm rounded-[32px] overflow-hidden bg-white border border-slate-100 h-fit">
                <CardHeader className="flex flex-row items-center justify-between p-8 border-b border-slate-50">
                  <div>
                    <CardTitle className="text-xl font-black italic">Application Ledger</CardTitle>
                    <CardDescription className="text-xs font-medium">Monitoring your authorization lifecycle.</CardDescription>
                  </div>
                  <Badge variant="outline" className="rounded-full px-4 py-1 font-bold text-[10px] uppercase">Live Sync</Badge>
                </CardHeader>
                <CardContent className="p-0">
                  {previousApplications.length > 0 ? (
                    <Table>
                        <TableHeader>
                        <TableRow className="bg-slate-50/50">
                            <TableHead className="font-black uppercase tracking-widest text-[10px] pl-8">Category</TableHead>
                            <TableHead className="font-black uppercase tracking-widest text-[10px]">Authorization Window</TableHead>
                            <TableHead className="font-black uppercase tracking-widest text-[10px] text-right pr-8">Status</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {previousApplications.slice(0, 6).map((app) => (
                            <TableRow key={app.id} className="group hover:bg-slate-50/80 transition-colors">
                            <TableCell className="pl-8">
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                        <FileText size={16} />
                                    </div>
                                    <span className="font-bold text-slate-900 group-hover:text-primary transition-colors">{app.type}</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-xs font-bold text-slate-500">
                                {app.date} <span className="opacity-30 mx-1">→</span> {app.end_date}
                            </TableCell>
                            <TableCell className="text-right pr-8">
                                <Badge variant={
                                    app.code === 4 ? 'success' : 
                                    app.code === 5 ? 'danger' : 
                                    'warning'
                                } className="rounded-full px-3 py-1 font-black text-[9px] uppercase tracking-wider">
                                    {app.status}
                                </Badge>
                            </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                  ) : (
                    <div className="p-12">
                        <EmptyState 
                            icon={FileText}
                            title="No Active Ledger" 
                            description="All your future leave requests will be cataloged here."
                            action={
                                <Button className="rounded-2xl px-8 h-12 shadow-xl shadow-primary/20" onClick={() => navigate('/student-ui?tab=apply')}>
                                    Initiate Request
                                </Button>
                            }
                        />
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="border-none shadow-sm bg-slate-900 text-white rounded-[32px] overflow-hidden relative">
                  <CardHeader className="relative z-10 p-7">
                    <CardTitle className="text-lg font-black italic leading-none">Operations Deck</CardTitle>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Quick Service Access</p>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 gap-4 p-7 pt-0 relative z-10">
                    <Button className="w-full justify-between h-14 rounded-2xl bg-white text-slate-900 hover:bg-slate-50 border-none shadow-xl shadow-black/20" onClick={() => navigate('/student-ui?tab=apply')}>
                      <span className="font-black italic">Initiate Leave</span>
                      <Send className="h-5 w-5 text-primary" />
                    </Button>
                    <Button variant="outline" className="w-full justify-between h-14 rounded-2xl bg-white/5 border-white/10 hover:bg-white/10 text-white" onClick={() => navigate('/student-ui?tab=qr')}>
                      <span className="font-black italic">Display Pass</span>
                      <QrCode className="h-5 w-5 text-white/50" />
                    </Button>
                  </CardContent>
                  <div className="absolute right-[-20px] bottom-[-20px] h-40 w-40 rounded-full bg-primary blur-3xl opacity-20" />
                </Card>

                <Card className="border-none shadow-sm rounded-[32px] bg-indigo-50 border border-indigo-100">
                  <CardHeader className="pb-3 p-7">
                    <div className="flex items-center gap-3 text-primary">
                      <div className="h-9 w-9 rounded-xl bg-white border border-indigo-100 flex items-center justify-center shadow-sm">
                        <AlertCircle className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-sm font-black uppercase tracking-widest leading-none">Residency Notice</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-7 pt-0">
                    <p className="text-[13px] text-indigo-900 leading-relaxed font-bold italic">
                      "All leave requests must be submitted at least 24 hours in advance. Weekend authorizations close every Friday at 12 PM."
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}

        {activeTab === 'apply' && (
          <div className="max-w-3xl mx-auto py-8">
            <div className="text-center mb-12">
                <div className="h-20 w-20 bg-primary rounded-[28px] flex items-center justify-center text-white mx-auto mb-6 shadow-2xl shadow-primary/30 rotate-3">
                    <Send size={40} />
                </div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Initiate Authorization</h1>
                <p className="text-slate-500 font-bold tracking-tight text-lg italic">Submit a formal request for leave from residency.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 bg-white rounded-[40px] p-10 shadow-[0_32px_64px_-15px_rgba(0,0,0,0.08)] border border-slate-50">
                <div className="space-y-3 sm:col-span-2">
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Application Category</label>
                  <select
                    name="applicationType"
                    value={formData.applicationType}
                    onChange={handleChange}
                    className="flex h-14 w-full rounded-2xl border-2 border-slate-50 bg-slate-50 px-5 text-sm font-bold transition-all focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5"
                    required
                  >
                    <option value="">Select category...</option>
                    <option value="Leave Application">Vacation / Long Leave</option>
                    <option value="Emergency Leave">Emergency Leave</option>
                    <option value="Local Outing">Weekend / Local Outing</option>
                    <option value="Special Permission">Academic / Event Permission</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 ml-1 flex items-center gap-2">
                    <Calendar size={14} className="text-primary" /> Departure Date
                  </label>
                  <Input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="h-14 rounded-2xl bg-slate-50 border-2 border-slate-50 focus:bg-white font-bold"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 ml-1 flex items-center gap-2">
                    <Calendar size={14} className="text-primary" /> Return Date
                  </label>
                  <Input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="h-14 rounded-2xl bg-slate-50 border-2 border-slate-50 focus:bg-white font-bold"
                    required
                  />
                </div>

                <div className="space-y-3 sm:col-span-2">
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Justification Protocol</label>
                  <textarea
                    name="reason"
                    placeholder="Provide a detailed explanation for your absence..."
                    rows="4"
                    value={formData.reason}
                    onChange={handleChange}
                    className="flex min-h-[160px] w-full rounded-[32px] border-2 border-slate-50 bg-slate-50 px-6 py-5 text-[15px] font-bold italic transition-all focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/5 outline-none"
                    required
                  />
                </div>

                <div className="sm:col-span-2 p-7 rounded-[32px] border-2 border-indigo-50 bg-indigo-50/30 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-white border border-indigo-100 flex items-center justify-center text-red-500 shadow-sm">
                            <AlertCircle size={28} />
                        </div>
                        <div>
                            <p className="font-black text-lg text-indigo-950 tracking-tighter italic leading-none mb-1">Family Emergency?</p>
                            <p className="text-[11px] text-indigo-600 font-bold uppercase tracking-widest">Bypasses sequential review window.</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer scale-110">
                        <input 
                            type="checkbox" 
                            name="urgent"
                            checked={formData.urgent}
                            onChange={handleChange}
                            className="sr-only peer" 
                        />
                        <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500 shadow-inner"></div>
                    </label>
                </div>
              </div>
              
              <div className="flex gap-6 items-center">
                <Button 
                    type="submit" 
                    className="flex-1 h-16 rounded-3xl text-xl font-black italic shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] shadow-primary/30" 
                    disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing Registry..." : "Transmit Request"}
                </Button>
                <Button 
                    type="button" 
                    variant="ghost" 
                    className="h-16 px-10 rounded-3xl font-black text-slate-400 hover:text-slate-900"
                    onClick={() => navigate('/student-ui?tab=status')}
                >
                  Discard
                </Button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'qr' && (
          <div className="max-w-2xl mx-auto py-12 flex flex-col items-center">
            {qrData ? (
                <div className="w-full flex flex-col items-center">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Digital Gate Pass</h1>
                        <p className="text-slate-500 font-bold tracking-tight text-lg italic capitalize">Authorization Token for {studentInfo.name}</p>
                    </div>

                    <div className="w-full bg-white rounded-[48px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] border border-slate-50 overflow-hidden group">
                        <div className="bg-slate-900 p-10 text-white relative overflow-hidden">
                            <div className="flex items-center gap-6 relative z-10">
                                <div className="h-16 w-16 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform duration-500">
                                    <ShieldCheck className="h-8 w-8 text-emerald-400" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black tracking-tighter italic leading-none mb-1">Authenticated Access</h3>
                                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Verified Digital Asset</p>
                                </div>
                            </div>
                            <div className="absolute right-[-40px] top-[-40px] h-48 w-48 rounded-full bg-primary blur-3xl opacity-40" />
                        </div>

                        <div className="p-12 flex flex-col items-center">
                            <div className="relative p-10 bg-white rounded-[40px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] mb-12 border border-slate-50 group-hover:scale-[1.02] transition-transform duration-500">
                                <QRCode 
                                    value={`HostelID:${studentInfo.room}-Email:${email}`} 
                                    size={240} 
                                    className="relative z-10"
                                    fgColor="#0F172A"
                                />
                                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03]">
                                    <ShieldCheck className="h-48 w-48" />
                                </div>
                            </div>

                            <div className="w-full space-y-6">
                                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                                    <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Registry Name</span>
                                    <span className="font-black text-xl text-slate-900 tracking-tight">{studentInfo.name.toUpperCase()}</span>
                                </div>
                                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                                    <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Unit Allocation</span>
                                    <span className="font-black text-xl text-slate-900 italic tracking-tight">{studentInfo.room}</span>
                                </div>
                                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                                    <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Valid Horizon</span>
                                    <span className="font-black text-base text-primary tracking-tight">
                                        {qrData[0].start_date} <span className="mx-2 opacity-20">→</span> {qrData[0].end_date}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-12 p-6 rounded-[32px] bg-slate-50 border border-slate-100 flex items-start gap-5 w-full">
                                <div className="h-10 w-10 rounded-2xl bg-primary flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary/20">
                                    <Info size={20} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.2em]">Security Lifecycle</p>
                                    <p className="text-sm text-slate-700 leading-tight font-bold italic">
                                        This digital pass was issued on {new Date(qrData[0].createdAt).toLocaleDateString()} and is currently active for residential verification.
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-slate-50 p-6 border-t flex items-center justify-center gap-4">
                            <CheckCircle2 className="h-5 w-5 text-emerald-500 shadow-sm" />
                            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Official Residence Auth Token</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="w-full">
                    <EmptyState 
                        icon={QrCode}
                        title="Authorization Pending" 
                        description="Your Digital Gate Pass is generated automatically once your Warden grants leave approval."
                        action={
                            <Button 
                                className="rounded-3xl px-12 h-14 text-lg font-black italic shadow-2xl shadow-primary/30"
                                onClick={() => navigate('/student-ui?tab=apply')}
                            >
                                Initiate Leave Request
                            </Button>
                        }
                    />
                </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="max-w-5xl mx-auto py-8">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Card */}
                <Card className="md:col-span-1 border-none shadow-2xl rounded-[40px] overflow-hidden bg-slate-900 text-white h-fit">
                    <div className="p-10 flex flex-col items-center">
                        <div className="relative group">
                            <div className="h-32 w-32 rounded-[40px] bg-white text-slate-900 flex items-center justify-center overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-105 border-4 border-primary">
                                <User size={64} className="group-hover:scale-110 transition-transform duration-700" />
                            </div>
                            <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-emerald-500 rounded-2xl border-4 border-slate-900 flex items-center justify-center">
                                <ShieldCheck size={20} className="text-white" />
                            </div>
                        </div>
                        <h2 className="mt-8 text-2xl font-black tracking-tight text-center">{studentInfo.name.toUpperCase()}</h2>
                        <Badge className="mt-3 bg-white/10 text-slate-300 border-none rounded-full px-5 py-1 font-black text-[10px] uppercase tracking-[0.2em]">{studentInfo.status}</Badge>
                        
                        <div className="w-full mt-10 space-y-4">
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                                <Mail size={18} className="text-primary" />
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Contact Email</p>
                                    <p className="text-sm font-bold text-white/90 truncate max-w-[150px]">{email}</p>
                                </div>
                            </div>
                            <Button 
                                variant="outline" 
                                className="w-full h-14 rounded-2xl bg-white/5 border-white/10 hover:bg-white/10 text-white font-black italic justify-between group"
                                onClick={() => {
                                    localStorage.clear();
                                    handleSuccess("Logged out successfully");
                                    navigate('/Login');
                                }}
                            >
                                Terminate Session
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Details Section */}
                <div className="md:col-span-2 space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <Card className="border-none shadow-sm rounded-[32px] bg-white border border-slate-50 p-8 space-y-4">
                            <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-primary flex items-center justify-center shadow-sm">
                                <Building size={24} />
                            </div>
                            <div>
                                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Academic Unit</p>
                                <p className="text-xl font-black text-slate-900 tracking-tight italic">{studentInfo.department}</p>
                            </div>
                        </Card>
                        <Card className="border-none shadow-sm rounded-[32px] bg-white border border-slate-50 p-8 space-y-4">
                            <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm">
                                <Home size={24} />
                            </div>
                            <div>
                                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Housing Allocation</p>
                                <p className="text-xl font-black text-slate-900 tracking-tight italic">Unit {studentInfo.room}</p>
                            </div>
                        </Card>
                    </div>

                    <Card className="border-none shadow-sm rounded-[40px] bg-white border border-slate-50 overflow-hidden">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-xl font-black italic">Residency Metadata</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 space-y-6">
                            <div className="p-6 rounded-[32px] bg-slate-50 space-y-4 border border-slate-100">
                                <div className="flex justify-between items-center pb-4 border-b border-slate-200/50">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Admission Year</span>
                                    <span className="font-bold text-slate-900">2024 Batch</span>
                                </div>
                                <div className="flex justify-between items-center pb-4 border-b border-slate-200/50">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Academic Standing</span>
                                    <span className="font-bold text-emerald-600 uppercase text-xs tracking-widest">Compliant</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Registry ID</span>
                                    <span className="font-mono text-xs font-black text-slate-500">#{email.split('@')[0]}</span>
                                </div>
                            </div>

                            <div className="flex gap-4 p-6 rounded-[32px] bg-primary text-white shadow-xl shadow-primary/20">
                                <Info size={24} className="shrink-0 text-white/50" />
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40 leading-none mb-1">Notice</p>
                                    <p className="text-sm font-bold leading-tight italic">Registry updates must be processed through the Warden's Office directly.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
             </div>
          </div>
        )}
      </div>

      <ToastContainer position="bottom-right" />
    </DashboardLayout>
  );
}

export default StudentUI;
