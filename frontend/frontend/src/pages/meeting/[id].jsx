import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Users, MessageSquare, ShieldAlert, MonitorUp, Send, Copy, Check } from 'lucide-react';
import Button from '../../components/common/Button';
import InputComponent from '../../components/common/Input';
import { meetingsApi } from '../../services/api';

export default function MeetingRoom() {
  const router = useRouter();
  const { id: meetingId, name: queryName } = router.query;
  const displayName = queryName || 'Guest User';

  const [meeting, setMeeting] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showParticipantsDrawer, setShowParticipantsDrawer] = useState(true);
  const [showChatDrawer, setShowChatDrawer] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  
  const localVideoRef = useRef(null);
  const streamRef = useRef(null);

  const [chatMessages, setChatMessages] = useState([]);
  const [messageText, setMessageText] = useState('');

  const fetchMeetingData = async () => {
    if (!meetingId) return;
    try {
      const meetingData = await meetingsApi.getMeeting(meetingId);
      setMeeting(meetingData);
      const participantList = await meetingsApi.getParticipants(meetingId);
      setParticipants(participantList);
    } catch (err) {
      setMeeting({
        title: meeting?.title || 'Interactive Session',
        host_name: meeting?.host_name || 'Admin Host',
      });
      setParticipants([
        { display_name: displayName, joined_at: new Date().toISOString() },
        { display_name: 'John Doe (Mock)', joined_at: new Date(Date.now() - 300000).toISOString() },
        { display_name: 'Sarah Lee (Mock)', joined_at: new Date(Date.now() - 600000).toISOString() },
      ]);
    }
  };

  useEffect(() => {
    if (meetingId) {
      fetchMeetingData();
      const interval = setInterval(fetchMeetingData, 5000);
      return () => clearInterval(interval);
    }
  }, [meetingId]);

  useEffect(() => {
    const getMedia = async () => {
      try {
        if (!isCamOff) {
          if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            console.warn('Camera/microphone access is blocked on insecure contexts. Please use http://localhost:3000 or HTTPS.');
            setIsCamOff(true);
            return;
          }
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
          streamRef.current = stream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        } else {
          stopMedia();
        }
      } catch (err) {
        console.error('Camera/microphone access denied:', err);
        setIsCamOff(true);
      }
    };

    getMedia();

    return () => {
      stopMedia();
    };
  }, [isCamOff]);

  const stopMedia = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = isMuted;
      });
    }
  };

  const handleToggleCam = () => {
    setIsCamOff(!isCamOff);
  };

  const handleToggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
  };

  const handleLeave = async () => {
    stopMedia();
    try {
      if (meetingId) {
        await meetingsApi.endMeeting(meetingId);
      }
    } catch (err) {
      console.warn('Could not register exit with database');
    }
    router.push('/');
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    
    setChatMessages((prev) => [
      ...prev,
      {
        sender: displayName,
        text: messageText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setMessageText('');
  };

  const handleCopyLink = () => {
    const inviteLink = `${window.location.origin}/join?id=${meetingId}`;
    navigator.clipboard.writeText(inviteLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  return (
    <div className="h-screen bg-[#0d0d12] flex flex-col overflow-hidden text-white font-sans">
      <header className="h-14 border-b border-gray-800/80 bg-[#14141c] px-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400">
            <ShieldAlert size={16} />
          </div>
          <div className="flex flex-col">
            <h3 className="text-sm font-bold leading-tight">{meeting?.title || 'Loading Room...'}</h3>
            <span className="text-[10px] text-zoom-textMuted font-mono">Room: {meetingId}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 bg-zoom-button hover:bg-zoom-blue/20 hover:text-zoom-blue px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-800 text-zoom-textMuted hover:text-white transition-colors"
          >
            {linkCopied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
            {linkCopied ? 'Link Copied!' : 'Copy Invite Link'}
          </button>
          <div className="flex items-center gap-1 bg-zoom-button px-2.5 py-1 rounded-full text-xs font-semibold border border-gray-800">
            <Users size={12} className="text-zoom-blue" />
            <span>{participants.length}</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 p-6 flex flex-col justify-center items-center overflow-y-auto min-h-0 bg-[#07070a]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl aspect-video md:aspect-auto">
            <div className="relative bg-[#181824] rounded-2xl border border-gray-800 shadow-2xl overflow-hidden aspect-video flex items-center justify-center group">
              {!isCamOff ? (
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform -scale-x-100"
                />
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-zoom-blue flex items-center justify-center text-xl font-bold border-2 border-blue-400/20">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-bold text-gray-400">Camera Off</span>
                </div>
              )}

              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-semibold border border-white/5 flex items-center gap-2">
                <span>{displayName} (You)</span>
                {isMuted && <MicOff size={11} className="text-red-400" />}
              </div>
            </div>

            {participants.filter(p => p.display_name !== displayName).slice(0, 1).map((p, idx) => (
              <div key={idx} className="relative bg-[#181824] rounded-2xl border border-gray-800 shadow-2xl overflow-hidden aspect-video flex items-center justify-center group">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center text-xl font-bold border-2 border-purple-400/20">
                    {p.display_name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-bold text-gray-400">Connecting video...</span>
                </div>
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-semibold border border-white/5">
                  <span>{p.display_name}</span>
                </div>
              </div>
            ))}

            {participants.length <= 1 && (
              <div className="relative bg-[#181824]/40 rounded-2xl border border-dashed border-gray-800 shadow-2xl overflow-hidden aspect-video flex flex-col items-center justify-center gap-3 p-6 text-center">
                <div className="w-12 h-12 bg-zoom-button rounded-xl flex items-center justify-center text-zoom-textMuted border border-gray-800">
                  <Users size={20} />
                </div>
                <div className="flex flex-col gap-1 max-w-xs">
                  <h4 className="text-xs font-bold text-white">Waiting for participants to join</h4>
                  <p className="text-[10px] text-zoom-textMuted">
                    Give them the meeting ID <strong className="text-zoom-blue">{meetingId}</strong> to join this call.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {(showParticipantsDrawer || showChatDrawer) && (
          <aside className="w-80 bg-[#14141c] border-l border-gray-800/80 flex flex-col h-full shrink-0">
            <div className="flex border-b border-gray-800/80 text-xs font-semibold">
              <button 
                onClick={() => { setShowParticipantsDrawer(true); setShowChatDrawer(false); }}
                className={`flex-1 py-3.5 border-b-2 flex items-center justify-center gap-1.5 transition-colors ${showParticipantsDrawer ? 'border-zoom-blue text-white bg-zoom-button/20' : 'border-transparent text-zoom-textMuted hover:text-white'}`}
              >
                <Users size={14} />
                Participants ({participants.length})
              </button>
              <button 
                onClick={() => { setShowParticipantsDrawer(false); setShowChatDrawer(true); }}
                className={`flex-1 py-3.5 border-b-2 flex items-center justify-center gap-1.5 transition-colors ${showChatDrawer ? 'border-zoom-blue text-white bg-zoom-button/20' : 'border-transparent text-zoom-textMuted hover:text-white'}`}
              >
                <MessageSquare size={14} />
                Chat
              </button>
            </div>

            {showParticipantsDrawer && (
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 min-h-0">
                {participants.map((p, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-zoom-panel/30 border border-gray-800/40">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-zoom-button border border-gray-800 flex items-center justify-center text-xs font-bold">
                        {p.display_name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xs font-semibold text-gray-200">{p.display_name}</span>
                    </div>
                    {p.display_name === displayName && (
                      <span className="text-[9px] font-bold uppercase tracking-wider text-zoom-blue bg-zoom-blue/10 border border-zoom-blue/20 px-2 py-0.5 rounded-full">
                        Me
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {showChatDrawer && (
              <div className="flex-1 flex flex-col min-h-0">
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5 min-h-0">
                  {chatMessages.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-4 gap-2 text-zoom-textMuted">
                      <MessageSquare size={18} />
                      <p className="text-[10px]">No messages yet. Send a message to start chatting.</p>
                    </div>
                  ) : (
                    chatMessages.map((msg, idx) => (
                      <div key={idx} className="flex flex-col gap-1 max-w-[90%]">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xs font-bold text-gray-200">{msg.sender}</span>
                          <span className="text-[9px] text-zoom-textMuted">{msg.time}</span>
                        </div>
                        <div className="bg-zoom-panel px-3.5 py-2.5 rounded-2xl rounded-tl-none border border-gray-800 text-xs text-gray-300 break-words leading-relaxed">
                          {msg.text}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-800/80 bg-[#121217] flex items-center gap-2">
                  <InputComponent
                    placeholder="Send a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="!w-full"
                    required
                  />
                  <Button type="submit" variant="primary" className="!p-3 shrink-0">
                    <Send size={14} />
                  </Button>
                </form>
              </div>
            )}
          </aside>
        )}
      </div>

      <footer className="h-20 border-t border-gray-800/80 bg-[#14141c] px-6 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3">
          <Button
            variant={isMuted ? 'danger' : 'secondary'}
            onClick={handleToggleMute}
            className="!p-3.5 rounded-full"
          >
            {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
          </Button>
          <Button
            variant={isCamOff ? 'danger' : 'secondary'}
            onClick={handleToggleCam}
            className="!p-3.5 rounded-full"
          >
            {isCamOff ? <VideoOff size={18} /> : <Video size={18} />}
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <Button variant={isScreenSharing ? 'primary' : 'secondary'} onClick={handleToggleScreenShare} className="hidden sm:flex">
            <MonitorUp size={16} />
            {isScreenSharing ? 'Sharing' : 'Share'}
          </Button>
          <Button variant={showParticipantsDrawer ? 'primary' : 'secondary'} onClick={() => { if (showParticipantsDrawer) { setShowParticipantsDrawer(false); } else { setShowParticipantsDrawer(true); setShowChatDrawer(false); } }}>
            <Users size={16} />
          </Button>
          <Button variant={showChatDrawer ? 'primary' : 'secondary'} onClick={() => { if (showChatDrawer) { setShowChatDrawer(false); } else { setShowChatDrawer(true); setShowParticipantsDrawer(false); } }}>
            <MessageSquare size={16} />
          </Button>
        </div>

        <div>
          <Button variant="danger" onClick={handleLeave} className="font-bold px-5 py-2.5">
            <PhoneOff size={16} />
            Leave
          </Button>
        </div>
      </footer>
    </div>
  );
}