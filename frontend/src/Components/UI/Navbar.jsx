import React from "react";
import { Bell, Search, User } from "lucide-react";
import { Input } from "./Input";
import { Button } from "./Button";

const Navbar = ({ title, user = { name: "Dr. Sudarshan Kumar", role: "Wardan" } }) => {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-6 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      </div>

      <div className="flex flex-1 items-center justify-center px-8">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search for students, applications..." 
            className="pl-10 bg-secondary/50 border-none focus-visible:ring-1"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background" />
        </Button>
        
        <div className="flex items-center gap-3 pl-4 border-l">
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
          </div>
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
            {user.name.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
};

export { Navbar };
