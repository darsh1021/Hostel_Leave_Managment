import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import { handleSuccess, handleError } from '../util';
import { useNavigate, useLocation } from 'react-router-dom';
import { DashboardLayout } from './UI/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from './UI/Card';
import { Button } from './UI/Button';
import { Badge } from './UI/Badge';
import { Input } from './UI/Input';
import { WelcomeSplash, EmptyState, LoadingScreen } from './UI/PolishedElements';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from './UI/Table';
import ReviewModelAdmin from './SubComponents/ReviewModelAdmin';
import AddStudent from './AdminDasboard/AddStudent';
import { 
  Users, 
  FileText, 
  ClipboardCheck, 
  ChevronRight, 
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  MoreVertical,
  Plus
} from 'lucide-react';

function AdminUI() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const activeTab = queryParams.get('tab') || 'dashboard';

  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchApplications = async () => {
    try {
      const res = await axios.get("https://cp-project-5ths.onrender.com/getApplications", {
        params: { accept: 2 }
      });
      setApplications(res.data.data || []);
    } catch (err) {
      console.error("Error fetching applications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleAccept = async (app) => {
    try {
      const updatedApp = { ...app, accept: 4 };
      setApplications((prev) => prev.filter((a) => a._id !== app._id));
      await axios.post("https://cp-project-5ths.onrender.com/auth/updateApplication", updatedApp);
      handleSuccess("Application Approved Successfully");
      setSelectedApp(null);
    } catch (err) {
      handleError("Action Failed");
    }
  };

  const handleReject = async (app) => {
    try {
      const updatedApp = { ...app, accept: 5 };
      setApplications((prev) => prev.filter((a) => a._id !== app._id));
      await axios.post("https://cp-project-5ths.onrender.com/auth/updateApplication", updatedApp);
      handleSuccess("Application Rejected");
      setSelectedApp(null);
    } catch (err) {
      handleError("Action Failed");
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-GB");
  };

  const filteredApps = applications.filter(app => 
    app.StudentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.Room_no.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <LoadingScreen />;

  return (
    <DashboardLayout 
      title="Admin Dashboard" 
      role="admin" 
      user={{ name: "Dr. Alok Verma", role: "Chief Warden" }}
      notificationsCount={applications.length}
    >
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeTab === 'dashboard' && (
          <>
            <WelcomeSplash name="Administrator" />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                { title: 'Active Students', value: '842', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', change: '+12 this week' },
                { title: 'Pending Review', value: applications.length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', change: 'Awaiting action' },
                { title: 'Authorizations', value: '156', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', change: '84% increase' },
                { title: 'Violations', value: '3', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50', change: 'Action required' },
              ].map((stat, i) => (
                <Card key={i} className="border-none shadow-sm hover:shadow-md transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                        <stat.icon size={22} />
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.title}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-3xl font-black text-slate-900">{stat.value}</h3>
                      <span className="text-[11px] font-bold text-emerald-500">{stat.change}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <Card className="lg:col-span-2 border-none shadow-sm overflow-hidden h-full">
                <CardHeader className="flex flex-row items-center justify-between border-b bg-white pb-6 pt-8 px-8">
                  <div>
                    <CardTitle className="text-xl font-black italic">Awaiting Authorization</CardTitle>
                    <CardDescription className="text-sm font-medium">Final approval required for these leaving requests.</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-xl border-slate-200" onClick={() => navigate('/admin-ui?tab=applications')}>
                    View All Queues <ChevronRight size={16} className="ml-1" />
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  {filteredApps.length > 0 ? (
                    <Table>
                        <TableHeader>
                        <TableRow className="bg-slate-50/50">
                            <TableHead className="font-black uppercase tracking-[0.15em] text-[10px] text-slate-400 pl-8">Resident</TableHead>
                            <TableHead className="font-black uppercase tracking-[0.15em] text-[10px] text-slate-400">Category</TableHead>
                            <TableHead className="font-black uppercase tracking-[0.15em] text-[10px] text-slate-400">Duration</TableHead>
                            <TableHead className="font-black uppercase tracking-[0.15em] text-[10px] text-slate-400 text-right pr-8">Actions</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {filteredApps.slice(0, 6).map((app) => (
                            <TableRow key={app._id} className="group hover:bg-slate-50/80 transition-colors">
                            <TableCell className="pl-8">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-500 shadow-sm border border-slate-200 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                        {app.StudentName.charAt(0)}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-900 group-hover:text-primary transition-colors">{app.StudentName}</span>
                                        <span className="text-[11px] font-bold text-slate-400 uppercase">Room {app.Room_no}</span>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant="secondary" className="px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider">{app.ApplicationType}</Badge>
                            </TableCell>
                            <TableCell className="text-xs font-bold text-slate-500">
                                {formatDate(app.start_Date)} <span className="opacity-30 mx-1">→</span> {formatDate(app.end_date)}
                            </TableCell>
                            <TableCell className="text-right pr-8">
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="rounded-xl font-bold bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all group/btn" 
                                    onClick={() => setSelectedApp(app)}
                                >
                                    Review <ArrowUpRight size={14} className="ml-1 opacity-50 group-hover/btn:opacity-100 transition-opacity" />
                                </Button>
                            </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                  ) : (
                    <EmptyState 
                        icon={ClipboardCheck}
                        title="All Cleared!" 
                        description="There are no pending applications requiring your authorization right now."
                    />
                  )}
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="border-none shadow-sm bg-primary p-2">
                  <CardContent className="pt-6">
                    <h4 className="text-primary-foreground font-black text-lg mb-2">Quick Onboard</h4>
                    <p className="text-primary-foreground/70 text-sm mb-6 font-medium leading-relaxed">Add a new student to the system and allocate room instantly.</p>
                    <Button onClick={() => navigate('/addStudent')} className="w-full bg-white text-primary hover:bg-slate-50 h-12 rounded-2xl font-black shadow-xl shadow-primary/20">
                        <Plus className="mr-2 h-5 w-5" /> REGISTER STUDENT
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                    <CardHeader className="pb-4 border-b border-slate-50">
                        <CardTitle className="text-base font-black uppercase tracking-tight italic">Upcoming Events</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-slate-50">
                            {[
                                { title: 'Dorm Cleaning', time: 'Tomorrow, 09:00 AM', color: 'bg-amber-400' },
                                { title: 'Fire Safety Drill', time: '14 Oct, 11:30 AM', color: 'bg-red-400' },
                                { title: 'Parents Meet', time: '18 Oct, 03:00 PM', color: 'bg-emerald-400' },
                            ].map((event, j) => (
                                <div key={j} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                                    <div className={`h-2 w-2 rounded-full ${event.color} shadow-glow`} />
                                    <div>
                                        <p className="text-[13px] font-bold text-slate-900">{event.title}</p>
                                        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{event.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}

        {activeTab === 'applications' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h3 className="text-3xl font-black text-slate-900 italic">Leaves Queue</h3>
                    <p className="text-slate-500 font-medium">Manage and monitor all leave cycles within the hostel.</p>
                </div>
                <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border shadow-sm">
                    <div className="relative flex-1 min-w-[240px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Student name or room..." 
                            className="h-10 border-none bg-slate-50 rounded-xl pl-10" 
                        />
                    </div>
                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-slate-200">
                        <Filter size={18} className="text-slate-500" />
                    </Button>
                </div>
            </div>

            <Card className="border-none shadow-sm overflow-hidden">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50/80">
                                <TableHead className="font-black uppercase tracking-[0.12em] text-[10px] pl-8">Student</TableHead>
                                <TableHead className="font-black uppercase tracking-[0.12em] text-[10px]">Type</TableHead>
                                <TableHead className="font-black uppercase tracking-[0.12em] text-[10px]">Priority</TableHead>
                                <TableHead className="font-black uppercase tracking-[0.12em] text-[10px]">Timeline</TableHead>
                                <TableHead className="font-black uppercase tracking-[0.12em] text-[10px] text-right pr-8">Management</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredApps.map((app) => (
                                <TableRow key={app._id} className="hover:bg-primary/5 transition-colors group">
                                    <TableCell className="pl-8">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-900">{app.StudentName}</span>
                                            <span className="text-[11px] font-bold text-slate-400">R: {app.Room_no}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest">{app.ApplicationType}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={app.urgancy ? "destructive" : "secondary"} className="h-6 px-2 text-[10px] font-bold">
                                            {app.urgancy ? "URGENT" : "NORMAL"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-xs font-bold text-slate-500">
                                        {formatDate(app.start_Date)} <span className="opacity-30">→</span> {formatDate(app.end_date)}
                                    </TableCell>
                                    <TableCell className="text-right pr-8">
                                        <Button variant="ghost" size="sm" onClick={() => setSelectedApp(app)} className="rounded-lg h-8 px-4 font-bold text-primary hover:bg-primary hover:text-white transition-all">
                                            Manage
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'students' && (
            <div className="max-w-4xl mx-auto">
                <AddStudent embedded={true} />
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
      <ToastContainer position="top-center" />
    </DashboardLayout>
  );
}

export default AdminUI;
