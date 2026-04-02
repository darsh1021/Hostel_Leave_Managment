import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  LogOut, 
  Bell, 
  Menu, 
  X,
  User,
  ShieldCheck,
  QrCode,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const DashboardLayout = ({ children, title, role, user, notificationsCount = 0 }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const getNavItems = () => {
    switch (role) {
      case 'admin':
        return [
          { name: 'Dashboard', icon: LayoutDashboard, path: '/admin-ui?tab=dashboard' },
          { name: 'Applications', icon: FileText, path: '/admin-ui?tab=applications' },
          { name: 'Add Student', icon: Users, path: '/admin-ui?tab=students' },
        ];
      case 'student':
        return [
          { name: 'Status', icon: LayoutDashboard, path: '/student-ui?tab=status' },
          { name: 'Apply Leave', icon: FileText, path: '/student-ui?tab=apply' },
          { name: 'Gate Pass', icon: QrCode, path: '/student-ui?tab=qr' },
          { name: 'Profile', icon: User, path: '/student-ui?tab=profile' },
        ];
      case 'mentor':
        return [
          { name: 'Overview', icon: LayoutDashboard, path: '/mentor-ui?tab=dashboard' },
          { name: 'Approvals', icon: FileText, path: '/mentor-ui?tab=approvals' },
        ];
      case 'parent':
        return [
          { name: 'Overview', icon: LayoutDashboard, path: '/parent-ui?tab=status' },
          { name: 'Approvals', icon: FileText, path: '/parent-ui?tab=approvals' },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/Login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="fixed left-0 top-0 h-full bg-slate-900 text-slate-300 shadow-xl z-50 flex flex-col transition-all duration-300 border-r border-slate-800"
      >
        <div className="p-6 flex items-center gap-3 border-b border-slate-800/50">
          <div className="h-10 w-10 min-w-[40px] rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <ShieldCheck size={24} />
          </div>
          {isSidebarOpen && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-bold text-xl text-white tracking-tight"
            >
              HostelFlow
            </motion.span>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-1 mt-4 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname + location.search === item.path || (location.pathname === item.path.split('?')[0]);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-primary text-white shadow-lg shadow-primary/25' 
                    : 'hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <item.icon size={22} className={isActive ? 'text-white' : 'group-hover:scale-110 transition-transform'} />
                {isSidebarOpen && (
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="font-medium"
                  >
                    {item.name}
                  </motion.span>
                )}
                {isActive && isSidebarOpen && (
                  <motion.div 
                    layoutId="active-pill"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-glow" 
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800/50">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 w-full px-4 py-3.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-all duration-200 group"
          >
            <LogOut size={22} className="group-hover:-translate-x-1 transition-transform" />
            {isSidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className={`flex-1 transition-all duration-300 min-h-screen flex flex-col ${isSidebarOpen ? 'pl-[280px]' : 'pl-[80px]'}`}>
        {/* Navbar */}
        <header className="sticky top-0 h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 z-40 px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2.5 rounded-xl hover:bg-slate-100/80 transition-colors text-slate-500 hover:text-slate-900 border border-transparent hover:border-slate-200"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full text-[11px] font-bold uppercase tracking-wider text-slate-500">
               <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
               Server: Online
            </div>
            
            <div className="relative">
              <button className="p-2.5 rounded-xl hover:bg-slate-100/80 transition-colors text-slate-500 hover:text-slate-900 relative border border-transparent hover:border-slate-200">
                <Bell size={20} />
                {notificationsCount > 0 && (
                  <span className="absolute top-2 right-2 h-4 w-4 bg-red-500 text-[10px] font-bold text-white flex items-center justify-center rounded-full border-2 border-white animate-bounce">
                    {notificationsCount}
                  </span>
                )}
              </button>
            </div>

            <div className="h-10 w-[1px] bg-slate-200" />

            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 leading-none">{user?.name || 'User'}</p>
                <p className="text-[10px] font-semibold text-slate-400 mt-1 uppercase tracking-wider">{user?.role || role}</p>
              </div>
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-slate-200 to-slate-100 flex items-center justify-center text-slate-600 shadow-sm border border-slate-200">
                <User size={22} />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 max-w-[1600px] mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname + location.search}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

const ClipboardList = ({ size, className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <rect width="8" height="4" x="8" y="2" rx="1" ry="1"/>
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
        <path d="M9 12h6"/>
        <path d="M9 16h6"/>
        <path d="M9 8h6"/>
    </svg>
);
