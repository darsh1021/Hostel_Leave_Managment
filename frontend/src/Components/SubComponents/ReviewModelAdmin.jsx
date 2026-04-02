import React from "react";
import { Modal } from "../UI/Modal";
import { Button } from "../UI/Button";
import { Card, CardContent } from "../UI/Card";
import { Badge } from "../UI/Badge"; // Import from UI
import { Calendar, User, Home, AlertCircle, FileText, ShieldCheck, CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";

const ReviewModelAdmin = ({ application, onClose, onAccept, onReject }) => {
  if (!application) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
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
      title="Administrative Authorization"
      footer={
        <div className="flex gap-4 w-full">
          <Button variant="outline" className="flex-1 h-12 rounded-2xl font-bold" onClick={onClose}>
            Postpone
          </Button>
          <Button variant="danger" className="flex-1 h-12 rounded-2xl font-bold shadow-lg shadow-red-50" onClick={() => onReject(application)}>
            <XCircle className="mr-2 h-4 w-4" /> Reject Case
          </Button>
          <Button variant="primary" className="flex-[1.5] h-12 rounded-2xl font-bold shadow-2xl shadow-primary/30" onClick={() => onAccept(application)}>
             <CheckCircle className="mr-2 h-4 w-4" /> Authorize & Sign
          </Button>
        </div>
      }
    >
      <div className="space-y-8 py-2">
        {/* Verification Chain Status */}
        <div className="flex items-center justify-between p-5 bg-emerald-50/50 rounded-[24px] border border-emerald-100 shadow-sm mb-2">
            <span className="flex items-center gap-2 text-[10px] font-black text-emerald-800 uppercase tracking-[0.25em]">
                <ShieldCheck size={14} className="text-emerald-500" /> Security Verified
            </span>
            <div className="px-3 py-1 bg-emerald-500 rounded-full text-[9px] font-black text-white uppercase tracking-widest shadow-md shadow-emerald-100">
                Guardian Approved
            </div>
        </div>

        {/* Resident Identity */}
        <div className="bg-slate-900 rounded-[32px] p-7 text-white shadow-2xl relative overflow-hidden group border border-slate-800">
          <div className="flex items-center gap-6 relative z-10">
            <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-500">
                <User className="h-8 w-8 text-white" />
            </div>
            <div>
                <h3 className="font-black text-2xl tracking-tight leading-none mb-2">{application.StudentName || application.name}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    Hostel Unit: <span className="text-white italic font-black">{application.Room_no || application.room}</span>
                </p>
            </div>
          </div>
          {/* Abstract Decorations - Solidified */}
          <div className="absolute right-[-20px] top-[-20px] h-32 w-32 rounded-full bg-primary/10 border border-primary/5 shadow-2xl" />
          <div className="absolute left-[-10px] bottom-[-10px] h-20 w-20 rounded-full bg-white/5" />
        </div>

        {/* Schedule Dashboard */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-6 rounded-[28px] bg-slate-50 border border-slate-100 shadow-sm flex flex-col justify-between h-28">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Departure</span>
            <div className="flex items-center gap-2 font-black text-slate-900 italic">
              <Calendar className="h-4 w-4 text-primary" />
              {formatDate(application.start_Date)}
            </div>
          </div>
          <div className="p-6 rounded-[28px] bg-slate-50 border border-slate-100 shadow-sm flex flex-col justify-between h-28">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Return</span>
            <div className="flex items-center gap-2 font-black text-slate-900 italic">
              <Calendar className="h-4 w-4 text-primary" />
              {formatDate(application.end_date)}
            </div>
          </div>
        </div>

        {/* Administrative Justification */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-400 px-1">
            <FileText className="h-3.5 w-3.5" />
            <span>Final Case Summary</span>
          </div>
          <div className="rounded-[32px] border-2 border-dashed border-slate-200 p-8 bg-white relative">
            <p className="text-[15px] font-bold text-slate-700 leading-relaxed italic text-center">
              "{application.reason || "Resident has requested leave for domestic purposes, verified through all prerequisite authorization stages."}"
            </p>
            <div className="absolute -bottom-3 right-10 px-4 py-1.5 bg-slate-800 rounded-full text-[9px] font-black text-white uppercase tracking-widest shadow-xl">
                Official Case Statement
            </div>
          </div>
        </div>

        {/* Emergency/Urgent Escalation */}
        {application.urgancy && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center gap-4 p-6 rounded-[32px] bg-red-600 text-white shadow-2xl shadow-red-200 overflow-hidden relative"
          >
            <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                <AlertCircle className="h-7 w-7 animate-bounce" />
            </div>
            <div className="relative z-10">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] block opacity-70">Warden Alert</span>
                <p className="text-sm font-black italic">This case has been flagged as a Priority Residency Emergency.</p>
            </div>
            <div className="absolute right-[-20px] top-[-20px] h-32 w-32 rounded-full bg-white/10 blur-2xl" />
          </motion.div>
        )}
      </div>
    </Modal>
  );
};

export default ReviewModelAdmin;
