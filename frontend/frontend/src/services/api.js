import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const meetingsApi = {
  getUpcomingMeetings: async () => {
    try {
      const response = await api.get('/api/meetings/upcoming');
      // Map backend fields (start_time, is_active) to frontend expected fields (scheduled_at, status)
      return response.data.map(meeting => ({
        ...meeting,
        scheduled_at: meeting.start_time,
        status: meeting.is_active ? 'active' : 'upcoming',
      }));
    } catch (error) {
      console.error('Error fetching upcoming meetings:', error);
      throw error;
    }
  },

  getRecentMeetings: async () => {
    try {
      const response = await api.get('/api/meetings/recent');
      // Map backend fields to frontend fields
      return response.data.map(meeting => ({
        ...meeting,
        scheduled_at: meeting.start_time,
        status: 'ended',
      }));
    } catch (error) {
      console.error('Error fetching recent meetings:', error);
      throw error;
    }
  },

  createMeeting: async (meetingData) => {
    try {
      // Map frontend fields to backend expected fields
      const backendData = {
        title: meetingData.title,
        description: meetingData.description || 'No description',
        start_time: meetingData.scheduled_at || new Date().toISOString(),
        duration: meetingData.duration || 30,
        type: meetingData.type || 'scheduled',
        host_name: meetingData.host_name || 'Guest Host',
      };
      
      const response = await api.post('/api/meetings/create', backendData);
      
      // Map backend response back to frontend fields
      return {
        ...response.data,
        scheduled_at: response.data.start_time,
        status: response.data.is_active ? 'active' : 'upcoming',
      };
    } catch (error) {
      console.error('Error creating meeting:', error);
      throw error;
    }
  },

  getMeeting: async (meetingId) => {
    try {
      const response = await api.get(`/api/meetings/${meetingId}`);
      return {
        ...response.data,
        scheduled_at: response.data.start_time,
        status: response.data.is_active ? 'active' : 'upcoming',
      };
    } catch (error) {
      console.error(`Error fetching meeting ${meetingId}:`, error);
      throw error;
    }
  },

  joinMeeting: async (meetingId, displayName) => {
    try {
      const response = await api.post(`/api/meetings/join/${meetingId}`, {
        display_name: displayName,
      });
      return response.data;
    } catch (error) {
      console.error(`Error joining meeting ${meetingId}:`, error);
      throw error;
    }
  },

  getParticipants: async (meetingId) => {
    try {
      const response = await api.get(`/api/meetings/${meetingId}/participants`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching participants for meeting ${meetingId}:`, error);
      throw error;
    }
  },

  endMeeting: async (meetingId) => {
    try {
      const response = await api.post(`/api/meetings/${meetingId}/end`);
      return response.data;
    } catch (error) {
      console.error(`Error ending meeting ${meetingId}:`, error);
      throw error;
    }
  },
};

export default api;