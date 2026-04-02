import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../util";
import { Button } from "./UI/Button";
import { Input } from "./UI/Input";
import { ShieldCheck, UserPlus } from "lucide-react";

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      return handleError("Please fill in all fields");
    }

    setIsLoading(true);
    try {
      const url = "https://cp-project-5ths.onrender.com/auth/signup";
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      const { success, message, error } = result;

      if (success) {
        handleSuccess(message);
        setTimeout(() => navigate("/Login"), 1000);
      } else if (error) {
        handleError(error?.details[0]?.message || "Registration failed");
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
    <div className="flex min-h-screen bg-background items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="mb-10 flex flex-col items-center gap-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-xl shadow-primary/20">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Create account</h1>
            <p className="text-muted-foreground mt-2">
              Join HostelFlow and manage your leaves effortlessly.
            </p>
          </div>
        </div>

        <div className="bg-card border rounded-2xl p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                required
                className="bg-secondary/30 border-none h-11"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <Input
                name="email"
                type="email"
                placeholder="name@university.edu"
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-secondary/30 border-none h-11"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="bg-secondary/30 border-none h-11"
              />
            </div>

            <Button 
                type="submit" 
                className="w-full h-11 mt-4 shadow-lg shadow-primary/20" 
                disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Sign up"}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/Login" className="font-semibold text-accent hover:underline">
              Log in
            </Link>
          </div>
        </div>
        
        <p className="mt-12 text-center text-xs text-muted-foreground">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Signup;
