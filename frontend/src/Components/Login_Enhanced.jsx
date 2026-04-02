import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../util";
import { Button } from "./UI/Button";
import { Input } from "./UI/Input";
import { Card, CardContent } from "./UI/Card";
import { LogIn, ShieldCheck, ArrowRight } from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return handleError("Please fill in all fields");
    }

    setIsLoading(true);
    try {
      const url = "https://cp-project-5ths.onrender.com/auth/login";
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();
      const { success, message, jwtToken, name, error, role } = result;

      if (success) {
        handleSuccess(message);
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('loggedInUser', name);
        localStorage.setItem('userRole', role);
        localStorage.setItem('email', email);

        setTimeout(() => {
          const routes = {
            user: "/student-ui",
            admin: "/admin-ui",
            parent: "/parent-ui",
            mentor: "/mentor-ui"
          };
          navigate(routes[role] || "/");
        }, 800);
      } else if (error) {
        handleError(error?.details[0]?.message || "Authentication failed");
      } else {
        handleError(message);
      }
    } catch (err) {
      handleError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left: Form - 50% Split */}
      <div className="flex flex-1 flex-col justify-center px-8 py-12 sm:px-16 lg:px-24 bg-white relative z-20">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-12 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-2xl shadow-primary/30">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-slate-900 italic">HostelFlow</h1>
          </div>

          <div className="space-y-2 mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
            <p className="text-muted-foreground">
              Enter your credentials to access your dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Email Address
              </label>
              <Input
                type="email"
                placeholder="name@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-secondary/30 border-none h-11"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Password
                </label>
                <Link to="#" className="text-xs text-accent hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-secondary/30 border-none h-11"
              />
            </div>

            <Button 
                type="submit" 
                className="w-full h-11 shadow-lg shadow-primary/20" 
                disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link to="/Signup" className="font-semibold text-accent hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </div>

      {/* Right: Visual */}
      <div className="relative hidden w-0 flex-1 lg:block">
        <div className="absolute inset-0 bg-primary overflow-hidden">
          {/* Subtle patterns/mesh gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#4f46e5,transparent)] opacity-40"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,#6366f1,transparent)] opacity-20"></div>
          
          <div className="relative z-10 flex h-full flex-col items-center justify-center p-12 text-white">
            <div className="max-w-md text-center">
              <h3 className="text-4xl font-bold mb-6 tracking-tight">Streamlining Student Life</h3>
              <p className="text-lg text-white/80 leading-relaxed mb-12">
                "Modern hostel management should be as seamless as the life of the students it serves."
              </p>
              
              <div className="grid grid-cols-2 gap-4 text-left">
                <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                  <CardContent className="p-4 pt-4">
                    <p className="text-sm font-medium text-white/50 mb-1">Leaves</p>
                    <p className="text-2xl font-bold">1,240+</p>
                    <p className="text-[10px] text-emerald-400 mt-1">Processed this month</p>
                  </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                  <CardContent className="p-4 pt-4">
                    <p className="text-sm font-medium text-white/50 mb-1">Users</p>
                    <p className="text-2xl font-bold">5,000+</p>
                    <p className="text-[10px] text-emerald-400 mt-1">Active students</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
          
          {/* Decorative lines/circles */}
          <div className="absolute top-1/4 -right-24 h-96 w-96 rounded-full bg-white/5 blur-3xl"></div>
          <div className="absolute bottom-1/4 -left-24 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl"></div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Login;
