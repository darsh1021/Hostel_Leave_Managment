import React from "react";
import { Modal } from "../UI/Modal";
import { Button } from "../UI/Button";
import { Card, CardContent } from "../UI/Card";
import { Calendar, User, FileText, AlertCircle, ShieldCheck, CheckSquare, XCircle, Info } from "lucide-react";
import { motion } from "framer-motion";

const ParentReviewModel = ({ application, onClose, onAccept, onReject }) => {
  if (!application) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
  };

  return (
    <Modal
      isOpen={!!application}
      onClose={onClose}
      title="Guardian Authorization Board"
      footer={
        <div className="flex gap-4 w-full">
          <Button variant="outline" className="flex-1 h-12 rounded-2xl font-bold" onClick={onClose}>
            Review Later
          </Button>
          <Button variant="danger" className="flex-1 h-12 rounded-2xl font-bold shadow-lg shadow-red-100" onClick={() => onReject(application)}>
             Decline Request
          </Button>
          <Button variant="primary" className="flex-[1.5] h-12 rounded-2xl font-bold shadow-xl shadow-primary/25" onClick={() => onAccept(application)}>
            <ShieldCheck className="mr-2 h-5 w-5" /> Confirm Authorization
          </Button>
        </div>
      }
    >
      <div className="space-y-8 py-2">
        {/* Verification Header */}
        <div className="bg-slate-900 rounded-[32px] p-7 text-white shadow-2xl relative overflow-hidden group border border-slate-800">
          <div className="flex items-center gap-5 relative z-10">
            <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-500">
                <User className="h-8 w-8 text-white" />
            </div>
            <div>
                <h3 className="font-black text-2xl tracking-tight leading-none mb-1">Parental Verification</h3>
                <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Secure Digital Signature Required</span>
                </div>
            </div>
          </div>
          {/* Abstract Decorations - Solidified */}
          <div className="absolute right-[-20px] top-[-20px] h-32 w-32 rounded-full bg-primary/10 border border-primary/5" />
          <div className="absolute left-[-10px] bottom-[-10px] h-20 w-20 rounded-full bg-emerald-500/5" />
        </div>

        {/* Schedule & Metadata */}
        <div className="grid grid-cols-2 gap-4">
            <div className="p-5 rounded-3xl bg-slate-50 border border-slate-100/50 flex flex-col justify-between h-28 shadow-sm">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <Calendar size={14} className="text-primary" /> Departure Date
                </div>
                <span className="text-lg font-black text-slate-900 italic leading-none">{formatDate(application.start_Date) || application.date}</span>
            </div>
            <div className="p-5 rounded-3xl bg-slate-50 border border-slate-100/50 flex flex-col justify-between h-28 shadow-sm">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <Calendar size={14} className="text-primary" /> Estimated Return
                </div>
                <span className="text-lg font-black text-slate-900 italic leading-none">{application.end_date ? formatDate(application.end_date) : 'Fixed Schedule'}</span>
            </div>
        </div>

        {/* Reason Section - Fixed Visual Padding & Style */}
        <div className="space-y-4">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">
                <FileText className="h-3.5 w-3.5" /> Statement of Purpose
            </div>
            <div className="relative p-7 rounded-[32px] bg-white border-2 border-slate-50 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] min-h-[120px] flex items-center">
                <p className="text-[15px] font-semibold text-slate-700 leading-relaxed italic text-center w-full">
                    "{application.reason || "The student has requested leave for domestic purposes as indicated in the previous logs."}"
                </p>
                <div className="absolute top-[-12px] right-8 px-4 py-1.5 bg-slate-900 rounded-full text-[9px] font-black text-white uppercase tracking-wider shadow-lg">
                    Verified Statement
                </div>
            </div>
        </div>

        {/* Urgency Highlight - Improved Contrast */}
        {application.urgancy && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 p-5 rounded-[28px] bg-red-600 text-white shadow-xl shadow-red-100 border border-red-500 overflow-hidden relative"
          >
            <div className="h-10 w-10 rounded-xl bg-red-500 flex items-center justify-center shrink-0 border border-white/10">
                <AlertCircle className="h-6 w-6 animate-pulse" />
            </div>
            <p className="text-xs font-black uppercase tracking-tight leading-tight relative z-10">
                Priority Notice: This request has been flagged as urgent by the student.
            </p>
            <div className="absolute right-[-10px] top-[-10px] h-20 w-20 rounded-full bg-white/5" />
          </motion.div>
        )}

        {/* Acknowledgement Statement */}
        <div className="p-6 rounded-[32px] bg-indigo-50/50 border border-indigo-100/50 flex flex-col gap-4">
            <div className="flex items-center gap-2 px-1">
                <ShieldCheck size={16} className="text-primary" />
                <span className="text-[10px] font-black text-primary uppercase tracking-widest">Digital Acknowledgement</span>
            </div>
            <div className="flex gap-4">
                <div className="h-5 w-5 rounded-md bg-white border border-indigo-200 flex items-center justify-center shrink-0 mt-1">
                    <CheckSquare size={14} className="text-primary" />
                </div>
                <p className="text-[12px] text-slate-600 leading-relaxed font-medium italic">
                    "By clicking 'Confirm Authorization', I acknowledge that I am fully aware of my child's travel plans and approve their leave for the dates specified above."
                </p>
            </div>
        </div>
      </div>
    </Modal>
  );
};

export default ParentReviewModel;
