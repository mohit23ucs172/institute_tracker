import React from 'react';

export default function Button({ children, variant = 'primary', ...props }) {
  const baseStyles = "px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50",
    danger: "bg-red-50 text-red-600 border border-red-100 hover:bg-red-600 hover:text-white",
    ghost: "text-slate-400 hover:text-slate-600 uppercase tracking-widest text-[10px]"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]}`} {...props}>
      {children}
    </button>
  );
}