import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useRouter } from 'next/router';
import { Video, ArrowLeft, AlertTriangle } from 'lucide-react';
import { meetingsApi } from '../services/api';

export default function JoinMeeting() {
  const router = useRouter();
  const [meetingId, setMeetingId] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (router.query.id) {
      setMeetingId(router.query.id);
    }
  }, [router.query.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!meetingId.trim() || !displayName.trim()) return;
    setLoading(true);
    setError('');

    try {
      await meetingsApi.joinMeeting(meetingId, displayName);
      router.push(`/meeting/${meetingId}?name=${encodeURIComponent(displayName)}`);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError('Meeting not found. Please verify the Meeting ID and try again.');
        setLoading(false);
      } else {
        router.push(`/meeting/${meetingId}?name=${encodeURIComponent(displayName)}`);
      }
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
            <div className="flex flex-col gap-1 text-center">
              <div className="w-12 h-12 bg-zoom-blue/10 rounded-xl flex items-center justify-center text-zoom-blue mx-auto mb-2 border border-zoom-blue/20">
                <Video size={22} fill="currentColor" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">Join a Meeting</h2>
              <p className="text-xs text-zoom-textMuted">Enter the meeting details below to connect</p>
            </div>

            {error && (
              <div className="flex items-start gap-2.5 p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-semibold">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                label="Meeting ID"
                placeholder="e.g. daily-standup"
                value={meetingId}
                onChange={(e) => setMeetingId(e.target.value)}
                required
                disabled={loading}
              />
              <Input
                label="Your Display Name"
                placeholder="e.g. Robert Smith"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                disabled={loading}
              />
              
              <Button type="submit" variant="primary" className="w-full mt-2 py-3 font-bold" disabled={loading}>
                {loading ? 'Entering Room...' : 'Join Meeting'}
              </Button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}