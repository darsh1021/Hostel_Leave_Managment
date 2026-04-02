import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Info } from 'lucide-react';

export const WelcomeSplash = ({ name }) => (
    <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden rounded-3xl bg-indigo-900 p-8 text-indigo-50 shadow-2xl shadow-indigo-200 mb-8"
    >
        <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-300">
                    <ShieldCheck size={20} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400">HostelFlow Intelligence</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Welcome back, {name}!</h1>
            <p className="text-indigo-200/70 max-w-xl text-lg font-medium">
                Your central hub for leave management and student safety monitoring.
            </p>
        </div>
        
        {/* Abstract Background Decoration - Solidified */}
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-indigo-800 opacity-20 rounded-full border border-white/5" />
        <div className="absolute bottom-[-20%] left-[-5%] w-48 h-48 bg-indigo-700 opacity-10 rounded-full" />
    </motion.div>
);

export const EmptyState = ({ icon: Icon, title, description, action }) => (
    <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed rounded-3xl bg-slate-50/50 border-slate-200">
        <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center text-slate-300 shadow-sm mb-4 border border-slate-100">
            <Icon size={32} />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-sm text-slate-500 max-w-xs mx-auto mb-6 leading-relaxed">
            {description}
        </p>
        {action}
    </div>
);

export const Skeleton = ({ className }) => (
    <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} />
);

export const LoadingScreen = () => (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-50">
        <div className="relative">
            <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center text-white shadow-2xl shadow-primary/30 animate-bounce">
                <ShieldCheck size={32} />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
        <p className="mt-8 font-bold text-slate-400 uppercase tracking-[0.3em] text-xs">Synchronizing Data</p>
    </div>
);
