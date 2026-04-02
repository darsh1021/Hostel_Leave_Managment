import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { DashboardLayout } from './UI/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from './UI/Card';
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
import ReviewModel from './SubComponents/ReviewModel';
import { ClipboardList, CheckCircle, Clock, BarChart3, Search, ExternalLink, Users, Filter, Calendar } from 'lucide-react';
import { cn } from '../lib/utils';

const MentorUI = () => {
    const navigate = useNavigate();
    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);
    const activeTab = queryParams.get('tab') || 'dashboard';

    const [applications, setApplications] = useState([]);
    const [historyApplications, setHistoryApplications] = useState([]);
    const [selectedApp, setSelectedApp] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchApplications = async () => {
        try {
            // Fetch Pending (1)
            const resPending = await axios.get("https://cp-project-5ths.onrender.com/getApplications", {
                params: { accept: 1 }
            });
            setApplications(resPending.data.data || []);

            // Fetch History (2: Mentor Approved, 4: Fully Approved, 5: Rejected)
            const states = [2, 4, 5];
            const historyRequests = states.map(s => 
                axios.get("https://cp-project-5ths.onrender.com/getApplications", {
                    params: { accept: s }
                })
            );
            
            const historyResponses = await Promise.all(historyRequests);
            const allHistory = historyResponses.flatMap((res, index) => (res.data.data || []).map(info => ({
                ...info,
                historyStatus: states[index] === 4 ? 'Fully Authorized' : 
                               states[index] === 5 ? 'Rejected' : 
                               'Pending Warden',
                historyCode: states[index]
            })));

            setHistoryApplications(allHistory.sort((a, b) => b._id.localeCompare(a._id)));
        } catch (err) {
            console.error("Error fetching applications:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, [activeTab]);

    const handleAccept = async (app) => {
        try {
            const updatedApp = { ...app, accept: 2 };
            setApplications((prev) => prev.filter((a) => a._id !== app._id));
            await axios.post("https://cp-project-5ths.onrender.com/auth/updateApplication", updatedApp);
            setSelectedApp(null);
            fetchApplications();
        } catch (err) {
            console.error("Failed to update application");
        }
    };

    const handleReject = async (app) => {
        try {
            const updatedApp = { ...app, accept: 5 };
            setApplications((prev) => prev.filter((a) => a._id !== app._id));
            await axios.post("https://cp-project-5ths.onrender.com/auth/updateApplication", updatedApp);
            setSelectedApp(null);
            fetchApplications();
        } catch (err) {
            console.error("Failed to reject application");
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        return new Date(dateStr).toLocaleDateString("en-GB");
    };

    const filteredApps = applications.filter(app => 
        (app.StudentName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (app.Room_no || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredHistory = historyApplications.filter(app => 
        (app.StudentName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (app.Room_no || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return <LoadingScreen />;

    return (
        <DashboardLayout 
            title="Mentor Portal" 
            role="mentor" 
            user={{ name: "Prof. Rajesh Sharma", role: "Sr. Mentor" }}
            notificationsCount={applications.length}
        >
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {activeTab === 'dashboard' && (
                    <>
                        <WelcomeSplash name="Prof. Rajesh" />

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <Card className="border-none shadow-sm h-full group hover:bg-slate-50 transition-colors rounded-[32px]">
                                <CardContent className="p-6 flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Students Assigned</p>
                                        <div className="text-3xl font-black text-slate-900">128</div>
                                        <p className="text-xs text-emerald-500 font-bold mt-1">+4 from last semester</p>
                                    </div>
                                    <div className="h-14 w-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                        <Users size={24} />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-sm h-full bg-primary text-primary-foreground rounded-[32px]">
                                <CardContent className="p-6 flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-primary-foreground/50 mb-1">Reviews Pending</p>
                                        <div className="text-3xl font-black">{applications.length}</div>
                                        <p className="text-xs text-primary-foreground/70 font-medium mt-1">Requires focus today</p>
                                    </div>
                                    <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center text-white">
                                        <Clock size={24} />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-sm h-full group hover:bg-slate-50 transition-colors rounded-[32px]">
                                <CardContent className="p-6 flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">History Ledger</p>
                                        <div className="text-3xl font-black text-slate-900">{historyApplications.length}</div>
                                        <p className="text-xs text-slate-400 font-bold mt-1">Processed records</p>
                                    </div>
                                    <div className="h-14 w-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                                        <CheckCircle size={24} />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card className="border-none shadow-sm overflow-hidden rounded-[32px]">
                            <CardHeader className="flex flex-row items-center justify-between border-b bg-white pb-6 pt-8 px-8">
                                <div>
                                    <CardTitle className="text-xl font-black italic">Student Submissions</CardTitle>
                                    <CardDescription className="text-xs font-medium">Review and authorize student leave requests before admin clearance.</CardDescription>
                                </div>
                                <div className="flex gap-3">
                                    <div className="relative hidden md:block">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <Input 
                                            placeholder="Student or Room..." 
                                            className="h-10 w-64 pl-10 rounded-xl bg-slate-50 border-none" 
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                    <Button variant="outline" className="rounded-xl border-slate-200 font-black text-[10px] tracking-widest uppercase h-10 px-6" onClick={() => navigate('/mentor-ui?tab=approvals')}>
                                        VIEW HISTORY
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                {filteredApps.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-slate-50/50">
                                                <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400 pl-8">Resident</TableHead>
                                                <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400">Request Type</TableHead>
                                                <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400">Timeline</TableHead>
                                                <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-400">Priority</TableHead>
                                                <TableHead className="text-right font-black text-[10px] uppercase tracking-widest text-slate-400 pr-8">Decision</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredApps.slice(0, 8).map((app) => (
                                                <TableRow key={app._id} className="hover:bg-slate-50 transition-colors group">
                                                    <TableCell className="pl-8 py-5">
                                                        <div className="flex flex-col">
                                                            <span className="font-black text-slate-900 group-hover:text-primary transition-colors text-base italic">{app.StudentName}</span>
                                                            <span className="text-[10px] font-black text-slate-400 tracking-widest">HOSTEL UNIT {app.Room_no}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="secondary" className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter">{app.ApplicationType}</Badge>
                                                    </TableCell>
                                                    <TableCell className="text-xs font-bold text-slate-500 italic">
                                                        <div className="flex items-center gap-1">
                                                            {formatDate(app.start_Date)}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant={app.urgancy ? "destructive" : "outline"} className="text-[9px] font-black uppercase h-5 tracking-tighter rounded-full px-3">
                                                            {app.urgancy ? "EMERGENCY" : "STANDARD"}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right pr-8">
                                                        <Button 
                                                            variant="primary" 
                                                            size="sm" 
                                                            className="rounded-xl font-black italic px-5 shadow-lg shadow-primary/20"
                                                            onClick={() => setSelectedApp(app)}
                                                        >
                                                            Review Case
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <div className="py-20">
                                        <EmptyState 
                                            icon={ClipboardList}
                                            title="No Pending Tasks" 
                                            description="You've reviewed all student applications. Take a break!"
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </>
                )}

                {activeTab === 'approvals' && (
                    <div className="space-y-6">
                        <div className="flex flex-col mb-10">
                            <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2 italic flex items-center gap-3">
                                <BarChart3 size={36} className="text-primary" />
                                Authorization Ledger
                            </h1>
                            <p className="text-slate-500 font-bold tracking-tight text-lg italic">Complete history of processed student leave applications.</p>
                        </div>

                        <Card className="border-none shadow-sm rounded-[32px] overflow-hidden bg-white">
                            <CardHeader className="flex flex-row items-center justify-between border-b p-8">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        <Input 
                                            placeholder="Search history..." 
                                            className="h-11 w-80 pl-10 rounded-2xl bg-slate-50 border-none" 
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <Badge variant="outline" className="rounded-full px-5 py-1.5 font-black text-[10px] tracking-widest">{filteredHistory.length} RECORDS</Badge>
                            </CardHeader>
                            <CardContent className="p-0">
                                {filteredHistory.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <tr className="bg-slate-50 border-b border-slate-100">
                                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Student Identity</th>
                                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Category</th>
                                                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Timeline</th>
                                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Approval Status</th>
                                            </tr>
                                        </TableHeader>
                                        <TableBody className="divide-y divide-slate-50">
                                            {filteredHistory.map((app) => (
                                                <TableRow key={app._id} className="hover:bg-slate-50/50 transition-colors">
                                                    <TableCell className="px-8 py-5">
                                                        <div className="flex flex-col">
                                                            <span className="font-black text-slate-900 italic text-base leading-none mb-1">{app.StudentName}</span>
                                                            <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">UNIT {app.Room_no}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="px-6 py-5">
                                                        <Badge variant="secondary" className="rounded-full px-3 py-1 font-black text-[8px] tracking-widest uppercase">
                                                            {app.ApplicationType}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="px-6 py-5 text-xs font-bold text-slate-500 italic">
                                                        {formatDate(app.start_Date)}
                                                    </TableCell>
                                                    <TableCell className="px-8 py-5 text-right">
                                                        <Badge className={cn(
                                                            "rounded-full px-4 py-1.5 font-black text-[9px] uppercase tracking-widest italic shadow-sm",
                                                            app.historyCode === 4 ? "bg-emerald-500 text-white" : 
                                                            app.historyCode === 5 ? "bg-red-500 text-white" : 
                                                            "bg-primary text-white"
                                                        )}>
                                                            {app.historyStatus}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <div className="py-20">
                                        <EmptyState 
                                            icon={BarChart3}
                                            title="No Records Found" 
                                            description="Try broadening your search or check back later."
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>

            {selectedApp && (
                <ReviewModel
                    application={selectedApp}
                    onClose={() => setSelectedApp(null)}
                    onAccept={handleAccept}
                    onReject={handleReject}
                />
            )}
        </DashboardLayout>
    );
};

export default MentorUI;
