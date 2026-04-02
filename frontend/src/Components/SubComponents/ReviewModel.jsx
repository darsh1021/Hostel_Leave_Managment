import React from "react";
import { Modal } from "../UI/Modal";
import { Button } from "../UI/Button";
import { Card, CardContent } from "../UI/Card";
import { Calendar, User, FileText, AlertCircle, CheckCircle2, XCircle, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const ReviewModel = ({ application, onClose, onAccept, onReject }) => {
  if (!application) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return "Not Scheduled";
    return new Date(dateStr).toLocaleDateString("en-GB", {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
  };

  return (
    <Modal
      isOpen={!!application}
      onClose={onClose}
      title="Academic Verification"
      footer={
        <div className="flex gap-4 w-full">
          <Button variant="outline" className="flex-1 h-12 rounded-2xl font-bold" onClick={onClose}>
            Back
          </Button>
          <Button variant="danger" className="flex-1 h-12 rounded-2xl font-bold shadow-lg shadow-red-50" onClick={() => onReject(application)}>
            <XCircle className="mr-2 h-4 w-4" /> Reject
          </Button>
          <Button variant="primary" className="flex-[1.5] h-12 rounded-2xl font-bold shadow-xl shadow-primary/25" onClick={() => onAccept(application)}>
            <CheckCircle2 className="mr-2 h-4 w-4" /> Approve Leave
          </Button>
        </div>
      }
    >
      <div className="space-y-8 py-2">
        {/* Profile Header */}
        <div className="flex items-center gap-5 p-6 rounded-[32px] bg-slate-50 border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/20 group-hover:scale-105 transition-transform duration-500">
            <User className="h-8 w-8" />
          </div>
          <div className="flex-1">
            <h3 className="font-black text-2xl text-slate-900 tracking-tight">{application.StudentName}</h3>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mt-1">
                Resident Unit: <span className="text-primary italic font-black">{application.Room_no}</span>
            </p>
          </div>
          <div className="absolute right-[-10px] top-[-10px] opacity-[0.03] rotate-12">
            <ShieldCheck size={120} />
          </div>
        </div>

        {/* Date Display */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div 
            whileHover={{ y: -2 }}
            className="p-5 rounded-3xl bg-white border-2 border-slate-50 shadow-sm"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">Departure</p>
            <div className="flex items-center gap-3 text-sm font-black text-slate-800 italic">
              <Calendar className="h-4 w-4 text-primary" />
              {formatDate(application.start_Date)}
            </div>
          </motion.div>
          <motion.div 
            whileHover={{ y: -2 }}
            className="p-5 rounded-3xl bg-white border-2 border-slate-50 shadow-sm"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">Return</p>
            <div className="flex items-center gap-3 text-sm font-black text-slate-800 italic">
              <Calendar className="h-4 w-4 text-primary" />
              {formatDate(application.end_date)}
            </div>
          </motion.div>
        </div>

        {/* Reason Section */}
        <div className="space-y-4">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                <FileText className="h-3.5 w-3.5" />
                <span>Verification Justification</span>
            </div>
            <div className="p-7 rounded-[32px] bg-slate-50 border-2 border-dashed border-slate-200 relative min-h-[100px] flex items-center justify-center">
                <p className="text-[15px] leading-relaxed text-slate-700 font-bold italic text-center">
                    "{application.reason || "No detailed justification was provided by the student for this period."}"
                </p>
                <div className="absolute bottom-[-10px] right-8 px-4 py-1 bg-white border border-slate-200 rounded-full shadow-sm text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                    Verified Statement
                </div>
            </div>
        </div>

        {/* Urgency Indicator */}
        {application.urgancy && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-4 p-5 rounded-[28px] bg-red-600 text-white shadow-xl shadow-red-100 border border-red-500"
          >
            <div className="h-10 w-10 rounded-xl bg-red-500 flex items-center justify-center text-white border border-white/10 shadow-sm shrink-0">
                <AlertCircle className="h-6 w-6 animate-pulse" />
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] block opacity-80">Mentor Escalation</span>
                <span className="text-xs font-black italic">This application requires priority academic clearance.</span>
            </div>
          </motion.div>
        )}
      </div>
    </Modal>
  );
};

export default ReviewModel;
