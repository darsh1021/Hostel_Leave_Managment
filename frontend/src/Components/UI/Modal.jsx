import React from "react";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "./Button";

const Modal = ({ isOpen, onClose, title, children, footer, className }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 animate-in fade-in duration-200">
      <div 
        className={cn(
          "relative w-full max-w-lg rounded-[32px] bg-white p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] animate-in zoom-in-95 duration-200 border border-slate-100",
          className
        )}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-black italic tracking-tight text-slate-900">{title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-2xl hover:bg-slate-50">
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="mb-8">{children}</div>
        
        {footer && <div className="flex justify-end gap-3 pt-2">{footer}</div>}
      </div>
    </div>
  );
};

export { Modal };
