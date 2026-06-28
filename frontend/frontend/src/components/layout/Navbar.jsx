import React, { useState, useEffect } from 'react';
import { Video, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setDate(now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }));
    };
    updateDateTime();
    const timer = setInterval(updateDateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-16 border-b border-gray-800 bg-[#14141c]/80 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between">
      {/* Brand */}
      <Link href="/" className="flex items-center gap-2 group">
        <div className="w-9 h-9 rounded-xl bg-zoom-blue flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
          <Video className="text-white" size={18} fill="white" />
        </div>
        <span className="text-lg font-bold text-white tracking-wider font-sans group-hover:text-zoom-blue transition-colors">
          ZOOM<span className="text-zoom-blue font-light">.</span>
        </span>
      </Link>

      {/* Date, Time & Profile */}
      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-3 text-sm text-zoom-textMuted bg-zoom-button/40 px-3.5 py-1.5 rounded-lg border border-gray-800/60">
          <Calendar size={14} className="text-zoom-blue" />
          <span className="font-semibold text-white">{time}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-gray-600" />
          <span>{date}</span>
        </div>
        
        {/* User indicator */}
        <div className="flex items-center gap-2.5 bg-zoom-button/60 hover:bg-zoom-button cursor-pointer border border-gray-800 rounded-full pl-2 pr-3.5 py-1.5 transition-colors">
          <div className="w-6 h-6 rounded-full bg-zoom-blue flex items-center justify-center text-xs font-bold text-white">
            G
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-white leading-tight">Guest User</span>
            <span className="text-[10px] text-green-400 font-medium leading-none">Online</span>
          </div>
        </div>
      </div>
    </header>
  );
}
