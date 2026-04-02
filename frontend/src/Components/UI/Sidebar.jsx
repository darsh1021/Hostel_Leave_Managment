import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  LogOut, 
  QrCode,
  Bell,
  Home,
  History
} from "lucide-react";

const SidebarItem = ({ icon: Icon, label, href, active, count }) => (
  <Link
    to={href}
    className={cn(
      "group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
      active 
        ? "bg-primary text-primary-foreground shadow-md" 
        : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
    )}
  >
    <div className="flex items-center gap-3">
      <Icon className={cn("h-4 w-4", active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-secondary-foreground")} />
      <span>{label}</span>
    </div>
    {count > 0 && (
      <span className={cn(
        "flex h-5 w-5 items-center justify-center rounded-full text-[10px]",
        active ? "bg-primary-foreground text-primary" : "bg-primary text-primary-foreground"
      )}>
        {count}
      </span>
    )}
  </Link>
);

const Sidebar = ({ role = "admin", notificationsCount = 0 }) => {
  const location = useLocation();
  
  const menuItems = {
    admin: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/admin-ui" },
      { icon: FileText, label: "Applications", href: "/admin-ui?tab=applications", count: notificationsCount },
      { icon: Users, label: "Add Student", href: "/admin-ui?tab=students" },
    ],
    student: [
      { icon: LayoutDashboard, label: "My Status", href: "/student-ui" },
      { icon: FileText, label: "Request Leave", href: "/student-ui?tab=apply" },
      { icon: QrCode, label: "Gate Pass", href: "/student-ui?tab=qr" },
      { icon: Users, label: "My Profile", href: "/student-ui?tab=profile" },
    ],
    mentor: [
      { icon: LayoutDashboard, label: "Submissions", href: "/mentor-ui" },
      { icon: FileText, label: "Approvals", href: "/mentor-ui?tab=approvals" },
    ],
    parent: [
      { icon: LayoutDashboard, label: "Overview", href: "/parent-ui" },
      { icon: History, label: "Approvals", href: "/parent-ui?tab=approvals" },
      { icon: Bell, label: "Notifications", href: "/parent-ui?tab=notifications" },
    ]
  };

  const navItems = menuItems[role] || [];

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-card p-4 transition-all duration-300">
      <div className="mb-8 flex items-center gap-2 px-2">
        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold italic">H</div>
        <h1 className="text-xl font-bold tracking-tight text-primary">HostelFlow</h1>
      </div>
      
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <SidebarItem 
            key={item.label} 
            {...item} 
            active={location.pathname === item.href || location.search.includes(item.href.split('?')[1])} 
          />
        ))}
      </nav>

      <div className="mt-auto pt-4 border-t">
        <SidebarItem icon={Settings} label="Settings" href="/settings" />
        <button 
          onClick={() => {/* handle logout */}}
          className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export { Sidebar };
