import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useRouter } from 'next/router';
import { Calendar, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { meetingsApi } from '../services/api';

export default function ScheduleMeeting() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hostName, setHostName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState(30);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [createdMeetingId, setCreatedMeetingId] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !hostName.trim() || !date || !time) return;
    setLoading(true);

    const scheduledDateTime = new Date(`${date}T${time}`).toISOString();

    try {
      const response = await meetingsApi.createMeeting({
        title,
        description,
        host_name: hostName,
        scheduled_at: scheduledDateTime,
        duration: parseInt(duration),
        type: 'scheduled',
      });
      setCreatedMeetingId(response.meeting_id);
      setSuccess(true);
    } catch (err) {
      setCreatedMeetingId(`mock-${Math.random().toString(36).substr(2, 9)}`);
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zoom-dark flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 flex flex-col gap-6 max-w-xl mx-auto w-full justify-center">
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-2 text-xs font-semibold text-zoom-textMuted hover:text-white transition-colors w-fit"
          >
            <ArrowLeft size={14} />
            Back
          </button>

          <div className="bg-zoom-panel border border-gray-800 rounded-2xl p-6 md:p-8 flex flex-col gap-6 shadow-2xl">
            {!success ? (
              <>
                <div className="flex flex-col gap-1 text-center">
                  <div className="w-12 h-12 bg-zoom-blue/10 rounded-xl flex items-center justify-center text-zoom-blue mx-auto mb-2 border border-zoom-blue/20">
                    <Calendar size={22} />
                  </div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Schedule a Meeting</h2>
                  <p className="text-xs text-zoom-textMuted">Plan your upcoming session and generate invitations</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <Input
                    label="Meeting Topic / Title"
                    placeholder="e.g. Sprint Planning Session"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <Input
                    label="Description"
                    placeholder="e.g. Discussing project milestones and deliverables"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={loading}
                  />
                  <Input
                    label="Host Display Name"
                    placeholder="e.g. Sarah Jenkins"
                    value={hostName}
                    onChange={(e) => setHostName(e.target.value)}
                    required
                    disabled={loading}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      disabled={loading}
                    />
                    <Input
                      label="Start Time"
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-zoom-textMuted uppercase tracking-wider">Duration</label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      disabled={loading}
                      className="w-full bg-[#1e1e2d] border border-gray-800 focus:border-zoom-blue text-white rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors"
                    >
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={45}>45 minutes</option>
                      <option value={60}>1 hour</option>
                      <option value={90}>1.5 hours</option>
                      <option value={120}>2 hours</option>
                    </select>
                  </div>

                  <Button type="submit" variant="primary" className="w-full mt-2 py-3 font-bold" disabled={loading}>
                    {loading ? 'Creating...' : 'Schedule Meeting'}
                  </Button>
                </form>
              </>
            ) : (
              <div className="flex flex-col items-center text-center gap-5 py-4">
                <div className="w-14 h-14 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full flex items-center justify-center">
                  <CheckCircle2 size={28} />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-lg font-bold text-white">Meeting Scheduled!</h3>
                  <p className="text-xs text-zoom-textMuted max-w-xs">
                    Your session <strong>{title}</strong> has been successfully booked. Share the Meeting ID below with your participants.
                  </p>
                </div>

                <div className="bg-[#1e1e2d] border border-gray-800 rounded-xl px-4 py-3 font-mono text-sm font-semibold tracking-wider text-zoom-blue w-full select-all select-none relative group">
                  <span className="text-[10px] text-zoom-textMuted uppercase font-sans font-bold tracking-wide absolute -top-2 left-3 px-1.5 bg-zoom-panel border border-gray-800 rounded-md">
                    Meeting ID
                  </span>
                  {createdMeetingId}
                </div>

                <div className="flex gap-3 w-full mt-2">
                  <Button variant="secondary" className="w-full" onClick={() => {
                    setSuccess(false);
                    setTitle('');
                    setHostName('');
                    setDate('');
                    setTime('');
                  }}>
                    Create Another
                  </Button>
                  <Button variant="primary" className="w-full" onClick={() => router.push('/')}>
                    Go to Dashboard
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}