import React from 'react';
import MeetingCard from './MeetingCard';
import { CalendarOff } from 'lucide-react';
import Link from 'next/link';

export default function MeetingList({ meetings, loading, onJoin }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3].map((n) => (
          <div key={n} className="bg-zoom-panel/40 border border-gray-800/60 rounded-2xl p-5 flex flex-col gap-4 animate-pulse">
            <div className="flex justify-between items-center">
              <div className="h-5 bg-gray-800 rounded-full w-20" />
              <div className="h-4 bg-gray-800 rounded-lg w-24" />
            </div>
            <div className="h-6 bg-gray-800 rounded-lg w-3/4 mt-2" />
            <div className="flex flex-col gap-2 mt-4">
              <div className="h-3 bg-gray-800 rounded w-1/2" />
              <div className="h-3 bg-gray-800 rounded w-2/3" />
            </div>
            <div className="h-10 bg-gray-800 rounded-lg w-full mt-2" />
          </div>
        ))}
      </div>
    );
  }

  if (!meetings || meetings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-zoom-panel/30 border border-dashed border-gray-800/80 rounded-2xl text-center gap-4">
        <div className="w-14 h-14 rounded-full bg-zoom-button flex items-center justify-center text-zoom-textMuted border border-gray-800">
          <CalendarOff size={24} />
        </div>
        <div className="flex flex-col gap-1 max-w-sm">
          <h4 className="font-bold text-white text-base">No upcoming meetings</h4>
          <p className="text-xs text-zoom-textMuted">
            Get started by scheduling a new meeting or joining an existing one using its Meeting ID.
          </p>
        </div>
        <Link 
          href="/schedule" 
          className="text-xs font-bold text-zoom-blue hover:text-zoom-blueHover hover:underline transition-colors mt-2"
        >
          Schedule a meeting now &rarr;
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {meetings.map((meeting) => (
        <MeetingCard 
          key={meeting.id || meeting.meeting_id} 
          meeting={meeting} 
          onJoin={onJoin} 
        />
      ))}
    </div>
  );
}
