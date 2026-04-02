import React, { useState } from 'react';
import { handleError, handleSuccess } from '../../util';
import { ToastContainer } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../UI/Card';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { UserPlus, BookOpen, Hash, Phone, Mail, MapPin, Image as ImageIcon, ArrowLeft } from 'lucide-react';

const AddStudent = ({ embedded = false }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    s_name: "", 
    department: "", 
    division: "", 
    r_no: "", 
    s_phone: "", 
    p_phone: "", 
    address: "", 
    photo_url: "", 
    p_email: ""
  });
  
  const [roomData, setRoomData] = useState({ id: "", status: "", students: [], capacity: "", current: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.s_name.trim() === "") return;
    
    setIsSubmitting(true);
    const updatedRoomData = {
      ...roomData,
      students: [...roomData.students, formData.s_name]
    };
  
    try {
      const res1 = await axios.post('https://cp-project-5ths.onrender.com/auth/saveForm', formData);
      if (res1.data.success) {
        await axios.post('https://cp-project-5ths.onrender.com/auth/saveData', updatedRoomData);
        handleSuccess("Student Added Successfully & Room allocated: " + formData.r_no);
        if (!embedded) {
            setTimeout(() => navigate("/admin-ui"), 1500);
        } else {
            setFormData({
                s_name: "", department: "", division: "", r_no: "", 
                s_phone: "", p_phone: "", address: "", photo_url: "", p_email: ""
            });
        }
      } else {
        handleError(res1.data.msg || "Failed to add student");
      }
    } catch (err) {
      handleError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "r_no") {
        setRoomData({ ...roomData, id: value });
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const content = (
    <div className={embedded ? "" : "max-w-3xl mx-auto"}>
        {!embedded && (
            <Button 
                variant="ghost" 
                className="mb-6 hover:bg-background/80" 
                onClick={() => navigate('/admin-ui')}
            >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>
        )}

        <Card className={embedded ? "border-none shadow-sm rounded-[32px] overflow-hidden" : "border-none shadow-xl overflow-hidden"}>
          <div className="bg-primary h-1.5 w-full" />
          <CardHeader className="pb-8 pt-10 text-center">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 shadow-inner">
                <UserPlus size={32} />
            </div>
            <CardTitle className="text-3xl font-black tracking-tight italic">Onboard New Student</CardTitle>
            <CardDescription className="text-base font-medium">Enter student and parent details to allocate a room.</CardDescription>
          </CardHeader>
          
          <CardContent className="px-8 pb-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500 flex items-center gap-2">
                    <UserPlus className="h-3 w-3" />
                    Student Full Name
                  </label>
                  <Input
                    name="s_name"
                    className="h-12 rounded-xl bg-slate-50 border-slate-300/50 font-medium text-slate-900 focus:border-primary focus-visible:ring-0 focus-visible:ring-offset-0 transition-all shadow-sm"
                    value={formData.s_name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600 flex items-center gap-2">
                    <BookOpen className="h-3 w-3" />
                    Department / Class
                  </label>
                  <Input
                    name="department"
                    className="h-12 rounded-xl bg-slate-50 border-slate-300/50 font-medium text-slate-900 focus:border-primary focus-visible:ring-0 focus-visible:ring-offset-0 transition-all shadow-sm"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="Computer Science"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600 flex items-center gap-2">
                    <Mail className="h-3 w-3" />
                    Student Email
                  </label>
                  <Input
                    name="division"
                    className="h-12 rounded-xl bg-slate-50 border-slate-300/50 font-medium text-slate-900 focus:border-primary focus-visible:ring-0 focus-visible:ring-offset-0 transition-all shadow-sm"
                    value={formData.division}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600 flex items-center gap-2">
                    <Hash className="h-3 w-3" />
                    Assigned Room Number
                  </label>
                  <Input
                    name="r_no"
                    className="h-12 rounded-xl bg-slate-50 border-slate-300/50 font-medium text-slate-900 focus:border-primary focus-visible:ring-0 focus-visible:ring-offset-0 transition-all shadow-sm"
                    value={formData.r_no}
                    onChange={handleChange}
                    placeholder="B-204"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600 flex items-center gap-2">
                    <Phone className="h-3 w-3" />
                    Student Phone Number
                  </label>
                  <Input
                    type="tel"
                    name="s_phone"
                    className="h-12 rounded-xl bg-slate-50 border-slate-300/50 font-medium text-slate-900 focus:border-primary focus-visible:ring-0 focus-visible:ring-offset-0 transition-all shadow-sm"
                    value={formData.s_phone}
                    onChange={handleChange}
                    placeholder="+91 XXXXX XXXXX"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600 flex items-center gap-2">
                    <Phone className="h-3 w-3" />
                    Parent Phone Number
                  </label>
                  <Input
                    type="tel"
                    name="p_phone"
                    className="h-12 rounded-xl bg-slate-50 border-slate-300/50 font-medium text-slate-900 focus:border-primary focus-visible:ring-0 focus-visible:ring-offset-0 transition-all shadow-sm"
                    value={formData.p_phone}
                    onChange={handleChange}
                    placeholder="+91 XXXXX XXXXX"
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600 flex items-center gap-2">
                    <Mail className="h-3 w-3" />
                    Parent Email ID
                  </label>
                  <Input
                    type="email"
                    name="p_email"
                    className="h-12 rounded-xl bg-slate-50 border-slate-300/50 font-medium text-slate-900 focus:border-primary focus-visible:ring-0 focus-visible:ring-offset-0 transition-all shadow-sm"
                    value={formData.p_email}
                    onChange={handleChange}
                    placeholder="parent@example.com"
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600 flex items-center gap-2">
                    <MapPin className="h-3 w-3" />
                    Permanent Address
                  </label>
                  <Input
                    name="address"
                    className="h-12 rounded-xl bg-slate-50 border-slate-300/50 font-medium text-slate-900 focus:border-primary focus-visible:ring-0 focus-visible:ring-offset-0 transition-all shadow-sm"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="123 Street Name, City, Country"
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600 flex items-center gap-2">
                    <ImageIcon className="h-3 w-3" />
                    Student Photo URL (Optional)
                  </label>
                  <Input
                    type="url"
                    name="photo_url"
                    className="h-12 rounded-xl bg-slate-50 border-slate-300/50 font-medium text-slate-900 focus:border-primary focus-visible:ring-0 focus-visible:ring-offset-0 transition-all shadow-sm"
                    value={formData.photo_url}
                    onChange={handleChange}
                    placeholder="https://images.com/student-photo.jpg"
                  />
                </div>
              </div>
              
              <div className="pt-4">
                <Button 
                    type="submit" 
                    className="w-full h-14 rounded-2xl text-lg font-black tracking-tight italic shadow-xl shadow-primary/20" 
                    disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing Enrolment..." : "COMPLETE REGISTRATION"}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="bg-slate-50 py-6 flex justify-center border-t border-slate-100">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Credentials will be dispatched via automated verification</p>
          </CardFooter>
        </Card>
    </div>
  );

  if (embedded) return content;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-500">
      {content}
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default AddStudent;