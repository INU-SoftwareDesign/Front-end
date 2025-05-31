import { create } from 'zustand';
import feedbackApi from '../api/feedbackApi';

/**
 * Zustand store for managing feedback data
 */
const useFeedbackStore = create((set, get) => ({
  // State
  feedbacks: [],
  loading: false,
  error: null,
  
  // Actions
  fetchFeedbacks: async (studentId) => {
    console.log('[FeedbackStore] Fetching feedbacks for studentId:', studentId);
    set({ loading: true, error: null });
    
    try {
      const response = await feedbackApi.getStudentFeedbacks(studentId);
      console.log('[FeedbackStore] Fetched feedbacks:', response.data.data);
      set({ 
        feedbacks: response.data.data || [], 
        loading: false 
      });
      return response.data.data;
    } catch (error) {
      console.error('[FeedbackStore] Failed to fetch feedbacks:', error);
      set({ 
        error: error.message || '피드백을 불러오는데 실패했습니다.', 
        loading: false 
      });
      return [];
    }
  },
  
  createFeedback: async (feedbackData) => {
    console.log('[FeedbackStore] Creating feedback with data:', feedbackData);
    set({ loading: true, error: null });
    
    try {
      const response = await feedbackApi.createFeedback(feedbackData);
      console.log('[FeedbackStore] Created feedback:', response.data.data);
      set((state) => ({ 
        feedbacks: [...state.feedbacks, response.data.data],
        loading: false 
      }));
      return response.data.data;
    } catch (error) {
      console.error('[FeedbackStore] Failed to create feedback:', error);
      set({ 
        error: error.message || '피드백을 생성하는데 실패했습니다.', 
        loading: false 
      });
      throw error;
    }
  },
  
  updateFeedback: async (feedbackId, feedbackData) => {
    console.log('[FeedbackStore] Updating feedback:', feedbackId, 'with data:', feedbackData);
    set({ loading: true, error: null });
    
    try {
      const response = await feedbackApi.updateFeedback(feedbackId, feedbackData);
      console.log('[FeedbackStore] Updated feedback response:', response.data.data);
      set((state) => ({ 
        feedbacks: state.feedbacks.map(feedback => 
          feedback.id === feedbackId ? response.data.data : feedback
        ),
        loading: false 
      }));
      return response.data.data;
    } catch (error) {
      console.error('[FeedbackStore] Failed to update feedback:', error);
      set({ 
        error: error.message || '피드백을 수정하는데 실패했습니다.', 
        loading: false 
      });
      throw error;
    }
  },
  
  deleteFeedback: async (feedbackId) => {
    console.log('[FeedbackStore] Deleting feedback:', feedbackId);
    set({ loading: true, error: null });
    
    try {
      await feedbackApi.deleteFeedback(feedbackId);
      console.log('[FeedbackStore] Successfully deleted feedback:', feedbackId);
      set((state) => ({ 
        feedbacks: state.feedbacks.filter(feedback => feedback.id !== feedbackId),
        loading: false 
      }));
      return true;
    } catch (error) {
      console.error('[FeedbackStore] Failed to delete feedback:', error);
      set({ 
        error: error.message || '피드백을 삭제하는데 실패했습니다.', 
        loading: false 
      });
      throw error;
    }
  },
  
  // Helper functions
  getFeedbacksByCategory: (category) => {
    return get().feedbacks.filter(feedback => feedback.category === category);
  },
  
  clearFeedbacks: () => {
    set({ feedbacks: [], error: null });
  }
}));

export default useFeedbackStore;
