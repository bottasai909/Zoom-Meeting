import React, { useState } from 'react';
import { Calendar, User, Copy, Check, ExternalLink } from 'lucide-react';
import Button from '../common/Button';

export default function MeetingCard({ meeting, onJoin }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(meeting.meeting_id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleString([], {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const statusColors = {
    upcoming: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    active: 'bg-green-500/10 text-green-400 border border-green-500/20 animate-pulse',
    ended: 'bg-gray-500/10 text-gray-400 border border-gray-500/20',
  };

  return (
    <div className="bg-zoom-panel border border-gray-800/80 hover:border-gray-700/80 rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all duration-300 hover:shadow-xl hover:shadow-black/10 group">
      
      {/* Upper Section */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider ${statusColors[meeting.status]}`}>
            {meeting.status}
          </span>
          <button 
            onClick={handleCopy}
            className="text-zoom-textMuted hover:text-white p-1.5 rounded-lg hover:bg-zoom-button transition-colors flex items-center gap-1.5 text-xs font-medium"
            title="Copy Meeting ID"
          >
            {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
            ID: {meeting.meeting_id}
          </button>
        </div>

        <h4 className="text-base font-bold text-white leading-snug tracking-tight group-hover:text-zoom-blue transition-colors">
          {meeting.title}
        </h4>
      </div>

      {/* Middle Stats */}
      <div className="flex flex-col gap-2 border-t border-gray-800/60 pt-3 text-xs text-zoom-textMuted">
        <div className="flex items-center gap-2">
          <Calendar size={13} className="text-zoom-blue" />
          <span>{formatDate(meeting.scheduled_at)}</span>
        </div>
        <div className="flex items-center gap-2">
          <User size={13} className="text-zoom-blue" />
          <span>Hosted by <strong className="text-gray-300 font-semibold">{meeting.host_name}</strong></span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex gap-2">
        {meeting.status !== 'ended' ? (
          <Button 
            variant={meeting.status === 'active' ? 'primary' : 'secondary'} 
            className="w-full"
            onClick={() => onJoin(meeting.meeting_id)}
          >
            Join Meeting
            <ExternalLink size={14} />
          </Button>
        ) : (
          <Button variant="secondary" className="w-full cursor-not-allowed" disabled>
            Meeting Ended
          </Button>
        )}
      </div>
    </div>
  );
}
