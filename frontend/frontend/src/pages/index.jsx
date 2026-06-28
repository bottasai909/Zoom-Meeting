import React, { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import MeetingList from '../components/meetings/MeetingList';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import { useRouter } from 'next/router';
import { Video, Calendar, Monitor, RefreshCw, AlertCircle, History } from 'lucide-react';
import { meetingsApi } from '../services/api';

export default function Dashboard() {
  const router = useRouter();
  const [meetings, setMeetings] = useState([]);
  const [recentMeetings, setRecentMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [isInstantModalOpen, setIsInstantModalOpen] = useState(false);
  const [hostName, setHostName] = useState('');
  const [instantLoading, setInstantLoading] = useState(false);

  const fetchMeetings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await meetingsApi.getUpcomingMeetings();
      setMeetings(data);
      const recentData = await meetingsApi.getRecentMeetings();
      setRecentMeetings(recentData);
    } catch (err) {
      console.warn('Backend offline, loaded preview items.');
      setError('Could not connect to FastAPI server. Displaying mock data for preview.');
      setMeetings([
        {
          id: 1,
          meeting_id: 'instant-demo',
          title: 'Daily Standup Call',
          host_name: 'Alex Johnson',
          scheduled_at: new Date(Date.now() + 3600000).toISOString(),
          status: 'active',
        },
        {
          id: 2,
          meeting_id: 'design-review',
          title: 'Q3 UI/UX Design Review',
          host_name: 'Emily Davis',
          scheduled_at: new Date(Date.now() + 86400000).toISOString(),
          status: 'upcoming',
        },
      ]);
      setRecentMeetings([
        {
          id: 3,
          meeting_id: 'past-sync',
          title: 'Weekly Retro',
          host_name: 'Sarah Miller',
          scheduled_at: new Date(Date.now() - 86400000).toISOString(),
          status: 'ended',
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const handleJoin = (meetingId) => {
    router.push(`/join?id=${meetingId}`);
  };

  const handleStartInstantMeeting = async (e) => {
    e.preventDefault();
    if (!hostName.trim()) return;
    setInstantLoading(true);
    try {
      const meeting = await meetingsApi.createMeeting({
        title: `${hostName}'s Instant Meeting`,
        host_name: hostName,
        scheduled_at: new Date().toISOString(),
      });
      router.push(`/meeting/${meeting.meeting_id}?name=${encodeURIComponent(hostName)}`);
    } catch (err) {
      router.push(`/meeting/instant-${Math.random().toString(36).substr(2, 9)}?name=${encodeURIComponent(hostName)}`);
    } finally {
      setInstantLoading(false);
      setIsInstantModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-zoom-dark flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 flex flex-col gap-8 max-w-6xl mx-auto w-full">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600/90 to-purple-600/80 p-8 border border-white/10 shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="relative z-10 flex flex-col gap-2 max-w-md">
              <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                Connect Anywhere, Anytime
              </h2>
              <p className="text-xs md:text-sm text-blue-100 font-medium">
                Create or schedule a secure high-definition virtual room and invite participants in one click.
              </p>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto relative z-10">
              <Button 
                variant="primary" 
                className="w-full md:w-auto bg-white text-blue-600 hover:bg-blue-50 font-bold px-5 py-3 shadow-lg"
                onClick={() => setIsInstantModalOpen(true)}
              >
                <Video size={18} fill="currentColor" />
                New Meeting
              </Button>
              <Button 
                variant="secondary" 
                className="w-full md:w-auto border-white/20 bg-white/10 hover:bg-white/15 text-white font-bold px-5 py-3"
                onClick={() => router.push('/join')}
              >
                <Monitor size={18} />
                Join
              </Button>
            </div>
          </div>

          {error && (
            <div className="flex items-center justify-between p-3.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-xl text-xs font-semibold gap-3">
              <div className="flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
              <button onClick={fetchMeetings} className="hover:bg-yellow-500/20 p-1.5 rounded-lg transition-colors flex items-center gap-1">
                <RefreshCw size={13} />
                Retry
              </button>
            </div>
          )}

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-zoom-blue" />
                <h3 className="text-lg font-bold text-white tracking-tight">Upcoming Scheduled Meetings</h3>
              </div>
              <button 
                onClick={fetchMeetings} 
                className="p-2 rounded-lg bg-zoom-panel hover:bg-zoom-button text-zoom-textMuted hover:text-white transition-colors border border-gray-800"
              >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>

            <MeetingList meetings={meetings} loading={loading} onJoin={handleJoin} />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <History size={18} className="text-zoom-blue" />
              <h3 className="text-lg font-bold text-white tracking-tight">Recent Meetings</h3>
            </div>
            <MeetingList meetings={recentMeetings} loading={loading} onJoin={handleJoin} />
          </div>
        </main>
      </div>

      <Modal isOpen={isInstantModalOpen} onClose={() => setIsInstantModalOpen(false)} title="Start Instant Meeting">
        <form onSubmit={handleStartInstantMeeting} className="flex flex-col gap-4">
          <Input
            label="Your Display Name"
            placeholder="e.g. Sarah Jenkins"
            value={hostName}
            onChange={(e) => setHostName(e.target.value)}
            required
            autoFocus
          />
          <div className="flex gap-3 justify-end mt-2">
            <Button variant="secondary" onClick={() => setIsInstantModalOpen(false)} disabled={instantLoading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={instantLoading}>
              {instantLoading ? 'Starting...' : 'Launch Meeting'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}