import { create } from 'zustand';
import specialNotesApi from '../api/specialNotesApi';

/**
 * Zustand store for managing special notes data
 */
const useSpecialNotesStore = create((set, get) => ({
  // State
  specialNotes: [],
  loading: false,
  error: null,
  
  // Actions
  fetchSpecialNotes: async (studentId) => {
    console.log('%c[SpecialNotesStore] Fetching special notes for studentId:', 'color: #2ecc71; font-weight: bold;', studentId);
    set({ loading: true, error: null });
    
    try {
      const response = await specialNotesApi.getStudentSpecialNotes(studentId);
      console.log('%c[SpecialNotesStore] Fetched special notes:', 'color: #2ecc71; font-weight: bold;', response.data.data);
      set({ 
        specialNotes: response.data.data || [], 
        loading: false 
      });
      return response.data.data;
    } catch (error) {
      console.error('%c[SpecialNotesStore] Failed to fetch special notes:', 'color: #e74c3c; font-weight: bold;', error);
      set({ 
        error: error.message || '특기사항을 불러오는데 실패했습니다.', 
        loading: false 
      });
      return [];
    }
  },
  
  createSpecialNote: async (noteData) => {
    console.log('%c[SpecialNotesStore] Creating special note with data:', 'color: #2ecc71; font-weight: bold;', noteData);
    set({ loading: true, error: null });
    
    try {
      const response = await specialNotesApi.createSpecialNote(noteData);
      console.log('%c[SpecialNotesStore] Created special note:', 'color: #2ecc71; font-weight: bold;', response.data.data);
      set((state) => ({ 
        specialNotes: [...state.specialNotes, response.data.data],
        loading: false 
      }));
      return response.data.data;
    } catch (error) {
      console.error('%c[SpecialNotesStore] Failed to create special note:', 'color: #e74c3c; font-weight: bold;', error);
      set({ 
        error: error.message || '특기사항을 생성하는데 실패했습니다.', 
        loading: false 
      });
      throw error;
    }
  },
  
  updateSpecialNote: async (noteId, noteData) => {
    console.log('%c[SpecialNotesStore] %cUpdating special note:%c %s %cwith data:%c %o', 'color: #2ecc71; font-weight: bold;', 'color: #95a5a6; font-weight: normal;', 'color: #2ecc71; font-weight: bold;', noteId, 'color: #95a5a6; font-weight: normal;', 'color: #2ecc71; font-weight: bold;', noteData);
    set({ loading: true, error: null });
    
    try {
      const response = await specialNotesApi.updateSpecialNote(noteId, noteData);
      console.log('%c[SpecialNotesStore] %cUpdated special note:%c %o', 'color: #2ecc71; font-weight: bold;', 'color: #95a5a6; font-weight: normal;', 'color: #2ecc71; font-weight: bold;', response.data.data);
      set((state) => ({ 
        specialNotes: state.specialNotes.map(note => 
          note.id === noteId ? response.data.data : note
        ),
        loading: false 
      }));
      return response.data.data;
    } catch (error) {
      console.error('%c[SpecialNotesStore] Failed to update special note:', 'color: #e74c3c; font-weight: bold;', error);
      set({ 
        error: error.message || '특기사항을 수정하는데 실패했습니다.', 
        loading: false 
      });
      throw error;
    }
  },
  
  deleteSpecialNote: async (noteId) => {
    console.log('%c[SpecialNotesStore] Deleting special note:', 'color: #2ecc71; font-weight: bold;', noteId);
    set({ loading: true, error: null });
    
    try {
      await specialNotesApi.deleteSpecialNote(noteId);
      console.log('[SpecialNotesStore] Successfully deleted special note:', noteId);
      set((state) => ({ 
        specialNotes: state.specialNotes.filter(note => note.id !== noteId),
        loading: false 
      }));
      return true;
    } catch (error) {
      console.error('%c[SpecialNotesStore] Failed to delete special note:', 'color: #e74c3c; font-weight: bold;', error);
      set({ 
        error: error.message || '특기사항을 삭제하는데 실패했습니다.', 
        loading: false 
      });
      throw error;
    }
  },
  
  clearSpecialNotes: () => {
    set({ specialNotes: [], error: null });
  }
}));

export default useSpecialNotesStore;
